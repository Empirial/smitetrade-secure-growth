
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { useState } from "react";
import { Printer, Search, FileText } from "lucide-react";
import { toast } from "sonner";

const CashierReceipts = () => {
    const { orders } = useStore();
    const [searchTerm, setSearchTerm] = useState("");

    // Mock filtering for receipts (using orders)
    const filteredReceipts = orders.filter(order =>
        order.id.toString().includes(searchTerm) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleReprint = (orderId: number) => {
        toast.info(`Reprinting receipt for Order #${orderId}...`);
    };

    return (
        <DashboardLayout role="cashier">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Receipt History</h1>
                    <p className="text-muted-foreground">Lookup past transactions and reprint receipts.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by Order ID or Customer..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
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
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">#{order.id}</TableCell>
                                            <TableCell>{new Date(order.date).toLocaleTimeString()}</TableCell>
                                            <TableCell>{order.customerName}</TableCell>
                                            <TableCell>{order.items.length} items</TableCell>
                                            <TableCell className="text-right">R {order.total.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" variant="outline" onClick={() => handleReprint(order.id)}>
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
            </div>
        </DashboardLayout>
    );
};

export default CashierReceipts;
