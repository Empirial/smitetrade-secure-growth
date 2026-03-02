
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { useState } from "react";
import { Printer, Search, FileText, Receipt, User, MapPin, Calendar, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { Order } from "@/types";

const CashierReceipts = () => {
    const { orders } = useStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // Mock filtering for receipts (using orders)
    const filteredReceipts = orders.filter(order => {
        const matchesSearch = order.id.toString().includes(searchTerm) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase());

        if (!dateFilter) return matchesSearch;

        // Match just the "YYYY-MM-DD" part of the order date string
        const orderDateStr = order.date.split('T')[0];
        return matchesSearch && orderDateStr === dateFilter;
    });

    const handleReprint = (e: React.MouseEvent, orderId: string) => {
        e.stopPropagation();
        toast.info(`Reprinting receipt for Order #${orderId}...`);
    };

    return (
        <DashboardLayout role="cashier">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Receipt History</h1>
                    <p className="text-muted-foreground">Lookup past transactions and reprint receipts.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="relative w-full sm:max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by Order ID or Customer..."
                            className="pl-8 bg-slate-900 border-slate-800 text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="w-full sm:w-auto">
                        <Input
                            type="date"
                            className="bg-slate-900 border-slate-800 text-white cursor-pointer w-full sm:w-[200px]"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        />
                    </div>
                    {(searchTerm || dateFilter) && (
                        <Button
                            variant="ghost"
                            className="text-slate-400 hover:text-white"
                            onClick={() => { setSearchTerm(""); setDateFilter(""); }}
                        >
                            Clear Filters
                        </Button>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Transaction Log
                        </CardTitle>
                        <CardDescription>Most recent completed sales.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Receipt #</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredReceipts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No receipts found matching "{searchTerm}".
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredReceipts.slice().reverse().map((order) => (
                                        <TableRow
                                            key={order.id}
                                            className="cursor-pointer hover:bg-slate-800/50 transition-colors"
                                            onClick={() => setSelectedOrder(order)}
                                        >
                                            <TableCell className="font-medium">#{order.id.substring(0, 8)}...</TableCell>
                                            <TableCell>{new Date(order.date).toLocaleTimeString()}</TableCell>
                                            <TableCell>{order.customerName}</TableCell>
                                            <TableCell>{order.items.length} items</TableCell>
                                            <TableCell className="text-right">R {order.total.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" variant="outline" onClick={(e) => handleReprint(e, order.id)}>
                                                    <Printer className="h-4 w-4 mr-2" />
                                                    Reprint
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
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
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: hsl(var(--border) / 0.3);
                    border-radius: 10px;
                }
            `}</style>
        </DashboardLayout>
    );
};

export default CashierReceipts;
