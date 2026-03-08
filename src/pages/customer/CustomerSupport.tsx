import DashboardLayout from "@/components/DashboardLayout";
import SupportForm from "@/components/SupportForm";

const CustomerSupport = () => (
  <DashboardLayout role="customer">
    <SupportForm role="customer" target="admin" />
  </DashboardLayout>
);

export default CustomerSupport;
