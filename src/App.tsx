import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OwnerLogin from "./pages/owner/OwnerLogin";
import OwnerRegister from "./pages/owner/OwnerRegister";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerPOS from "./pages/owner/OwnerPOS";
import OwnerProfile from "./pages/owner/OwnerProfile";
import CashierLogin from "./pages/cashier/CashierLogin";
import CashierRegister from "./pages/cashier/CashierRegister";
import CashierDashboard from "./pages/cashier/CashierDashboard";
import CashierPOS from "./pages/cashier/CashierPOS";
import CashierScanner from "./pages/cashier/CashierScanner";
import CashierCreditReview from "./pages/cashier/CashierCreditReview";
import CashierCheckout from "./pages/cashier/CashierCheckout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

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

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
