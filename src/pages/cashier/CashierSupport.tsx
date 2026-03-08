import DashboardLayout from "@/components/DashboardLayout";
import SupportForm from "@/components/SupportForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CashierSupport = () => (
  <DashboardLayout role="cashier">
    <Tabs defaultValue="employer" className="max-w-xl mx-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="employer">Store Owner</TabsTrigger>
        <TabsTrigger value="platform">SmiteTrade Support</TabsTrigger>
      </TabsList>
      <TabsContent value="employer">
        <SupportForm role="cashier" target="owner" />
      </TabsContent>
      <TabsContent value="platform">
        <SupportForm role="cashier" target="admin" />
      </TabsContent>
    </Tabs>
  </DashboardLayout>
);

export default CashierSupport;
