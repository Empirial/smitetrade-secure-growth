

# MVP Implementation Plan — Route Protection, Stock Deduction, and PayStack Integration

## Payment Integration Points Found

After scanning the entire codebase, here are **all areas that involve payments or financial transactions**:

| # | File | What it does | Needs PayStack? |
|---|---|---|---|
| 1 | `CustomerPayment.tsx` | Fake `setTimeout` card payment for R220 | **Yes** — primary checkout |
| 2 | `CustomerCheckout.tsx` | Card/wallet/credit payment selection, calls `simulatePayment` | **Yes** — card path |
| 3 | `CashierCheckout.tsx` | In-store Cash/Card/SS-ID/Split payment | **Yes** — card path only |
| 4 | `OwnerPOS.tsx` | Owner's in-store POS checkout | **Yes** — card path |
| 5 | `CreditContext.tsx` → `simulatePayment()` | Mock payment simulation used by BRI and checkout | **Yes** — replace with real call |
| 6 | `DriverWallet.tsx` | Driver payout requests (CashSend) | **No** — payout, not collection (future phase) |
| 7 | `OwnerLending.tsx` → `recordPayment()` | Mark loan as paid | **No** — internal status change |
| 8 | `LenderCollections.tsx` | Overdue loan management | **No** — collections tracking |
| 9 | `CustomerCreditApplication.tsx` | Loan application (no money moves) | **No** |
| 10 | `OwnerExpenses.tsx` | Record expenses (no money moves) | **No** |

**Summary**: 5 areas need PayStack (items 1-5). The rest are internal bookkeeping.

---

## Plan Overview

### 1. Route Protection — AuthGuard Component
- Create `src/components/AuthGuard.tsx` that wraps protected routes
- Checks Firebase `auth.currentUser` on mount; if not authenticated, redirects to the portal's login page
- Accept a `role` prop to match against the user's role (stored in Firestore `users` collection or Firebase custom claims)
- Wrap all portal routes in `App.tsx` with `<AuthGuard role="owner">`, etc.
- Public routes (landing, login, register, forgot-password) remain unwrapped

### 2. Stock Deduction on Checkout
- In `StoreContext.tsx` → `placeOrder()`, after creating the order, loop through order items and decrement `stock` on matching products
- Auto-update product `status` field: stock=0 → "Out of Stock", stock≤5 → "Critical", stock≤10 → "Low Stock"
- Apply to both customer online checkout and cashier/owner POS checkout flows

### 3. PayStack Integration (Test/Mock Mode)
- Create a shared `src/lib/paystack.ts` utility that initializes PayStack Popup with the test public key
- Create a reusable `usePaystack` hook that handles: open popup → on success callback → on close callback
- **CustomerPayment.tsx**: Replace `setTimeout` mock with PayStack popup for card payments
- **CustomerCheckout.tsx**: When `paymentMethod === 'card'`, trigger PayStack instead of `simulatePayment`
- **CashierCheckout.tsx**: When Card is selected, trigger PayStack popup
- **OwnerPOS.tsx**: When card payment is selected, trigger PayStack popup
- **CreditContext.tsx**: Replace `simulatePayment` to optionally trigger PayStack for card payments
- Use PayStack **test keys** so no real money moves — test cards like `4084 0840 8408 4081` will work

### Files to Change

| File | Change |
|---|---|
| `src/components/AuthGuard.tsx` | **New** — auth check + role guard component |
| `src/App.tsx` | Wrap portal routes with AuthGuard |
| `src/lib/paystack.ts` | **New** — PayStack utility with test keys |
| `src/hooks/usePaystack.ts` | **New** — reusable PayStack hook |
| `src/context/StoreContext.tsx` | Add stock deduction logic in `placeOrder` |
| `src/pages/customer/CustomerPayment.tsx` | Replace setTimeout with PayStack |
| `src/pages/customer/CustomerCheckout.tsx` | Use PayStack for card payments |
| `src/pages/cashier/CashierCheckout.tsx` | Use PayStack for card payments |
| `src/pages/owner/OwnerPOS.tsx` | Use PayStack for card payments |
| `src/context/CreditContext.tsx` | Update `simulatePayment` to use PayStack |

