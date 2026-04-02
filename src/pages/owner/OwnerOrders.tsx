
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/context/StoreContext";
import { useState } from "react";
import { Search, Calendar } from "lucide-react";

const OwnerOrders = () => {
    const { orders } = useStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterDate, setFilterDate] = useState("");

    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleRowClick = (order: any) => {
        setSelectedOrder(order);
        setIsDialogOpen(true);
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toString().includes(searchTerm);

        let matchesDate = true;
        if (filterDate) {
            const orderDateStr = new Date(order.date).toISOString().split("T")[0];
            matchesDate = orderDateStr === filterDate;
        }

        if (filterType === "preorder") return matchesSearch && matchesDate && (order as any).isPreorder === true;
        if (filterType === "all") return matchesSearch && matchesDate;
        const matchesType = (order as any).orderType === filterType;
        return matchesSearch && matchesDate && matchesType && !(order as any).isPreorder;
    });

    const preorderCount = orders.filter(o => (o as any).isPreorder).length;

    return (
        <DashboardLayout role="owner">
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Orders Management</h1>
                        <p className="text-muted-foreground">View and manage all in-store, online, and pre-orders.</p>
                    </div>
                    {preorderCount > 0 && (
                        <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-200 text-purple-700 rounded-lg px-4 py-2 text-sm">
                            <Calendar className="h-4 w-4" />
                            <span><strong>{preorderCount}</strong> pre-order{preorderCount !== 1 ? "s" : ""} pending</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search orders..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Input
                        type="date"
                        className="w-full md:w-[150px]"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                    />
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Orders</SelectItem>
                            <SelectItem value="preorder">Pre-orders</SelectItem>
                            <SelectItem value="instore">In-Store</SelectItem>
                            <SelectItem value="online">Online</SelectItem>
                            <SelectItem value="delivery">Delivery</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Orders: {filteredOrders.length}</CardTitle>
                        <CardDescription>Recent transactions from all channels.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No orders found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredOrders.map((order) => {
                                        const isPreorder = (order as any).isPreorder;
                                        return (
                                            <TableRow
                                                key={order.id}
                                                className="cursor-pointer hover:bg-muted/50"
                                                onClick={() => handleRowClick(order)}
                                            >
                                                <TableCell className="font-medium">#{order.id}</TableCell>
                                                <TableCell>{order.customerName}</TableCell>
                                                <TableCell>
                                                    {isPreorder ? (
                                                        <Badge className="bg-purple-500/10 text-purple-700 border border-purple-200 hover:bg-purple-500/20">
                                                            <Calendar className="h-3 w-3 mr-1" /> Pre-order
                                                        </Badge>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                                            Customer Order
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(order.date).toLocaleDateString()}{" "}
                                                    {new Date(order.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                        isPreorder
                                                            ? "bg-purple-100 text-purple-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">R {order.total.toFixed(2)}</TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Order Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="w-full max-w-[95vw] sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {(selectedOrder as any)?.isPreorder && <Calendar className="h-4 w-4 text-purple-600" />}
                            Order Details #{selectedOrder?.id}
                        </DialogTitle>
                        <DialogDescription>
                            Placed on {selectedOrder && new Date(selectedOrder.date).toLocaleString()}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-4 py-4">
                            {/* Pre-order banner */}
                            {(selectedOrder as any).isPreorder && (
                                <div className="flex items-start gap-3 bg-purple-500/10 border border-purple-200 rounded-lg p-3">
                                    <Calendar className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-purple-800">Pre-order — Paid Upfront</p>
                                        <p className="text-xs text-purple-600 mt-0.5">
                                            Customer requested: <strong>{new Date((selectedOrder as any).requestedDate + "T00:00:00").toLocaleDateString("en-ZA")}</strong>
                                        </p>
                                        <p className="text-xs text-purple-500 mt-0.5">You determine the actual delivery date.</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between border-b pb-2">
                                <span className="font-semibold text-muted-foreground">Customer:</span>
                                <span className="font-medium">{selectedOrder.customerName}</span>
                            </div>

                            {selectedOrder.paymentMethod && (
                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-semibold text-muted-foreground">Payment:</span>
                                    <span className="font-medium capitalize">{selectedOrder.paymentMethod}</span>
                                </div>
                            )}

                            <div>
                                <h4 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wider">Order Items</h4>
                                <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
                                    {selectedOrder.items?.map((item: any, i: number) => (
                                        <div key={i} className="flex justify-between text-sm items-center">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs">{item.quantity}x</span>
                                                <span>{item.name}</span>
                                            </div>
                                            <span className="font-medium">R {(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    {(!selectedOrder.items || selectedOrder.items.length === 0) && (
                                        <div className="text-sm text-muted-foreground italic">No item details available.</div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-between items-center border-t pt-4">
                                <span className="font-bold text-lg">Total</span>
                                <span className="text-xl font-bold text-emerald-600">R {selectedOrder.total.toFixed(2)}</span>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default OwnerOrders;
