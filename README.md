# SmiteTrade

Multi-role SaaS platform for the South African informal retail and spaza shop economy. Six role-based portals serving customers, shop owners, cashiers, drivers, lenders, and administrators — 92 pages total, production-grade.

**Last reviewed:** 18 April 2026 — Admin portal fully hardened; all mock data removed, Firestore rules verified.

---

## Tech Stack

- **React 18.3.1 + TypeScript 5.8.3**
- **Vite 5.4** — dev server on port 8080
- **Firebase 12** — Auth, Firestore, Storage, Analytics
- **Paystack** — payment processing
- **TanStack React Query 5** — server state
- **shadcn/ui + Radix UI** — 50 UI components
- **Tailwind CSS 3.4** — custom tokens: emerald, electric-blue, gold
- **Framer Motion** — animations
- **Recharts** — data visualisation
- **@zxing** — barcode scanning
- **jsPDF** — PDF generation
- **Playwright** — E2E tests
- **Vitest** — unit tests

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server → localhost:8080
npm run dev

# Production build
npm run build

# Deploy to Firebase
npm run build && firebase deploy
```

---

## Environment Variables

Create a `.env` file in the root (never commit it):

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

---

## Portals

| Portal | URL Prefix | Pages | Status |
|--------|-----------|-------|--------|
| Customer | `/customer/` | 16 | Live |
| Owner | `/owner/` | 20 | Live |
| Cashier | `/cashier/` | 12 | Live |
| Driver | `/driver/` | 12 | Coming Soon gate active |
| Lender | `/lender/` | 12 | Coming Soon gate active |
| Admin | `/admin/` | 14 | Live |
| Public | `/` | 6 | Live |

---

## Architecture

### RBAC & Routing
- `src/components/AuthGuard.tsx` — wraps every protected route, checks user role
- `src/App.tsx` — all 92 routes + providers
- Portals at `/owner`, `/customer`, `/cashier`, `/driver`, `/lender`, `/admin`

### Global State
- `src/context/StoreContext.tsx` — auth, products, cart, orders, staff, inventory, suppliers, shifts
- `src/context/CreditContext.tsx` — credit profiles, BRI scoring, borrowers, loans, applications

### Multi-Tenancy
- Every Firestore document has a `storeId` field
- `firestore.rules` enforces storeId isolation across all 20 collections
- Owners can manage multiple stores

### BRI (Behavioural Reliability Index)
SmiteTrade's proprietary credit scoring system. Scores customers based on payment timing, history depth, and behavioural patterns. Five algorithms: weighted rolling average, dynamic credit limit engine, loan overdue auto-detection, multi-factor borrower risk scoring, and auto credit limit review.

---

## Key Files

| File | Purpose |
|------|---------|
| `src/main.tsx` | App entry point |
| `src/App.tsx` | All routes + providers |
| `src/types.ts` | All TypeScript interfaces |
| `src/lib/firebase.ts` | Firebase init |
| `src/lib/constants.ts` | Mock data, defaults |
| `src/lib/paystack.ts` | Payment integration |
| `firestore.rules` | Security rules |
| `firestore.indexes.json` | Composite indexes |

---

## Testing

```bash
npm run test              # Vitest unit tests
npm run test:agent        # All Playwright E2E
npm run test:customer     # Customer portal E2E
npm run test:owner        # Owner portal E2E
npm run test:cashier      # Cashier portal E2E
npm run test:driver       # Driver portal E2E
npm run test:lender       # Lender portal E2E
```

---

## Build Status

| Check | Status |
|-------|--------|
| TypeScript | 0 errors |
| Production build | Passing |
| Firestore security | Reviewed & hardened |

---

## Session Log — 17–18 April 2026

### Customer Portal
- `/customer/lender-registration` route wrapped in `ComingSoonGuard portal="Credit" allowAdminPreview={false}` — all 4 credit routes now gated.
- Testing guide saved to `testing portal/CUSTOMER_PORTAL_TESTING_GUIDE.md` (11 phases, 13 active pages).

### Admin Portal — Bootstrapping
- Created `src/lib/seedAdmin.ts` — one-time seed function that creates the admin Firebase Auth account and Firestore user document.
- Added `admin_seed` collection rule to `firestore.rules`: `allow read: if true`, `allow write: if !exists(admin_seed/status)` (one-time write guard).
- Deployed updated rules to Firebase project `smitetrade-40643`.
- Admin credentials: ID `admin` / password `Admin@Smite2026!` (login appends `@admin.smitetrade.co.za`).
- Testing guide saved to `testing portal/ADMIN_PORTAL_PROTOTYPE_TESTING_GUIDE.md` (14 phases, embedded credentials).

### Admin Portal — Closed Portal References Removed
Removed all references to Driver, Lender, and Credit portals from:
- `AdminDashboard.tsx` — removed Lending Portfolio KPI card, `useCredit` import.
- `AdminAnalytics.tsx` — removed Drivers/Lenders from user role chart, `useCredit` import.
- `AdminAlerts.tsx` — removed credit/lending alert, driver/lender broadcast targets.
- `AdminRevenue.tsx` — removed Credit payment method row, Lender transaction row.

### Admin Portal — Mock Data Removal (full pass)
All hardcoded/fake data replaced with live Firestore or real computed values:

| Page | Before | After |
|------|--------|-------|
| AdminDashboard | Mock daily/weekly chart arrays | Orders grouped by day-of-week; real order status pie |
| AdminAnalytics | Fake weekly signups; hardcoded fallback counts | Orders per day of week; real customer/store/staff counts |
| AdminDisputes | 4 hardcoded fake disputes | Live `disputes` Firestore collection via `onSnapshot` |
| AdminApplications | 3 hardcoded fake applications | Live `applications` Firestore collection via `onSnapshot` |
| AdminAuditLogs | 5 fake fallback log entries incl. credit entry | Empty state when Firestore returns nothing |
| AdminPOSMonitor | 5 fake transactions with invented names | Real orders from StoreContext, sorted by date |
| AdminStores | 5 hardcoded fake store fallback | Real stores only; empty state when none registered |
| AdminRevenue | Hardcoded KPIs (72300, 73, 93.2%, 990); MOCK_WEEKLY_REVENUE chart | Real PayFast/orders data; `—` when no data; daily revenue chart from real orders |
| AdminAlerts | 2 hardcoded alerts with fake email/SLA numbers | Removed; only live Firestore notifications shown |

### Firestore Rules Audit
All admin portal Firestore operations verified against `firestore.rules`:
- `disputes` — admin read ✓ / admin update ✓
- `applications` — admin read ✓ / admin update ✓
- `audit_logs` — admin read ✓ / write blocked (intentional; server-only writes)
- `users` — admin list ✓ / admin update ✓
- `stores` — admin update ✓
- `transactions` — admin read ✓
- `notifications` — admin read ✓ / create ✓
