import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, Truck, Package } from "lucide-react";

import { useStore } from "@/context/StoreContext";

const CustomerTracking = () => {
    const { orders } = useStore();
    const latestOrder = orders.length > 0 ? orders[0] : null;

    if (!latestOrder) {
        return (
            <DashboardLayout role="customer">
                <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                    <Package className="h-16 w-16 text-muted-foreground opacity-20" />
                    <h1 className="text-2xl font-bold">No Orders Found</h1>
                    <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                </div>
            </DashboardLayout>
        );
    }

    const steps = [
        { label: "Order Received", status: "completed", time: new Date(latestOrder.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        { label: "Preparing Order", status: latestOrder.status === 'Pending' ? 'current' : 'completed', time: "Est. 10 mins" },
        { label: "Out for Delivery", status: latestOrder.status === 'Out for Delivery' ? 'current' : latestOrder.status === 'Delivered' ? 'completed' : 'pending', time: "Est. 20 mins" },
        { label: "Delivered", status: latestOrder.status === 'Delivered' ? 'completed' : 'pending', time: "Est. 30 mins" },
    ];

    return (
        <DashboardLayout role="customer">
            <div className="max-w-2xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold tracking-tight">Track Order #{latestOrder.id}</h1>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Truck className="h-5 w-5" /> Delivery Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative py-10 pl-6">
                        {/* Connecting Line */}
                        <div className="absolute left-[35px] top-14 bottom-14 w-0.5 bg-border" />

                        <div className="space-y-12">
                            {steps.map((step, index) => (
                                <div key={index} className="relative flex items-center gap-6">
                                    <div className={`relative z-10 flex h-5 w-5 items-center justify-center rounded-full bg-background ring-4 ring-background ${step.status === "completed" ? "text-primary" :
                                        step.status === "current" ? "text-primary animate-pulse" : "text-muted-foreground"
                                        }`}>
                                        {step.status === "completed" ? (
                                            <CheckCircle2 className="h-6 w-6 fill-background" />
                                        ) : step.status === "current" ? (
                                            <div className="h-4 w-4 rounded-full bg-primary" />
                                        ) : (
                                            <Circle className="h-4 w-4" />
                                        )}
                                    </div>
                                    <div className="flex-1 flex justify-between items-center">
                                        <div>
                                            <p className={`font-medium ${step.status === "pending" ? "text-muted-foreground" : "text-foreground"}`}>
                                                {step.label}
                                            </p>
                                        </div>
                                        <span className="text-sm text-muted-foreground">{step.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" /> Order Items
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            {latestOrder.items.map(i => `${i.name} x${i.quantity}`).join(', ')}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default CustomerTracking;
