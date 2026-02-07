
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Phone, MessageCircle, Navigation, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const DriverRoute = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("In Transit");

    // Mock Order Data
    const order = {
        id: orderId || "1001",
        customerName: "Lufuno Mphela",
        phone: "072 123 4567",
        address: "123 Main St, Suburbia, City",
        notes: "Gate code is 1234. Please ring the bell.",
        items: 3,
        total: 850.00
    };

    const handleDelivered = () => {
        setStatus("Delivered");
        toast.success("Order marked as delivered!");
        setTimeout(() => navigate("/driver/orders"), 2000);
    };

    return (
        <DashboardLayout role="driver">
            <div className="space-y-6 max-w-xl mx-auto h-[calc(100vh-100px)] flex flex-col">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Current Delivery</h1>
                        <p className="text-muted-foreground">Order #{order.id}</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {status}
                    </span>
                </div>

                {/* Map Placeholder */}
                <Card className="flex-1 overflow-hidden relative">
                    <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                            <Navigation className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>Map Navigation View</p>
                            <p className="text-xs">(Google Maps Integration)</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Customer Details</CardTitle>
                        <CardDescription>{order.customerName}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="font-medium">{order.address}</p>
                                <p className="text-sm text-muted-foreground">{order.notes}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="w-full">
                                <Phone className="mr-2 h-4 w-4" />
                                Call
                            </Button>
                            <Button variant="outline" className="w-full">
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Message
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4 pb-4">
                    <Button variant="secondary" size="lg" className="w-full" onClick={() => navigate("/driver/issues")}>
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        Report Issue
                    </Button>
                    <Button size="lg" className="w-full bg-green-600 hover:bg-green-700" onClick={handleDelivered}>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Delivered
                    </Button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DriverRoute;
