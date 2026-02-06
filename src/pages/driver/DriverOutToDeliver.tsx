import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Phone, CheckCircle, Navigation, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { useState } from "react";

const DriverOutToDeliver = () => {
    const navigate = useNavigate();
    const { orders, updateOrderStatus, user } = useStore();
    const [progress, setProgress] = useState(33);

    // Find the active order for this driver
    // In a real app, we'd query by driverId and status 'Out for Delivery'
    const currentOrder = orders.find(o => o.driverId === user?.id && o.status === "Out for Delivery");

    const handleComplete = () => {
        if (currentOrder) {
            updateOrderStatus(currentOrder.id, "Delivered");
            navigate("/driver/delivered");
        }
    };

    if (!currentOrder) {
        return (
            <DashboardLayout role="driver">
                <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                    <Navigation className="h-16 w-16 text-muted-foreground opacity-20" />
                    <h2 className="text-2xl font-bold">No Active Delivery</h2>
                    <p className="text-muted-foreground">You don't have an order currently out for delivery.</p>
                    <Link to="/driver/orders">
                        <Button>Go to Orders</Button>
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="driver">
            <div className="flex flex-col gap-6 max-w-md mx-auto">
                <div className="space-y-2 text-center">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
                        IN PROGRESS
                    </Badge>
                    <h1 className="text-3xl font-bold tracking-tight">Out for Delivery</h1>
                    <p className="text-muted-foreground">Head to the customer's location.</p>
                </div>

                <Card className="border-blue-200 shadow-lg">
                    <CardHeader className="bg-muted/50 pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-xl">{currentOrder.customerName}</CardTitle>
                                <div className="flex items-center text-muted-foreground text-sm mt-1">
                                    <Phone className="h-3 w-3 mr-1" /> +27 82 123 4567
                                </div>
                            </div>
                            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border shadow-sm">
                                <Navigation className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="mt-1">
                                <div className="h-2 w-2 bg-blue-500 rounded-full" />
                                <div className="w-0.5 h-12 bg-border mx-auto my-1" />
                                <div className="h-2 w-2 bg-foreground rounded-full" />
                            </div>
                            <div className="space-y-8 flex-1">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-semibold">Pickup</p>
                                    <p className="font-medium">My Spaza Shop</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-semibold">Dropoff</p>
                                    <p className="font-medium text-lg">{currentOrder.customerAddress}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Delivery Progress</span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>

                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex gap-3 text-sm text-yellow-800">
                            <ShieldCheck className="h-5 w-5 shrink-0" />
                            <p>Verify customer ID/PIN code "1029" upon delivery.</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-3 pt-2">
                        <Button className="w-full h-12 text-lg bg-emerald-600 hover:bg-emerald-700" onClick={handleComplete}>
                            <CheckCircle className="mr-2 h-5 w-5" /> Mark Delivered
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => window.open(`https://maps.google.com/?q=${currentOrder.customerAddress}`)}>
                            <MapPin className="mr-2 h-4 w-4" /> Open Maps
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default DriverOutToDeliver;
