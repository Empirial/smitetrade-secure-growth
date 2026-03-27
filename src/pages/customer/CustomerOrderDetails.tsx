
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Package, Truck, CheckCircle, RefreshCcw, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/context/StoreContext";

const CustomerOrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock Order Data
    const { orders } = useStore();
    const order = orders.find(o => o.id === id);

    if (!order) {
        return (
            <DashboardLayout role="customer">
                <div className="flex flex-col items-center justify-center h-96">
                    <h1 className="text-2xl font-bold">Order Not Found</h1>
                    <Button onClick={() => navigate('/customer/orders')} className="mt-4">
                        Back to Orders
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    // Calculate derived values
    const DELIVERY_FEE = (order as any).deliveryFee ?? 15;
    const subtotal = order.total - DELIVERY_FEE;

    const handleDownloadReceipt = () => {
        toast.success("Opening print dialog...");
        setTimeout(() => window.print(), 300);
    };

    const handleReorder = () => {
        // Clear current cart (optional, depending on desired UX. We'll just add to it here)
        // order.items.forEach(item => addToCart(item)); // Needs products mapped properly

        // For simplicity in this mock, we just alert
        toast.success("Items added to cart!");
        navigate('/customer/cart');
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
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button onClick={handleDownloadReceipt} variant="outline" className="flex-1 sm:flex-none">
                            <Download className="mr-2 h-4 w-4" />
                            Receipt
                        </Button>
                        <Button onClick={handleReorder} className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700">
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Reorder All
                        </Button>
                    </div>
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
                                    <span>R {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Delivery Fee</span>
                                    <span>R {DELIVERY_FEE.toFixed(2)}</span>
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
                                {order.status === 'Cancelled' ? (
                                    <div className="flex items-center gap-3 text-red-600">
                                        <XCircle className="h-5 w-5" />
                                        <span className="font-medium">Order Cancelled</span>
                                    </div>
                                ) : (() => {
                                    const STATUS_STEPS = ['Pending', 'Processing', 'Out for Delivery', 'Delivered'];
                                    const activeIndex = STATUS_STEPS.indexOf(order.status);
                                    return (
                                        <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 pb-2">
                                            {STATUS_STEPS.map((step, i) => {
                                                const isDone = i < activeIndex;
                                                const isCurrent = i === activeIndex;
                                                return (
                                                    <div key={step} className={`flex items-center -ml-[9px] gap-4 ${!isDone && !isCurrent ? 'opacity-40' : ''}`}>
                                                        <div className={`h-4 w-4 rounded-full ring-4 ring-white ${isDone ? 'bg-emerald-500' : isCurrent ? 'bg-blue-500' : 'bg-slate-200'}`} />
                                                        <div className={`text-sm flex items-center gap-2 ${isCurrent ? 'font-medium' : 'text-muted-foreground'}`}>
                                                            {step === 'Out for Delivery' && <Truck className="h-3 w-3" />}
                                                            {step === 'Delivered' && <CheckCircle className="h-3 w-3" />}
                                                            {step}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })()}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Delivery Address</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {order.customerAddress}
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
