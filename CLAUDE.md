# SmiteTrade — Claude Context

## What This Is
Multi-role SaaS platform for the South African informal retail / spaza shop economy.
Six role-based portals: Customer, Owner, Cashier, Driver, Lender, Admin.
92 pages total. Production-grade. Built on Firebase + React.

## Tech Stack
- **React 18.3.1 + TypeScript 5.8.3** — no strict mode (`tsconfig.json` is lenient)
- **Vite 5.4** — dev server on port **8080** (`npm run dev`)
- **Firebase 12** — Auth, Firestore, Storage, Analytics
- **Paystack** — payment processing
- **TanStack React Query 5** — server state
- **shadcn/ui + Radix UI** — 50 UI components in `src/components/ui/`
- **Tailwind CSS 3.4** — custom tokens: emerald, electric-blue, gold
- **Framer Motion** — animations
- **Recharts** — data visualization
- **@zxing** — barcode scanning (camera-based)
- **jsPDF** — PDF generation
- **Playwright** — E2E tests per portal
- **Vitest** — unit tests

## Running the Project
```bash
npm run dev          # Dev server → localhost:8080
npm run build        # Production build → /dist
npm run lint         # ESLint
npm run test         # Vitest unit tests
npm run test:agent   # All Playwright E2E
```

## Portal Test Commands
```bash
npm run test:customer
npm run test:owner
npm run test:cashier
npm run test:driver
npm run test:lender
```

## Architecture

### RBAC & Routing
- `src/components/AuthGuard.tsx` — wraps every protected route, checks user role
- Routes defined in `src/App.tsx`
- Portals at `/owner`, `/customer`, `/cashier`, `/driver`, `/lender`, `/admin`

### Global State (Context API)
- `src/context/StoreContext.tsx` (~1500 lines) — auth, products, cart, orders, staff, inventory, suppliers, shifts
- `src/context/CreditContext.tsx` (~1000 lines) — credit profiles, BRI scoring, borrowers, loans, applications
- These are the two most important files to understand for any feature work

### Data Flow
1. Firebase Auth → sets current user + role
2. StoreContext loads user's store data from Firestore
3. Components subscribe via `useContext(StoreContext)` or `useContext(CreditContext)`
4. Firestore `onSnapshot` listeners for real-time updates
5. TanStack Query for non-realtime server fetches

### Multi-Tenant
- Every Firestore document has a `storeId` field
- `firestore.rules` (335 lines) enforces storeId isolation per collection
- Owners can have multiple stores

### Key Collections (Firestore)
`users`, `stores`, `products`, `orders`, `inventory`, `staff`, `credit_profiles`,
`borrowers`, `loans`, `loan_applications`, `deliveries`, `shifts`, `expenses`,
`audit_logs`, `disputes`, `suppliers`

## Key Files
| File | Purpose |
|------|---------|
| `src/main.tsx` | App entry point |
| `src/App.tsx` | All routes + providers |
| `src/types.ts` | ALL TypeScript interfaces — read this first |
| `src/lib/firebase.ts` | Firebase init |
| `src/lib/constants.ts` | Mock data, defaults, samples |
| `src/lib/paystack.ts` | Payment integration |
| `src/utils/pdfUtils.ts` | PDF generation helpers |
| `src/utils/validation.ts` | Form validation schemas |
| `firestore.rules` | Security rules — touch carefully |
| `firestore.indexes.json` | Composite indexes |

## Patterns to Follow
- New pages go in `src/pages/[role]/[PageName].tsx`
- Use existing shadcn/ui components — never install duplicate UI libs
- All forms use React Hook Form + Zod schema validation
- All Firestore writes must include `storeId` for multi-tenant isolation
- Use `useToast()` hook for notifications (not direct Sonner calls)
- Animations via Framer Motion `motion.div` — keep consistent with existing pages
- TypeScript is lenient — avoid adding `any` but don't over-engineer types

## Environment Variables
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
```
Live values in `.env` — never commit this file.

## BRI (Behavioral Reliability Index)
SmiteTrade's proprietary creditworthiness scoring system. Lives in `CreditContext`.
Scores customers based on payment history, order reliability, and behavioral patterns.
Critical business logic — treat changes here with extra care.

## Deployment
Firebase Hosting. SPA rewrite in `firebase.json`.
```bash
npm run build && firebase deploy
```
Or use the `/deploy-firebase` custom command.
