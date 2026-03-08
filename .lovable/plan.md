

# SMITETRADE Improvements Plan

## Overview
This plan covers 7 changes plus fixing 5 existing build errors that are blocking the app.

---

## Part A: Fix Build Errors (Must Do First)

### 1. StoreContext.tsx - Duplicate properties (lines 479-484)
The mock order object has `id`, `customerName`, and `customerAddress` listed twice. Remove the duplicate lines (482-484).

### 2. CashierCheckout.tsx - Missing `address` property (line 39)
The `placeOrder` call is missing the required `address` field. Add `address: "In-Store"` to the object.

### 3. OwnerLending.tsx - Invalid icon import (line 8)
`UserByOrder` does not exist in lucide-react. Replace with `UserCheck` or `Users`.

---

## Part B: Requested Changes

### 1. Background Color Improvements
Update `src/index.css` to restore the branded SMITETRADE color palette instead of the current grayscale overrides. The custom CSS variables (lines 40-49) currently map emerald, electric-blue, and gold to grays. These will be restored to the actual brand colors:
- `--emerald`: Deep Emerald (#1B4D3E)
- `--electric-blue`: Electric Blue (#00BFFF)
- `--gold`: Radiant Gold (#FFD700)

Also update the dashboard background to use a subtle gradient rather than plain white.

### 2. Supplier Contact Details
In `src/pages/owner/OwnerSuppliers.tsx`, change the supplier contact numbers to SMITETRADE's intermediary contact details. All suppliers will show a single SMITETRADE contact number/email as the point of contact, reinforcing SMITETRADE's role as the middleman.

### 3. Customer Credit Scoring Alignment
The Customer portal (`CustomerCreditReview.tsx`) currently uses a 0-850 point scale (showing "750 / EXCELLENT"). The Lending portal uses the BRI percentage system (lower is better, with tiers: Platinum/Gold/Silver/Bronze).

Changes:
- Update `CustomerCreditReview.tsx` to use the BRI percentage system with the same tier badges (Platinum/Gold/Silver/Bronze) used in `BehavioralReliabilityIndex.tsx`
- Replace the "750 / 850" display with the BRI score (e.g., "3.2%") and tier badge
- Use the CreditContext data instead of hardcoded values

### 4. Auto-Generated SS-ID Format
In `src/context/CreditContext.tsx`, change the `addBorrower` function so the SS-ID is system-generated in the format `SS-ID0001`, `SS-ID0002`, etc., using an auto-incrementing counter rather than the SA ID number. The SA ID number will be stored separately as a private field.

Files affected:
- `CreditContext.tsx` - Add counter, generate SS-ID in `addBorrower`
- `OwnerLending.tsx` - Show SS-ID (auto-generated) separate from ID Number input
- `LenderClients.tsx` - Display SS-ID format instead of raw ID

### 5. ID Number Privacy Masking
Wherever SA ID numbers are displayed (borrower cards, credit check results), mask the middle digits showing only the first 6 and last 2 characters. For example: `9001015009087` becomes `900101*****87`.

Files affected:
- `LenderClients.tsx` - Mask ID in borrower cards
- `LenderCreditCheck.tsx` - Mask ID in search results
- `OwnerLending.tsx` - Mask ID display
- Add a utility function `maskIdNumber()` in `src/lib/utils.ts`

### 6. Order Tracking Estimated Time
In `CustomerTracking.tsx`, replace specific minute estimates ("Est. 10 mins", "Est. 20 mins") with a time window format like "Between 8am - 6pm" for delivery, making it more realistic for the South African spaza context.

### 7. Safe Compliance Disclaimer on Lender Portal
Add a compliance statement to the Lender Dashboard (`LenderDashboard.tsx`) and Lender Loans page. The disclaimer will be similar to the one already on `BehavioralReliabilityIndex.tsx` (lines 168-173), stating that SMITETRADE provides scoring insights only and does not act as a credit provider.

---

## Technical Summary

| File | Changes |
|------|---------|
| `src/context/StoreContext.tsx` | Remove duplicate object properties (lines 482-484) |
| `src/pages/cashier/CashierCheckout.tsx` | Add missing `address` field |
| `src/pages/owner/OwnerLending.tsx` | Fix icon import, mask ID display |
| `src/index.css` | Restore brand colors from grayscale |
| `src/pages/owner/OwnerSuppliers.tsx` | Update supplier contacts to SMITETRADE intermediary |
| `src/pages/customer/CustomerCreditReview.tsx` | Switch to BRI percentage system with tiers |
| `src/context/CreditContext.tsx` | Auto-generate SS-ID format (SS-ID0001) |
| `src/pages/lender/LenderClients.tsx` | Display SS-ID format, mask ID numbers |
| `src/pages/lender/LenderCreditCheck.tsx` | Mask ID numbers in results |
| `src/pages/customer/CustomerTracking.tsx` | Use "Between 8am - 6pm" time windows |
| `src/pages/lender/LenderDashboard.tsx` | Add compliance disclaimer |
| `src/pages/lender/LenderLoans.tsx` | Add compliance disclaimer |
| `src/lib/utils.ts` | Add `maskIdNumber()` helper function |

