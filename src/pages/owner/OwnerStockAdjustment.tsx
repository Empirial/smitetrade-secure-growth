import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardList, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useStore } from "@/context/StoreContext";

const mockAdjustments = [
    { id: 1, date: "2026-02-26", product: "Albany Brown Bread", qty: -2, reason: "Expired", cost: 36.00, user: "Thabo (Owner)" },
    { id: 2, date: "2026-02-25", product: "Coke 2L", qty: -1, reason: "Damaged in store", cost: 24.50, user: "Lerato (Cashier)" },
];

const OwnerStockAdjustment = () => {
    const { products } = useStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newAdj, setNewAdj] = useState({ productId: "", qty: "", reason: "Damaged" });

    // Mock functionality for the UI
    const handleAddAdjustment = () => {
        setIsAddOpen(false);
        setNewAdj({ productId: "", qty: "", reason: "Damaged" });
    };

    return (
        <DashboardLayout role="owner">
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Stock Adjustments (Wastage)</h1>
                        <p className="text-muted-foreground">Log shrink, breakages, and expirations.</p>
                    </div>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Log Adjustment
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Record Stock Loss</DialogTitle>
                                <DialogDescription>Adjust inventory for items not sold through the POS.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label>Product</Label>
                                    <Select value={newAdj.productId} onValueChange={(v) => setNewAdj({ ...newAdj, productId: v })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {products.map(p => (
                                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Quantity Lost</Label>
                                        <Input type="number" value={newAdj.qty} onChange={(e) => setNewAdj({ ...newAdj, qty: e.target.value })} min="1" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Reason</Label>
                                        <Select value={newAdj.reason} onValueChange={(v) => setNewAdj({ ...newAdj, reason: v })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Damaged">Damaged</SelectItem>
                                                <SelectItem value="Expired">Expired</SelectItem>
                                                <SelectItem value="Theft">Theft/Shrinkage</SelectItem>
                                                <SelectItem value="Store Use">Store Use</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddAdjustment} variant="destructive">Deduct Stock</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search records..."
                            className="pl-8 max-w-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ClipboardList className="h-5 w-5" /> Adjustment Log
                        </CardTitle>
                        <CardDescription>Recent deductions from inventory.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Qty</TableHead>
                                    <TableHead>Lost Value</TableHead>
                                    <TableHead>Logged By</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockAdjustments.map((adj) => (
                                    <TableRow key={adj.id}>
                                        <TableCell>{adj.date}</TableCell>
                                        <TableCell className="font-medium">{adj.product}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                {adj.reason}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-red-600 font-bold">{adj.qty}</TableCell>
                                        <TableCell>R {adj.cost.toFixed(2)}</TableCell>
                                        <TableCell>{adj.user}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default OwnerStockAdjustment;
