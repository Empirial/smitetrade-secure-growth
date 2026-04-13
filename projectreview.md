 Here's the full project review:                                                                 
                                                                                                    --- to interrupt                                                                                
  SmiteTrade — Project Review                                                                                                                                                                       
  Overall: 75% production-ready. Routes complete, architecture sound, but several security gaps     and state management issues need fixing before go-live.                                                                                                                                             ---                                                                                               Modified Files Summary                                                                          

  ┌───────────────────────────────────┬────────┬───────────────────────────────────────────────┐  
  │               File                │ Status │                     Notes                     │  
  ├───────────────────────────────────┼────────┼───────────────────────────────────────────────┤  
  │ firestore.rules                   │ ⚠️     │ Mostly good, 3 security gaps (see below)      │  
  ├───────────────────────────────────┼────────┼───────────────────────────────────────────────┤  
  │ src/App.tsx                       │ ✅     │ All 85 routes present, guards correct         │  
  ├───────────────────────────────────┼────────┼───────────────────────────────────────────────┤  
  │ src/context/StoreContext.tsx      │ ⚠️     │ Incomplete useMemo deps — stale closures risk │  
  ├───────────────────────────────────┼────────┼───────────────────────────────────────────────┤  
  │ src/context/CreditContext.tsx     │ ⚠️     │ Listener cleanup missing on user change       │  
  ├───────────────────────────────────┼────────┼───────────────────────────────────────────────┤  
  │ src/components/BarcodeScanner.tsx │ ✅     │ Clean, proper cleanup                         │  
  ├───────────────────────────────────┼────────┼───────────────────────────────────────────────┤  
  │ vite.config.ts                    │ ✅     │ Good chunking strategy                        │  
  ├───────────────────────────────────┼────────┼───────────────────────────────────────────────┤  
  │ src/context/hooks/                │ ✅     │ 8 hooks, mostly well-structured               │  
  └───────────────────────────────────┴────────┴───────────────────────────────────────────────┘  

  ---
  P1 — Critical (Fix Before Deploy)

  1. Firestore: Products readable by any auth user cross-store
  firestore.rules:105 — change:
  allow read: if isAuth();
  to:
  allow read: if isAuth() && (isAdmin() || canAccessStore(resource.data.storeId));

  2. Firestore: Lenders see all loan applications, not just their own
  firestore.rules:285 — add resource.data.lenderId == uid() check for lenders

  3. Firestore: Orders create doesn't validate storeId presence
  firestore.rules:128 — add null check for storeId

  4. CreditContext: Listeners not cleaned up on user change
  src/context/CreditContext.tsx:308 — old onSnapshot listeners persist through user switches      
  (memory leak + ghost data)

  5. StoreContext: Incomplete useMemo deps
  src/context/StoreContext.tsx:161 — addStaff, deleteStaff, startShift, endShift, recordCashDrop  
  missing from deps array → stale callbacks

  ---
  P2 — High

  - src/context/CreditContext.tsx:464 — profile used in effect without being in deps → concurrent 
  payment bugs
  - src/context/hooks/useProducts.ts:32 — owner/cashier fetches ALL products globally (cost +     
  exposure) — needs where("storeId", "==", activeStoreId)
  - src/App.tsx — no root <ErrorBoundary> wrapping lazy-loaded pages

  ---
  P3 — Medium

  - 30+ any casts across pages (worst: OwnerOrders.tsx, CashierShift.tsx, CustomerCheckout.tsx)   
  - CashierCheckout.tsx:258 — card terminal is UI-only (TODO stub)
  - No stock conflict detection at checkout (concurrent buyers can oversell)
  - Credit limit recalculates on every load (not cached) — performance hit at scale
  - sessionStorage used for role tracking — client-manipulable

  ---
  What's Solid

  - All 85 pages routed and lazy-loaded correctly
  - BRI scoring algorithms (5 of them) are properly implemented
  - Firestore multi-tenant isolation is architecturally correct (20 collections covered)
  - BarcodeScanner.tsx is clean
  - Vite chunk splitting is smart
  - src/context/hooks/ refactor is the right direction

  ---
  Want me to fix the P1 issues now? I can work through them in order — firestore rules first, then
   context cleanup.