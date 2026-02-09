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
}

const CreditContext = createContext<CreditContextType | undefined>(undefined);

export const CreditProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useStore();
    const [profile, setProfile] = useState<CreditProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);

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

    const simulatePayment = async (amount: number, paymentDate: Date) => {
        const { score, tier } = calculateScoreAndTier(paymentDate);

        // Update State
        if (profile) {
            setProfile({
                ...profile,
                briScore: score,
                tier: tier,
                balance: Math.max(0, profile.balance - amount),
                paymentHistory: [
                    ...profile.paymentHistory,
                    { date: paymentDate.toISOString(), amount, scoreSnapshot: score }
                ]
            });

            // Show feedback
            if (tier === 'Platinum' || tier === 'Gold') {
                toast.success(`Payment Successful! You achieved ${tier} Status! 🏆`);
            } else if (tier === 'Silver') {
                toast.success('Payment Received. Pay earlier next time to reach Gold!');
            } else {
                toast.warning('Payment Received (Late). Your score has dropped.');
            }
        }
    };

    return (
        <CreditContext.Provider value={{
            profile,
            refreshProfile,
            simulatePayment,
            calculateProjectedScore: calculateScoreAndTier,
            isLoading
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
