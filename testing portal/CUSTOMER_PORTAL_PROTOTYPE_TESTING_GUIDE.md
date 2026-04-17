# SmiteTrade Customer Portal Prototype Testing Guide

## Purpose
A structured, real-world walkthrough for testing the Customer portal from account creation through to a completed order. Designed to be executed after the Owner portal setup is done so products and a live store already exist.

Current scope note:

- BRI, credit, and lending workflows are gated behind `ComingSoonGuard` — they are out of scope for this guide
- Payment steps that reference Payfast/card will redirect to the payment gateway; use test credentials if available

---

## Pre-conditions
Before starting, confirm the following in the Owner portal:

- At least one active store exists
- At least 10 products are stocked with quantities > 0
- At least one product has each fulfilment option: `pickup`, `courier`, `instore_delivery`

Reference:

- [OWNER_PORTAL_PROTOTYPE_TESTING_GUIDE.md](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/testing%20portal/OWNER_PORTAL_PROTOTYPE_TESTING_GUIDE.md)

---

## Suggested Test Data

- Customer name: `Thabo Nkosi`
- Email: `customer.test@smitetrade.co.za`
- Password: `Test@12345`
- ID number: `9001015009087`
- Phone: `0712345678`
- Default address: `12 Voortrekker Road, Polokwane, 0700`
- Cart 1 (pickup): `2x Coca-Cola + 1x Albany Bread + 1x Sunlight Dishwash`
- Cart 2 (courier): `3x Simba Chips + 1x Cremora`

---

## Status Labels

- `Pass`
- `Fail`
- `Blocked`
- `Needs Manual Browser Test`
- `Needs Firebase Verification`

---

## Phase 1 — Account Setup

Pages:

- `/customer/signup`
- `/customer/login`

### Step 1.1 — Register

1. Navigate to `/customer/signup`
2. Fill in first name, last name, email, phone, ID number, and password
3. Submit the form
4. Confirm redirect to `/customer/products` or dashboard

Verify:

- user document created in Firestore `users` collection with role `customer`
- no owner or cashier routes are accessible
- form validation rejects blank fields, invalid email, short password

File references:

- [src/pages/customer/CustomerRegister.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/customer/CustomerRegister.tsx)
- [src/context/hooks/useAuth.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/hooks/useAuth.ts)
- [src/components/AuthGuard.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/components/AuthGuard.tsx)

| Check | Result |
|-------|--------|
| Form submits successfully | |
| Redirects after registration | |
| Firestore user document created with role `customer` | |
| Invalid inputs are rejected | |

---

### Step 1.2 — Login

1. Log out if already signed in
2. Navigate to `/customer/login`
3. Sign in with the registered email and password
4. Confirm redirect to products page

Verify:

- successful login lands on `/customer/products`
- wrong password shows an error toast
- owner/cashier routes are still inaccessible

File references:

- [src/pages/customer/CustomerLogin.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/customer/CustomerLogin.tsx)

| Check | Result |
|-------|--------|
| Login succeeds with correct credentials | |
| Wrong password shows error | |
| Redirect to products on success | |

---

## Phase 2 — Browse Products

Page: `/customer/products`

### Step 2.1 — Category Filtering

1. Navigate to `/customer/products`
2. Click each category tab: `All`, `Staples`, `Beverages`, `Dairy`, `Bakery`, `Household`, `Pantry`
3. Confirm the product list updates for each category

Verify:

- active category is highlighted
- product count changes per category
- `All` shows the full product list

File references:

- [src/pages/customer/CustomerProducts.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/customer/CustomerProducts.tsx)

| Check | Result |
|-------|--------|
| Category tabs filter correctly | |
| All products shown under `All` | |

---

### Step 2.2 — Search

1. Type `Bread` in the search bar
2. Confirm matching products appear
3. Clear the search and confirm all products return
4. Try a popular search chip (e.g. `Milk`)

Verify:

- search is case-insensitive
- no results state appears for nonsense input like `zzzzz`

| Check | Result |
|-------|--------|
| Search filters product list | |
| Clearing search restores full list | |
| Popular search chips work | |
| No-results state appears for unmatched query | |

---

### Step 2.3 — Store Filter & Location

1. Use the store selector dropdown to switch between available stores
2. Confirm products update to match the selected store
3. Allow location permissions if prompted — confirm distance labels appear

Verify:

- store selector shows all active stores
- switching stores reloads the product list
- distance shown next to each store

| Check | Result |
|-------|--------|
| Store filter updates products | |
| Distance shown for stores with location | |

---

### Step 2.4 — Add to Cart

1. Add `2x Coca-Cola` using the quantity controls
2. Add `1x Albany Bread`
3. Add `1x Sunlight Dishwash`
4. Confirm the cart badge in the header increments

Verify:

- adding the same item again increments quantity
- cart badge reflects total item count
- toast appears confirming item added

| Check | Result |
|-------|--------|
| Items added to cart | |
| Cart badge increments | |
| Duplicate item increments quantity | |
| Add toast appears | |

---

## Phase 3 — Cart Management

Page: `/customer/cart`

### Step 3.1 — Review Cart

1. Navigate to `/customer/cart`
2. Confirm all 3 items are listed with correct quantities and prices
3. Change `Coca-Cola` quantity to 3 using the `+` button
4. Remove `Sunlight Dishwash` using the remove/trash button

Verify:

- line totals update when quantity changes
- cart total updates immediately
- removed item disappears from the list
- empty cart state appears if all items removed

File references:

- [src/pages/customer/CustomerCart.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/customer/CustomerCart.tsx)

| Check | Result |
|-------|--------|
| Items listed with correct quantities | |
| Quantity increment updates total | |
| Remove button deletes item | |
| Cart total is accurate | |
| Empty cart state shown when cart cleared | |

---

### Step 3.2 — Proceed to Checkout

1. With items in cart, click `Proceed to Checkout`
2. Confirm redirect to `/customer/checkout`

| Check | Result |
|-------|--------|
| Checkout button is active when cart has items | |
| Navigates to checkout | |

---

## Phase 4 — Checkout

Page: `/customer/checkout`

### Step 4.1 — Delivery Method

1. On checkout Step 1, select `Pickup` as the delivery method
2. Select the active store from the store dropdown
3. Proceed to next step

Verify:

- only fulfilment options available for cart items are shown
- store selector lists active stores only

File references:

- [src/pages/customer/CustomerCheckout.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/customer/CustomerCheckout.tsx)

| Check | Result |
|-------|--------|
| Delivery method options shown | |
| Pickup selected successfully | |
| Store selector lists active stores | |

---

### Step 4.2 — Delivery Address (Courier)

1. Go back and change delivery method to `Courier`
2. Enter the test address: `12 Voortrekker Road, Polokwane, 0700`
3. Confirm postal code validation accepts valid Limpopo postcodes (`0700`)
4. Enter an invalid postal code (e.g. `9999`) and confirm the error

Verify:

- address fields are shown only for courier/delivery methods
- invalid postal code blocked from proceeding
- valid address allows next step

| Check | Result |
|-------|--------|
| Address fields appear for courier method | |
| Valid postal code accepted | |
| Invalid postal code shows error | |

---

### Step 4.3 — Payment Method

1. On the payment step, select `Card` as the payment method
2. Confirm order summary shows correct total
3. Confirm allow-substitutions checkbox is available

Verify:

- card, EFT options visible (credit/wallet option should NOT appear — it is gated)
- order summary matches cart total
- allow-substitutions checkbox toggles

| Check | Result |
|-------|--------|
| Payment method selector shown | |
| Credit/wallet option NOT visible | |
| Order summary matches cart total | |
| Allow-substitutions toggles | |

---

### Step 4.4 — Place Order

1. Click `Place Order`
2. Confirm redirect to `/customer/payment` or Payfast gateway

Verify:

- order is created in Firestore `orders` collection with correct `storeId`, `userId`, items, and total
- order status is `Pending`

| Check | Result |
|-------|--------|
| Order placed successfully | |
| Redirects to payment | |
| Firestore order document created | |
| Order status is `Pending` | |

---

## Phase 5 — Payment

Page: `/customer/payment`

### Step 5.1 — Payment Confirmation Screen

1. After checkout, land on `/customer/payment`
2. Confirm the order summary is visible
3. Confirm the Payfast/payment button is present

Verify:

- order details match what was placed
- payment button initiates the gateway redirect

File references:

- [src/pages/customer/CustomerPayment.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/customer/CustomerPayment.tsx)

| Check | Result |
|-------|--------|
| Order summary shown on payment page | |
| Payment button present | |
| Gateway redirect triggers on click | |

---

## Phase 6 — Orders

Pages: `/customer/orders`, `/customer/orders/:id`

### Step 6.1 — Order List

1. Navigate to `/customer/orders`
2. Confirm the placed order appears in the list
3. Check the status badge shows `Pending` or `Processing`

Verify:

- only the logged-in customer's orders are shown
- status badges match the order state in Firestore
- `Reorder` button is visible on delivered orders

File references:

- [src/pages/customer/CustomerOrders.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/customer/CustomerOrders.tsx)

| Check | Result |
|-------|--------|
| Order appears in list | |
| Correct status badge shown | |
| Other customers' orders not visible | |

---

### Step 6.2 — Order Details

1. Click on the order from the list
2. Confirm redirect to `/customer/orders/:id`
3. Confirm all items, quantities, prices, delivery method, and total are shown

Verify:

- item list matches what was placed
- totals are correct
- delivery address shown for courier orders

File references:

- [src/pages/customer/CustomerOrderDetails.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/customer/CustomerOrderDetails.tsx)

| Check | Result |
|-------|--------|
| Order details page loads | |
| Items and totals correct | |
| Delivery info visible for courier | |

---

## Phase 7 — Order Tracking

Page: `/customer/tracking`

### Step 7.1 — Tracking Timeline

1. Navigate to `/customer/tracking`
2. Select the active order from the order selector dropdown (if multiple orders exist)
3. Confirm the tracking timeline is shown with correct step statuses

Verify:

- timeline steps: Order Received → Picking & Packing → Driver Assigned → Arriving Soon
- completed steps are marked visually distinct from pending steps
- if no active orders exist, the empty state renders correctly

File references:

- [src/pages/customer/CustomerTracking.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/customer/CustomerTracking.tsx)

| Check | Result |
|-------|--------|
| Tracking timeline renders | |
| Correct step highlighted as current | |
| Empty state shown when no active orders | |
| Order selector switches between orders | |

---

## Phase 8 — Profile Management

Page: `/customer/profile`

### Step 8.1 — View Profile

1. Navigate to `/customer/profile`
2. Confirm the customer's name, email, phone, and ID number are pre-filled
3. Check that order count is displayed correctly

Verify:

- profile fields match what was entered at registration
- order count reflects the number of orders placed

File references:

- [src/pages/customer/CustomerProfile.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/customer/CustomerProfile.tsx)

| Check | Result |
|-------|--------|
| Profile fields pre-filled | |
| Order count correct | |

---

### Step 8.2 — Update Profile

1. Change the phone number to `0798765432`
2. Save changes
3. Refresh the page and confirm the new number persists

Verify:

- validation rejects invalid formats (e.g. letters in phone field)
- success toast appears on save
- Firestore user document reflects the update

| Check | Result |
|-------|--------|
| Phone number update saved | |
| Validation rejects invalid phone | |
| Success toast shown | |
| Firestore updated | |

---

### Step 8.3 — Address Book

1. Click `Add Address`
2. Enter label `Home` and address `12 Voortrekker Road, Polokwane`
3. Save the address
4. Confirm it appears in the address list

Verify:

- address saved to local state (persists on page refresh if wired to Firestore)
- label is displayed with the address

| Check | Result |
|-------|--------|
| Add address form opens | |
| Address saved and listed | |
| Blank fields are rejected | |

---

## Phase 9 — Alerts & Notifications

Page: `/customer/alerts`

### Step 9.1 — Notifications

1. Navigate to `/customer/alerts`
2. Confirm notification items are listed (order updates, system messages)
3. Mark one notification as read
4. Click `Mark All as Read`
5. Dismiss a notification

Verify:

- unread notifications are visually distinct
- marking as read changes the visual state
- dismissed notification is removed from the list

File references:

- [src/pages/customer/CustomerAlerts.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/customer/CustomerAlerts.tsx)

| Check | Result |
|-------|--------|
| Notifications listed | |
| Mark as read updates visual state | |
| Mark all as read clears unread indicators | |
| Dismiss removes notification | |

---

## Phase 10 — Support

Page: `/customer/support`

### Step 10.1 — Submit a Support Request

1. Navigate to `/customer/support`
2. Fill in the subject and message fields
3. Submit the form
4. Confirm a success toast appears

Verify:

- form validates empty fields
- support message submitted (check Firestore or admin panel for received ticket)
- form resets after submission

File references:

- [src/pages/customer/CustomerSupport.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/customer/CustomerSupport.tsx)
- [src/components/SupportForm.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/components/SupportForm.tsx)

| Check | Result |
|-------|--------|
| Form validates blank fields | |
| Submission shows success toast | |
| Ticket appears in admin panel | |
| Form resets after submission | |

---

## Phase 11 — Role Isolation Check

### Step 11.1 — Access Control

1. While logged in as customer, manually navigate to `/owner/dashboard`
2. Confirm redirect or access denied
3. Manually navigate to `/cashier/dashboard`
4. Confirm redirect or access denied
5. Manually navigate to `/customer/credit-status` and `/customer/apply-credit`
6. Confirm "Coming Soon" screen renders instead of the actual page

Verify:

- `AuthGuard` blocks cross-role access
- `ComingSoonGuard` intercepts all credit routes

File references:

- [src/components/AuthGuard.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/components/AuthGuard.tsx)
- [src/components/ComingSoonGuard.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/components/ComingSoonGuard.tsx)

| Check | Result |
|-------|--------|
| Owner routes inaccessible | |
| Cashier routes inaccessible | |
| Credit routes show Coming Soon | |

---

## Summary Checklist

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Account Setup (Register + Login) | |
| 2 | Browse Products (Filter, Search, Cart) | |
| 3 | Cart Management | |
| 4 | Checkout (Delivery + Payment method) | |
| 5 | Payment | |
| 6 | Orders (List + Details) | |
| 7 | Order Tracking | |
| 8 | Profile Management | |
| 9 | Alerts & Notifications | |
| 10 | Support | |
| 11 | Role Isolation | |

---

## Out of Scope (Gated Features)

The following routes are currently behind `ComingSoonGuard portal="Credit"` and should not be tested:

- `/customer/credit-review`
- `/customer/apply-credit`
- `/customer/credit-status` (BRI score page)
- `/customer/lender-registration`
