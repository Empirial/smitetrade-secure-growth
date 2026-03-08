# Admin Portal Enhancement Plan

## Current State

The admin portal has 6 pages: Dashboard (KPI cards + mock alerts), Applications, POS Monitor, Users (real Firestore queries), Audit Logs (mock data), and Disputes. All pages use mostly hardcoded/mock data with minimal real functionality.

## What the Admin Portal Should Do

For a spaza shop management platform, the admin needs to be a **super-operator** who can oversee the entire ecosystem:


| Category       | New Page                  | Purpose                                                                   |
| -------------- | ------------------------- | ------------------------------------------------------------------------- |
| **Analytics**  | Platform Analytics        | Revenue trends, user growth, transaction volume charts (using recharts)   |
| **Finance**    | Revenue & Payments        | PayStack transaction history, payment success/failure rates, total GMV    |
| **Stores**     | Store Management          | View all registered stores, approve/suspend stores, see per-store metrics |
| **Credit**     | Credit & Lending Overview | Total loan portfolio, default rates, BRI score distribution across users  |
| **Operations** | System Settings           | Feature flags, platform fee config, notification templates                |
| **Support**    | Support Tickets           | View/respond to customer support requests (from CustomerSupport page)     |


## Plan

### 1. Enhance Admin Dashboard

- Replace hardcoded KPIs with aggregated data from Firestore (user count, store count, order count, total revenue)
- Add recharts line/bar charts: daily transaction volume, user signups over time, revenue trend
- Add a "Recent Activity" feed pulling from orders and user registrations

### 2. New: Platform Analytics Page (`AdminAnalytics.tsx`)

- User growth chart (signups by day/week)
- Revenue breakdown by store (bar chart)
- Order volume and status distribution (pie chart)
- Active users by role (owner/cashier/customer/driver/lender)

### 3. New: Store Management Page (`AdminStores.tsx`)

- Table of all stores from Firestore `stores` collection
- Columns: name, owner, location, status, product count, total sales
- Actions: activate/suspend store, view store details

### 4. New: Revenue & Payments Page (`AdminRevenue.tsx`)

- Transaction summary cards (total volume, success rate, average order value)
- Recent transactions table
- Payment method breakdown (card vs cash vs credit)

### 5. New: Credit Overview Page (`AdminCreditOverview.tsx`)

- Total lending portfolio value
- Default rate metrics
- BRI score distribution histogram
- Top borrowers table

### 6. New: Support Tickets Page (`AdminSupport.tsx`)

- List of support tickets submitted by customers
- Status management (open/in-progress/resolved)
- Reply functionality

### 7. Update Navigation & Routes

- Add new nav links to `DashboardLayout.tsx` admin section
- Add routes in `App.tsx` with AuthGuard
  &nbsp;

## Files to Create/Change


| File                                      | Change                                                 |
| ----------------------------------------- | ------------------------------------------------------ |
| `src/pages/admin/AdminDashboard.tsx`      | Replace mock KPIs with Firestore aggregates + recharts |
| `src/pages/admin/AdminAnalytics.tsx`      | **New** — platform-wide analytics with charts          |
| `src/pages/admin/AdminStores.tsx`         | **New** — store management table                       |
| `src/pages/admin/AdminRevenue.tsx`        | **New** — revenue & payment tracking                   |
| `src/pages/admin/AdminCreditOverview.tsx` | **New** — lending portfolio overview                   |
| `src/pages/admin/AdminSupport.tsx`        | **New** — support ticket management                    |
| `src/components/DashboardLayout.tsx`      | Add new admin nav links                                |
| `src/App.tsx`                             | Add new admin routes                                   |
