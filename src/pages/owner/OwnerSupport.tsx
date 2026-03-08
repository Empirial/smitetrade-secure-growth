import DashboardLayout from "@/components/DashboardLayout";
import SupportForm from "@/components/SupportForm";

const OwnerSupport = () => (
  <DashboardLayout role="owner">
    <SupportForm role="owner" target="admin" />
  </DashboardLayout>
);

export default OwnerSupport;
