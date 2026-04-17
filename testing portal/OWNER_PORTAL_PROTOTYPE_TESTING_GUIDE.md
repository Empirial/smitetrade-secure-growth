# SmiteTrade Owner Portal Prototype Testing Guide

## Purpose
This guide turns the owner portal walkthrough into a structured test checklist that can be followed in sequence.

Important:

- follow phases in order
- later phases depend on data created in earlier phases
- use consistent test data across all pages
- record pass, fail, notes, and screenshots for each phase

Current scope note:

- BRI, credit, and lending workflows are currently disabled in the live portal experience
- treat those sections as out of scope for active prototype testing unless the product team intentionally unlocks them

## Suggested Test Data

- Store name: `Mphela Spaza`
- Supplier: `Makro Polokwane`
- Products:
  - `Coca-Cola 330ml`
  - `Simba Chips`
  - `Albany Bread`
  - `Nik Naks`
  - `Fanta Orange`
  - `Sprite`
  - `Energade`
  - `Cremora 500g`
  - `Sunlight Dishwash`
  - `Bokomo Weet-Bix`
- Staff cashier email: `cashier.test@smitetrade.co.za`
- Staff driver email: `driver.test@smitetrade.co.za`

## Status Labels

- `Pass`
- `Fail`
- `Blocked`
- `Needs Manual Browser Test`
- `Needs Firebase Verification`

---

## Phase 1 - Account Setup

Pages:

- `/owner/register`
- `/owner/login`

### Step 1.1 - Register

1. Navigate to `/owner/register`
2. Fill in full name, email, password, and phone number
3. Optionally click `Sign up with Google`
4. Submit
5. Confirm redirect to dashboard or store setup flow

Verify:

- form validation fires for empty and invalid fields
- duplicate email shows a friendly error
- Google OAuth popup opens and completes
- Firestore `users` collection stores role as `owner`

File references:

- [src/pages/owner/OwnerRegister.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/owner/OwnerRegister.tsx)
- [src/pages/owner/OwnerLogin.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/owner/OwnerLogin.tsx)
- [src/context/hooks/useAuth.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/hooks/useAuth.ts)
- [src/lib/authErrors.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/lib/authErrors.ts)
- [src/App.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/App.tsx)

### Step 1.2 - Login

1. Log out
2. Navigate to `/owner/login`
3. Sign in with the newly created account
4. Confirm redirect to `/owner/dashboard`

Edge cases:

- wrong password shows friendly error
- unknown email shows friendly error
- forgot password link is visible and navigates correctly

---

## Phase 2 - Store Setup

Page:

- `/owner/profile`

### Step 2.1 - Create Your Store

1. Follow dashboard store setup prompt or open `/owner/profile`
2. Enter store name, address, province, contact number, and store type
3. Upload a store logo
4. Save

Verify:

- dashboard shows the store name
- Firestore `stores` collection contains the new store
- later data is linked to the correct `storeId`

File references:

- [src/pages/owner/OwnerProfile.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/owner/OwnerProfile.tsx)
- [src/context/hooks/useStores.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/hooks/useStores.ts)
- [src/context/hooks/useAuth.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/hooks/useAuth.ts)
- [src/types.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/types.ts)

---

## Phase 3 - Supplier Setup

Page:

- `/owner/suppliers`

### Step 3.1 - Add A Supplier

1. Navigate to `/owner/suppliers`
2. Click `Add Supplier`
3. Fill in supplier details
4. Save

Verify:

- supplier appears in the list
- search works
- supplier is scoped to the active store

File references:

- [src/pages/owner/OwnerSuppliers.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/owner/OwnerSuppliers.tsx)
- [src/context/hooks/useSuppliers.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/hooks/useSuppliers.ts)
- [src/context/StoreContext.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/StoreContext.tsx)
- [src/lib/pageContexts.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/lib/pageContexts.ts)

---

## Phase 4 - Inventory And Barcode Scanning

Page:

- `/owner/inventory`

### Step 4.1 - Add 10 Products

1. Open `/owner/inventory`
2. Add products using barcode scan when possible
3. If camera is unavailable, use manual barcode entry
4. Complete price, quantity, category, supplier, and unit details
5. Save each product

Verify:

- all 10 products appear
- quantities match entered stock
- supplier mapping is correct
- search and filters work
- barcode values are stored

File references:

- [src/pages/owner/OwnerInventory.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/owner/OwnerInventory.tsx)
- [src/components/BarcodeScanner.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/components/BarcodeScanner.tsx)
- [src/context/hooks/useProducts.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/hooks/useProducts.ts)
- [src/types.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/types.ts)

---

## Phase 5 - Pricing

Page:

- `/owner/pricing`

### Step 5.1 - Review And Adjust Prices

1. Open `/owner/pricing`
2. Confirm all products are listed
3. Adjust margins on several products
4. Apply bulk pricing if available
5. Save

Verify:

- updated prices reflect correctly
- margin and profit values update
- pricing changes carry through to POS and inventory views

File references:

- [src/pages/owner/OwnerPricing.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/owner/OwnerPricing.tsx)
- [src/context/hooks/useProducts.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/hooks/useProducts.ts)
- [src/lib/pageContexts.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/lib/pageContexts.ts)

---

## Phase 6 - POS

Page:

- `/owner/pos`

### Step 6.1 - Full Sale

1. Add all 10 products to cart
2. Change quantities on some items
3. Apply discount if supported
4. Choose `Cash`
5. Complete the sale

### Step 6.2 - Second Payment Method

1. Start a new cart
2. Add 3 to 4 products
3. Choose `Card` or `Paystack`
4. Verify payment modal loads with correct amount
5. Cancel and finish with cash if needed

Verify:

- totals match pricing
- inventory stock decreases
- order appears in `/owner/orders`
- receipt prints or downloads

File references:

- [src/pages/owner/OwnerPOS.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/owner/OwnerPOS.tsx)
- [src/context/hooks/useOrders.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/hooks/useOrders.ts)
- [src/context/hooks/useProducts.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/hooks/useProducts.ts)
- [src/lib/paystack.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/lib/paystack.ts)
- [src/lib/pageContexts.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/lib/pageContexts.ts)

---

## Phase 7 - Orders

Page:

- `/owner/orders`

### Step 7.1 - Review Completed Orders

1. Open `/owner/orders`
2. Confirm sale from Phase 6 exists
3. Inspect line items, totals, payment method, and time
4. Test search and filters

Verify:

- order values match POS sale
- order is tied to the correct `storeId`

File references:

- [src/pages/owner/OwnerOrders.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/owner/OwnerOrders.tsx)
- [src/context/hooks/useOrders.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/hooks/useOrders.ts)
- [src/types.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/types.ts)

---

## Phase 8 - Expenses

Page:

- `/owner/expenses`

### Step 8.1 - Log Expenses

Create:

- `Rent` - `R5,000` - `Overheads`
- `Stock purchase from supplier` - `R2,300` - `Inventory`
- `Electricity` - `R800` - `Utilities`

Verify:

- all three expenses save
- totals update
- filters work by date and category

File references:

- [src/pages/owner/OwnerExpenses.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/owner/OwnerExpenses.tsx)
- [src/context/hooks/useCustomers.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/hooks/useCustomers.ts)
- [src/context/StoreContext.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/StoreContext.tsx)
- [src/lib/pageContexts.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/lib/pageContexts.ts)

---

## Phase 9 - Staff Management

Page:

- `/owner/staff`

### Step 9.1 - Add Staff

1. Add one cashier
2. Add one driver
3. verify both appear in the list
4. test deactivate or remove if available

Verify:

- staff records carry the correct role
- staff link to your `storeId`
- status changes save correctly

File references:

- [src/pages/owner/OwnerStaff.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/owner/OwnerStaff.tsx)
- [src/context/hooks/useStaff.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/hooks/useStaff.ts)
- [src/context/StoreContext.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/StoreContext.tsx)
- [src/types.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/types.ts)

---

## Phase 10 - Stock Adjustment

Page:

- `/owner/stock-adjustment`

### Step 10.1 - Adjust Stock

1. Select a product
2. create a write-off entry
3. create a stock received entry
4. include reason notes
5. save

Verify:

- inventory count updates
- adjustment history is visible
- adjustment is linked to product and `storeId`

File references:

- [src/pages/owner/OwnerStockAdjustment.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/owner/OwnerStockAdjustment.tsx)
- [src/context/hooks/useProducts.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/hooks/useProducts.ts)
- [src/lib/pageContexts.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/lib/pageContexts.ts)

---

## Phase 11 - Alerts

Page:

- `/owner/alerts`

### Step 11.1 - Review Alerts

1. Open alerts
2. check low-stock, payment, and order alerts
3. force a low-stock case if needed
4. mark alerts as read or dismiss them

Verify:

- low-stock threshold triggers alerts
- timestamps are sensible
- alert status updates correctly

File references:

- [src/pages/owner/OwnerAlerts.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/owner/OwnerAlerts.tsx)
- [src/hooks/useNotifications.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/hooks/useNotifications.ts)
- [src/lib/pageContexts.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/lib/pageContexts.ts)

---

## Phase 12 - Lending

Page:

- `/owner/lending`

### Step 12.1 - Review Lending Dashboard

Current status:

- `Disabled / Out Of Scope`

Testing instruction:

- open `/owner/lending`
- confirm the page is gated, blurred, or non-interactive
- capture screenshot evidence
- do not treat this as a launch-ready working workflow

Verify:

- the page is visibly unavailable for normal owner operations
- no stakeholder mistake is made that this feature is active

File references:

- [src/pages/owner/OwnerLending.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/owner/OwnerLending.tsx)
- [src/components/CreditComingSoon.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/components/CreditComingSoon.tsx)
- [src/context/CreditContext.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/CreditContext.tsx)

---

## Phase 13 - Credit Review

Page:

- `/owner/credit-review`

### Step 13.1 - Review Credit Applications

Current status:

- `Disabled / Out Of Scope`

Testing instruction:

- open `/owner/credit-review`
- confirm the page is gated, blurred, or non-interactive
- capture screenshot evidence
- do not attempt to validate approval or rejection flow as an active feature

Verify:

- the page is not available as a normal owner workflow
- the team documents this feature as disabled, not partially live

File references:

- [src/pages/owner/OwnerCreditReview.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/owner/OwnerCreditReview.tsx)
- [src/components/CreditComingSoon.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/components/CreditComingSoon.tsx)
- [src/context/CreditContext.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/CreditContext.tsx)

---

## Phase 14 - Analytics

Page:

- `/owner/analytics`

### Step 14.1 - Review Business Analytics

1. Open `/owner/analytics`
2. verify sales appear
3. review top products
4. test date range toggles

Verify:

- chart data matches POS and expenses
- charts render without errors
- empty states behave gracefully

File references:

- [src/pages/owner/OwnerAnalytics.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/owner/OwnerAnalytics.tsx)
- [src/context/hooks/useOrders.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/hooks/useOrders.ts)
- [src/lib/pageContexts.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/lib/pageContexts.ts)

---

## Phase 15 - Reports

Page:

- `/owner/reports`

### Step 15.1 - Generate Reports

1. Generate sales report
2. generate inventory report
3. generate expenses report
4. download each as PDF

Verify:

- PDFs generate
- downloaded data matches the system
- date filters work

File references:

- [src/pages/owner/OwnerReports.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/owner/OwnerReports.tsx)
- [src/utils/pdfUtils.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/utils/pdfUtils.ts)
- [src/lib/pageContexts.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/lib/pageContexts.ts)

---

## Phase 16 - Subscription

Page:

- `/owner/subscription`

### Step 16.1 - Review Plan

1. Open `/owner/subscription`
2. review current plan
3. click an upgrade option
4. verify Paystack opens with correct amount
5. cancel and return

Verify:

- plan details are correct
- payment flow opens
- selected plan pricing is correct

File references:

- [src/pages/owner/OwnerSubscription.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/owner/OwnerSubscription.tsx)
- [src/lib/paystack.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/lib/paystack.ts)
- [src/lib/pageContexts.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/lib/pageContexts.ts)

---

## Phase 17 - Support

Page:

- `/owner/support`

### Step 17.1 - Submit Support Ticket

1. Open `/owner/support`
2. enter a test support message
3. submit
4. verify confirmation message

Verify:

- validation works
- submission succeeds
- confirmation or ticket indicator appears

File references:

- [src/pages/owner/OwnerSupport.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/owner/OwnerSupport.tsx)
- [src/components/SupportForm.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/components/SupportForm.tsx)
- [src/lib/pageContexts.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/lib/pageContexts.ts)

---

## Full Regression Checklist

| Check | Status | Notes |
|---|---|---|
| Dashboard shows correct store name |  |  |
| Dashboard KPIs reflect today's sale |  |  |
| 10 products in inventory with correct stock |  |  |
| Stock decreased after POS sale |  |  |
| 1 order in orders list |  |  |
| 3 expenses logged |  |  |
| 2 staff members listed |  |  |
| 2 stock adjustments in history |  |  |
| Analytics chart shows revenue |  |  |
| PDF reports download without error |  |  |
| No console errors during testing |  |  |
| No broken navigation links |  |  |
| Mobile responsive at 375px width |  |  |

## Evidence To Capture

- screenshots per phase
- Firestore screenshots for `users`, `stores`, `products`, `orders`, `expenses`, `staff`
- payment modal screenshots
- PDF output screenshots
- any console errors
