import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "@/context/StoreContext";

const DriverOrders = () => {
    const { orders, updateOrderStatus, assignDriver, user } = useStore();

    // Filter for orders relevant to drivers (Ready for pickup or already assigned to them)
    // In a real app, 'Ready' means the shop has packed it.
    const availableOrders = orders.filter(o =>
        o.status === "Ready" ||
        (o.driverId === user?.id && o.status === "Out for Delivery")
    );

    const handleAccept = (orderId: string) => {
        // Assign current user as driver and update status
        assignDriver(orderId, user?.id || "driver-1");
    };

    return (
        <DashboardLayout role="driver">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Today's Orders</h1>

            <div className="grid gap-4">
                {availableOrders.length === 0 ? (
                    <div className="text-center py-12 bg-muted rounded-xl border border-dashed">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-3" />
                        <h3 className="text-lg font-medium">No Orders Available</h3>
                        <p className="text-sm text-muted-foreground">Wait for shops to mark orders as "Ready".</p>
                    </div>
                ) : (
                    availableOrders.map((order) => (
                        <Card key={order.id} className="relative overflow-hidden">
                            {order.status === "Ready" && (
                                <div className="absolute top-0 right-0 p-2">
                                    <span className="flex h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                                </div>
                            )}
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">{order.id}</CardTitle>
                                    <Badge variant={order.status === "Ready" ? "default" : "secondary"}>
                                        {order.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-2 space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>{order.customerAddress}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                    <span>{order.items.length} Items • {order.customerName}</span>
                                </div>
                                <div className="pl-6 text-xs text-muted-foreground">
                                    {order.items.map(i => i.name).join(", ")}
                                </div>
                            </CardContent>
                            <CardFooter>
                                {order.status === "Ready" ? (
                                    <Link to="/driver/out-to-deliver" className="w-full" onClick={() => handleAccept(order.id)}>
                                        <Button className="w-full">
                                            Accept & Deliver <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link to="/driver/out-to-deliver" className="w-full">
                                        <Button variant="secondary" className="w-full">
                                            Continue Delivery <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                )}
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </DashboardLayout>
    );
};

export default DriverOrders;
