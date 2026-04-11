import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardList, Plus, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useStore } from "@/context/StoreContext";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { addDoc, collection, onSnapshot, query, where, orderBy, serverTimestamp } from "firebase/firestore";

interface StockAdjustment {
    id: string;
    productId: string;
    productName: string;
    qty: number;
    reason: string;
    cost: number;
    loggedBy: string;
    createdAt: any;
}

const OwnerStockAdjustment = () => {
    const { products, user, updateProduct } = useStore();
    const [adjustments, setAdjustments] = useState<StockAdjustment[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newAdj, setNewAdj] = useState({ productId: "", qty: "", reason: "Damaged" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!user?.storeId) return;
        const q = query(
            collection(db, "stock_adjustments"),
            where("storeId", "==", user.storeId),
            orderBy("createdAt", "desc")
        );
        return onSnapshot(q, (snap) => {
            setAdjustments(snap.docs.map(d => ({ id: d.id, ...d.data() })) as StockAdjustment[]);
        });
    }, [user?.storeId]);

    const handleAddAdjustment = async () => {
        if (!newAdj.productId) { toast.error("Please select a product."); return; }
        const qty = parseInt(newAdj.qty);
        if (!newAdj.qty || isNaN(qty) || qty <= 0) { toast.error("Please enter a valid quantity."); return; }
        const product = products.find(p => p.id === newAdj.productId);
        if (!product) return;
        if ((product.quantity ?? 0) < qty) {
            toast.error(`Only ${product.quantity ?? 0} units in stock.`);
            return;
        }
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "stock_adjustments"), {
                storeId: user?.storeId || "unknown",
                productId: product.id,
                productName: product.name,
                qty: -qty,
                reason: newAdj.reason,
                cost: product.price * qty,
                loggedBy: user?.name || "Owner",
                createdAt: serverTimestamp(),
            });
            await updateProduct(product.id, { quantity: (product.quantity ?? 0) - qty });
            toast.success(`Stock adjustment logged: -${qty} ${product.name}`);
            setIsAddOpen(false);
            setNewAdj({ productId: "", qty: "", reason: "Damaged" });
        } catch {
            toast.error("Failed to save adjustment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (ts: any) => {
        if (!ts) return "—";
        const d = ts?.toDate ? ts.toDate() : new Date(ts);
        return d.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
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
                                                <SelectItem key={p.id} value={p.id}>
                                                    {p.name} ({p.quantity ?? 0} in stock)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Quantity Lost</Label>
                                        <Input type="number" value={newAdj.qty} onChange={(e) => setNewAdj({ ...newAdj, qty: e.target.value })} min="1" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Reason</Label>
                                        <Select value={newAdj.reason} onValueChange={(v) => setNewAdj({ ...newAdj, reason: v })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
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
                                <Button onClick={handleAddAdjustment} variant="destructive" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : "Deduct Stock"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search records..."
                        className="pl-8 max-w-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
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
                                {adjustments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No adjustments logged yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    adjustments
                                        .filter(a => a.productName?.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map((adj) => (
                                            <TableRow key={adj.id}>
                                                <TableCell>{formatDate(adj.createdAt)}</TableCell>
                                                <TableCell className="font-medium">{adj.productName}</TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        {adj.reason}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-red-600 font-bold">{adj.qty}</TableCell>
                                                <TableCell>R {adj.cost?.toFixed(2)}</TableCell>
                                                <TableCell>{adj.loggedBy}</TableCell>
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

export default OwnerStockAdjustment;
