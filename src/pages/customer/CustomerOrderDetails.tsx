
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Package, Truck, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const CustomerOrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock Order Data
    const order = {
        id: id || "1001",
        date: new Date().toISOString(),
        status: "Delivered",
        items: [
            { name: "Premium Widget", quantity: 2, price: 150.00 },
            { name: "Service Pack", quantity: 1, price: 500.00 },
        ],
        subtotal: 800.00,
        deliveryFee: 50.00,
        total: 850.00,
        address: "123 Main St, Suburbia, City"
    };

    const handleDownloadReceipt = () => {
        toast.success("Receipt downloading...");
    };

    return (
        <DashboardLayout role="customer">
            <div className="space-y-6 max-w-3xl mx-auto">
                <Button variant="ghost" className="pl-0 hover:pl-2 transition-all" onClick={() => navigate(-1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Orders
                </Button>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Order #{order.id}</h1>
                        <p className="text-muted-foreground">Placed on {new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <Button onClick={handleDownloadReceipt} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download Receipt
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Items</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center">
                                            <Package className="h-6 w-6 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="font-medium">R {(item.price * item.quantity).toFixed(2)}</div>
                                </div>
                            ))}
                            <div className="pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>R {order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Delivery Method</span>
                                    <span>Standard Delivery (R {order.deliveryFee.toFixed(2)})</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                                    <span>Total</span>
                                    <span>R {order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 pb-2">
                                    <div className="flex items-center -ml-[9px] gap-4">
                                        <div className="h-4 w-4 rounded-full bg-slate-300 ring-4 ring-white" />
                                        <div className="text-sm text-muted-foreground">Order Placed</div>
                                    </div>
                                    <div className="flex items-center -ml-[9px] gap-4">
                                        <div className="h-4 w-4 rounded-full bg-slate-300 ring-4 ring-white" />
                                        <div className="text-sm text-muted-foreground">Processing</div>
                                    </div>
                                    <div className="flex items-center -ml-[9px] gap-4">
                                        <div className="h-4 w-4 rounded-full bg-blue-500 ring-4 ring-white" />
                                        <div className="text-sm font-medium flex items-center gap-2">
                                            <Truck className="h-3 w-3" />
                                            Out for Delivery
                                        </div>
                                    </div>
                                    {/* Future status example */}
                                    <div className="flex items-center -ml-[9px] gap-4 opacity-50">
                                        <div className="h-4 w-4 rounded-full bg-slate-200 ring-4 ring-white" />
                                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                                            <CheckCircle className="h-3 w-3" />
                                            Delivered
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Delivery Address</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {order.address}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CustomerOrderDetails;
