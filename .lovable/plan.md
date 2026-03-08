

## Notifications Gap Analysis

Currently, only **Owner** and **Customer** portals have alerts pages. The remaining portals — **Cashier**, **Driver**, **Lender**, and **Admin** — have no alerts/notifications page.

### Current State
| Portal | Alerts Page | Nav Link |
|--------|------------|----------|
| Owner | `OwnerAlerts.tsx` | Yes |
| Customer | `CustomerAlerts.tsx` | Yes |
| Cashier | None | No |
| Driver | None | No |
| Lender | None | No |
| Admin | None | No |

### Plan: Add Alerts Pages to All Remaining Portals

Create alerts pages for **Cashier**, **Driver**, **Lender**, and **Admin** portals, each tailored with role-relevant mock alerts plus a shared "System Notifications" section for platform-wide updates (maintenance, new features, policy changes).

#### 1. Create 4 new alert pages

- **`CashierAlerts.tsx`** — Shift discrepancy warnings, POS errors, system updates
- **`DriverAlerts.tsx`** — New delivery assignments, route changes, system updates
- **`LenderAlerts.tsx`** — Loan application alerts, overdue repayments, compliance notices, system updates
- **`AdminAlerts.tsx`** — Platform-wide metrics alerts, security notices, system updates

Each page will follow the `CustomerAlerts.tsx` card-based pattern with severity-coded alerts (warning/error/success/info) and a consistent "System Notifications" section at the bottom.

#### 2. Add routes in `App.tsx`
Register `/cashier/alerts`, `/driver/alerts`, `/lender/alerts`, `/admin/alerts` with `AuthGuard`.

#### 3. Add nav links in `DashboardLayout.tsx`
Add a Bell icon "Alerts" nav item to each portal's sidebar navigation.

#### 4. Future consideration
All alerts are currently mock data. When ready, these can be wired to a Firestore `notifications` collection (similar to the support ticket integration) so admins can broadcast system updates to all portals.

