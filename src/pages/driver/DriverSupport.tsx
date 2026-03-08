import DashboardLayout from "@/components/DashboardLayout";
import SupportForm from "@/components/SupportForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DriverSupport = () => (
  <DashboardLayout role="driver">
    <Tabs defaultValue="employer" className="max-w-xl mx-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="employer">Store Owner</TabsTrigger>
        <TabsTrigger value="platform">SmiteTrade Support</TabsTrigger>
      </TabsList>
      <TabsContent value="employer">
        <SupportForm role="driver" target="owner" />
      </TabsContent>
      <TabsContent value="platform">
        <SupportForm role="driver" target="admin" />
      </TabsContent>
    </Tabs>
  </DashboardLayout>
);

export default DriverSupport;
