# SmiteTrade Admin Portal Prototype Testing Guide

## Purpose
End-to-end walkthrough for testing the Admin portal across all 13 active pages. Designed to be run after at least one Owner, Cashier, and Customer account exist with real data.

Current scope note:

- `/admin/credit-overview` is gated behind `ComingSoonGuard portal="Credit"` — it is out of scope for this guide
- POS Monitor and Audit Logs use a mix of live Firestore data and mock fallbacks

---

## Pre-conditions

Before starting, confirm:

- At least one owner account exists with a store, products, and orders
- At least one cashier account is linked to the owner's store
- At least one customer has placed an order
- Admin account has been seeded (see Step 1.0 below)

Reference:

- [OWNER_PORTAL_PROTOTYPE_TESTING_GUIDE.md](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/testing%20portal/OWNER_PORTAL_PROTOTYPE_TESTING_GUIDE.md)
- [CASHIER_PORTAL_PROTOTYPE_TESTING_GUIDE.md](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/testing%20portal/CASHIER_PORTAL_PROTOTYPE_TESTING_GUIDE.md)
- [CUSTOMER_PORTAL_PROTOTYPE_TESTING_GUIDE.md](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/testing%20portal/CUSTOMER_PORTAL_PROTOTYPE_TESTING_GUIDE.md)

---

## Admin Login Credentials

> **Note:** The admin account must be seeded once before first use. See Step 1.0.

| Field | Value |
|-------|-------|
| Admin ID / Email | `admin@smitetrade.co.za` |
| Password | `Admin@Smite2026!` |
| Login URL | `/admin/login` |

The login field accepts either a full email (`admin@smitetrade.co.za`) or just an ID (e.g. `admin` — the system appends `@admin.smitetrade.co.za` automatically).

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

- Browser console (seed step)
- `/admin/login`
admin@smitetrade.co.za
### Step 1.0 — Seed the Admin Account (First Time Only)

If no admin account exists yet:

1. Open the browser dev console on any SmiteTrade page
2. Run the following:

```js
import('@/lib/seedAdmin').then(m =>
  m.seedAdminUser('admin@smitetrade.co.za', 'Admin@Smite2026!', 'Smitetrade Admin')
    .then(console.log)
)
```

3. Confirm the console prints: `✅ Admin user created: `
4. A Firestore document is created in `users` with `role: "admin"` and a record in `admin_seed/status` with `seeded: true`

> Running this a second time will return: `Admin already seeded.` — this is expected.

File references:

- [src/lib/seedAdmin.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/lib/seedAdmin.ts)

| Check | Result |
|-------|--------|
| Seed script runs without error | |
| Firestore `users` doc created with `role: admin` | |
| `admin_seed/status.seeded` is `true` | |
| Second run returns "already seeded" message | |

---

### Step 1.1 — Login

1. Navigate to `/admin/login`
2. Enter Admin ID: `admin` (or full email `admin@smitetrade.co.za`)
3. Enter password: `Admin@Smite2026!`
4. Submit and confirm redirect to `/admin/dashboard`

Verify:

- wrong password shows "Access denied" error
- blank fields are rejected before submission
- successful login lands on the dashboard

File references:

- [src/pages/admin/AdminLogin.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/admin/AdminLogin.tsx)
- [src/context/hooks/useAuth.ts](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/context/hooks/useAuth.ts)

| Check | Result |
|-------|--------|
| Login with ID shorthand works | |
| Login with full email works | |
| Wrong password shows error message | |
| Blank fields blocked by validation | |
| Redirect to dashboard on success | |

---

## Phase 2 — Dashboard Overview

Page: `/admin/dashboard`

### Step 2.1 — KPI Cards

1. Land on `/admin/dashboard`
2. Confirm the four KPI cards are populated:
   - Total Users
   - Total Stores
   - Total Revenue (delivered/paid orders only)
   - Total Orders

Verify:

- values reflect actual Firestore data (not all zeros)
- revenue only counts `Delivered` and `Paid` order statuses

File references:

- [src/pages/admin/AdminDashboard.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/admin/AdminDashboard.tsx)

| Check | Result |
|-------|--------|
| KPI cards load with data | |
| Revenue excludes pending/cancelled orders | |

---

### Step 2.2 — Charts

1. Confirm daily transactions bar chart renders
2. Confirm user growth line chart renders
3. Confirm order status pie chart renders with correct segments

| Check | Result |
|-------|--------|
| Bar chart renders | |
| Line chart renders | |
| Pie chart renders with all segments | |

---

## Phase 3 — User Management

Page: `/admin/users`

### Step 3.1 — View All Users

1. Navigate to `/admin/users`
2. Confirm users from all roles are listed (owners, cashiers, customers)
3. Check status badges (`active`, `pending`, `banned`)

File references:

- [src/pages/admin/AdminUsers.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/admin/AdminUsers.tsx)

| Check | Result |
|-------|--------|
| All users listed from Firestore | |
| Role labels visible per user | |
| Status badges displayed | |

---

### Step 3.2 — Ban and Unban a User

1. Find the test cashier (`Precious Sithole`)
2. Click `Ban` — confirm status changes to `banned`
3. Click `Activate` — confirm status reverts to `active`

Verify:

- Firestore user document updated with new status
- action reflected immediately in the table

| Check | Result |
|-------|--------|
| Ban action updates status | |
| Activate action reverts status | |
| Firestore updated on both actions | |

---

### Step 3.3 — Send Password Reset

1. Find the test customer account
2. Click `Send Reset Email`
3. Confirm the toast says reset email sent

Verify:

- Firebase Auth `sendPasswordResetEmail` triggered
- no error toast

| Check | Result |
|-------|--------|
| Reset email action fires without error | |
| Success toast shown | |

---

## Phase 4 — Store Management

Page: `/admin/stores`

### Step 4.1 — View All Stores

1. Navigate to `/admin/stores`
2. Confirm the test store appears in the table
3. Check product count and total sales columns

File references:

- [src/pages/admin/AdminStores.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/admin/AdminStores.tsx)

| Check | Result |
|-------|--------|
| Test store listed | |
| Product count correct | |
| Sales total shown | |

---

### Step 4.2 — Suspend and Activate a Store

1. Find a store with `Active` status
2. Click `Suspend` — confirm status changes to `Suspended`
3. Click `Activate` — confirm status reverts to `Active`

Verify:

- Firestore `stores` document updated
- status badge changes in the table immediately

| Check | Result |
|-------|--------|
| Suspend toggles store status | |
| Activate reverts store status | |
| Firestore updated | |

---

## Phase 5 — Applications

Page: `/admin/applications`

### Step 5.1 — View Pending Applications

1. Navigate to `/admin/applications`
2. Confirm pending store owner applications are listed
3. Click `View` on one application — confirm the detail dialog opens with name, contact, location, and documents

File references:

- [src/pages/admin/AdminApplications.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/admin/AdminApplications.tsx)

| Check | Result |
|-------|--------|
| Pending applications listed | |
| Detail dialog opens with full info | |
| Documents checklist visible | |

---

### Step 5.2 — Approve and Reject

1. Approve one `Pending` application — confirm status changes to `Approved` and a success toast appears
2. Reject another — confirm status changes to `Rejected`
3. Optionally add a rejection note in the message field

| Check | Result |
|-------|--------|
| Approve changes status to Approved | |
| Reject changes status to Rejected | |
| Rejection note saved | |

---

## Phase 6 — POS Monitor

Page: `/admin/pos-monitor`

### Step 6.1 — Live Transaction Feed

1. Navigate to `/admin/pos-monitor`
2. Confirm the active terminals count is shown
3. Confirm the recent transaction list is populated
4. Click on a transaction row — confirm the detail dialog opens with customer name, phone, address, items, and payment method

Verify:

- if real orders exist in Firestore, they populate the stats
- mock transactions fill the feed as fallback

File references:

- [src/pages/admin/AdminPOSMonitor.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/admin/AdminPOSMonitor.tsx)

| Check | Result |
|-------|--------|
| Terminal count and volume shown | |
| Transaction feed populated | |
| Detail dialog opens with full transaction info | |

---

## Phase 7 — Analytics

Page: `/admin/analytics`

### Step 7.1 — Charts

1. Navigate to `/admin/analytics`
2. Confirm user growth chart renders (weekly signups)
3. Confirm revenue by store bar chart renders
4. Confirm all chart data is displayed without errors

File references:

- [src/pages/admin/AdminAnalytics.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/admin/AdminAnalytics.tsx)

| Check | Result |
|-------|--------|
| User growth chart renders | |
| Revenue by store chart renders | |
| No chart errors in console | |

---

## Phase 8 — Revenue

Page: `/admin/revenue`

### Step 8.1 — Revenue Overview

1. Navigate to `/admin/revenue`
2. Confirm total revenue, transaction count, and average transaction value KPI cards load
3. Confirm the revenue breakdown chart renders
4. Confirm the transactions table is populated

Verify:

- Firestore `transactions` collection queried
- mock fallback data renders if collection is empty

File references:

- [src/pages/admin/AdminRevenue.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/admin/AdminRevenue.tsx)

| Check | Result |
|-------|--------|
| KPI cards load | |
| Chart renders | |
| Transactions table shows data | |

---

## Phase 9 — Disputes & Flags

Page: `/admin/disputes`

### Step 9.1 — View Disputes

1. Navigate to `/admin/disputes`
2. Confirm active dispute count is shown
3. Confirm dispute rows are listed with type, description, status, and priority

File references:

- [src/pages/admin/AdminDisputes.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/admin/AdminDisputes.tsx)

| Check | Result |
|-------|--------|
| Disputes listed | |
| Priority and status badges shown | |

---

### Step 9.2 — Resolve a Dispute

1. Find a dispute with `Pending` or `Open` status
2. Click `Resolve` — confirm status changes to `Resolved` and a success toast appears
3. Confirm the active dispute count decrements

| Check | Result |
|-------|--------|
| Resolve action updates status | |
| Success toast shown | |
| Active dispute count updates | |

---

## Phase 10 — Audit Logs

Page: `/admin/audit-logs`

### Step 10.1 — View Log Entries

1. Navigate to `/admin/audit-logs`
2. Confirm log entries are listed with action, user, details, and timestamp
3. Confirm entries are ordered by most recent first

Verify:

- if `audit_logs` Firestore collection has entries, they display
- fallback mock logs render if collection is empty

File references:

- [src/pages/admin/AdminAuditLogs.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/admin/AdminAuditLogs.tsx)

| Check | Result |
|-------|--------|
| Log entries listed | |
| Ordered by most recent | |
| Firestore data loads if available | |
| Fallback mock data renders if empty | |

---

## Phase 11 — Support Tickets

Page: `/admin/support`

### Step 11.1 — View Incoming Tickets

1. Navigate to `/admin/support`
2. Confirm tickets submitted from Owner, Cashier, and Customer portals appear
3. Confirm each ticket shows role, subject, message, and timestamp

Verify:

- tickets come from the `support_tickets` Firestore collection
- tickets from all portals (owner, cashier, customer) are visible to admin

File references:

- [src/pages/admin/AdminSupport.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/admin/AdminSupport.tsx)
- [src/components/SupportForm.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/components/SupportForm.tsx)

| Check | Result |
|-------|--------|
| Tickets from all portals listed | |
| Role label visible per ticket | |
| Subject and message visible | |

---

## Phase 12 — Alerts & Notifications

Page: `/admin/alerts`

### Step 12.1 — Notification Centre

1. Navigate to `/admin/alerts`
2. Confirm notifications are listed
3. Mark one as read — confirm visual state updates
4. Click `Mark All as Read`
5. Dismiss a notification

File references:

- [src/pages/admin/AdminAlerts.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/admin/AdminAlerts.tsx)

| Check | Result |
|-------|--------|
| Notifications listed | |
| Mark as read updates state | |
| Mark all as read clears unread indicators | |
| Dismiss removes notification | |

---

## Phase 13 — Supplier Directory

Page: `/admin/suppliers`

### Step 13.1 — View Platform Suppliers

1. Navigate to `/admin/suppliers`
2. Confirm the supplier list is populated (Unilever SA, Pioneer Foods, Tiger Brands, Clover SA, or Firestore entries)

File references:

- [src/pages/admin/AdminSuppliers.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/pages/admin/AdminSuppliers.tsx)

| Check | Result |
|-------|--------|
| Supplier list populated | |
| Status badges shown | |

---

### Step 13.2 — Add a Supplier

1. Click `Add Supplier`
2. Enter name: `Simba Chips SA`
3. Save — confirm the supplier appears in the list and a success toast shows

Verify:

- supplier saved to `platform_suppliers` Firestore collection
- new entry appears immediately in the table

| Check | Result |
|-------|--------|
| Add supplier dialog opens | |
| New supplier saves successfully | |
| Success toast shown | |
| Supplier appears in list | |

---

### Step 13.3 — Delete a Supplier

1. Click `Delete` on `Simba Chips SA`
2. Confirm the supplier is removed and a success toast appears

Verify:

- Firestore `platform_suppliers` document deleted

| Check | Result |
|-------|--------|
| Delete removes supplier from list | |
| Success toast shown | |
| Firestore document deleted | |

---

## Phase 14 — Role Isolation Check

### Step 14.1 — Access Control

1. While logged in as admin, navigate to `/owner/dashboard`
2. Confirm redirect or access denied (admin role should not pass owner AuthGuard)
3. Navigate to `/admin/credit-overview`
4. Confirm "Coming Soon" screen renders

File references:

- [src/components/AuthGuard.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/components/AuthGuard.tsx)
- [src/components/ComingSoonGuard.tsx](c:/Users/Lufuno%20Mphela/Documents/smitetrade-secure-growth/src/components/ComingSoonGuard.tsx)

| Check | Result |
|-------|--------|
| Owner routes inaccessible from admin session | |
| `/admin/credit-overview` shows Coming Soon | |

---

## Summary Checklist

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Account Setup (Seed + Login) | |
| 2 | Dashboard KPI Cards + Charts | |
| 3 | User Management (View, Ban, Reset) | |
| 4 | Store Management (View, Suspend) | |
| 5 | Applications (View, Approve, Reject) | |
| 6 | POS Monitor (Live feed, Transaction detail) | |
| 7 | Analytics Charts | |
| 8 | Revenue Tracking | |
| 9 | Disputes (View, Resolve) | |
| 10 | Audit Logs | |
| 11 | Support Tickets | |
| 12 | Alerts & Notifications | |
| 13 | Supplier Directory (Add, Delete) | |
| 14 | Role Isolation | |

---

## Out of Scope (Gated Features)

The following route is currently behind `ComingSoonGuard portal="Credit"`:

- `/admin/credit-overview`
