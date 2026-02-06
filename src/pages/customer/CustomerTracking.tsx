import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, Truck, Package } from "lucide-react";

const CustomerTracking = () => {
    const steps = [
        { label: "Order Received", status: "completed", time: "10:30 AM" },
        { label: "Preparing Order", status: "completed", time: "10:45 AM" },
        { label: "Out for Delivery", status: "current", time: "11:15 AM" },
        { label: "Delivered", status: "pending", time: "Est. 11:45 AM" },
    ];

    return (
        <DashboardLayout role="customer">
            <div className="max-w-2xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold tracking-tight">Track Order #Ord-992</h1>

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
                        <p className="text-muted-foreground">Maize Meal 10kg, Cooking Oil 2L</p>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default CustomerTracking;
