# SmiteTrade Platform — Portal & Page Report
**Prepared:** 15 March 2026
**Project:** SmiteTrade Secure Growth
**Purpose:** Overview of all role-based portals and their functional pages

---

## Executive Summary

SmiteTrade is a multi-role SaaS platform serving the informal retail and spaza shop economy. It supports **6 distinct user portals**, each tailored to a specific role in the ecosystem — from shop owners and cashiers to customers, drivers, lenders, and platform administrators. In total, the platform comprises **80+ pages** across all portals.

---

## Portal Summary

| # | Portal | Role | Colour | Pages |
|---|--------|------|--------|-------|
| 1 | Customer Portal | Buyers & consumers | Blue | 16 |
| 2 | Owner Portal | Spaza shop owners | Emerald | 20 |
| 3 | Cashier Portal | Store staff | Orange | 12 |
| 4 | Driver Portal | Delivery personnel | Indigo | 12 |
| 5 | Lender Portal | Credit providers | Purple | 12 |
| 6 | Admin Portal | Platform administrators | Red | 14 |
| — | Public Pages | No login required | — | 6 |
| **Total** | | | | **92** |

---

## 1. Customer Portal
**URL prefix:** `/customer/`
**User:** End consumers shopping from local spaza shops

| Page | Route | Description |
|------|-------|-------------|
| Login | `/customer/login` | Customer sign-in |
| Signup | `/customer/signup` | New customer registration |
| Products | `/customer/products` | Browse and purchase products with search, category filters, and store selection |
| Cart | `/customer/cart` | View cart items, adjust quantities, see order summary (minimum R100 threshold enforced) |
| Checkout | `/customer/checkout` | Multi-step checkout process: address entry → order review → payment |
| Payment | `/customer/payment` | Payment processing |
| Order Tracking | `/customer/tracking` | Real-time delivery tracking for active orders |
| Orders | `/customer/orders` | Full history of past and current orders |
| Order Details | `/customer/orders/:id` | Detailed view of a specific order |
| Apply for Credit | `/customer/apply-credit` | Loan application form submitted to lenders |
| Credit Review | `/customer/credit-review` | View personal credit and lending history |
| BRI Score | `/customer/credit-status` | Behavioral Reliability Index — Smitetrade's proprietary credit score |
| Lender Registration | `/customer/lender-registration` | Register as a lender to extend credit to other customers |
| Alerts | `/customer/alerts` | Platform notifications and alerts |
| Profile | `/customer/profile` | Account and personal settings |
| Support | `/customer/support` | Customer support channel |

---

## 2. Owner Portal
**URL prefix:** `/owner/`
**User:** Spaza shop owners managing their business operations

| Page | Route | Description |
|------|-------|-------------|
| Login | `/owner/login` | Owner sign-in |
| Register | `/owner/register` | Owner onboarding and store setup |
| Dashboard | `/owner/dashboard` | Business overview: revenue, net profit, stock alerts, unique customers, sales charts, recent activity |
| POS | `/owner/pos` | Point of Sale system with barcode scanning, custom item entry, photo capture, and cart management |
| Inventory | `/owner/inventory` | Manage products and stock: add/edit/delete items, barcode scanning, category filters, stock level tracking |
| Orders | `/owner/orders` | View and manage incoming customer orders |
| Staff | `/owner/staff` | Manage cashiers and store employees |
| Customers | `/owner/customers` | Customer relationship management and customer profiles |
| Suppliers | `/owner/suppliers` | Manage supplier relationships and wholesale orders |
| Pricing | `/owner/pricing` | Set and update product pricing |
| Lending | `/owner/lending` | Manage credit extended to customers and track repayments |
| Credit Review | `/owner/credit-review` | Review a customer's repayment behaviour before extending credit |
| Expenses | `/owner/expenses` | Track and categorise business expenses |
| Reports | `/owner/reports` | Business analytics and reporting (sales, revenue, trends) |
| Analytics | `/owner/analytics` | Advanced business insights and data visualisation |
| Stock Adjustment | `/owner/stock-adjustment` | Adjust inventory levels to account for damage or loss |
| Subscription | `/owner/subscription` | Manage subscription plan and billing |
| Alerts | `/owner/alerts` | Stock alerts and operational notifications |
| Profile | `/owner/profile` | Store and account settings |
| Support | `/owner/support` | Owner support channel |

---

## 3. Cashier Portal
**URL prefix:** `/cashier/`
**User:** Store staff responsible for processing in-store transactions

| Page | Route | Description |
|------|-------|-------------|
| Login | `/cashier/login` | Cashier sign-in |
| Register | `/cashier/register` | Cashier registration |
| Dashboard | `/cashier/dashboard` | Quick-access hub for POS, scanner, credit checks, and recent transactions |
| POS | `/cashier/pos` | Full Point of Sale: barcode scanning, custom items, held/parked transactions, offline mode, item voiding with reason tracking |
| Scanner | `/cashier/scanner` | Dedicated barcode and QR code scanner tool |
| Checkout | `/cashier/checkout` | Complete a transaction and process payment |
| Credit Review | `/cashier/credit-review` | Check a customer's repayment behaviour before completing a sale |
| Receipts | `/cashier/receipts` | View and reprint receipts for past transactions |
| Shift | `/cashier/shift` | Track and manage shift start/end times |
| Inventory | `/cashier/inventory` | View current stock levels (read-only access) |
| Alerts | `/cashier/alerts` | Operational alerts and notifications |
| Support | `/cashier/support` | Cashier support channel |

---

## 4. Driver Portal
**URL prefix:** `/driver/`
**User:** Delivery personnel managing orders and earnings

| Page | Route | Description |
|------|-------|-------------|
| Login | `/driver/login` | Driver sign-in |
| Register | `/driver/register` | Driver onboarding |
| Dashboard | `/driver/dashboard` | Today's overview: earnings, deliveries completed, available orders, active delivery status |
| Orders | `/driver/orders` | List of available orders to accept and current assignments |
| Out to Deliver | `/driver/out-to-deliver` | Orders currently in progress |
| Delivered | `/driver/delivered` | Completed delivery history |
| Route | `/driver/route/:orderId` | Real-time GPS route and delivery instructions for a specific order |
| Wallet | `/driver/wallet` | Track earnings, payouts, and current balance |
| Issues | `/driver/issues` | Report delivery problems or disputes |
| Profile | `/driver/profile` | Personal account and vehicle details |
| Alerts | `/driver/alerts` | Delivery notifications and alerts |
| Support | `/driver/support` | Driver support channel |

---

## 5. Lender Portal
**URL prefix:** `/lender/`
**User:** Third-party credit providers managing loans and client relationships

| Page | Route | Description |
|------|-------|-------------|
| Login | `/lender/login` | Lender sign-in |
| Register | `/lender/register` | Lender onboarding |
| Dashboard | `/lender/dashboard` | Portfolio overview: total active amount lent, total recovered, total clients, risk alerts, recent activity |
| Clients | `/lender/clients` | Manage borrower profiles, loan history, and issue new loans |
| Loans | `/lender/loans` | View all active and past loans with status tracking |
| Applications | `/lender/applications` | Review and approve or deny loan applications from customers |
| Collections | `/lender/collections` | Track repayments and manage collection of outstanding amounts |
| Credit Check | `/lender/credit-check` | Look up a customer's credit history and BRI score |
| Loan Quote | `/lender/quote` | Generate loan quotations for prospective borrowers |
| Profile | `/lender/profile` | Lender account and settings |
| Alerts | `/lender/alerts` | Alerts for due payments, defaults, and risk events |
| Support | `/lender/support` | Lender support channel |

---

## 6. Admin Portal
**URL prefix:** `/admin/`
**User:** Platform administrators with full system oversight

| Page | Route | Description |
|------|-------|-------------|
| Login | `/admin/login` | Admin sign-in |
| Dashboard | `/admin/dashboard` | Platform-wide metrics: total users, registered stores, revenue, lending portfolio, transaction volume charts, user growth |
| Users | `/admin/users` | Manage all platform users: activate, suspend, ban, reset passwords |
| Stores | `/admin/stores` | View and manage all registered stores and their status |
| Applications | `/admin/applications` | Review and process user registration applications |
| Disputes | `/admin/disputes` | Handle customer complaints and escalated disputes |
| POS Monitor | `/admin/pos-monitor` | Monitor all POS transactions across the entire platform |
| Revenue | `/admin/revenue` | Track platform revenue, fees, and payment flows |
| Credit Overview | `/admin/credit-overview` | Platform-wide lending and credit metrics |
| Analytics | `/admin/analytics` | Deep-dive platform analytics and reporting |
| Audit Logs | `/admin/audit-logs` | Full system audit trail and activity logs |
| Alerts | `/admin/alerts` | System-wide and compliance alerts |
| Support | `/admin/support` | Admin-level support and escalation management |
| Setup | `/admin/setup` | Initial platform configuration and admin setup |

---

## Public Pages
**No login required**

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with hero section, platform features, statistics, discovery map, and footer |
| Portal Selection | `/portals` | Gateway page for users to select their role portal |
| Forgot Password | `/forgot-password` | Initiate password recovery via email |
| Reset Password | `/reset-password` | Complete password reset with a new password |
| Session Expired | `/session-expired` | Notification page shown when a user session times out |
| Not Found | `/*` | 404 error page for unrecognised routes |

---

## Feature Coverage by Portal

| Feature | Customer | Owner | Cashier | Driver | Lender | Admin |
|---------|----------|-------|---------|--------|--------|-------|
| Shopping / Product Browsing | Yes | — | — | — | — | — |
| Point of Sale (POS) | — | Yes | Yes | — | — | — |
| Barcode Scanning | — | Yes | Yes | — | — | — |
| Inventory Management | — | Yes | View only | — | — | — |
| Order Tracking | Yes | — | — | Yes | — | — |
| Delivery Management | — | — | — | Yes | — | — |
| Credit / Loan Application | Yes | — | — | — | — | — |
| Lending & Credit Management | Yes (view) | Yes | Yes (check) | — | Yes | Yes (overview) |
| Staff Management | — | Yes | — | — | — | — |
| Supplier Management | — | Yes | — | — | — | — |
| Wallet / Earnings | — | — | — | Yes | — | — |
| Analytics & Reporting | — | Yes | — | — | — | Yes |
| User / Platform Administration | — | — | — | — | — | Yes |
| Audit & Compliance | — | — | — | — | — | Yes |

---

*Report generated from SmiteTrade Secure Growth codebase — 15 March 2026*
