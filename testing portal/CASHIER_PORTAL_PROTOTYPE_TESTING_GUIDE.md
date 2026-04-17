# SmiteTrade Cashier Portal Prototype Testing Guide

## Purpose
This guide turns the cashier portal walkthrough into a structured test checklist that can be executed after the owner portal setup is complete.

Current scope note:

- BRI, credit, and lending workflows are currently disabled in the live portal experience
- cashier credit-related testing should be treated as out of scope unless the feature gate is intentionally removed

## Pre-condition
The owner should complete their setup first:

- store created
- 10 products added to inventory
- cashier added as staff

Reference:

- [OWNER_PORTAL_PROTOTYPE_TESTING_GUIDE.md](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/testing%20portal/OWNER_PORTAL_PROTOTYPE_TESTING_GUIDE.md)

## Suggested Test Data

- Cashier name: `Precious Sithole`
- Cashier email: `cashier.test@smitetrade.co.za`
- Opening float: `R500`
- Sale 1: `2x Coca-Cola + 3x Simba Chips + 1x Albany Bread`
- Sale 2: `Fanta Orange + Sprite + Energade`
- Sale 3: `Nik Naks (10% off) + Cremora`
- Credit sale: `1x Weet-Bix + 1x Sunlight Dishwash`

## Status Labels

- `Pass`
- `Fail`
- `Blocked`
- `Needs Manual Browser Test`
- `Needs Firebase Verification`

---

## Phase 1 - Account Setup

Pages:

- `/cashier/register`
- `/cashier/login`

### Step 1.1 - Register

1. Navigate to `/cashier/register`
2. Fill in full name, email, password, and phone number
3. Confirm the store link is connected through the owner-created staff record
4. Submit and confirm redirect to dashboard

Verify:

- role is stored as `cashier` in Firestore
- cashier is linked to the same store as the owner
- cashier cannot access owner-only routes

File references:

- [src/pages/cashier/CashierRegister.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/cashier/CashierRegister.tsx)
- [src/pages/cashier/CashierLogin.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/cashier/CashierLogin.tsx)
- [src/context/hooks/useAuth.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/hooks/useAuth.ts)
- [src/components/AuthGuard.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/components/AuthGuard.tsx)
- [src/App.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/App.tsx)

### Step 1.2 - Login

1. Log out
2. Navigate to `/cashier/login`
3. Sign in with cashier credentials
4. Confirm redirect to `/cashier/dashboard`

Verify:

- successful login lands on dashboard
- owner routes remain inaccessible

File references:

- [src/pages/cashier/CashierLogin.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/cashier/CashierLogin.tsx)
- [src/context/hooks/useAuth.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/hooks/useAuth.ts)
- [src/lib/authErrors.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/lib/authErrors.ts)

---

## Phase 2 - Dashboard

Page:

- `/cashier/dashboard`

### Step 2.1 - Review Dashboard

1. Open `/cashier/dashboard`
2. Review KPI cards
3. verify store name
4. test quick-action navigation

Verify:

- KPIs load
- store name matches owner store
- quick links work

File references:

- [src/pages/cashier/CashierDashboard.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/cashier/CashierDashboard.tsx)
- [src/context/StoreContext.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/StoreContext.tsx)
- [src/lib/pageContexts.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/lib/pageContexts.ts)

---

## Phase 3 - Start A Shift

Page:

- `/cashier/shift`

### Step 3.1 - Clock In

1. Open `/cashier/shift`
2. Start a shift
3. enter opening float
4. confirm timestamp and active state

Verify:

- shift becomes active
- opening float is stored
- dashboard reflects active shift
- second active shift cannot be created

File references:

- [src/pages/cashier/CashierShift.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/cashier/CashierShift.tsx)
- [src/context/hooks/useStaff.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/hooks/useStaff.ts)
- [src/context/StoreContext.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/StoreContext.tsx)
- [src/types.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/types.ts)

---

## Phase 4 - Barcode Scanner

Page:

- `/cashier/scanner`

### Step 4.1 - Scan Products

1. Open `/cashier/scanner`
2. allow camera
3. scan three owner-created products
4. test an unknown barcode

Verify:

- camera starts
- matching products resolve correctly
- unknown barcode shows product-not-found feedback
- scanned item can be added to cart

File references:

- [src/pages/cashier/CashierScanner.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/cashier/CashierScanner.tsx)
- [src/components/BarcodeScanner.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/components/BarcodeScanner.tsx)
- [src/context/hooks/useProducts.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/hooks/useProducts.ts)
- [src/lib/pageContexts.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/lib/pageContexts.ts)

---

## Phase 5 - POS

Page:

- `/cashier/pos`

### Step 5.1 - Ring Up Full Sale

1. Add 5 products
2. change quantities
3. complete one cash sale

### Step 5.2 - Ring Up Card Attempt

1. Start a new cart
2. select card or Paystack
3. confirm modal opens
4. cancel and complete by cash

### Step 5.3 - Apply Discount

1. Add 2 products
2. apply a discount
3. verify total updates
4. complete the sale

Verify:

- all sales create orders
- stock decreases
- orders appear in owner view
- change due calculates correctly

File references:

- [src/pages/cashier/CashierPOS.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/cashier/CashierPOS.tsx)
- [src/context/hooks/useOrders.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/hooks/useOrders.ts)
- [src/context/hooks/useProducts.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/hooks/useProducts.ts)
- [src/lib/paystack.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/lib/paystack.ts)
- [src/lib/pageContexts.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/lib/pageContexts.ts)

---

## Phase 6 - Checkout

Page:

- `/cashier/checkout`

### Step 6.1 - Review Checkout Flow

1. Build a cart in POS
2. navigate to `/cashier/checkout`
3. review subtotal and total
4. test voucher or credit option if present
5. complete payment

Verify:

- checkout shows correct cart contents
- payment selection works
- confirmation state appears

File references:

- [src/pages/cashier/CashierCheckout.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/cashier/CashierCheckout.tsx)
- [src/context/hooks/useOrders.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/hooks/useOrders.ts)
- [src/lib/pageContexts.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/lib/pageContexts.ts)

---

## Phase 7 - Credit Review

Page:

- `/cashier/credit-review`

### Step 7.1 - Check Customer Credit

Current status:

- `Disabled / Out Of Scope`

Testing instruction:

- open `/cashier/credit-review`
- confirm the page is gated, blurred, or non-interactive
- capture screenshot evidence
- do not treat customer credit lookup or buy-on-credit as active cashier functionality

Verify:

- the page is visibly unavailable for normal cashier use
- this feature is documented as disabled rather than launch-ready

File references:

- [src/pages/cashier/CashierCreditReview.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/cashier/CashierCreditReview.tsx)
- [src/components/CreditComingSoon.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/components/CreditComingSoon.tsx)
- [src/context/CreditContext.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/CreditContext.tsx)

---

## Phase 8 - Receipts

Page:

- `/cashier/receipts`

### Step 8.1 - Review And Reprint Receipts

1. Open `/cashier/receipts`
2. verify sales from earlier phases
3. inspect receipt details
4. print or download one receipt
5. test search by date or order number

Verify:

- receipts list includes completed sales
- details match original sale
- PDF works
- search and filter work

File references:

- [src/pages/cashier/CashierReceipts.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/cashier/CashierReceipts.tsx)
- [src/utils/pdfUtils.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/utils/pdfUtils.ts)
- [src/context/hooks/useOrders.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/hooks/useOrders.ts)
- [src/lib/pageContexts.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/lib/pageContexts.ts)

---

## Phase 9 - Inventory View

Page:

- `/cashier/inventory`

### Step 9.1 - Check Stock Levels

1. Open `/cashier/inventory`
2. verify owner-created products
3. check reduced stock after sales
4. search for a product
5. locate low-stock items

Verify:

- cashier view is read-only
- stock levels are accurate
- search works

File references:

- [src/pages/cashier/CashierInventory.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/cashier/CashierInventory.tsx)
- [src/context/hooks/useProducts.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/hooks/useProducts.ts)
- [src/components/AuthGuard.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/components/AuthGuard.tsx)

---

## Phase 10 - Alerts

Page:

- `/cashier/alerts`

### Step 10.1 - Review Alerts

1. Open `/cashier/alerts`
2. review stock, shift, and system alerts
3. mark one as read
4. dismiss one

Verify:

- alerts load
- read state updates
- badge counts update

File references:

- [src/pages/cashier/CashierAlerts.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/cashier/CashierAlerts.tsx)
- [src/hooks/useNotifications.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/hooks/useNotifications.ts)
- [src/lib/pageContexts.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/lib/pageContexts.ts)

---

## Phase 11 - End Shift

Page:

- `/cashier/shift`

### Step 11.1 - Clock Out

1. Return to `/cashier/shift`
2. end the shift
3. enter closing float
4. review expected vs actual cash
5. confirm variance

Verify:

- shift summary shows start, end, sales, transactions, and variance
- shift becomes closed
- sales are blocked or warned after shift close
- owner analytics can see the shift outcome

File references:

- [src/pages/cashier/CashierShift.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/cashier/CashierShift.tsx)
- [src/context/hooks/useStaff.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/hooks/useStaff.ts)
- [src/pages/owner/OwnerAnalytics.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/owner/OwnerAnalytics.tsx)
- [src/types.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/types.ts)

---

## Phase 12 - Support

Page:

- `/cashier/support`

### Step 12.1 - Submit Support Request

1. Open `/cashier/support`
2. submit a subject and message
3. verify confirmation feedback

Verify:

- form validation works
- submission succeeds

File references:

- [src/pages/cashier/CashierSupport.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/cashier/CashierSupport.tsx)
- [src/components/SupportForm.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/components/SupportForm.tsx)
- [src/lib/pageContexts.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/lib/pageContexts.ts)

---

## Full Regression Checklist

| Check | Status | Notes |
|---|---|---|
| Cashier registers and logs in |  |  |
| Linked to correct store |  |  |
| Cannot access owner routes |  |  |
| Shift starts with opening float |  |  |
| Barcode scanner identifies products |  |  |
| 3 POS sales completed |  |  |
| Stock decreases after each sale |  |  |
| Orders appear in owner orders list |  |  |
| Credit review page correctly appears disabled |  |  |
| Receipts list shows all completed sales |  |  |
| PDF receipt downloads correctly |  |  |
| Inventory view is read-only |  |  |
| Shift ends with cash variance calculation |  |  |
| Alerts load and dismiss correctly |  |  |
| Support form submits without errors |  |  |
| No console errors during testing |  |  |
| Mobile responsive at 375px width |  |  |
