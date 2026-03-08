# Admin Support Popup Enhancement + Support Pages for All Portals

## Summary

Two changes needed:

1. **Admin Support popup** -- already has a Dialog with reply functionality (lines 142-182 in AdminSupport.tsx). It works but could be improved with better ticket detail info (ticket ID, type/category badge, role of submitter, store association).
2. **Support pages for all remaining portals** -- Customer already has one. Need to create support pages for Owner, Cashier, Driver, and Lender. Key distinction:
  - **Cashier & Driver**: Their support goes to their **store owner** (employer), not platform admin. They are linked to a specific store.
  - **Owner, Customer, Lender**: Their support goes to **platform admin** (SmiteTrade). -- lets add the Cashier and Driver meaning this two portals have two support pages One directed to employer Two directed to us "this helps if there are issues in the casher/drivers portal pages"
    &nbsp;

## Changes

### 1. Enhance Admin Support Popup (`AdminSupport.tsx`)

- Add more ticket metadata: ticket type/category (issue/update/suggestion), submitter role, associated store name
- Add a `DialogDescription` for accessibility
- Add a scrollable message thread area for long conversations
- Show ticket ID and status badge in the dialog header

### 2. Create Shared Support Form Component (`src/components/SupportForm.tsx`)

- Reusable form component accepting `role` and `target` ("admin" | "owner") props
- Issue types: Bug/Issue, Update Request, Suggestion, Other
- Fields: subject, issue type, description, optional order/reference number
- Used by all portal support pages

### 3. New Support Pages


| File                                   | Role    | Messages go to         |
| -------------------------------------- | ------- | ---------------------- |
| `src/pages/owner/OwnerSupport.tsx`     | Owner   | Platform Admin         |
| `src/pages/cashier/CashierSupport.tsx` | Cashier | Store Owner (employer) |
| `src/pages/driver/DriverSupport.tsx`   | Driver  | Store Owner (employer) |
| `src/pages/lender/LenderSupport.tsx`   | Lender  | Platform Admin         |


- Cashier/Driver pages will show "Contact Your Store Owner" messaging instead of "Contact SmiteTrade Support"
- Refactor existing `CustomerSupport.tsx` to use the shared `SupportForm`

### 4. Update Navigation (`DashboardLayout.tsx`)

- Add `{ href: "/owner/support", label: "Support", icon: LifeBuoy }` to ownerLinks Management section
- Add `{ href: "/cashier/support", label: "Support", icon: LifeBuoy }` to cashierLinks
- Add `{ href: "/driver/support", label: "Support", icon: LifeBuoy }` to driverLinks (replace or keep alongside "Report Issue")
- Add `{ href: "/lender/support", label: "Support", icon: LifeBuoy }` to lenderLinks
- Customer already has support via CustomerSupport but no nav link -- add `{ href: "/customer/support", label: "Support", icon: LifeBuoy }` to customerLinks

### 5. Register Routes (`App.tsx`)

- Add routes for `/owner/support`, `/cashier/support`, `/driver/support`, `/lender/support` with appropriate AuthGuard roles

### 6. Update Ticket Interface in AdminSupport

- Add `type` field: "issue" | "update" | "suggestion"
- Add `role` field to show which portal the ticket came from
- Add `storeName` field for store-linked users

## Files to Create/Modify


| File                                     | Action                                         |
| ---------------------------------------- | ---------------------------------------------- |
| `src/components/SupportForm.tsx`         | **Create** -- shared support form              |
| `src/pages/admin/AdminSupport.tsx`       | **Modify** -- enhance popup with more detail   |
| `src/pages/owner/OwnerSupport.tsx`       | **Create** -- owner support (to admin)         |
| `src/pages/cashier/CashierSupport.tsx`   | **Create** -- cashier support (to store owner) |
| `src/pages/driver/DriverSupport.tsx`     | **Create** -- driver support (to store owner)  |
| `src/pages/lender/LenderSupport.tsx`     | **Create** -- lender support (to admin)        |
| `src/pages/customer/CustomerSupport.tsx` | **Modify** -- refactor to use SupportForm      |
| `src/components/DashboardLayout.tsx`     | **Modify** -- add support nav links            |
| `src/App.tsx`                            | **Modify** -- add new routes                   |
