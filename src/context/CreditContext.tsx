import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useStore } from './StoreContext';
import { toast } from 'sonner';

import { CreditProfile, Borrower, Loan, Notification, MRIScoreTier } from "@/types";

interface CreditContextType {
    profile: CreditProfile | null;
    refreshProfile: () => Promise<void>;
    simulatePayment: (amount: number, paymentDate: Date) => Promise<void>;
    calculateProjectedScore: (paymentDate: Date) => { score: number; tier: MRIScoreTier };
    isLoading: boolean;
    // Lending Module
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
    // Customer Actions
    purchaseOnCredit: (amount: number) => Promise<boolean>;
    // Marketplace
    lenderOffers: any[];
    addLenderOffer: (offer: any) => void;
}

const CreditContext = createContext<CreditContextType | undefined>(undefined);

export const CreditProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useStore();
    const [profile, setProfile] = useState<CreditProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // --- BRI Calculation Logic (The "Secret Sauce") ---
    // Formula: (Payment Day / Days in Month) * 100
    // Ranges:
    // Platinum: 0-3% (Paid before 1st)
    // Gold: 3-4% (Paid on 1st)
    // Silver: 4-100% (Paid during month)
    // Bronze: 100-1181% (Paid late)
    // Default: >1181%
    const calculateScoreAndTier = (paymentDate: Date) => {
        const today = paymentDate;
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        // Assume Due Date was the 1st of THIS month
        // We need to match the PDF logic:
        // "I used number of days in a calender... January-31"
        // "Simon pays on the 1st... 1/31 = 3.2% (Excellent)"

        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const paymentDay = today.getDate();

        // Determine "Month of Debt"
        // If we are paying for LAST month's debt, and we are in THIS month:
        // Technically the formula is simple days ratio.

        const ratio = (paymentDay / daysInMonth) * 100;

        // But wait, what if they pay EARLY (previous month)?
        // The PDF says: "If he paid before the 1st... automatically fall under very excellent (0-3%)"
        // So we need to simulation context. For this MVP, we'll assume the payment is happening "Now".
        // If "Now" is the 1st, it's Gold.

        let tier: MRIScoreTier = 'Silver';

        // Strict mapping from PDF
        if (ratio <= 3) {
            tier = 'Platinum'; // Very Excellent
        } else if (ratio > 3 && ratio <= 4) {
            tier = 'Gold'; // Excellent (e.g. 3.2%)
        } else if (ratio > 4 && ratio <= 100) {
            tier = 'Silver'; // Good
        } else if (ratio > 100) {
            tier = 'Bronze'; // Bad (Late)
        }

        // Handle "Next Month" logic for Bronze/Default?
        // PDF: "Pays the 1st of following month: 32/31 = 103% => Bad"
        // We'll need a mechanism to know "Days since Due Date" if it crosses months.
        // For MVP, we stick to the simple Day/Month ratio for the CURRENT month payment.

        return { score: ratio, tier };
    };

    // --- Load Mock Profile (Replace with Firestore later) ---
    const refreshProfile = async () => {
        if (!user) return;
        setIsLoading(true);
        // Simulate fetch
        setTimeout(() => {
            setProfile({
                uid: user.uid,
                briScore: 3.2,
                tier: 'Gold',
                creditLimit: 5000,
                balance: 1200,
                dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
                paymentHistory: [
                    { date: '2025-10-01', amount: 500, scoreSnapshot: 3.2 },
                    { date: '2025-11-01', amount: 500, scoreSnapshot: 3.1 }
                ]
            });
            setIsLoading(false);
        }, 800);
    };

    useEffect(() => {
        refreshProfile();
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    // --- Lending Module State (Mock for Phase 7) ---
    const [borrowers, setBorrowers] = useState<Borrower[]>([
        {
            id: "9001015009087",
            ssid: "SS-ID0001",
            name: "Lufuno Mphela",
            phone: "082 123 4567",
            email: "lufuno@example.com",
            rating: "Good",
            score: 3.2,
            photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
        },
        {
            id: "8505055009088",
            ssid: "SS-ID0002",
            name: "Thabo Mbeki",
            phone: "072 999 8888",
            email: "thabo@example.com",
            rating: "Risk",
            score: 105,
            photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
        }
    ]);

    const [loans, setLoans] = useState<Loan[]>([
        { id: "loan_1", borrowerId: "9001015009087", borrowerName: "Lufuno Mphela", amount: 500, dueDate: "2026-03-01", status: "active" }
    ]);

    // --- Applications State (Mock) ---
    const [applications, setApplications] = useState<any[]>([
        { id: "app_1", borrower: "Thabo Mbeki", amount: 2500, term: "14 Days", reason: "Equipment Repair", creditScore: 650, date: "2024-02-11", ssid: "SS-ID0002" },
        { id: "app_2", borrower: "Sipho Khumalo", amount: 10000, term: "90 Days", reason: "Stock Expansion", creditScore: 710, date: "2024-02-12", ssid: "SS-ID0003" } // New applicant not in borrowers yet
    ]);

    // --- Marketplace State ---
    const [lenderOffers, setLenderOffers] = useState<any[]>([
        {
            id: "lender-1",
            name: "Swift Capital",
            rate: "12%",
            term: "30 Days",
            maxAmount: 5000,
            minScore: 650,
            features: ["Instant Approval", "No hidden fees"],
            description: "Swift Capital provides fast and reliable funding for Spaza shops needing quick inventory restocks. With minimal paperwork and instant approval algorithms, you get the cash you need within hours."
        },
        {
            id: "lender-2",
            name: "Growth Fund",
            rate: "10.5%",
            term: "14 Days",
            maxAmount: 3000,
            minScore: 700,
            features: ["Low Rates", "Flexible Repayment"],
            description: "Growth Fund offers highly competitive interest rates for shop owners with excellent repayment histories. Our flexible repayment terms mean you can pay back when your sales peak."
        },
        {
            id: "lender-3",
            name: "EasyAccess Loans",
            rate: "15%",
            term: "60 Days",
            maxAmount: 10000,
            minScore: 600,
            features: ["High Limits", "Longer Terms"],
            description: "Designed for larger capital investments like equipment upgrades or bulk purchasing. EasyAccess allows for higher borrowing limits with comfortably spaced-out 60-day terms."
        },
        {
            id: "lender-4",
            name: "Community Trust",
            rate: "11%",
            term: "45 Days",
            maxAmount: 7500,
            minScore: 680,
            features: ["Community Focus", "Grace Period"],
            description: "A lender dedicated to local business growth. Enjoy a generous grace period and personalized support to ensure your business thrives."
        },
    ]);

    const addLenderOffer = (offer: any) => {
        setLenderOffers(prev => [...prev, offer]);
    };

    // --- Simulate Payment (For Customer Side) ---
    const simulatePayment = async (amount: number, paymentDate: Date) => {
        toast.success(`Payment of R${amount} simulated for ${paymentDate.toLocaleDateString()}`);
    };

    // --- Lender Actions ---
    const addBorrower = async (name: string, phone: string, idNumber: string, photoFile?: File) => {
        // Generate SS-ID (SS-ID 0001 format)
        // Find highest current ID
        const maxId = borrowers.reduce((max, b) => {
            const num = parseInt(b.ssid.replace("SS-ID", ""));
            return isNaN(num) ? max : Math.max(max, num);
        }, 0);

        const nextId = maxId + 1;
        const ssid = `SS-ID ${nextId.toString().padStart(4, '0')}`;

        // Mock Photo Upload
        const photoUrl = photoFile
            ? URL.createObjectURL(photoFile)
            : "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop";
        const newBorrower = {
            id: idNumber,
            ssid,
            name,
            phone,
            idNumber,
            rating: "New",
            score: 0,
            photoUrl
        };
        setBorrowers([...borrowers, newBorrower]);
    };

    const createLoan = async (borrowerId: string, amount: number, dueDate: string) => {
        const borrower = borrowers.find(b => b.id === borrowerId);
        const newLoan = {
            id: `loan_${Date.now()}`,
            borrowerId,
            borrowerName: borrower?.name || "Unknown",
            amount,
            dueDate,
            status: "active"
        };
        setLoans([...loans, newLoan]);
        // In real app: await addDoc(collection(db, "loans"), newLoan);
    };

    const recordPayment = async (loanId: string) => {
        let borrowerId = "";
        let paymentAmount = 0;
        let dueDateStr = "";

        // 1. Update Loan Status
        setLoans(prev => prev.map(loan => {
            if (loan.id === loanId) {
                borrowerId = loan.borrowerId;
                paymentAmount = loan.amount;
                dueDateStr = loan.dueDate;
                return { ...loan, status: "paid", paidDate: new Date().toISOString() };
            }
            return loan;
        }));

        if (!borrowerId) return;

        // 2. Calculate New Score Impact
        const paymentDate = new Date();
        const dueDate = new Date(dueDateStr);

        // Simple Logic: 
        // Paid before/on due date -> Score improves (lower % is better in this specific BRI logic? 
        // Wait, the PDF said 0-3% is Platinum (Ratio of Day/Month). 
        // Actually, let's treat "Score" as a SpazaScore (Points) for simplicity in this gamification context, 
        // OR stick to the BRI % logic. 
        // The UI shows "Score: 3.2%". Let's stick to that. Lower is better?
        // "3.2% (Excellent)". "105% (Bad)".
        // So YES, lower percentage is better (Early payment in month).

        // Let's recalculate the borrower's average score based on this new payment.
        const { score: newPaymentScore } = calculateScoreAndTier(paymentDate);

        setBorrowers(prev => prev.map(b => {
            if (b.id === borrowerId) {
                // Weighted average or just set to latest? 
                // Let's do a mock weighted average to show progression.
                // If current is 0 (new), take new score.
                const currentScore = b.score || newPaymentScore;
                const updatedScore = Number(((currentScore + newPaymentScore) / 2).toFixed(2));

                return {
                    ...b,
                    score: updatedScore,
                    rating: updatedScore <= 4 ? 'Good' : 'Risk'
                };
            }
            return b;
        }));

        // 3. Send Notification
        const newNotification: Notification = {
            id: `notif_${Date.now()}`,
            userId: borrowerId,
            message: `Payment of R${paymentAmount} received! Your SpazaScore has been updated.`,
            date: new Date().toISOString(),
            read: false
        };
        setNotifications(prev => [newNotification, ...prev]);

        toast.success("Payment Recorded & Score Updated");
    };

    const clearNotifications = () => setNotifications([]);

    // --- Lender Applications Actions ---
    const approveApplication = async (appId: string) => {
        const app = applications.find(a => a.id === appId);
        if (!app) return;

        // 1. Check if borrower already exists, if not, add them automatically
        let borrowerId = borrowers.find(b => b.ssid === app.ssid)?.id;

        if (!borrowerId) {
            borrowerId = `GUEST_${Date.now()}`;
            const newBorrower = {
                id: borrowerId,
                ssid: app.ssid,
                name: app.borrower,
                phone: "000 000 0000", // Needs to be filled in later
                rating: app.creditScore >= 700 ? "Good" : "Risk",
                score: app.creditScore,
                photoUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"
            };
            setBorrowers(prev => [...prev, newBorrower]);
        }

        // 2. Create the loan with "pending" status (funds not transferred yet)
        const newLoan: Loan = {
            id: `loan_${Date.now()}`,
            borrowerId,
            borrowerName: app.borrower,
            amount: app.amount,
            // Calculate a simple due date for demo
            dueDate: new Date(Date.now() + parseInt(app.term) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: "pending" // IMPORTANT: Setting to pending
        };
        setLoans(prev => [...prev, newLoan]);

        // 3. Remove application
        setApplications(prev => prev.filter(a => a.id !== appId));
        toast.success(`${app.borrower}'s application approved. Waiting for funds transfer transfer.`);
    };

    const rejectApplication = (appId: string) => {
        setApplications(prev => prev.filter(a => a.id !== appId));
        toast.error("Application Rejected", { description: "The applicant has been notified." });
    };

    const confirmTransfer = (loanId: string) => {
        setLoans(prev => prev.map(l => l.id === loanId ? { ...l, status: "active" } : l));
        toast.success("Funds transfer confirmed! Loan is now Active.");
    };

    const restructureLoan = (loanId: string, newAmount: number, newDueDate: string) => {
        setLoans(prev => prev.map(l => l.id === loanId ? { ...l, amount: newAmount, dueDate: newDueDate, status: "active" } : l));
        toast.success("Loan successfully restructured! The client has been updated.");
    };

    const sendReminder = (borrowerId: string, type: string) => {
        // Find borrower to show realistic toast
        const borrower = borrowers.find(b => b.id === borrowerId);

        // Log note in real app, we'll just show a toast here for the MVP
        toast.success(`${type} email successfully sent to ${borrower?.name || "the client"}!`);
    };

    // --- Customer Actions ---
    const purchaseOnCredit = async (amount: number): Promise<boolean> => {
        if (!profile) return false;
        if (profile.balance + amount > profile.creditLimit) {
            toast.error("Insufficient Credit Limit");
            return false;
        }

        // Create a new loan (Self-initiated)
        const newLoan = {
            id: `loan_${Date.now()}`,
            borrowerId: profile.uid,
            borrowerName: user?.name || "Customer",
            amount: amount,
            dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(), // 1st of next month
            status: "active"
        };
        setLoans([...loans, newLoan]);

        // Update local profile balance
        setProfile({ ...profile, balance: profile.balance + amount });

        return true;
    };

    return (
        <CreditContext.Provider value={{
            profile,
            refreshProfile,
            simulatePayment,
            calculateProjectedScore: calculateScoreAndTier,
            isLoading,
            borrowers,
            loans,
            addBorrower,
            createLoan,
            recordPayment,
            applications,
            approveApplication,
            rejectApplication,
            confirmTransfer,
            restructureLoan,
            sendReminder,
            notifications,
            clearNotifications,
            purchaseOnCredit,
            lenderOffers,
            addLenderOffer
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
