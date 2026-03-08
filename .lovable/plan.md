

## Backend Assessment

Here's the current state of your backend:

### What's Connected to Firebase (Real Data)
- **Authentication** - Login/registration via Firebase Auth
- **Stores, Products, Orders** - Real-time Firestore with `onSnapshot` listeners
- **Customers, Expenses, Suppliers, Staff, Shifts** - All persisted in Firestore
- **Firestore Security Rules** - Comprehensive role-based access control with a `user_roles` collection

### What's Still Hardcoded / Mock Data (No Backend)
- **Support Tickets** (`AdminSupport.tsx`) - All tickets are hardcoded in `useState` with mock data. Submitting a ticket from `SupportForm.tsx` just runs a `setTimeout` and shows a toast — nothing is saved.
- **Admin Applications** (`AdminApplications.tsx`) - Likely hardcoded mock data as well.
- **Credit/Lending system** - Would need to verify, but likely local state.
- **Disputes, Audit Logs, Issues** - Firestore rules exist for these collections, but they may not be wired up in the frontend yet.

### Key Gaps
1. **Support system has no persistence** — tickets submitted by users vanish on refresh, and admin sees only hardcoded tickets.
2. **No `support_tickets` Firestore collection** — rules don't cover it either.
3. **SupportForm doesn't write to Firestore** — it fakes a submission with `setTimeout`.

### Recommended Next Step
Wire up the support ticket system end-to-end:
1. Create a `support_tickets` Firestore collection
2. Add Firestore security rules for it
3. Update `SupportForm` to write tickets to Firestore with `addDoc`
4. Update `AdminSupport` to read tickets via `onSnapshot`
5. Persist replies and status changes with `updateDoc`

This would make the support system fully functional — tickets submitted by any portal user would appear in the admin dashboard in real time.

