
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { StoreProvider } from "./context/StoreContext";
import { CreditProvider } from "./context/CreditContext";
import AuthGuard from "./components/AuthGuard";

// Global
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SessionExpired from "./pages/SessionExpired";
import Portals from "./pages/Portals";

// Owner
import OwnerLogin from "./pages/owner/OwnerLogin";
import OwnerRegister from "./pages/owner/OwnerRegister";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerPOS from "./pages/owner/OwnerPOS";
import OwnerProfile from "./pages/owner/OwnerProfile";
import OwnerInventory from "./pages/owner/OwnerInventory";
import OwnerLending from "./pages/owner/OwnerLending";
import OwnerStaff from "./pages/owner/OwnerStaff";
import OwnerReports from "./pages/owner/OwnerReports";
import OwnerOrders from "./pages/owner/OwnerOrders";
import OwnerPricing from "./pages/owner/OwnerPricing";
import OwnerSuppliers from "./pages/owner/OwnerSuppliers";
import OwnerAlerts from "./pages/owner/OwnerAlerts";
import OwnerAnalytics from "./pages/owner/OwnerAnalytics";
import OwnerExpenses from "./pages/owner/OwnerExpenses";
import OwnerCustomers from "./pages/owner/OwnerCustomers";
import OwnerCreditReview from "./pages/owner/OwnerCreditReview";
import OwnerStockAdjustment from "./pages/owner/OwnerStockAdjustment";
import OwnerSupport from "./pages/owner/OwnerSupport";
// Cashier
import CashierLogin from "./pages/cashier/CashierLogin";
import CashierRegister from "./pages/cashier/CashierRegister";
import CashierDashboard from "./pages/cashier/CashierDashboard";
import CashierPOS from "./pages/cashier/CashierPOS";
import CashierScanner from "./pages/cashier/CashierScanner";
import CashierCreditReview from "./pages/cashier/CashierCreditReview";
import CashierCheckout from "./pages/cashier/CashierCheckout";
import CashierShift from "./pages/cashier/CashierShift";
import CashierReceipts from "./pages/cashier/CashierReceipts";
import CashierInventory from "./pages/cashier/CashierInventory";

// Customer
import CustomerLogin from "./pages/customer/CustomerLogin";
import CustomerRegister from "./pages/customer/CustomerRegister";
import CustomerProducts from "./pages/customer/CustomerProducts";
import CustomerCart from "./pages/customer/CustomerCart";
import CustomerCheckout from "./pages/customer/CustomerCheckout";
import CustomerPayment from "./pages/customer/CustomerPayment";
import CustomerTracking from "./pages/customer/CustomerTracking";
import CustomerCreditReview from "./pages/customer/CustomerCreditReview";
import CustomerCreditApplication from "./pages/customer/CustomerCreditApplication";
import CustomerLenderRegistration from "./pages/customer/CustomerLenderRegistration";
import CustomerAlerts from "./pages/customer/CustomerAlerts";
import CustomerProfile from "./pages/customer/CustomerProfile";
import CustomerOrderDetails from "./pages/customer/CustomerOrderDetails";
import CustomerSupport from "./pages/customer/CustomerSupport";
import CustomerOrders from "./pages/customer/CustomerOrders";
import BehavioralReliabilityIndex from "./pages/customer/BehavioralReliabilityIndex";

// Driver
import DriverLogin from "./pages/driver/DriverLogin";
import DriverRegister from "./pages/driver/DriverRegister";
import DriverOrders from "./pages/driver/DriverOrders";
import DriverOutToDeliver from "./pages/driver/DriverOutToDeliver";
import DriverDelivered from "./pages/driver/DriverDelivered";
import DriverRoute from "./pages/driver/DriverRoute";
import DriverIssues from "./pages/driver/DriverIssues";
import DriverWallet from "./pages/driver/DriverWallet";
import DriverProfile from "./pages/driver/DriverProfile";

// Admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminPOSMonitor from "./pages/admin/AdminPOSMonitor";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAuditLogs from "./pages/admin/AdminAuditLogs";
import AdminDisputes from "./pages/admin/AdminDisputes";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminStores from "./pages/admin/AdminStores";
import AdminRevenue from "./pages/admin/AdminRevenue";
import AdminCreditOverview from "./pages/admin/AdminCreditOverview";
import AdminSupport from "./pages/admin/AdminSupport";

// Lender
import LenderLogin from "./pages/lender/LenderLogin";
import LenderRegister from "./pages/lender/LenderRegister";
import LenderDashboard from "./pages/lender/LenderDashboard";
import LenderClients from "./pages/lender/LenderClients";
import LenderLoans from "./pages/lender/LenderLoans";
import LenderCollections from "./pages/lender/LenderCollections";
import LenderApplications from "./pages/lender/LenderApplications";
import LenderProfile from "./pages/lender/LenderProfile";
import LenderCreditCheck from "./pages/lender/LenderCreditCheck";
import LoanQuote from "./pages/lender/LoanQuote";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <StoreProvider>
        <CreditProvider>
          <BrowserRouter>
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
              <Route path="/owner/alerts" element={<AuthGuard role="owner"><OwnerAlerts /></AuthGuard>} />
              <Route path="/owner/analytics" element={<AuthGuard role="owner"><OwnerAnalytics /></AuthGuard>} />
              <Route path="/owner/expenses" element={<AuthGuard role="owner"><OwnerExpenses /></AuthGuard>} />
              <Route path="/owner/customers" element={<AuthGuard role="owner"><OwnerCustomers /></AuthGuard>} />
              <Route path="/owner/credit-review" element={<AuthGuard role="owner"><OwnerCreditReview /></AuthGuard>} />
              <Route path="/owner/stock-adjustment" element={<AuthGuard role="owner"><OwnerStockAdjustment /></AuthGuard>} />

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
              <Route path="/driver/orders" element={<AuthGuard role="driver"><DriverOrders /></AuthGuard>} />
              <Route path="/driver/out-to-deliver" element={<AuthGuard role="driver"><DriverOutToDeliver /></AuthGuard>} />
              <Route path="/driver/delivered" element={<AuthGuard role="driver"><DriverDelivered /></AuthGuard>} />
              <Route path="/driver/route/:orderId" element={<AuthGuard role="driver"><DriverRoute /></AuthGuard>} />
              <Route path="/driver/issues" element={<AuthGuard role="driver"><DriverIssues /></AuthGuard>} />
              <Route path="/driver/wallet" element={<AuthGuard role="driver"><DriverWallet /></AuthGuard>} />
              <Route path="/driver/profile" element={<AuthGuard role="driver"><DriverProfile /></AuthGuard>} />

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

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CreditProvider>
      </StoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
