
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./context/StoreContext";
import { CreditProvider } from "./context/CreditContext";
import AuthGuard from "./components/AuthGuard";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { lazy, Suspense } from "react";

// Global
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const TestSetup = lazy(() => import("./pages/TestSetup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const SessionExpired = lazy(() => import("./pages/SessionExpired"));
const Portals = lazy(() => import("./pages/Portals"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentCancel = lazy(() => import("./pages/PaymentCancel"));

// Owner
const OwnerLogin = lazy(() => import("./pages/owner/OwnerLogin"));
const OwnerRegister = lazy(() => import("./pages/owner/OwnerRegister"));
const OwnerDashboard = lazy(() => import("./pages/owner/OwnerDashboard"));
const OwnerPOS = lazy(() => import("./pages/owner/OwnerPOS"));
const OwnerProfile = lazy(() => import("./pages/owner/OwnerProfile"));
const OwnerInventory = lazy(() => import("./pages/owner/OwnerInventory"));
const OwnerLending = lazy(() => import("./pages/owner/OwnerLending"));
const OwnerStaff = lazy(() => import("./pages/owner/OwnerStaff"));
const OwnerReports = lazy(() => import("./pages/owner/OwnerReports"));
const OwnerOrders = lazy(() => import("./pages/owner/OwnerOrders"));
const OwnerPricing = lazy(() => import("./pages/owner/OwnerPricing"));
const OwnerSuppliers = lazy(() => import("./pages/owner/OwnerSuppliers"));
const OwnerAlerts = lazy(() => import("./pages/owner/OwnerAlerts"));
const OwnerAnalytics = lazy(() => import("./pages/owner/OwnerAnalytics"));
const OwnerExpenses = lazy(() => import("./pages/owner/OwnerExpenses"));
const OwnerCreditReview = lazy(() => import("./pages/owner/OwnerCreditReview"));
const OwnerStockAdjustment = lazy(() => import("./pages/owner/OwnerStockAdjustment"));
const OwnerSupport = lazy(() => import("./pages/owner/OwnerSupport"));
const OwnerSubscription = lazy(() => import("./pages/owner/OwnerSubscription"));

// Cashier
const CashierLogin = lazy(() => import("./pages/cashier/CashierLogin"));
const CashierRegister = lazy(() => import("./pages/cashier/CashierRegister"));
const CashierDashboard = lazy(() => import("./pages/cashier/CashierDashboard"));
const CashierPOS = lazy(() => import("./pages/cashier/CashierPOS"));
const CashierScanner = lazy(() => import("./pages/cashier/CashierScanner"));
const CashierCreditReview = lazy(() => import("./pages/cashier/CashierCreditReview"));
const CashierCheckout = lazy(() => import("./pages/cashier/CashierCheckout"));
const CashierShift = lazy(() => import("./pages/cashier/CashierShift"));
const CashierReceipts = lazy(() => import("./pages/cashier/CashierReceipts"));
const CashierInventory = lazy(() => import("./pages/cashier/CashierInventory"));
const CashierSupport = lazy(() => import("./pages/cashier/CashierSupport"));
const CashierAlerts = lazy(() => import("./pages/cashier/CashierAlerts"));

// Customer
const CustomerLogin = lazy(() => import("./pages/customer/CustomerLogin"));
const CustomerRegister = lazy(() => import("./pages/customer/CustomerRegister"));
const CustomerProducts = lazy(() => import("./pages/customer/CustomerProducts"));
const CustomerCart = lazy(() => import("./pages/customer/CustomerCart"));
const CustomerCheckout = lazy(() => import("./pages/customer/CustomerCheckout"));
const CustomerPayment = lazy(() => import("./pages/customer/CustomerPayment"));
const CustomerTracking = lazy(() => import("./pages/customer/CustomerTracking"));
const CustomerCreditReview = lazy(() => import("./pages/customer/CustomerCreditReview"));
const CustomerCreditApplication = lazy(() => import("./pages/customer/CustomerCreditApplication"));
const CustomerLenderRegistration = lazy(() => import("./pages/customer/CustomerLenderRegistration"));
const CustomerAlerts = lazy(() => import("./pages/customer/CustomerAlerts"));
const CustomerProfile = lazy(() => import("./pages/customer/CustomerProfile"));
const CustomerOrderDetails = lazy(() => import("./pages/customer/CustomerOrderDetails"));
const CustomerSupport = lazy(() => import("./pages/customer/CustomerSupport"));
const CustomerOrders = lazy(() => import("./pages/customer/CustomerOrders"));
const BehavioralReliabilityIndex = lazy(() => import("./pages/customer/BehavioralReliabilityIndex"));

// Driver
const DriverDashboard = lazy(() => import("./pages/driver/DriverDashboard"));
const DriverLogin = lazy(() => import("./pages/driver/DriverLogin"));
const DriverRegister = lazy(() => import("./pages/driver/DriverRegister"));
const DriverOrders = lazy(() => import("./pages/driver/DriverOrders"));
const DriverOutToDeliver = lazy(() => import("./pages/driver/DriverOutToDeliver"));
const DriverDelivered = lazy(() => import("./pages/driver/DriverDelivered"));
const DriverRoute = lazy(() => import("./pages/driver/DriverRoute"));
const DriverIssues = lazy(() => import("./pages/driver/DriverIssues"));
const DriverWallet = lazy(() => import("./pages/driver/DriverWallet"));
const DriverProfile = lazy(() => import("./pages/driver/DriverProfile"));
const DriverSupport = lazy(() => import("./pages/driver/DriverSupport"));
const DriverAlerts = lazy(() => import("./pages/driver/DriverAlerts"));

// Admin
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminApplications = lazy(() => import("./pages/admin/AdminApplications"));
const AdminPOSMonitor = lazy(() => import("./pages/admin/AdminPOSMonitor"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminAuditLogs = lazy(() => import("./pages/admin/AdminAuditLogs"));
const AdminDisputes = lazy(() => import("./pages/admin/AdminDisputes"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminStores = lazy(() => import("./pages/admin/AdminStores"));
const AdminRevenue = lazy(() => import("./pages/admin/AdminRevenue"));
const AdminCreditOverview = lazy(() => import("./pages/admin/AdminCreditOverview"));
const AdminSupport = lazy(() => import("./pages/admin/AdminSupport"));
const AdminAlerts = lazy(() => import("./pages/admin/AdminAlerts"));
const AdminSuppliers = lazy(() => import("./pages/admin/AdminSuppliers"));

// Lender
const LenderLogin = lazy(() => import("./pages/lender/LenderLogin"));
const LenderRegister = lazy(() => import("./pages/lender/LenderRegister"));
const LenderDashboard = lazy(() => import("./pages/lender/LenderDashboard"));
const LenderClients = lazy(() => import("./pages/lender/LenderClients"));
const LenderLoans = lazy(() => import("./pages/lender/LenderLoans"));
const LenderCollections = lazy(() => import("./pages/lender/LenderCollections"));
const LenderApplications = lazy(() => import("./pages/lender/LenderApplications"));
const LenderProfile = lazy(() => import("./pages/lender/LenderProfile"));
const LenderCreditCheck = lazy(() => import("./pages/lender/LenderCreditCheck"));
const LoanQuote = lazy(() => import("./pages/lender/LoanQuote"));
const LenderSupport = lazy(() => import("./pages/lender/LenderSupport"));
const LenderAlerts = lazy(() => import("./pages/lender/LenderAlerts"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <StoreProvider>
        <CreditProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ErrorBoundary>
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />

                {/* Global (public) */}
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/session-expired" element={<SessionExpired />} />
                <Route path="/portals" element={<Portals />} />

                {/* Owner Portal — Login/Register are public */}
                <Route path="/owner/login" element={<OwnerLogin />} />
                <Route path="/owner/register" element={<OwnerRegister />} />
                <Route path="/owner/dashboard" element={<AuthGuard role="owner"><OwnerDashboard /></AuthGuard>} />
                <Route path="/owner/pos" element={<AuthGuard role="owner"><OwnerPOS /></AuthGuard>} />
                <Route path="/owner/profile" element={<AuthGuard role="owner"><OwnerProfile /></AuthGuard>} />
                <Route path="/owner/lending" element={<AuthGuard role="owner"><OwnerLending /></AuthGuard>} />
                <Route path="/owner/inventory" element={<AuthGuard role="owner"><OwnerInventory /></AuthGuard>} />
                <Route path="/owner/staff" element={<AuthGuard role="owner"><OwnerStaff /></AuthGuard>} />
                <Route path="/owner/reports" element={<AuthGuard role="owner"><OwnerReports /></AuthGuard>} />
                <Route path="/owner/orders" element={<AuthGuard role="owner"><OwnerOrders /></AuthGuard>} />
                <Route path="/owner/pricing" element={<AuthGuard role="owner"><OwnerPricing /></AuthGuard>} />
                <Route path="/owner/suppliers" element={<AuthGuard role="owner"><OwnerSuppliers /></AuthGuard>} />
                <Route path="/owner/subscription" element={<AuthGuard role="owner"><OwnerSubscription /></AuthGuard>} />
                <Route path="/owner/alerts" element={<AuthGuard role="owner"><OwnerAlerts /></AuthGuard>} />
                <Route path="/owner/analytics" element={<AuthGuard role="owner"><OwnerAnalytics /></AuthGuard>} />
                <Route path="/owner/expenses" element={<AuthGuard role="owner"><OwnerExpenses /></AuthGuard>} />
                <Route path="/owner/credit-review" element={<AuthGuard role="owner"><OwnerCreditReview /></AuthGuard>} />
                <Route path="/owner/stock-adjustment" element={<AuthGuard role="owner"><OwnerStockAdjustment /></AuthGuard>} />
                <Route path="/owner/support" element={<AuthGuard role="owner"><OwnerSupport /></AuthGuard>} />

                {/* Cashier Portal */}
                <Route path="/cashier/login" element={<CashierLogin />} />
                <Route path="/cashier/register" element={<CashierRegister />} />
                <Route path="/cashier/dashboard" element={<AuthGuard role="cashier"><CashierDashboard /></AuthGuard>} />
                <Route path="/cashier/pos" element={<AuthGuard role="cashier"><CashierPOS /></AuthGuard>} />
                <Route path="/cashier/scanner" element={<AuthGuard role="cashier"><CashierScanner /></AuthGuard>} />
                <Route path="/cashier/credit-review" element={<AuthGuard role="cashier"><CashierCreditReview /></AuthGuard>} />
                <Route path="/cashier/checkout" element={<AuthGuard role="cashier"><CashierCheckout /></AuthGuard>} />
                <Route path="/cashier/shift" element={<AuthGuard role="cashier"><CashierShift /></AuthGuard>} />
                <Route path="/cashier/receipts" element={<AuthGuard role="cashier"><CashierReceipts /></AuthGuard>} />
                <Route path="/cashier/inventory" element={<AuthGuard role="cashier"><CashierInventory /></AuthGuard>} />
                <Route path="/cashier/support" element={<AuthGuard role="cashier"><CashierSupport /></AuthGuard>} />
                <Route path="/cashier/alerts" element={<AuthGuard role="cashier"><CashierAlerts /></AuthGuard>} />

                {/* Customer Portal */}
                <Route path="/customer/login" element={<CustomerLogin />} />
                <Route path="/customer/signup" element={<CustomerRegister />} />
                <Route path="/customer/products" element={<AuthGuard role="customer"><CustomerProducts /></AuthGuard>} />
                <Route path="/customer/cart" element={<AuthGuard role="customer"><CustomerCart /></AuthGuard>} />
                <Route path="/customer/checkout" element={<AuthGuard role="customer"><CustomerCheckout /></AuthGuard>} />
                <Route path="/customer/payment" element={<AuthGuard role="customer"><CustomerPayment /></AuthGuard>} />
                <Route path="/customer/tracking" element={<AuthGuard role="customer"><CustomerTracking /></AuthGuard>} />
                <Route path="/customer/credit-review" element={<AuthGuard role="customer"><CustomerCreditReview /></AuthGuard>} />
                <Route path="/customer/apply-credit" element={<AuthGuard role="customer"><CustomerCreditApplication /></AuthGuard>} />
                <Route path="/customer/lender-registration" element={<AuthGuard role="customer"><CustomerLenderRegistration /></AuthGuard>} />
                <Route path="/customer/alerts" element={<AuthGuard role="customer"><CustomerAlerts /></AuthGuard>} />
                <Route path="/customer/profile" element={<AuthGuard role="customer"><CustomerProfile /></AuthGuard>} />
                <Route path="/customer/orders" element={<AuthGuard role="customer"><CustomerOrders /></AuthGuard>} />
                <Route path="/customer/orders/:id" element={<AuthGuard role="customer"><CustomerOrderDetails /></AuthGuard>} />
                <Route path="/customer/credit-status" element={<AuthGuard role="customer"><BehavioralReliabilityIndex /></AuthGuard>} />
                <Route path="/customer/support" element={<AuthGuard role="customer"><CustomerSupport /></AuthGuard>} />

                {/* Driver Portal */}
                <Route path="/driver/login" element={<DriverLogin />} />
                <Route path="/driver/register" element={<DriverRegister />} />
                <Route path="/driver/dashboard" element={<AuthGuard role="driver"><DriverDashboard /></AuthGuard>} />
                <Route path="/driver/orders" element={<AuthGuard role="driver"><DriverOrders /></AuthGuard>} />
                <Route path="/driver/out-to-deliver" element={<AuthGuard role="driver"><DriverOutToDeliver /></AuthGuard>} />
                <Route path="/driver/delivered" element={<AuthGuard role="driver"><DriverDelivered /></AuthGuard>} />
                <Route path="/driver/route/:orderId" element={<AuthGuard role="driver"><DriverRoute /></AuthGuard>} />
                <Route path="/driver/issues" element={<AuthGuard role="driver"><DriverIssues /></AuthGuard>} />
                <Route path="/driver/wallet" element={<AuthGuard role="driver"><DriverWallet /></AuthGuard>} />
                <Route path="/driver/profile" element={<AuthGuard role="driver"><DriverProfile /></AuthGuard>} />
                <Route path="/driver/support" element={<AuthGuard role="driver"><DriverSupport /></AuthGuard>} />
                <Route path="/driver/alerts" element={<AuthGuard role="driver"><DriverAlerts /></AuthGuard>} />

                {/* Admin Portal */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AuthGuard role="admin"><AdminDashboard /></AuthGuard>} />
                <Route path="/admin/applications" element={<AuthGuard role="admin"><AdminApplications /></AuthGuard>} />
                <Route path="/admin/pos-monitor" element={<AuthGuard role="admin"><AdminPOSMonitor /></AuthGuard>} />
                <Route path="/admin/users" element={<AuthGuard role="admin"><AdminUsers /></AuthGuard>} />
                <Route path="/admin/audit-logs" element={<AuthGuard role="admin"><AdminAuditLogs /></AuthGuard>} />
                <Route path="/admin/disputes" element={<AuthGuard role="admin"><AdminDisputes /></AuthGuard>} />
                <Route path="/admin/analytics" element={<AuthGuard role="admin"><AdminAnalytics /></AuthGuard>} />
                <Route path="/admin/stores" element={<AuthGuard role="admin"><AdminStores /></AuthGuard>} />
                <Route path="/admin/revenue" element={<AuthGuard role="admin"><AdminRevenue /></AuthGuard>} />
                <Route path="/admin/credit-overview" element={<AuthGuard role="admin"><AdminCreditOverview /></AuthGuard>} />
                <Route path="/admin/support" element={<AuthGuard role="admin"><AdminSupport /></AuthGuard>} />
                <Route path="/admin/alerts" element={<AuthGuard role="admin"><AdminAlerts /></AuthGuard>} />
                <Route path="/admin/suppliers" element={<AuthGuard role="admin"><AdminSuppliers /></AuthGuard>} />

                {/* Lender Portal */}
                <Route path="/lender/login" element={<LenderLogin />} />
                <Route path="/lender/register" element={<LenderRegister />} />
                <Route path="/lender/dashboard" element={<AuthGuard role="lender"><LenderDashboard /></AuthGuard>} />
                <Route path="/lender/clients" element={<AuthGuard role="lender"><LenderClients /></AuthGuard>} />
                <Route path="/lender/loans" element={<AuthGuard role="lender"><LenderLoans /></AuthGuard>} />
                <Route path="/lender/collections" element={<AuthGuard role="lender"><LenderCollections /></AuthGuard>} />
                <Route path="/lender/applications" element={<AuthGuard role="lender"><LenderApplications /></AuthGuard>} />
                <Route path="/lender/profile" element={<AuthGuard role="lender"><LenderProfile /></AuthGuard>} />
                <Route path="/lender/credit-check" element={<AuthGuard role="lender"><LenderCreditCheck /></AuthGuard>} />
                <Route path="/lender/quote" element={<AuthGuard role="lender"><LoanQuote /></AuthGuard>} />
                <Route path="/lender/support" element={<AuthGuard role="lender"><LenderSupport /></AuthGuard>} />
                <Route path="/lender/alerts" element={<AuthGuard role="lender"><LenderAlerts /></AuthGuard>} />

                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/cancel" element={<PaymentCancel />} />
                <Route path="/test-setup" element={<TestSetup />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
        </CreditProvider>
      </StoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
