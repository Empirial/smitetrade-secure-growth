import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Activity, CreditCard, DollarSign, Server, MapPin, Clock, ShoppingCart, User } from "lucide-react";
import { useStore } from "@/context/StoreContext";

const AdminPOSMonitor = () => {
    const { stores, orders } = useStore();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const recentOrders = orders
        .filter(o => o.status !== 'Cancelled')
        .slice()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 20);

    const selected = recentOrders.find(o => o.id === selectedId) ?? null;

    const totalVolume = recentOrders.reduce((sum, o) => sum + o.total, 0);

    return (
        <DashboardLayout role="admin">
            <h1 className="text-3xl font-bold tracking-tight mb-6">POS System Monitor</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Terminals</CardTitle>
                        <Server className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stores.length || "—"}</div>
                        <p className="text-xs text-muted-foreground">Registered stores</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{recentOrders.length || "—"}</div>
                        <p className="text-xs text-muted-foreground">Non-cancelled orders</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Load</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">—</div>
                        <p className="text-xs text-muted-foreground">No telemetry source</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalVolume > 0 ? `R ${totalVolume.toLocaleString()}` : "—"}</div>
                        <p className="text-xs text-muted-foreground">From all orders</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Live Transaction Feed</CardTitle>
                </CardHeader>
                <CardContent>
                    {recentOrders.length === 0 ? (
                        <p className="text-center py-8 text-muted-foreground">No orders yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    onClick={() => setSelectedId(order.id)}
                                    className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0 cursor-pointer rounded-md px-2 py-1 hover:bg-accent/50 transition-colors"
                                >
                                    <div>
                                        <p className="font-medium text-sm">{order.customerName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {order.items.length} item(s) · {order.status}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm">R {order.total.toLocaleString()}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={!!selected} onOpenChange={(open) => !open && setSelectedId(null)}>
                <DialogContent className="w-full max-w-[95vw] sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                        <DialogDescription>
                            Order #{selected?.id.slice(-6).toUpperCase()} · {selected ? new Date(selected.date).toLocaleString() : ""}
                        </DialogDescription>
                    </DialogHeader>
                    {selected && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-semibold text-sm">{selected.customerName}</p>
                                </div>
                                <Badge variant="outline" className="ml-auto">{selected.status}</Badge>
                            </div>

                            <Separator />

                            <div className="flex items-start gap-3">
                                <ShoppingCart className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Items ({selected.items.length})</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {selected.items.map((item, i) => (
                                            <Badge key={i} variant="secondary" className="text-xs">
                                                {item.name} ×{item.quantity}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {selected.deliveryAddress && (
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <p className="text-sm">{selected.deliveryAddress}</p>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-muted-foreground" />
                                <p className="text-sm">{new Date(selected.date).toLocaleString()}</p>
                            </div>

                            <Separator />

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total</span>
                                <span className="text-lg font-bold">R {selected.total.toLocaleString()}</span>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default AdminPOSMonitor;
