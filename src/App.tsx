
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { StoreProvider } from "./context/StoreContext";

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
import OwnerShopSettings from "./pages/owner/OwnerShopSettings";
import OwnerOrders from "./pages/owner/OwnerOrders";
import OwnerPricing from "./pages/owner/OwnerPricing";
import OwnerSuppliers from "./pages/owner/OwnerSuppliers";
import OwnerAlerts from "./pages/owner/OwnerAlerts";
import OwnerAnalytics from "./pages/owner/OwnerAnalytics";

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
import CustomerProfile from "./pages/customer/CustomerProfile";
import CustomerOrderDetails from "./pages/customer/CustomerOrderDetails";
import CustomerSupport from "./pages/customer/CustomerSupport";

// Driver
import DriverLogin from "./pages/driver/DriverLogin";
import DriverRegister from "./pages/driver/DriverRegister";
import DriverOrders from "./pages/driver/DriverOrders";
import DriverOutToDeliver from "./pages/driver/DriverOutToDeliver";
import DriverDelivered from "./pages/driver/DriverDelivered";
import DriverRoute from "./pages/driver/DriverRoute";
import DriverIssues from "./pages/driver/DriverIssues";

// Admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminPOSMonitor from "./pages/admin/AdminPOSMonitor";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAuditLogs from "./pages/admin/AdminAuditLogs";
import AdminDisputes from "./pages/admin/AdminDisputes";

// Lender
import LenderLogin from "./pages/lender/LenderLogin";
import LenderDashboard from "./pages/lender/LenderDashboard";
import LenderClients from "./pages/lender/LenderClients";
import LenderLoans from "./pages/lender/LenderLoans";
import LenderCollections from "./pages/lender/LenderCollections";
import LenderApplications from "./pages/lender/LenderApplications";
import LenderProfile from "./pages/lender/LenderProfile";
import LenderCreditCheck from "./pages/lender/LenderCreditCheck";

const queryClient = new QueryClient();

import { CreditProvider } from "./context/CreditContext";

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

              {/* Global */}
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/session-expired" element={<SessionExpired />} />
              <Route path="/portals" element={<Portals />} />

              {/* Owner Portal */}
              <Route path="/owner/login" element={<OwnerLogin />} />
              <Route path="/owner/register" element={<OwnerRegister />} />
              <Route path="/owner/dashboard" element={<OwnerDashboard />} />
              <Route path="/owner/pos" element={<OwnerPOS />} />
              <Route path="/owner/profile" element={<OwnerProfile />} />
              <Route path="/owner/lending" element={<OwnerLending />} />
              <Route path="/owner/inventory" element={<OwnerInventory />} />
              <Route path="/owner/staff" element={<OwnerStaff />} />
              <Route path="/owner/reports" element={<OwnerReports />} />
              <Route path="/owner/settings" element={<OwnerShopSettings />} />
              <Route path="/owner/orders" element={<OwnerOrders />} />
              <Route path="/owner/pricing" element={<OwnerPricing />} />
              <Route path="/owner/suppliers" element={<OwnerSuppliers />} />
              <Route path="/owner/alerts" element={<OwnerAlerts />} />
              <Route path="/owner/analytics" element={<OwnerAnalytics />} />

              {/* Cashier Portal */}
              <Route path="/cashier/login" element={<CashierLogin />} />
              <Route path="/cashier/register" element={<CashierRegister />} />
              <Route path="/cashier/dashboard" element={<CashierDashboard />} />
              <Route path="/cashier/pos" element={<CashierPOS />} />
              <Route path="/cashier/scanner" element={<CashierScanner />} />
              <Route path="/cashier/credit-review" element={<CashierCreditReview />} />
              <Route path="/cashier/checkout" element={<CashierCheckout />} />
              <Route path="/cashier/shift" element={<CashierShift />} />
              <Route path="/cashier/receipts" element={<CashierReceipts />} />

              {/* Customer Portal */}
              <Route path="/customer/login" element={<CustomerLogin />} />
              <Route path="/customer/signup" element={<CustomerRegister />} />
              <Route path="/customer/products" element={<CustomerProducts />} />
              <Route path="/customer/cart" element={<CustomerCart />} />
              <Route path="/customer/checkout" element={<CustomerCheckout />} />
              <Route path="/customer/payment" element={<CustomerPayment />} />
              <Route path="/customer/tracking" element={<CustomerTracking />} />
              <Route path="/customer/credit-review" element={<CustomerCreditReview />} />
              <Route path="/customer/apply-credit" element={<CustomerCreditApplication />} />
              <Route path="/customer/profile" element={<CustomerProfile />} />
              <Route path="/customer/orders/:id" element={<CustomerOrderDetails />} />
              <Route path="/customer/support" element={<CustomerSupport />} />

              {/* Driver Portal */}
              <Route path="/driver/login" element={<DriverLogin />} />
              <Route path="/driver/register" element={<DriverRegister />} />
              <Route path="/driver/orders" element={<DriverOrders />} />
              <Route path="/driver/out-to-deliver" element={<DriverOutToDeliver />} />
              <Route path="/driver/delivered" element={<DriverDelivered />} />
              <Route path="/driver/route/:orderId" element={<DriverRoute />} />
              <Route path="/driver/issues" element={<DriverIssues />} />

              {/* Admin Portal */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/applications" element={<AdminApplications />} />
              <Route path="/admin/pos-monitor" element={<AdminPOSMonitor />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
              <Route path="/admin/disputes" element={<AdminDisputes />} />

              {/* Lender Portal */}
              <Route path="/lender/login" element={<LenderLogin />} />
              <Route path="/lender/dashboard" element={<LenderDashboard />} />
              <Route path="/lender/clients" element={<LenderClients />} />
              <Route path="/lender/loans" element={<LenderLoans />} />
              <Route path="/lender/collections" element={<LenderCollections />} />
              <Route path="/lender/applications" element={<LenderApplications />} />
              <Route path="/lender/profile" element={<LenderProfile />} />
              <Route path="/lender/credit-check" element={<LenderCreditCheck />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CreditProvider>
      </StoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
