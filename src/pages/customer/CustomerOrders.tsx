import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner"; // Added missing import

const CustomerOrders = () => {
    const navigate = useNavigate();
    // Mock orders data
    const orders = [
        { id: "ORD-001", date: "2024-02-10", total: 1250, status: "Delivered", items: 4 },
        { id: "ORD-002", date: "2024-02-12", total: 850, status: "Processing", items: 2 },
        { id: "ORD-003", date: "2024-02-13", total: 3200, status: "Shipped", items: 12 },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Delivered": return "bg-emerald-500 hover:bg-emerald-600";
            case "Processing": return "bg-blue-500 hover:bg-blue-600";
            case "Shipped": return "bg-orange-500 hover:bg-orange-600";
            default: return "bg-slate-500 hover:bg-slate-600";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Delivered": return <CheckCircle className="mr-2 h-4 w-4" />;
            case "Processing": return <Package className="mr-2 h-4 w-4" />;
            case "Shipped": return <Truck className="mr-2 h-4 w-4" />;
            default: return null;
        }
    };

    return (
        <DashboardLayout role="customer">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
                    <p className="text-muted-foreground">Track current orders and view past purchases.</p>
                </div>

                <div className="grid gap-4">
                    {orders.map((order) => (
                        <Card key={order.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-base font-bold">{order.id}</CardTitle>
                                        <Badge className={getStatusColor(order.status)}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </Badge>
                                    </div>
                                    <CardDescription>{order.date} • {order.items} Items</CardDescription>
                                    <p className="text-xs font-semibold text-emerald-600 mt-1">Estimated: 8am - 6pm</p>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold block">R {order.total.toFixed(2)}</span>
                                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                                        View Details
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 border-t flex justify-end gap-2">
                                <Button variant="outline" size="sm" asChild>
                                    <Link to="/customer/tracking">
                                        <Truck className="mr-2 h-4 w-4" /> Track
                                    </Link>
                                </Button>
                                <Button
                                    size="sm"
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                    onClick={() => {
                                        toast.success("Items added to cart");
                                        navigate("/customer/cart");
                                    }}
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" /> Reorder
                                </Button>
                            </CardContent>
                        </Card>
                    ))}

                    {orders.length === 0 && (
                        <div className="text-center py-12">
                            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium text-muted-foreground">No orders found</h3>
                            <Link to="/customer/products">
                                <Button className="mt-4">Start Shopping</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CustomerOrders;
