import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ShoppingCart, Scan, CreditCard, RotateCcw, Receipt, Calendar, User, MapPin, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { useState } from "react";
import { Order } from "@/types";
import { toast } from "sonner";

const CashierDashboard = () => {
    const { orders } = useStore();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // Get the 5 most recent orders
    const recentOrders = orders.slice().reverse().slice(0, 5);

    const handleReprint = (e: React.MouseEvent, orderId: string) => {
        e.stopPropagation();
        toast.info(`Reprinting receipt for Order #${orderId}...`);
    };

    return (
        <DashboardLayout role="cashier">
            <div className="space-y-2 mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Welcome, Cashier</h1>
                <p className="text-muted-foreground">Ready to start your shift.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Link to="/cashier/pos">
                    <Card className="hover:border-emerald-500 transition-colors cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">New Sale</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Open POS</div>
                            <p className="text-xs text-muted-foreground">Start a new transaction</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link to="/cashier/scanner">
                    <Card className="hover:border-blue-500 transition-colors cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Quick Scan</CardTitle>
                            <Scan className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Scan Item</div>
                            <p className="text-xs text-muted-foreground">Check price or add to cart</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link to="/cashier/credit-review">
                    <Card className="hover:border-amber-500 transition-colors cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Credit Check</CardTitle>
                            <CreditCard className="h-4 w-4 text-amber-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Review Credit</div>
                            <p className="text-xs text-muted-foreground">Lookup customer SpazaScore</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            <Card className="border-slate-800 bg-slate-900 text-white">
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription className="text-slate-400">Sales processed recently.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentOrders.length === 0 ? (
                            <div className="text-center py-4 text-slate-500">No recent transactions.</div>
                        ) : (
                            recentOrders.map((order, i) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between border-b border-slate-800 pb-3 cursor-pointer hover:bg-slate-800/50 p-2 rounded transition-colors last:border-0"
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-emerald-500">
                                            <Receipt size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Receipt #{order.id.substring(0, 8)}</p>
                                            <p className="text-xs text-slate-400">{new Date(order.date).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                    <div className="font-medium text-sm text-emerald-500">R {order.total.toFixed(2)}</div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Receipt Details Dialog */}
            <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Receipt className="h-5 w-5 text-emerald-500" />
                            Receipt Details
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Full transaction record for Order #{selectedOrder?.id?.substring(0, 8)}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-6 py-4">
                            {/* Order Metadata */}
                            <div className="grid grid-cols-2 gap-4 text-sm bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Calendar className="h-4 w-4" /> Date
                                    </div>
                                    <p className="font-medium">{new Date(selectedOrder.date).toLocaleDateString()} {new Date(selectedOrder.date).toLocaleTimeString()}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <CreditCard className="h-4 w-4" /> Status
                                    </div>
                                    <p className="font-medium text-emerald-400">{selectedOrder.status}</p>
                                </div>
                                <div className="space-y-1 col-span-2 pt-2 border-t border-slate-800">
                                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                                        <User className="h-4 w-4" /> Customer
                                    </div>
                                    <p className="font-medium">{selectedOrder.customerName}</p>
                                </div>
                                {selectedOrder.customerAddress && (
                                    <div className="space-y-1 col-span-2">
                                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                                            <MapPin className="h-4 w-4" /> Delivery Address
                                        </div>
                                        <p className="text-slate-300">{selectedOrder.customerAddress}</p>
                                    </div>
                                )}
                            </div>

                            {/* Items List */}
                            <div>
                                <h4 className="font-semibold text-sm text-slate-300 mb-3 border-b border-slate-800 pb-2">Purchased Items</h4>
                                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm">
                                            <div className="flex gap-3">
                                                <span className="text-slate-400">{item.quantity}x</span>
                                                <span>{item.name}</span>
                                            </div>
                                            <span className="font-medium">R {(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Totals */}
                            <div className="border-t border-slate-800 pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-slate-400">
                                    <span>Subtotal</span>
                                    <span>R {selectedOrder.total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-800 border-dashed">
                                    <span>Total</span>
                                    <span className="text-emerald-500">R {selectedOrder.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="sm:justify-between border-t border-slate-800 pt-4">
                        <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white" onClick={() => setSelectedOrder(null)}>
                            Close
                        </Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2" onClick={(e) => selectedOrder && handleReprint(e as any, selectedOrder.id)}>
                            <Printer className="h-4 w-4" /> Print Receipt
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </DashboardLayout>
    );
};

export default CashierDashboard;
