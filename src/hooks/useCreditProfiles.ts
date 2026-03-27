/**
 * useCreditProfiles — Customer BRI credit profile slice of CreditContext
 *
 * Provides:
 *   profile                 — the current user's CreditProfile (BRI score, tier, limit, balance)
 *   refreshProfile          — reload profile from Firestore and recalculate BRI
 *   simulatePayment         — fire a mock PayStack payment toast
 *   calculateProjectedScore — given a payment date, preview what score + tier it would yield
 *   isLoading               — true while profile is being fetched
 *   purchaseOnCredit        — deduct from credit limit; returns false if over limit
 *   notifications           — in-app notification list for this user
 *   clearNotifications      — wipe local notification list
 *
 * BRI Scoring Algorithms (all live in CreditContext.tsx):
 *   Algorithm 1 — Weighted Rolling Average (last 6 payments, newer = heavier weight)
 *   Algorithm 2 — Dynamic Credit Limit Engine (base by tier + history depth + streak bonus)
 *
 * This is a re-export shim. All state lives in CreditContext.
 */
import { useCredit } from '@/context/CreditContext';

export const useCreditProfiles = () => {
    const {
        profile,
        refreshProfile,
        simulatePayment,
        calculateProjectedScore,
        isLoading,
        purchaseOnCredit,
        notifications,
        clearNotifications,
    } = useCredit();

    return {
        profile,
        refreshProfile,
        simulatePayment,
        calculateProjectedScore,
        isLoading,
        purchaseOnCredit,
        notifications,
        clearNotifications,
    };
};
