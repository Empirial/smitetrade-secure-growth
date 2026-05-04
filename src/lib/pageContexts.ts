/**
 * Page context strings for the AI chatbot.
 * Keyed by route path. ChatBot reads this based on the current URL
 * and appends it to the system prompt so Claude knows what's on the page.
 *
 * Format per entry:
 *   "Page purpose. LIVE: <list of wired actions>. UI-ONLY: <display-only elements if any>."
 */

export const PAGE_CONTEXTS: Record<string, string> = {

  // ─── OWNER PORTAL ──────────────────────────────────────────────────────────

  "/owner/dashboard": `Overview dashboard for the store owner.
LIVE: Real-time KPI cards (revenue, orders, products, staff count) pulled from Firestore. Recent orders table with live status. Low-stock alerts list. Revenue chart (Recharts). Quick-action buttons navigate to Inventory, POS, Staff, Reports pages.
UI-ONLY: Chart date range selector is display-only (no filter applied).`,

  "/owner/inventory": `Full product inventory management page.
LIVE: Add Product button opens a dialog — saves new product to Firestore with storeId. Edit (pencil) button per row — updates product name, price, quantity, category, barcode in Firestore. Delete (trash) button — removes product from Firestore. Search bar filters the live table. Barcode scanner button opens camera to scan product barcode. Low-stock badge auto-shows when quantity < 5.
UI-ONLY: Column sort headers are visual only (no sort logic).`,

  "/owner/pos": `Point-of-sale system for the owner.
LIVE: Product grid — click to add to cart. Cart panel — adjust quantities, remove items. Apply Discount input — reduces cart total. Checkout button — creates an order in Firestore and decrements stock via updateProduct. Customer search / credit tab — looks up customer credit balance.
UI-ONLY: Receipt preview shown after checkout is display only (no print wired).`,

  "/owner/orders": `Order management page showing all store orders.
LIVE: Status dropdown per order — updates order status in Firestore (pending → processing → completed/cancelled). Search and status filter apply live. Assign Driver button — sets driverId on the order document.
UI-ONLY: Order detail expand is display only.`,

  "/owner/suppliers": `Supplier management and stock ordering.
LIVE: Add Supplier button — saves new supplier to Firestore. Edit/Delete supplier — updates/removes Firestore document. Place Order button — creates a purchase order in Firestore linked to the supplier. Submit Preorder — saves preorder to Firestore. Platform Suppliers tab — loads from Firestore (no mock fallback).
UI-ONLY: Supplier rating stars are display only.`,

  "/owner/staff": `Staff management and shift scheduling.
LIVE: Add Staff button — creates staff record in Firestore with storeId. Edit Staff — updates name, role, pay rate in Firestore. Delete Staff — removes from Firestore. Assign Shift — creates shift entry in Firestore. View Shifts tab — live onSnapshot from shifts collection.
UI-ONLY: Calendar view is display only (no drag-and-drop scheduling).`,

  "/owner/expenses": `Business expense tracking page.
LIVE: Add Expense button — saves expense (amount, category, description, date) to Firestore. Delete expense — removes document. Category filter and date filter apply live to Firestore-loaded list. Summary cards (total by category) computed from live data.
UI-ONLY: Export button is not wired.`,

  "/owner/reports": `Sales and business reports page.
LIVE: Revenue chart — computed from live orders. Top products table — derived from order items. Staff performance table — computed from shifts and sales. Date range filter applies to displayed data. Export PDF button — generates PDF via jsPDF from current view data.
UI-ONLY: Comparison period selector is display only.`,

  "/owner/pricing": `Product pricing, promotions, and timed specials management.
LIVE: Edit price per product — updates product price in Firestore via updateProduct. Add Promotion button — saves promo (name, discount %, dates, applicable products) to promotions Firestore collection. Edit promo — updates promo document. Delete promo — removes from Firestore. Schedule Timed Special — saves to timed_specials collection. Delete timed special — removes from Firestore.
UI-ONLY: Promotion preview badge is display only.`,

  "/owner/lending": `P2P micro-lending management for the owner.
LIVE: Borrower list loaded from Firestore. Add Borrower — saves to borrowers collection. Create Loan — saves to loans collection. Record Payment — updates loan balance in Firestore and recalculates BRI score. View loan history per borrower.
UI-ONLY: BRI score meter is computed display only.`,

  "/owner/credit-review": `Review customer credit applications submitted to the store.
LIVE: Applications list from Firestore. Approve button — updates application status to approved, creates credit profile. Reject button — sets status to rejected. View customer BRI score and history.
UI-ONLY: Credit limit slider is advisory display only.`,

  "/owner/stock-adjustment": `Log inventory wastage: damaged, expired, stolen, or store-use items.
LIVE: Log Adjustment button — saves adjustment record to stock_adjustments Firestore collection and decrements product quantity via updateProduct. Product dropdown shows live inventory. Adjustment log table loaded via onSnapshot.
UI-ONLY: Search bar filters the local table display.`,

  "/owner/alerts": `Notification centre for the store owner.
LIVE: Alerts loaded from Firestore notifications collection. Mark as read — updates read status in Firestore. Mark all read button — batch updates all unread alerts. Delete alert — removes document.
UI-ONLY: Filter tabs (All/Unread/Read) filter local state.`,

  "/owner/profile": `Owner profile and store settings page.
LIVE: Edit profile form — updates user document in Firestore (name, phone, email). Store settings — updates store document (name, address, logo). Change password — calls Firebase Auth updatePassword. Upload avatar — saves to Firebase Storage and updates user photoURL.
UI-ONLY: Preview section is display only.`,

  "/owner/support": `Submit a support ticket to the SmiteTrade admin team.
LIVE: Support form — saves ticket to support_tickets Firestore collection with role="owner" and target="admin". Subject, message, and priority fields are all submitted.
UI-ONLY: Ticket history (if shown) is display only.`,

  "/owner/subscription": `Manage the store's SmiteTrade subscription plan.
LIVE: Plan selection — initiates PayFast payment flow. Current plan and billing status loaded from store document. Cancel subscription button — updates store subscription status in Firestore.
UI-ONLY: Feature comparison table is display only.`,

  "/owner/analytics": `Advanced analytics and business intelligence for the owner.
LIVE: Charts and tables computed from live Firestore data (orders, products, expenses). Date range picker filters displayed data. Export button generates PDF report.
UI-ONLY: Comparison benchmarks are display only.`,

  // ─── CASHIER PORTAL ────────────────────────────────────────────────────────

  "/cashier/dashboard": `Cashier home screen showing shift summary and today's activity.
LIVE: Today's sales total and order count from Firestore. Pending orders queue with live count. Shift status (active/not started) from shifts collection. Quick links to POS and Scanner.
UI-ONLY: Sales chart is display only.`,

  "/cashier/pos": `Cashier point-of-sale for processing customer purchases.
LIVE: Product grid — click to add to cart. Quantity adjustments in cart. Apply discount input. Checkout — creates order in Firestore and decrements stock. Customer lookup — searches customers by name/phone. Credit payment — records credit sale against customer tab.
UI-ONLY: Receipt display after sale is display only.`,

  "/cashier/scanner": `Barcode scanner for quick product lookup.
LIVE: Camera barcode scan via @zxing — looks up product by barcode in live Firestore products. Add to cart button after scan — passes product to POS cart. Manual barcode input also supported.
UI-ONLY: Scan history is local state only.`,

  "/cashier/inventory": `Read-only inventory view for the cashier (no editing).
LIVE: Products table loaded from Firestore with live stock levels. Search bar filters list. Low-stock badge shows when quantity < 5.
UI-ONLY: No add/edit/delete — cashiers cannot modify inventory.`,

  "/cashier/shift": `Shift management for the cashier.
LIVE: Start Shift button — creates shift record in Firestore. End Shift button — closes shift with summary totals. Record Cash Drop — saves cash drop amount to shift subcollection. Current shift duration and running total computed live.
UI-ONLY: Shift history table is display only.`,

  "/cashier/receipts": `View and reprint past transaction receipts.
LIVE: Receipts/orders loaded from Firestore filtered by cashier and storeId. Search by order ID or date. View receipt detail dialog.
UI-ONLY: Print button opens browser print dialog (not wired to a printer directly).`,

  "/cashier/credit-review": `Review customer credit balances and outstanding tabs.
LIVE: Customer credit profiles loaded from Firestore. Settle Tab button — marks credit as paid and updates customer balance. View transaction history per customer.
UI-ONLY: BRI score display is read-only.`,

  "/cashier/alerts": `Notifications for the cashier (low stock, shift reminders, messages from owner).
LIVE: Alerts loaded from Firestore. Mark as read updates Firestore document.
UI-ONLY: Filter tabs are local state.`,

  "/cashier/support": `Submit a support request to the store owner or SmiteTrade admin.
LIVE: Support form — saves ticket to support_tickets collection.
UI-ONLY: None.`,

  // ─── CUSTOMER PORTAL ───────────────────────────────────────────────────────

  "/customer/products": `Browse and search products available in the store.
LIVE: Products loaded from Firestore filtered by storeId. Search and category filter apply live. Add to Cart — updates cart in StoreContext (persisted to localStorage). Wishlist toggle — saves to Firestore wishlist collection.
UI-ONLY: Sort dropdown is display only.`,

  "/customer/cart": `Shopping cart review before checkout.
LIVE: Cart items from StoreContext. Update quantity — adjusts cart. Remove item — removes from cart. Proceed to Checkout navigates to /customer/checkout.
UI-ONLY: Promo code input is not wired.`,

  "/customer/checkout": `Order placement and payment page.
LIVE: Delivery address form. Payment method selection (cash / PayFast). Place Order — creates order in Firestore via placeOrder(), clears cart. PayFast card payment — initiates PayFast redirect.
UI-ONLY: Estimated delivery time is display only.`,

  "/customer/orders": `List of all orders placed by this customer.
LIVE: Orders loaded from Firestore filtered by customer uid. Order status badge updates in real-time via onSnapshot. View detail navigates to /customer/orders/:id.
UI-ONLY: Filter tabs are local state.`,

  "/customer/orders/:id": `Detailed view of a single order.
LIVE: Order document loaded from Firestore. Real-time status updates via onSnapshot. Cancel Order button (if still pending) — updates order status to cancelled.
UI-ONLY: Timeline display is derived from status changes.`,

  "/customer/tracking": `Real-time delivery tracking for an active order.
LIVE: Order and delivery status from Firestore via onSnapshot. Driver location updates (if driver updates route). Contact driver button links to phone.
UI-ONLY: Map display is static placeholder (no live map integration yet).`,

  "/customer/apply-credit": `Apply for a micro-loan or buy-now-pay-later credit.
LIVE: Application form — saves to loan_applications Firestore collection with customer details and requested amount. ID upload — saves to Firebase Storage.
UI-ONLY: Credit limit estimate is advisory only.`,

  "/customer/credit-review": `View your credit profile and BRI score.
LIVE: Credit profile and loan history loaded from Firestore. BRI score computed from payment history.
UI-ONLY: Score gauge and improvement tips are display only.`,

  "/customer/alerts": `Customer notifications (order updates, loan decisions, promotions).
LIVE: Alerts from Firestore. Mark as read updates document.
UI-ONLY: Filter tabs are local state.`,

  "/customer/support": `Contact store support or SmiteTrade help.
LIVE: Support form saves ticket to support_tickets with role="customer".
UI-ONLY: FAQ accordion is display only.`,

  "/customer/profile": `Customer profile management.
LIVE: Edit form — updates user document (name, phone, address). Change password via Firebase Auth. Upload avatar to Firebase Storage.
UI-ONLY: Order count and loyalty stats are display only.`,

  // ─── DRIVER PORTAL ─────────────────────────────────────────────────────────

  "/driver/dashboard": `Driver home showing today's delivery summary.
LIVE: Active delivery count and completed deliveries from Firestore. Earnings total computed from completed orders. Quick links to Active Deliveries and Wallet.
UI-ONLY: Earnings chart is display only.`,

  "/driver/orders": `All orders assigned to this driver.
LIVE: Orders from Firestore filtered by driverId. Status badge updates in real-time. View order detail dialog.
UI-ONLY: Filter tabs are local state.`,

  "/driver/out-to-deliver": `Active deliveries currently out for delivery.
LIVE: Orders with status "out_for_delivery" from Firestore. Mark as Delivered button — updates order status to "delivered" in Firestore. Contact customer button links to phone. View address on map link.
UI-ONLY: Map embed is display only.`,

  "/driver/wallet": `Driver earnings wallet and payout history.
LIVE: Earnings computed from completed deliveries in Firestore. Request Payout button — creates payout request document in Firestore.
UI-ONLY: Payout history table is display only (no bank integration wired).`,

  "/driver/issues": `Report a delivery problem (damaged goods, no-show customer, wrong address).
LIVE: Issue report form — saves to issues Firestore collection with orderId, driverId, and description. Photo upload to Firebase Storage.
UI-ONLY: Issue status tracking is display only.`,

  "/driver/alerts": `Driver notifications (new assignments, payout confirmations).
LIVE: Alerts from Firestore. Mark as read updates document.
UI-ONLY: Filter tabs are local state.`,

  "/driver/support": `Contact SmiteTrade support.
LIVE: Support form saves to support_tickets with role="driver".
UI-ONLY: None.`,

  "/driver/profile": `Driver profile and vehicle details.
LIVE: Edit form updates user document. Vehicle info (type, plate) saved to driver profile in Firestore.
UI-ONLY: Rating stars are display only.`,

  // ─── LENDER PORTAL ─────────────────────────────────────────────────────────

  "/lender/dashboard": `Lender home showing portfolio overview.
LIVE: Borrower count, active loans, overdue count, total outstanding — all from Firestore via CreditContext. Recent activity feed from loans collection. Quick links to Clients, Loans, Applications.
UI-ONLY: Portfolio health gauge is display only.`,

  "/lender/clients": `Manage borrower/client profiles.
LIVE: Borrowers loaded from Firestore (lenderId == current user). Add Borrower button — saves to borrowers collection. Edit borrower — updates document. View loan history per borrower. BRI score displayed per client.
UI-ONLY: Sort and filter are local state.`,

  "/lender/loans": `All active and historical loans.
LIVE: Loans from Firestore. Record Payment button — updates loan balance, recalculates BRI score, auto-reviews credit limit after every 3 paid loans. Mark Overdue is automatic (runs on load). Loan detail dialog.
UI-ONLY: Repayment schedule calendar is display only.`,

  "/lender/applications": `Pending loan applications from customers.
LIVE: Applications from Firestore with status="pending". Approve button — creates loan in Firestore and adds borrower if new. Reject button — updates application status. View applicant BRI score and history.
UI-ONLY: Risk assessment summary is advisory display only.`,

  "/lender/collections": `Overdue loan collections management.
LIVE: Overdue loans from Firestore. Record Payment button — same as Loans page. Mark as Contacted — updates contact log in Firestore.
UI-ONLY: Collections script template is display only.`,

  "/lender/credit-check": `Run a BRI credit check on a potential borrower.
LIVE: Search by SSID or phone — looks up borrower in Firestore. BRI score computed from loan history. Credit limit recommendation generated.
UI-ONLY: Score breakdown chart is display only.`,

  "/lender/alerts": `Lender notifications (overdue alerts, new applications, payments received).
LIVE: Alerts from Firestore. Mark as read updates document.
UI-ONLY: Filter tabs are local state.`,

  "/lender/support": `Contact SmiteTrade support.
LIVE: Support form saves to support_tickets with role="lender".
UI-ONLY: None.`,

  "/lender/profile": `Lender profile and business details.
LIVE: Edit form updates user document in Firestore. Business registration and license uploads to Firebase Storage.
UI-ONLY: Verification badge status is display only.`,

  // ─── ADMIN PORTAL ──────────────────────────────────────────────────────────

  "/admin/dashboard": `Platform-wide admin overview.
LIVE: Total stores, users, orders, revenue — all from Firestore across all storeIds. Real-time KPI cards. Recent activity feed. Quick links to all admin sections.
UI-ONLY: Growth trend chart is display only.`,

  "/admin/analytics": `Platform-wide analytics and business intelligence.
LIVE: Revenue, orders, and user charts computed from all Firestore collections. Date range filter applies to displayed data. Export PDF via jsPDF.
UI-ONLY: Benchmark comparison data is display only.`,

  "/admin/stores": `Manage all stores on the SmiteTrade platform.
LIVE: Stores list from Firestore. View store details. Suspend/Activate store — updates store status in Firestore. Delete store — removes store document (hard delete).
UI-ONLY: Onboarding checklist per store is display only.`,

  "/admin/revenue": `Platform revenue tracking and PayFast reconciliation.
LIVE: Revenue records from Firestore. Payment status and transaction IDs from PayFast integration. Export CSV.
UI-ONLY: Forecasting chart is display only.`,

  "/admin/credit-overview": `Platform-wide credit and lending overview.
LIVE: All loan applications, active loans, default rates from Firestore. Approve/reject applications. View borrower BRI scores.
UI-ONLY: Risk heatmap is display only.`,

  "/admin/users": `Manage all platform users (owners, cashiers, drivers, lenders, customers).
LIVE: Users from Firestore. Change user role — updates role field. Suspend user — sets status to suspended. Delete user — removes user document (does not delete Firebase Auth account).
UI-ONLY: User activity timeline is display only.`,

  "/admin/support": `View and respond to support tickets from all portals.
LIVE: Tickets from support_tickets collection. Mark as resolved — updates ticket status. Reply (if wired) — adds response to ticket document.
UI-ONLY: SLA timer display is display only.`,

  "/admin/applications": `Review store owner and lender onboarding applications.
LIVE: Applications from Firestore. Approve — updates application status, activates store/lender account. Reject — updates status with reason.
UI-ONLY: Document viewer is display only.`,

  "/admin/pos-monitor": `Monitor POS activity across all stores in real-time.
LIVE: Live orders and POS sessions from Firestore via onSnapshot. Filter by store. Alert on abandoned sessions.
UI-ONLY: Session heatmap is display only.`,

  "/admin/audit-logs": `View all significant system events and data changes.
LIVE: Audit log entries from audit_logs Firestore collection. Filter by event type, user, date. Export CSV.
UI-ONLY: All content is read-only display.`,

  "/admin/disputes": `Handle disputes raised by customers, drivers, or owners.
LIVE: Disputes from disputes Firestore collection. Assign to admin — updates dispute document. Mark resolved — updates status. Add internal note — saves note to dispute document.
UI-ONLY: Dispute timeline is display only.`,

  "/admin/suppliers": `Platform-level supplier directory management.
LIVE: Platform suppliers from Firestore. Add supplier — saves to platform_suppliers collection. Edit/delete supplier. Approve supplier application.
UI-ONLY: Supplier rating is display only.`,

  "/admin/alerts": `Admin-wide notification centre.
LIVE: Alerts from Firestore. Mark as read. Broadcast alert to all users of a role — creates notification documents in Firestore.
UI-ONLY: Alert preview is display only.`,
};
