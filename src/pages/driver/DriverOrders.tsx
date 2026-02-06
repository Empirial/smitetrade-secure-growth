import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const DriverOrders = () => {
    const orders = [
        { id: "ORD-992", customer: "Lerato Nkosi", address: "123 Main St, Soweto", items: 5, status: "Ready" },
        { id: "ORD-995", customer: "Thabo Molefe", address: "45 Zone 6, Diepkloof", items: 2, status: "Pending" },
        { id: "ORD-998", customer: "Sipho Dlamini", address: "88 Fox St, JHB CBD", items: 12, status: "Ready" },
    ];

    return (
        <DashboardLayout role="driver">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Today's Orders</h1>

            <div className="grid gap-4">
                {orders.map((order) => (
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
                                <span>{order.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-muted-foreground" />
                                <span>{order.items} Items • {order.customer}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            {order.status === "Ready" ? (
                                <Link to="/driver/out-to-deliver" className="w-full">
                                    <Button className="w-full">
                                        Accept & Deliver <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            ) : (
                                <Button variant="outline" className="w-full" disabled>
                                    Waiting for Shop
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </DashboardLayout>
    );
};

export default DriverOrders;
