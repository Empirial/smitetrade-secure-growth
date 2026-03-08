import DashboardLayout from "@/components/DashboardLayout";
import SupportForm from "@/components/SupportForm";

const LenderSupport = () => (
  <DashboardLayout role="lender">
    <SupportForm role="lender" target="admin" />
  </DashboardLayout>
);

export default LenderSupport;
