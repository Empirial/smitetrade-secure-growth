import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Activity, CreditCard, DollarSign, Server, MapPin, Clock, ShoppingCart, User } from "lucide-react";
import { useStore } from "@/context/StoreContext";

const mockTransactions = [
    { id: 1, store: "Thabo's Spaza", terminal: 882, items: 3, amount: 145, time: "Just now", customer: "Sipho Mthembu", phone: "072 345 6789", method: "Cash", address: "12 Vilakazi St, Soweto", products: ["Bread", "Milk", "Sugar"] },
    { id: 2, store: "Mama Joy's Corner", terminal: 441, items: 5, amount: 87, time: "2 min ago", customer: "Nomsa Dlamini", phone: "083 221 4455", method: "Card", address: "45 Main Rd, Alex", products: ["Rice", "Cooking Oil", "Soap", "Matches", "Candles"] },
    { id: 3, store: "Lucky's Mini Mart", terminal: 223, items: 2, amount: 52, time: "5 min ago", customer: "John Mokoena", phone: "061 998 7766", method: "Credit", address: "8 Church St, Tembisa", products: ["Airtime", "Chips"] },
    { id: 4, store: "Busi's Shop", terminal: 667, items: 4, amount: 198, time: "8 min ago", customer: "Grace Nkosi", phone: "079 112 3344", method: "Cash", address: "23 Freedom Ave, Khayelitsha", products: ["Mealie Meal", "Chicken", "Tomatoes", "Onions"] },
    { id: 5, store: "Siyanda General", terminal: 115, items: 1, amount: 35, time: "12 min ago", customer: "Mandla Zulu", phone: "084 556 7788", method: "Card", address: "7 Station Rd, Gugulethu", products: ["Cigarettes"] },
];

const AdminPOSMonitor = () => {
    const [selected, setSelected] = useState<typeof mockTransactions[0] | null>(null);
    const { stores, orders } = useStore();

    const activeTerminals = stores.length > 0 ? stores.length : "N/A";
    const recentOrders = orders.filter(o => o.status !== 'Cancelled');
    const recentOrdersCount = recentOrders.length > 0 ? recentOrders.length : "N/A";
    const recentVolume = recentOrders.length > 0
        ? `R ${recentOrders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}`
        : "N/A";

    return (
        <DashboardLayout role="admin">
            <h1 className="text-3xl font-bold tracking-tight mb-6">POS System Monitor</h1>

            <div className="grid md:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Terminals</CardTitle>
                        <Server className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeTerminals}</div>
                        <p className="text-xs text-muted-foreground">Registered stores</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{recentOrdersCount}</div>
                        <p className="text-xs text-muted-foreground">Non-cancelled orders</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Load</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">N/A</div>
                        <p className="text-xs text-muted-foreground">No telemetry source</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{recentVolume}</div>
                        <p className="text-xs text-muted-foreground">From all orders</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Live Transaction Feed</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {mockTransactions.map((tx) => (
                            <div
                                key={tx.id}
                                onClick={() => setSelected(tx)}
                                className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0 cursor-pointer rounded-md px-2 py-1 hover:bg-accent/50 transition-colors"
                            >
                                <div>
                                    <p className="font-medium text-sm">{tx.store} (Terminal #{tx.terminal})</p>
                                    <p className="text-xs text-muted-foreground">Sale • Items: {tx.items} • Customer: {tx.customer}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-sm">R {tx.amount}.00</p>
                                    <p className="text-xs text-muted-foreground">{tx.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Transaction Details</DialogTitle>
                        <DialogDescription>Terminal #{selected?.terminal} — {selected?.time}</DialogDescription>
                    </DialogHeader>
                    {selected && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-semibold text-sm">{selected.customer}</p>
                                    <p className="text-xs text-muted-foreground">{selected.phone}</p>
                                </div>
                                <Badge variant="outline" className="ml-auto">{selected.method}</Badge>
                            </div>

                            <Separator />

                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">{selected.store}</p>
                                    <p className="text-xs text-muted-foreground">{selected.address}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <ShoppingCart className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Items ({selected.items})</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {selected.products.map((p) => (
                                            <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-muted-foreground" />
                                <p className="text-sm">{selected.time}</p>
                            </div>

                            <Separator />

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total</span>
                                <span className="text-lg font-bold">R {selected.amount}.00</span>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default AdminPOSMonitor;
