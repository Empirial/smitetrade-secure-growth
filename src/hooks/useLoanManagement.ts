/**
 * useLoanManagement — Lender-side loan management slice of CreditContext
 *
 * Provides:
 *   borrowers           — list of registered borrowers for this lender
 *   loans               — all loans created by this lender
 *   addBorrower         — register a new borrower (with optional photo upload to Storage)
 *   createLoan          — create a new active loan for a borrower
 *   recordPayment       — mark a loan paid; runs scoring algorithms 4 & 5
 *   applications        — pending loan applications
 *   approveApplication  — approve an application → creates a loan in 'pending' status
 *   rejectApplication   — reject an application
 *   confirmTransfer     — move a loan from 'pending' → 'active' after funds are sent
 *   restructureLoan     — change a loan's amount / due date
 *   sendReminder        — fire a notification to a borrower
 *   lenderOffers        — marketplace offers published by lenders
 *   addLenderOffer      — publish a new offer
 *
 * Algorithms in CreditContext.tsx that this slice triggers:
 *   Algorithm 3 — Loan Overdue Auto-Detection (runs on loans array change)
 *   Algorithm 4 — Multi-factor Borrower Risk Scoring (on recordPayment)
 *   Algorithm 5 — Auto Credit Limit Review every 3 paid loans (on recordPayment)
 *
 * This is a re-export shim. All state lives in CreditContext.
 */
import { useCredit } from '@/context/CreditContext';

export const useLoanManagement = () => {
    const {
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
        lenderOffers,
        addLenderOffer,
    } = useCredit();

    return {
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
        lenderOffers,
        addLenderOffer,
    };
};
