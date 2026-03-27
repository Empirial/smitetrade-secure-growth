import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useStore } from './StoreContext';
import { toast } from 'sonner';
import { db, storage } from '@/lib/firebase';
import {
    collection, onSnapshot, addDoc, updateDoc,
    doc, query, where, setDoc, getDoc, getDocs, orderBy, writeBatch
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { USE_MOCK_DATA } from '@/lib/constants';
import { CreditProfile, Borrower, Loan, Notification, MRIScoreTier } from "@/types";

interface CreditContextType {
    profile: CreditProfile | null;
    refreshProfile: () => Promise<void>;
    simulatePayment: (amount: number, paymentDate: Date) => Promise<void>;
    calculateProjectedScore: (paymentDate: Date) => { score: number; tier: MRIScoreTier };
    isLoading: boolean;
    borrowers: Borrower[];
    loans: Loan[];
    addBorrower: (name: string, phone: string, idNumber: string, photoFile?: File) => Promise<void>;
    createLoan: (borrowerId: string, amount: number, dueDate: string) => Promise<void>;
    recordPayment: (loanId: string) => Promise<void>;
    applications: any[];
    approveApplication: (appId: string) => Promise<void>;
    rejectApplication: (appId: string) => void;
    confirmTransfer: (loanId: string) => void;
    restructureLoan: (loanId: string, newAmount: number, newDueDate: string) => void;
    sendReminder: (borrowerId: string, type: string) => void;
    notifications: Notification[];
    clearNotifications: () => void;
    purchaseOnCredit: (amount: number) => Promise<boolean>;
    lenderOffers: any[];
    addLenderOffer: (offer: any) => void;
}

const CreditContext = createContext<CreditContextType | undefined>(undefined);

// ─────────────────────────────────────────────
// ALGORITHM 1: BRI Weighted Rolling Average
// Uses last 6 payments, weighted so recent payments
// count more heavily than older ones.
// ─────────────────────────────────────────────
const PAYMENT_WEIGHTS = [1, 1.5, 2, 2.5, 3, 3.5]; // oldest → newest

const calculateBRIFromHistory = (
    paymentHistory: { date: string; amount: number; scoreSnapshot: number }[]
): { score: number; tier: MRIScoreTier } => {
    if (paymentHistory.length === 0) return { score: 50, tier: 'Silver' };

    const recent = [...paymentHistory].slice(-6);
    const startIdx = PAYMENT_WEIGHTS.length - recent.length;

    let weightedSum = 0;
    let totalWeight = 0;
    recent.forEach((payment, i) => {
        const w = PAYMENT_WEIGHTS[startIdx + i];
        weightedSum += payment.scoreSnapshot * w;
        totalWeight += w;
    });

    const score = Number((weightedSum / totalWeight).toFixed(2));
    let tier: MRIScoreTier = 'Silver';
    if (score <= 3) tier = 'Platinum';
    else if (score <= 4) tier = 'Gold';
    else if (score <= 100) tier = 'Silver';
    else tier = 'Bronze';

    return { score, tier };
};

// ─────────────────────────────────────────────
// ALGORITHM 2: Dynamic Credit Limit Engine
// Base limit by tier + history depth bonus + streak bonus.
// Platinum users with 6+ months of clean history → R18,750
// Bronze with no history → R500
// ─────────────────────────────────────────────
const TIER_BASE_LIMITS: Record<MRIScoreTier, number> = {
    Platinum: 15000,
    Gold: 10000,
    Silver: 5000,
    Bronze: 1000,
    Default: 500
};
const HISTORY_BONUS_PER_MONTH = 500;   // R500 per month of history (max 6)
const STREAK_BONUS_PER_PAYMENT = 250;  // R250 per consecutive on-time payment

const getPaymentStreak = (
    history: { date: string; amount: number; scoreSnapshot: number }[]
): number => {
    let streak = 0;
    for (const payment of [...history].reverse()) {
        if (payment.scoreSnapshot <= 100) streak++;
        else break;
    }
    return streak;
};

const calculateCreditLimit = (
    tier: MRIScoreTier,
    paymentHistory: { date: string; amount: number; scoreSnapshot: number }[]
): number => {
    const base = TIER_BASE_LIMITS[tier] ?? 500;
    const historyMonths = Math.min(paymentHistory.length, 6);
    const streak = getPaymentStreak(paymentHistory);
    return base + historyMonths * HISTORY_BONUS_PER_MONTH + streak * STREAK_BONUS_PER_PAYMENT;
};

// ─────────────────────────────────────────────
// ALGORITHM 4: Multi-factor Borrower Risk Scoring
// Replaces binary Good/Risk with a composite model:
//   Factor 1 – On-time ratio   (0–60 pts)
//   Factor 2 – History depth   (0–20 pts, +5 per paid loan, max 4)
//   Factor 3 – Default penalty (−20 per overdue, capped −40)
//   Factor 4 – Recent trend    (0–20 pts based on last 3 loans)
// Ratings: New → Fair → Good → Excellent | Risk → Blacklisted
// ─────────────────────────────────────────────
const calculateBorrowerRiskRating = (
    borrowerId: string,
    allLoans: Loan[]
): { rating: string; riskScore: number } => {
    const borrowerLoans = allLoans.filter(l => l.borrowerId === borrowerId);
    if (borrowerLoans.length === 0) return { rating: 'New', riskScore: 50 };

    const paid = borrowerLoans.filter(l => l.status === 'paid').length;
    const overdue = borrowerLoans.filter(l => l.status === 'overdue').length;
    const completed = paid + overdue;

    const onTimeRatio = completed > 0 ? paid / completed : 1;
    const onTimeScore = onTimeRatio * 60;
    const historyScore = Math.min(paid * 5, 20);
    const defaultPenalty = Math.min(overdue * 20, 40);

    const recent = [...borrowerLoans]
        .sort((a, b) => (a.dueDate > b.dueDate ? -1 : 1))
        .slice(0, 3);
    const recentPaid = recent.filter(l => l.status === 'paid').length;
    const trendScore = (recentPaid / Math.max(recent.length, 1)) * 20;

    const riskScore = Math.max(0, Math.min(100, Math.round(onTimeScore + historyScore - defaultPenalty + trendScore)));

    let rating: string;
    if (overdue >= 3) rating = 'Blacklisted';
    else if (overdue >= 1 && onTimeRatio < 0.5) rating = 'Risk';
    else if (riskScore >= 80) rating = 'Excellent';
    else if (riskScore >= 55) rating = 'Good';
    else if (riskScore >= 30) rating = 'Fair';
    else rating = 'Risk';

    return { rating, riskScore };
};

// ─────────────────────────────────────────────
// Single-payment BRI (used for projections and new payments)
// ─────────────────────────────────────────────
const calculateScoreFromDate = (paymentDate: Date): { score: number; tier: MRIScoreTier } => {
    const daysInMonth = new Date(paymentDate.getFullYear(), paymentDate.getMonth() + 1, 0).getDate();
    const ratio = Number(((paymentDate.getDate() / daysInMonth) * 100).toFixed(2));
    let tier: MRIScoreTier = 'Silver';
    if (ratio <= 3) tier = 'Platinum';
    else if (ratio <= 4) tier = 'Gold';
    else if (ratio <= 100) tier = 'Silver';
    else tier = 'Bronze';
    return { score: ratio, tier };
};

// --- Mock seed data ---
const MOCK_BORROWERS: Borrower[] = [
    { id: "9001015009087", ssid: "SS-ID0001", name: "Lufuno Mphela", phone: "082 123 4567", email: "lufuno@example.com", rating: "Good", score: 3.2, photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" },
    { id: "8505055009088", ssid: "SS-ID0002", name: "Thabo Mbeki", phone: "072 999 8888", email: "thabo@example.com", rating: "Risk", score: 105, photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" }
];

const MOCK_LOANS: Loan[] = [
    { id: "loan_1", borrowerId: "9001015009087", borrowerName: "Lufuno Mphela", amount: 500, dueDate: "2026-03-01", status: "active" },
    { id: "loan_2", borrowerId: "8505055009088", borrowerName: "Thabo Mbeki", amount: 1200, dueDate: "2026-01-15", status: "active" } // past due — will be flagged
];

const MOCK_APPLICATIONS: any[] = [
    { id: "app_1", borrower: "Thabo Mbeki", amount: 2500, term: "14 Days", reason: "Equipment Repair", creditScore: 650, date: "2024-02-11", ssid: "SS-ID0002" },
    { id: "app_2", borrower: "Sipho Khumalo", amount: 10000, term: "90 Days", reason: "Stock Expansion", creditScore: 710, date: "2024-02-12", ssid: "SS-ID0003" }
];

const MOCK_LENDER_OFFERS: any[] = [
    { id: "lender-1", name: "Swift Capital", rate: "12%", term: "30 Days", maxAmount: 5000, minScore: 650, features: ["Instant Approval", "No hidden fees"], description: "Swift Capital provides fast and reliable funding for Spaza shops needing quick inventory restocks." },
    { id: "lender-2", name: "Growth Fund", rate: "10.5%", term: "14 Days", maxAmount: 3000, minScore: 700, features: ["Low Rates", "Flexible Repayment"], description: "Growth Fund offers highly competitive interest rates for shop owners with excellent repayment histories." },
    { id: "lender-3", name: "EasyAccess Loans", rate: "15%", term: "60 Days", maxAmount: 10000, minScore: 600, features: ["High Limits", "Longer Terms"], description: "Designed for larger capital investments like equipment upgrades or bulk purchasing." },
    { id: "lender-4", name: "Community Trust", rate: "11%", term: "45 Days", maxAmount: 7500, minScore: 680, features: ["Community Focus", "Grace Period"], description: "A lender dedicated to local business growth with a generous grace period." },
];

export const CreditProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useStore();
    const [profile, setProfile] = useState<CreditProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [borrowers, setBorrowers] = useState<Borrower[]>(USE_MOCK_DATA ? MOCK_BORROWERS : []);
    const [loans, setLoans] = useState<Loan[]>(USE_MOCK_DATA ? MOCK_LOANS : []);
    const [applications, setApplications] = useState<any[]>(USE_MOCK_DATA ? MOCK_APPLICATIONS : []);
    const [lenderOffers, setLenderOffers] = useState<any[]>(USE_MOCK_DATA ? MOCK_LENDER_OFFERS : []);

    // ─────────────────────────────────────────────
    // ALGORITHM 3: Loan Overdue Auto-Detection
    // Runs whenever the loans array changes.
    // Compares each active loan's dueDate to today,
    // marks overdue ones, and updates borrower rating.
    // ─────────────────────────────────────────────
    useEffect(() => {
        if (loans.length === 0) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const overdueLoans = loans.filter(
            l => l.status === 'active' && new Date(l.dueDate) < today
        );
        if (overdueLoans.length === 0) return;

        if (USE_MOCK_DATA) {
            const overdueIds = new Set(overdueLoans.map(l => l.id));
            const overdueBorrowerIds = new Set(overdueLoans.map(l => l.borrowerId));

            setLoans(prev => prev.map(l =>
                overdueIds.has(l.id) ? { ...l, status: 'overdue' } : l
            ));
            setBorrowers(prev => prev.map(b =>
                overdueBorrowerIds.has(b.id) ? { ...b, rating: 'Risk' } : b
            ));
            return;
        }

        // Firebase: batch update all overdue loans and borrowers
        const batch = writeBatch(db);
        overdueLoans.forEach(loan => {
            batch.update(doc(db, 'loans', loan.id), { status: 'overdue' });
            batch.update(doc(db, 'borrowers', loan.borrowerId), { rating: 'Risk' });
        });
        batch.commit().catch(err => console.error("Overdue batch update failed:", err));
    }, [loans]); // eslint-disable-line react-hooks/exhaustive-deps

    // --- Credit Profile ---
    const refreshProfile = async () => {
        if (!user) return;
        setIsLoading(true);

        if (USE_MOCK_DATA) {
            const mockHistory = [
                { date: '2025-09-01', amount: 500, scoreSnapshot: 6.5 },
                { date: '2025-10-01', amount: 500, scoreSnapshot: 3.8 },
                { date: '2025-11-01', amount: 500, scoreSnapshot: 3.2 },
                { date: '2025-12-01', amount: 500, scoreSnapshot: 3.1 },
            ];
            const { score: briScore, tier } = calculateBRIFromHistory(mockHistory);
            const creditLimit = calculateCreditLimit(tier, mockHistory);
            setTimeout(() => {
                setProfile({
                    uid: user.uid,
                    briScore,
                    tier,
                    creditLimit,
                    balance: 1200,
                    dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
                    paymentHistory: mockHistory
                });
                setIsLoading(false);
            }, 800);
            return;
        }

        try {
            const profileRef = doc(db, 'credit_profiles', user.uid);
            const profileSnap = await getDoc(profileRef);

            if (profileSnap.exists()) {
                const data = profileSnap.data() as CreditProfile;
                // Recalculate BRI and limit from history on every load
                if (data.paymentHistory?.length > 0) {
                    const { score: briScore, tier } = calculateBRIFromHistory(data.paymentHistory);
                    const creditLimit = calculateCreditLimit(tier, data.paymentHistory);
                    const updated = { ...data, briScore, tier, creditLimit };
                    await updateDoc(profileRef, { briScore, tier, creditLimit });
                    setProfile(updated);
                } else {
                    setProfile(data);
                }
            } else {
                const defaultProfile: CreditProfile = {
                    uid: user.uid,
                    briScore: 50,
                    tier: 'Silver',
                    creditLimit: calculateCreditLimit('Silver', []),
                    balance: 0,
                    dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
                    paymentHistory: []
                };
                await setDoc(profileRef, defaultProfile);
                setProfile(defaultProfile);
            }
        } catch (error) {
            console.error("Failed to load credit profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshProfile();
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    // --- Firebase real-time listeners (live mode only) ---
    useEffect(() => {
        if (!user || USE_MOCK_DATA) return;

        const unsubs: (() => void)[] = [];

        unsubs.push(onSnapshot(
            query(collection(db, 'borrowers'), where('lenderId', '==', user.uid)),
            (snap) => setBorrowers(snap.docs.map(d => ({ ...d.data(), id: d.id }) as Borrower)),
            (err) => console.error("Borrowers:", err)
        ));

        unsubs.push(onSnapshot(
            query(collection(db, 'loans'), where('lenderId', '==', user.uid), orderBy('dueDate', 'asc')),
            (snap) => setLoans(snap.docs.map(d => ({ ...d.data(), id: d.id }) as Loan)),
            (err) => console.error("Loans:", err)
        ));

        unsubs.push(onSnapshot(
            query(collection(db, 'applications'), where('status', '==', 'pending')),
            (snap) => setApplications(snap.docs.map(d => ({ ...d.data(), id: d.id }))),
            (err) => console.error("Applications:", err)
        ));

        unsubs.push(onSnapshot(
            collection(db, 'lender_offers'),
            (snap) => {
                if (snap.empty) {
                    MOCK_LENDER_OFFERS.forEach(offer => addDoc(collection(db, 'lender_offers'), offer));
                } else {
                    setLenderOffers(snap.docs.map(d => ({ ...d.data(), id: d.id })));
                }
            },
            (err) => console.error("Lender offers:", err)
        ));

        unsubs.push(onSnapshot(
            query(collection(db, 'notifications'), where('userId', '==', user.uid), orderBy('date', 'desc')),
            (snap) => setNotifications(snap.docs.map(d => ({ ...d.data(), id: d.id }) as Notification)),
            (err) => console.error("Notifications:", err)
        ));

        return () => unsubs.forEach(u => u());
    }, [user]);

    // --- addBorrower ---
    const addBorrower = async (name: string, phone: string, idNumber: string, photoFile?: File) => {
        if (!user) return;

        if (USE_MOCK_DATA) {
            const maxId = borrowers.reduce((max, b) => {
                const num = parseInt(b.ssid.replace("SS-ID", ""));
                return isNaN(num) ? max : Math.max(max, num);
            }, 0);
            const ssid = `SS-ID${(maxId + 1).toString().padStart(4, '0')}`;
            const photoUrl = photoFile ? URL.createObjectURL(photoFile) : "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop";
            setBorrowers(prev => [...prev, { id: idNumber, ssid, name, phone, nationalId: idNumber, rating: "New", score: 0, photoUrl }]);
            return;
        }

        const existingSnap = await getDocs(query(collection(db, 'borrowers'), where('lenderId', '==', user.uid)));
        const maxId = existingSnap.docs.reduce((max, d) => {
            const num = parseInt((d.data().ssid || '').replace('SS-ID', ''));
            return isNaN(num) ? max : Math.max(max, num);
        }, 0);
        const ssid = `SS-ID${(maxId + 1).toString().padStart(4, '0')}`;

        let photoUrl = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop";
        if (photoFile) {
            try {
                const storageRef = ref(storage, `borrowers/${user.uid}/${Date.now()}_${photoFile.name}`);
                await uploadBytes(storageRef, photoFile);
                photoUrl = await getDownloadURL(storageRef);
            } catch (err) {
                console.error("Photo upload failed:", err);
            }
        }

        await addDoc(collection(db, 'borrowers'), {
            ssid, name, phone, nationalId: idNumber,
            rating: 'New', score: 0, photoUrl,
            lenderId: user.uid, createdAt: new Date().toISOString()
        });
        toast.success(`Borrower registered — ${ssid}`);
    };

    // --- createLoan ---
    const createLoan = async (borrowerId: string, amount: number, dueDate: string) => {
        if (!user) return;

        if (USE_MOCK_DATA) {
            const borrower = borrowers.find(b => b.id === borrowerId);
            setLoans(prev => [...prev, { id: `loan_${Date.now()}`, borrowerId, borrowerName: borrower?.name || "Unknown", amount, dueDate, status: "active" }]);
            return;
        }

        let borrowerName = "Unknown";
        try {
            const snap = await getDoc(doc(db, 'borrowers', borrowerId));
            if (snap.exists()) borrowerName = snap.data().name;
        } catch (_) { /* use fallback */ }

        await addDoc(collection(db, 'loans'), {
            borrowerId, borrowerName, amount, dueDate,
            status: 'active', lenderId: user.uid, createdAt: new Date().toISOString()
        });
    };

    // --- recordPayment (uses weighted BRI + dynamic limit recalculation) ---
    const recordPayment = async (loanId: string) => {
        const paymentDate = new Date();
        const { score: newPaymentScore } = calculateScoreFromDate(paymentDate);
        const newHistoryEntry = {
            date: paymentDate.toISOString(),
            amount: 0,
            scoreSnapshot: newPaymentScore
        };

        if (USE_MOCK_DATA) {
            let borrowerId = "";
            let paymentAmount = 0;

            // Update loan status
            const updatedLoans = loans.map(loan => {
                if (loan.id === loanId) {
                    borrowerId = loan.borrowerId;
                    paymentAmount = loan.amount;
                    return { ...loan, status: "paid", paidDate: paymentDate.toISOString() };
                }
                return loan;
            });
            setLoans(updatedLoans);
            if (!borrowerId) return;

            // ALGORITHM 4: Multi-factor risk scoring
            const { rating } = calculateBorrowerRiskRating(borrowerId, updatedLoans);
            setBorrowers(prev => prev.map(b => {
                if (b.id !== borrowerId) return b;
                return { ...b, score: newPaymentScore, rating };
            }));

            // ALGORITHM 5: Auto credit limit review after every 3 paid loans (no overdue)
            const borrowerPaid = updatedLoans.filter(l => l.borrowerId === borrowerId && l.status === 'paid');
            const hasOverdue = updatedLoans.some(l => l.borrowerId === borrowerId && l.status === 'overdue');
            if (!hasOverdue && borrowerPaid.length > 0 && borrowerPaid.length % 3 === 0) {
                setBorrowers(prev => prev.map(b => {
                    if (b.id !== borrowerId) return b;
                    const newLimit = Math.round((b.limit || 500) * 1.1);
                    toast.success(`Credit review: limit increased to R${newLimit} for ${b.name}`, { duration: 5000 });
                    return { ...b, limit: newLimit };
                }));
            }

            // Recalculate customer credit profile if it exists
            if (profile && profile.uid === borrowerId) {
                const updatedHistory = [...profile.paymentHistory, { ...newHistoryEntry, amount: paymentAmount }];
                const { score: briScore, tier } = calculateBRIFromHistory(updatedHistory);
                const creditLimit = calculateCreditLimit(tier, updatedHistory);
                setProfile({ ...profile, briScore, tier, creditLimit, paymentHistory: updatedHistory });
            }

            setNotifications(prev => [{
                id: `notif_${Date.now()}`, userId: borrowerId,
                message: `Payment of R${paymentAmount} received! BRI Score updated to ${newPaymentScore.toFixed(1)}%.`,
                date: paymentDate.toISOString(), read: false
            }, ...prev]);
            toast.success("Payment Recorded & Score Updated");
            return;
        }

        const loanRef = doc(db, 'loans', loanId);
        const loanSnap = await getDoc(loanRef);
        if (!loanSnap.exists()) return;

        const loan = loanSnap.data() as Loan;
        newHistoryEntry.amount = loan.amount;

        await updateDoc(loanRef, { status: 'paid', paidDate: paymentDate.toISOString() });

        // ALGORITHM 4: Multi-factor risk scoring for Firebase path
        const borrowerRef = doc(db, 'borrowers', loan.borrowerId);
        const allLoansSnap = await getDocs(query(collection(db, 'loans'), where('borrowerId', '==', loan.borrowerId)));
        const allBorrowerLoans = allLoansSnap.docs.map(d => ({ ...d.data(), id: d.id }) as Loan);
        // Include the just-paid loan in the calculation
        const loansForScoring = allBorrowerLoans.map(l => l.id === loanId ? { ...l, status: 'paid' } : l);
        const { rating } = calculateBorrowerRiskRating(loan.borrowerId, loansForScoring);
        await updateDoc(borrowerRef, { score: newPaymentScore, rating });

        // ALGORITHM 5: Auto credit limit review after every 3 paid loans (no overdue)
        const paidCount = loansForScoring.filter(l => l.status === 'paid').length;
        const hasOverdue = loansForScoring.some(l => l.status === 'overdue');
        if (!hasOverdue && paidCount > 0 && paidCount % 3 === 0) {
            const borrowerSnap = await getDoc(borrowerRef);
            if (borrowerSnap.exists()) {
                const currentLimit = borrowerSnap.data().limit || 500;
                const newLimit = Math.round(currentLimit * 1.1);
                await updateDoc(borrowerRef, { limit: newLimit });
                toast.success(`Credit review: limit increased to R${newLimit} for ${loan.borrowerName}`, { duration: 5000 });
            }
        }

        // Recalculate customer credit profile with new history entry
        const profileRef = doc(db, 'credit_profiles', loan.borrowerId);
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
            const profileData = profileSnap.data() as CreditProfile;
            const updatedHistory = [...(profileData.paymentHistory || []), newHistoryEntry];
            const { score: briScore, tier } = calculateBRIFromHistory(updatedHistory);
            const creditLimit = calculateCreditLimit(tier, updatedHistory);
            await updateDoc(profileRef, { briScore, tier, creditLimit, paymentHistory: updatedHistory });
        }

        await addDoc(collection(db, 'notifications'), {
            userId: loan.borrowerId,
            message: `Payment of R${loan.amount} received! BRI Score updated to ${newPaymentScore.toFixed(1)}%.`,
            date: paymentDate.toISOString(), read: false
        });

        toast.success("Payment Recorded & Score Updated");
    };

    // --- approveApplication ---
    const approveApplication = async (appId: string) => {
        const app = applications.find(a => a.id === appId);
        if (!app || !user) return;

        if (USE_MOCK_DATA) {
            let borrowerId = borrowers.find(b => b.ssid === app.ssid)?.id;
            if (!borrowerId) {
                borrowerId = `GUEST_${Date.now()}`;
                setBorrowers(prev => [...prev, {
                    id: borrowerId!, ssid: app.ssid, name: app.borrower, phone: "000 000 0000",
                    rating: app.creditScore >= 700 ? "Good" : "Risk", score: app.creditScore,
                    photoUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"
                }]);
            }
            setLoans(prev => [...prev, {
                id: `loan_${Date.now()}`, borrowerId, borrowerName: app.borrower, amount: app.amount,
                dueDate: new Date(Date.now() + parseInt(app.term) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                status: "pending"
            }]);
            setApplications(prev => prev.filter(a => a.id !== appId));
            toast.success(`${app.borrower}'s application approved.`);
            return;
        }

        const borrowerSnap = await getDocs(query(
            collection(db, 'borrowers'),
            where('ssid', '==', app.ssid),
            where('lenderId', '==', user.uid)
        ));

        let borrowerId: string;
        if (!borrowerSnap.empty) {
            borrowerId = borrowerSnap.docs[0].id;
        } else {
            const newRef = await addDoc(collection(db, 'borrowers'), {
                ssid: app.ssid, name: app.borrower, phone: "000 000 0000",
                rating: app.creditScore >= 700 ? "Good" : "Risk", score: 0,
                photoUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop",
                lenderId: user.uid, createdAt: new Date().toISOString()
            });
            borrowerId = newRef.id;
        }

        await addDoc(collection(db, 'loans'), {
            borrowerId, borrowerName: app.borrower, amount: app.amount,
            dueDate: new Date(Date.now() + parseInt(app.term) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'pending', lenderId: user.uid, createdAt: new Date().toISOString()
        });

        await updateDoc(doc(db, 'applications', appId), { status: 'approved' });
        toast.success(`${app.borrower}'s application approved. Waiting for funds transfer.`);
    };

    const rejectApplication = (appId: string) => {
        if (USE_MOCK_DATA) {
            setApplications(prev => prev.filter(a => a.id !== appId));
        } else {
            updateDoc(doc(db, 'applications', appId), { status: 'rejected' });
        }
        toast.error("Application Rejected", { description: "The applicant has been notified." });
    };

    const confirmTransfer = (loanId: string) => {
        if (USE_MOCK_DATA) {
            setLoans(prev => prev.map(l => l.id === loanId ? { ...l, status: "active" } : l));
        } else {
            updateDoc(doc(db, 'loans', loanId), { status: 'active', transferConfirmedAt: new Date().toISOString() });
        }
        toast.success("Funds transfer confirmed! Loan is now Active.");
    };

    const restructureLoan = (loanId: string, newAmount: number, newDueDate: string) => {
        if (USE_MOCK_DATA) {
            setLoans(prev => prev.map(l => l.id === loanId ? { ...l, amount: newAmount, dueDate: newDueDate, status: "active" } : l));
        } else {
            updateDoc(doc(db, 'loans', loanId), { amount: newAmount, dueDate: newDueDate, status: 'active', restructuredAt: new Date().toISOString() });
        }
        toast.success("Loan successfully restructured!");
    };

    const sendReminder = (borrowerId: string, type: string) => {
        const borrower = borrowers.find(b => b.id === borrowerId);
        if (!USE_MOCK_DATA && user) {
            addDoc(collection(db, 'notifications'), {
                userId: borrowerId,
                message: `${type} reminder: You have an outstanding loan. Please make payment soon.`,
                date: new Date().toISOString(), read: false, sentBy: user.uid
            });
        }
        toast.success(`${type} reminder sent to ${borrower?.name || "the client"}!`);
    };

    const clearNotifications = () => setNotifications([]);

    const simulatePayment = async (amount: number, paymentDate: Date) => {
        toast.success(`Payment of R${amount.toFixed(2)} processed via PayStack for ${paymentDate.toLocaleDateString()}`);
    };

    const purchaseOnCredit = async (amount: number): Promise<boolean> => {
        if (!profile || !user) return false;
        if (profile.balance + amount > profile.creditLimit) {
            toast.error("Insufficient Credit Limit");
            return false;
        }
        const newBalance = profile.balance + amount;

        if (!USE_MOCK_DATA) {
            await addDoc(collection(db, 'loans'), {
                borrowerId: user.uid, borrowerName: user.name || 'Customer', amount,
                dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
                status: 'active', lenderId: 'system', createdAt: new Date().toISOString()
            });
            await updateDoc(doc(db, 'credit_profiles', user.uid), { balance: newBalance });
        }

        setProfile({ ...profile, balance: newBalance });
        return true;
    };

    const addLenderOffer = (offer: any) => {
        if (USE_MOCK_DATA) {
            setLenderOffers(prev => [...prev, offer]);
            return;
        }
        addDoc(collection(db, 'lender_offers'), { ...offer, createdAt: new Date().toISOString() });
    };

    return (
        <CreditContext.Provider value={{
            profile, refreshProfile, simulatePayment,
            calculateProjectedScore: calculateScoreFromDate,
            isLoading, borrowers, loans, addBorrower, createLoan, recordPayment,
            applications, approveApplication, rejectApplication,
            confirmTransfer, restructureLoan, sendReminder,
            notifications, clearNotifications,
            purchaseOnCredit, lenderOffers, addLenderOffer
        }}>
            {children}
        </CreditContext.Provider>
    );
};

export const useCredit = () => {
    const context = useContext(CreditContext);
    if (context === undefined) {
        throw new Error('useCredit must be used within a CreditProvider');
    }
    return context;
};
