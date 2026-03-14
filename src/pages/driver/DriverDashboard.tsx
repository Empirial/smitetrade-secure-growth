import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, CheckCircle2, Truck, Wallet, ArrowRight, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "@/context/StoreContext";

const DELIVERY_FEE = 25;

const DriverDashboard = () => {
    const { orders, user } = useStore();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const myOrders = orders.filter(o => o.driverId === user?.id);
    const todayOrders = myOrders.filter(o => new Date(o.date) >= today);

    const completedToday = todayOrders.filter(o => o.status === 'Delivered').length;
    const activeDelivery = myOrders.find(o => o.status === 'Out for Delivery');
    const availableOrders = orders.filter(o => o.status === 'Ready').length;

    const todayEarnings = completedToday * DELIVERY_FEE;

    return (
        <DashboardLayout role="driver">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Hey, {user?.name?.split(' ')[0] || 'Driver'} 👋
                    </h1>
                    <p className="text-muted-foreground">Here's your overview for today.</p>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="bg-emerald-600 text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-emerald-100">Today's Earnings</CardTitle>
                            <Wallet className="h-4 w-4 text-emerald-200" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">R {todayEarnings.toFixed(2)}</div>
                            <p className="text-xs text-emerald-200 mt-1">R{DELIVERY_FEE} per delivery</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Delivered Today</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{completedToday}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {completedToday === 0 ? 'No deliveries yet' : completedToday === 1 ? '1 order completed' : `${completedToday} orders completed`}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Available Orders</CardTitle>
                            <Package className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{availableOrders}</div>
                            <p className="text-xs text-muted-foreground mt-1">Ready for pickup</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Active Delivery Card */}
                {activeDelivery ? (
                    <Card className="border-emerald-500 border-2">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <CardTitle className="text-base">Active Delivery</CardTitle>
                                </div>
                                <Badge className="bg-emerald-600">Out for Delivery</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-medium">{activeDelivery.customerName}</p>
                                    <p className="text-muted-foreground">{activeDelivery.customerAddress}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Package className="h-4 w-4" />
                                <span>{activeDelivery.items.length} item{activeDelivery.items.length !== 1 ? 's' : ''} • R{activeDelivery.total.toFixed(2)}</span>
                            </div>
                            <Link to={`/driver/route/${activeDelivery.id}`} className="block">
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                                    Continue Delivery <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-10 text-center gap-3">
                            <Truck className="h-10 w-10 text-muted-foreground opacity-40" />
                            <div>
                                <p className="font-medium">No active delivery</p>
                                <p className="text-sm text-muted-foreground">Accept an order to start earning</p>
                            </div>
                            <Link to="/driver/orders">
                                <Button className="mt-2">
                                    View Available Orders <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <Link to="/driver/orders">
                        <Card className="cursor-pointer hover:border-emerald-500 transition-all border-2 border-transparent h-full">
                            <CardHeader className="flex flex-row items-center gap-3 pb-2">
                                <div className="bg-blue-100 p-2.5 rounded-lg">
                                    <Package className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-sm">Pick Up Orders</CardTitle>
                                    <CardDescription className="text-xs">{availableOrders} waiting</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link to="/driver/wallet">
                        <Card className="cursor-pointer hover:border-emerald-500 transition-all border-2 border-transparent h-full">
                            <CardHeader className="flex flex-row items-center gap-3 pb-2">
                                <div className="bg-emerald-100 p-2.5 rounded-lg">
                                    <Wallet className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-sm">My Wallet</CardTitle>
                                    <CardDescription className="text-xs">Earnings & payouts</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link to="/driver/delivered">
                        <Card className="cursor-pointer hover:border-emerald-500 transition-all border-2 border-transparent h-full">
                            <CardHeader className="flex flex-row items-center gap-3 pb-2">
                                <div className="bg-slate-100 p-2.5 rounded-lg">
                                    <CheckCircle2 className="h-5 w-5 text-slate-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-sm">Delivered</CardTitle>
                                    <CardDescription className="text-xs">Delivery history</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link to="/driver/issues">
                        <Card className="cursor-pointer hover:border-emerald-500 transition-all border-2 border-transparent h-full">
                            <CardHeader className="flex flex-row items-center gap-3 pb-2">
                                <div className="bg-amber-100 p-2.5 rounded-lg">
                                    <Clock className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-sm">Report Issue</CardTitle>
                                    <CardDescription className="text-xs">Log a delivery problem</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DriverDashboard;
