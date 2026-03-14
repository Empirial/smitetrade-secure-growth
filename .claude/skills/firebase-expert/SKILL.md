---
name: firebase-expert
description: Use when you need to implement Firebase features, write Firestore queries, set up security rules, handle auth flows, structure collections, or solve any Firebase backend problem.
---

## What This Skill Does

Activates Firebase backend expert mode for smitetrade-secure-growth. Applies deep Firebase knowledge to implement, fix, or advise on any backend concern in the project.

## Project Firebase Context

**Stack:** Firebase 12.x with Firestore, Firebase Auth, and client SDK (no Cloud Functions)
**Frontend:** React 18 + TypeScript
**Firebase lib:** `src/lib/firebase.ts`
**User roles:** owner, cashier, customer, driver, admin, lender

**Key collections (inferred from codebase):**
- `users` — all user accounts with role field
- `stores` — multi-tenant store data (owner-scoped)
- `orders` — customer orders with status tracking
- `products` — store inventory
- `credits` — BRI credit scoring & loan data
- `payments` — Paystack payment records
- `deliveries` — driver delivery tracking
- `support` — support tickets

## Expertise Areas

When asked a Firebase question or task, apply knowledge in these areas:

### Firestore Data Modeling
- Design flat, denormalized collections optimized for Firestore (not relational)
- Use subcollections for 1:many relationships scoped to a parent (e.g. `stores/{storeId}/products`)
- Avoid deep nesting beyond 2 levels
- Design for query patterns first — structure data the way it will be read
- Use composite indexes for multi-field queries
- Keep document sizes under 1MB

### Security Rules
- Write granular rules per collection and per role
- Use `get()` to fetch user role from Firestore inside rules
- Pattern for role-based access:
  ```
  function getUserRole() {
    return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
  }
  allow read: if getUserRole() == 'admin';
  ```
- Always require `request.auth != null` for authenticated data
- Scope owner data with `resource.data.ownerId == request.auth.uid`
- Never use `allow read, write: if true` in production

### Auth Flows
- Use `onAuthStateChanged` for persistent auth state
- Store role in Firestore `users` collection, not in Auth custom claims (simpler for this stack)
- Handle auth errors with specific error codes (`auth/user-not-found`, `auth/wrong-password`, etc.)
- Always sign out and redirect on auth state loss

### Firestore Queries
- Use React Query with Firestore for caching and loading states
- Real-time listeners with `onSnapshot` for live data (orders, deliveries)
- One-time reads with `getDocs` / `getDoc` for static data
- Paginate large collections with `startAfter` + `limit`
- Batch writes with `writeBatch` for multi-document updates
- Transactions with `runTransaction` for atomic read-write operations

### Multi-tenant Architecture
- Scope all store data under `ownerId` field
- All Firestore queries for store data must include `where('ownerId', '==', currentUser.uid)`
- Security rules enforce this at the database level too

### Error Handling
```typescript
try {
  await setDoc(doc(db, 'collection', id), data);
} catch (error) {
  if (error instanceof FirebaseError) {
    // handle specific Firebase error codes
    console.error(error.code, error.message);
  }
}
```

## How to Use This Skill

When invoked, apply the above knowledge to:

1. **Implement a feature** — write the complete Firestore query, hook, or service function
2. **Fix a bug** — diagnose Firebase-related errors and fix them
3. **Write security rules** — produce complete, tested Firestore rules for a collection
4. **Advise on structure** — recommend the best collection/document design for a use case
5. **Optimize queries** — identify slow or inefficient Firestore usage and fix it

Always:
- Read `src/lib/firebase.ts` before writing any Firebase code
- Match the existing patterns in `src/lib/` and `src/hooks/`
- Use TypeScript types for all Firestore documents
- Handle loading, error, and empty states in every query
