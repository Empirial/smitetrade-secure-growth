

# Cross-Portal Data Interconnection Plan

## Current State: Critical Issues

The app has **72 pages** but they are essentially **isolated silos** with no real cross-portal data flow. Here's why:

1. **Mock Data Mode is ON** (`USE_MOCK_DATA = true` in `constants.ts`) — all data is hardcoded, nothing persists to Firebase
2. **No multi-store/tenant model** — `Product`, `Order`, `Supplier`, `Staff` types have no `storeId` field, so there's no way to link data to a specific store owner
3. **Single flat context** — `StoreContext` serves all roles from one global state, meaning every user sees the same products/orders regardless of which store they belong to
4. **No Firestore collections** for customers, expenses, suppliers, staff, shifts, or issues (rules only cover `users`, `products`, `orders`)

## Architecture Diagram

```text
CURRENT (Broken):
  Owner A  ──┐
  Owner B  ──┤──> Single StoreContext ──> Same Mock Products/Orders
  Customer ──┘

TARGET (Connected):
  Owner A ──> Firestore: stores/storeA/products/*
  Owner B ──> Firestore: stores/storeB/products/*
                    │
  Customer ──> Reads ALL stores' products (e-commerce aggregation)
  Driver   ──> Reads orders assigned to them
  Cashier  ──> Reads products/orders for their linked store
  Lender   ──> Reads borrowers/loans linked to their lender ID
  Admin    ──> Reads everything (super-admin)
```

## Implementation Plan

### Phase 1: Data Model — Add Multi-Store Support

**1. Update `types.ts`** — Add `storeId` and `storeName` to:
- `Product` (which store sells it)
- `Order` (which store it was ordered from)
- `Supplier`, `StaffMember`, `Shift`, `Customer`, `Expense` (all store-scoped)

**2. Add a `Store` type**:
```typescript
interface Store {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  suburb: string;
  city: string;
  province: string;
}
```

### Phase 2: Firebase Backend — Firestore Collections & Rules

**3. Update `firestore.rules`** to add collections and enforce store-scoped access:
- `stores/{storeId}` — owner can CRUD their own store
- `products` — filtered by `storeId`; customers can read all, owners can write their own
- `orders` — customers read their own, owners read orders for their store
- `suppliers`, `staff`, `shifts`, `expenses`, `customers` — all scoped to `storeId`
- Move roles to a separate `user_roles` collection (security fix)

**4. Add missing Firestore rules** for: `suppliers`, `staff`, `shifts`, `issues`, `customers`, `expenses`, `borrowers`, `loans`

### Phase 3: Context Refactor — Connect to Live Firebase

**5. Set `USE_MOCK_DATA = false`** and update `StoreContext`:
- On login, fetch the user's `storeId` (for owner/cashier) or show all stores (for customer)
- Products listener: owners see `where('storeId', '==', myStoreId)`, customers see all
- Orders listener: scoped by role (customer sees theirs, owner sees their store's, driver sees assigned)

**6. Add a `stores` collection listener** so the Customer Products page can:
- Show products grouped by store
- Let customers pick a store to browse
- Display store name on each product card

### Phase 4: Cross-Portal Data Flows

**7. Wire up the 6 key cross-portal flows:**

| Flow | From | To | Data |
|---|---|---|---|
| Store Registration | Owner Register | `stores` collection | Creates store record |
| Product Catalog | Owner Inventory | Customer Products | Products with `storeId` appear in shop |
| Order Placement | Customer Checkout | Owner Orders + Driver Orders | Order with `storeId` routes to correct owner |
| Driver Assignment | Owner/Admin | Driver portal | `driverId` on order |
| Credit Application | Customer Apply | Lender Applications | Borrower record with `customerId` |
| Staff Linking | Owner Staff | Cashier Login | Cashier's `storeId` links to owner's store |

**8. Update Customer Products page** to:
- Fetch products from ALL stores (or let user select a store/area)
- Show store name on each product card
- Filter by store, category, and search
- Cart tracks which store each item is from (enforce single-store cart or multi-store with split orders)

### Phase 5: Page Interconnection Map

The 72 pages connect through these Firestore collections:

```text
Firestore Collections:
  users ─────────── All portals (auth)
  stores ────────── Owner creates, Customer browses
  products ──────── Owner manages, Customer/Cashier reads
  orders ────────── Customer creates, Owner/Cashier/Driver reads
  staff ─────────── Owner manages, Cashier linked via storeId
  suppliers ─────── Owner manages
  shifts ─────────── Cashier creates, Owner reads
  expenses ──────── Owner manages
  customers ─────── Owner's tab customers
  borrowers ─────── Lender manages
  loans ─────────── Lender manages, Customer reads their own
  issues ─────────── Driver creates, Owner/Admin reads
  audit_logs ────── Admin reads
  disputes ──────── Admin manages
```

### Summary of File Changes

| File | Change |
|---|---|
| `src/types.ts` | Add `Store` type, add `storeId`/`storeName` to Product, Order, etc. |
| `src/lib/constants.ts` | Set `USE_MOCK_DATA = false`, update mock data with `storeId` fields |
| `src/context/StoreContext.tsx` | Add store-scoped queries, multi-store product fetching for customers, store registration flow |
| `firestore.rules` | Add rules for all collections, move roles to `user_roles`, scope by `storeId` |
| `src/pages/owner/OwnerRegister.tsx` | Create `stores` doc on registration |
| `src/pages/customer/CustomerProducts.tsx` | Fetch from all stores, show store name, store filter |
| `src/pages/customer/CustomerCheckout.tsx` | Include `storeId` in order |
| `src/pages/owner/OwnerDashboard.tsx` | Filter data by user's `storeId` |
| `src/pages/driver/DriverOrders.tsx` | Filter by `driverId` |
| `src/pages/cashier/*` | Link to owner's `storeId` |
| `src/pages/lender/*` | Scope borrowers/loans to `lenderId` |

This is a significant architectural change spanning ~25-30 files. It transforms the app from isolated mock portals into a connected multi-tenant marketplace.

