import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Owner
import OwnerLogin from "./pages/owner/OwnerLogin";
import OwnerRegister from "./pages/owner/OwnerRegister";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerPOS from "./pages/owner/OwnerPOS";
import OwnerProfile from "./pages/owner/OwnerProfile";

// Cashier
import CashierLogin from "./pages/cashier/CashierLogin";
import CashierRegister from "./pages/cashier/CashierRegister";
import CashierDashboard from "./pages/cashier/CashierDashboard";
import CashierPOS from "./pages/cashier/CashierPOS";
import CashierScanner from "./pages/cashier/CashierScanner";
import CashierCreditReview from "./pages/cashier/CashierCreditReview";
import CashierCheckout from "./pages/cashier/CashierCheckout";

// Customer
import CustomerLogin from "./pages/customer/CustomerLogin";
import CustomerRegister from "./pages/customer/CustomerRegister";
import CustomerProducts from "./pages/customer/CustomerProducts";
import CustomerCart from "./pages/customer/CustomerCart";
import CustomerCheckout from "./pages/customer/CustomerCheckout";
import CustomerPayment from "./pages/customer/CustomerPayment";
import CustomerTracking from "./pages/customer/CustomerTracking";
import CustomerCreditReview from "./pages/customer/CustomerCreditReview";
import CustomerProfile from "./pages/customer/CustomerProfile";

// Driver
import DriverLogin from "./pages/driver/DriverLogin";
import DriverRegister from "./pages/driver/DriverRegister";
import DriverOrders from "./pages/driver/DriverOrders";
import DriverOutToDeliver from "./pages/driver/DriverOutToDeliver";
import DriverDelivered from "./pages/driver/DriverDelivered";

// Admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminPOSMonitor from "./pages/admin/AdminPOSMonitor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />


          {/* Owner Portal */}
          <Route path="/owner/login" element={<OwnerLogin />} />
          <Route path="/owner/register" element={<OwnerRegister />} />
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/pos" element={<OwnerPOS />} />
          <Route path="/owner/profile" element={<OwnerProfile />} />

          {/* Cashier Portal */}
          <Route path="/cashier/login" element={<CashierLogin />} />
          <Route path="/cashier/register" element={<CashierRegister />} />
          <Route path="/cashier/dashboard" element={<CashierDashboard />} />
          <Route path="/cashier/pos" element={<CashierPOS />} />
          <Route path="/cashier/scanner" element={<CashierScanner />} />
          <Route path="/cashier/credit-review" element={<CashierCreditReview />} />
          <Route path="/cashier/checkout" element={<CashierCheckout />} />

          {/* Customer Portal */}
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/customer/signup" element={<CustomerRegister />} />
          <Route path="/customer/products" element={<CustomerProducts />} />
          <Route path="/customer/cart" element={<CustomerCart />} />
          <Route path="/customer/checkout" element={<CustomerCheckout />} />
          <Route path="/customer/payment" element={<CustomerPayment />} />
          <Route path="/customer/tracking" element={<CustomerTracking />} />
          <Route path="/customer/credit-review" element={<CustomerCreditReview />} />
          <Route path="/customer/profile" element={<CustomerProfile />} />

          {/* Driver Portal */}
          <Route path="/driver/login" element={<DriverLogin />} />
          <Route path="/driver/register" element={<DriverRegister />} />
          <Route path="/driver/orders" element={<DriverOrders />} />
          <Route path="/driver/out-to-deliver" element={<DriverOutToDeliver />} />
          <Route path="/driver/delivered" element={<DriverDelivered />} />

          {/* Admin Portal */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="/admin/pos-monitor" element={<AdminPOSMonitor />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
