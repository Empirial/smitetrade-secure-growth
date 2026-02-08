
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/context/StoreContext";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Phone, CheckCircle, Navigation, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const DriverRoute = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { orders, updateOrderStatus, user } = useStore();
    const [confirmationCode, setConfirmationCode] = useState("");

    // Find the order
    const order = orders.find(o => o.id === orderId);

    if (!order) {
        return (
            <DashboardLayout role="driver">
                <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                    <h1 className="text-2xl font-bold">Order Not Found</h1>
                    <Button onClick={() => navigate("/driver/orders")}>Back to Orders</Button>
                </div>
            </DashboardLayout>
        );
    }

    const handleCompleteDelivery = async () => {
        // In a real app, verify code here.
        if (confirmationCode.length < 4) {
            toast.error("Please enter the 4-digit confirmation code from the customer.");
            return;
        }

        await updateOrderStatus(order.id, "Delivered");
        toast.success("Delivery completed!");
        navigate("/driver/orders");
    };

    return (
        <DashboardLayout role="driver">
            <div className="max-w-md mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Current Delivery</h1>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium animate-pulse">
                        In Progress
                    </span>
                </div>

                {/* Map Placeholder */}
                <Card className="overflow-hidden">
                    <div className="bg-slate-200 h-48 w-full flex items-center justify-center text-slate-400 relative">
                        <MapPin className="h-10 w-10 mb-2" />
                        <span className="absolute bottom-2 right-2 text-xs bg-white/80 px-2 py-1 rounded">
                            Google Maps Integration
                        </span>
                        {/* Mock Route Line */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                            <path d="M50,150 Q150,50 350,100" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="8 4" />
                        </svg>
                    </div>
                    <CardContent className="pt-4 space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="bg-emerald-100 p-2 rounded-full mt-1">
                                <Navigation className="h-4 w-4 text-emerald-700" />
                            </div>
                            <div>
                                <Label className="text-muted-foreground text-xs uppercase">Delivery Address</Label>
                                <p className="font-medium text-lg leading-tight">{order.customerAddress}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="bg-blue-100 p-2 rounded-full mt-1">
                                <Phone className="h-4 w-4 text-blue-700" />
                            </div>
                            <div>
                                <Label className="text-muted-foreground text-xs uppercase">Customer Contact</Label>
                                <p className="font-medium text-lg leading-tight">{order.customerName}</p>
                                <Button variant="link" className="p-0 h-auto text-blue-600">Call Customer</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Order Details Summary */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Package className="h-4 w-4" /> Order #{order.id} Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1 pb-2">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between">
                                <span>{item.quantity}x {item.name}</span>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter className="pt-2 border-t">
                        <div className="flex justify-between w-full font-bold">
                            <span>Total to Collect</span>
                            <span>{order.status === 'Paid' ? 'Paid Online' : `R ${order.total.toFixed(2)}`}</span>
                        </div>
                    </CardFooter>
                </Card>

                {/* Completion Action */}
                <Card className="border-t-4 border-t-emerald-500">
                    <CardHeader>
                        <CardTitle>Complete Delivery</CardTitle>
                        <CardDescription>Enter the code provided by the customer.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">Confirmation Code</Label>
                            <Input
                                id="code"
                                placeholder="e.g. 1234"
                                className="text-center text-2xl tracking-widest"
                                maxLength={4}
                                value={confirmationCode}
                                onChange={(e) => setConfirmationCode(e.target.value)}
                            />
                        </div>
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg" onClick={handleCompleteDelivery}>
                            <CheckCircle className="mr-2 h-5 w-5" /> Mark Delivered
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default DriverRoute;
