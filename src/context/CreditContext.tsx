import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useStore } from './StoreContext';
import { toast } from 'sonner';

// --- Types ---
export type MRIScoreTier = 'Platinum' | 'Gold' | 'Silver' | 'Bronze' | 'Default';

export interface CreditProfile {
    uid: string;
    briScore: number; // The calculated percentage (0-100+)
    tier: MRIScoreTier;
    creditLimit: number;
    balance: number;
    paymentHistory: { date: string; amount: number; scoreSnapshot: number }[];
    dueDate: string; // usually 1st of next month
}

interface CreditContextType {
    profile: CreditProfile | null;
    refreshProfile: () => Promise<void>;
    simulatePayment: (amount: number, paymentDate: Date) => Promise<void>;
    calculateProjectedScore: (paymentDate: Date) => { score: number; tier: MRIScoreTier };
    isLoading: boolean;
    // Lending Module
    borrowers: any[]; // Replace with proper interface
    loans: any[];
    addBorrower: (name: string, phone: string, idNumber: string) => Promise<void>;
    createLoan: (borrowerId: string, amount: number, dueDate: string) => Promise<void>;
    recordPayment: (loanId: string) => Promise<void>;
    notifications: Notification[];
    clearNotifications: () => void;
    // Customer Actions
    purchaseOnCredit: (amount: number) => Promise<boolean>;
}

export interface Notification {
    id: string;
    userId: string;
    message: string;
    date: string;
    read: boolean;
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

        let ratio = (paymentDay / daysInMonth) * 100;

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
    }, [user]);

    // --- Lending Module State (Mock for Phase 7) ---
    const [ssIdCounter, setSsIdCounter] = useState(2); // Start after initial mock data
    const [borrowers, setBorrowers] = useState<any[]>([
        { id: "SS-ID0001", name: "Lufuno Mphela", phone: "082 123 4567", email: "lufuno@example.com", idNumber: "9001015009087", rating: "Good", score: 3.2 },
        { id: "SS-ID0002", name: "Thabo Mbeki", phone: "072 999 8888", email: "thabo@example.com", idNumber: "8505055009088", rating: "Risk", score: 105 }
    ]);

    const [loans, setLoans] = useState<any[]>([
        { id: "loan_1", borrowerId: "SS-ID0001", borrowerName: "Lufuno Mphela", amount: 500, dueDate: "2026-03-01", status: "active" }
    ]);

    // --- Simulate Payment (For Customer Side) ---
    const simulatePayment = async (amount: number, paymentDate: Date) => {
        toast.success(`Payment of R${amount} simulated for ${paymentDate.toLocaleDateString()}`);
    };

    // --- Lender Actions ---
    const addBorrower = async (name: string, phone: string, idNumber: string) => {
        const nextCounter = ssIdCounter + 1;
        const ssid = `SS-ID${String(nextCounter).padStart(4, '0')}`;
        setSsIdCounter(nextCounter);
        const newBorrower = {
            id: ssid,
            name,
            phone,
            idNumber,
            rating: "New",
            score: 0
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
            notifications,
            clearNotifications,
            purchaseOnCredit
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
