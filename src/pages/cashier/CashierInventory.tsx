import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Package, AlertTriangle, CheckCircle, ClipboardCheck } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useToast } from "@/hooks/use-toast";

const CashierInventory = () => {
    const { products, updateProduct } = useStore();
    const { toast } = useToast();

    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [stockTakeOpen, setStockTakeOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
    const [countedStock, setCountedStock] = useState("");

    const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

    const filtered = products.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.barcode?.includes(searchTerm);
        const matchCategory = filterCategory === "All" || p.category === filterCategory;
        return matchSearch && matchCategory;
    });

    const statusColor = (status: string) => {
        switch (status) {
            case "In Stock": return "default";
            case "Low Stock": return "secondary";
            case "Critical": return "destructive";
            case "Out of Stock": return "outline";
            default: return "default";
        }
    };

    const openStockTake = (product: typeof products[0]) => {
        setSelectedProduct(product);
        setCountedStock(product.stock.toString());
        setStockTakeOpen(true);
    };

    const submitStockTake = () => {
        if (!selectedProduct) return;
        const counted = parseInt(countedStock);
        if (isNaN(counted) || counted < 0) {
            toast({ title: "Invalid count", description: "Please enter a valid number.", variant: "destructive" });
            return;
        }

        const newStatus = counted === 0 ? "Out of Stock" : counted <= 5 ? "Critical" : counted <= 15 ? "Low Stock" : "In Stock";

        updateProduct(selectedProduct.id, { stock: counted, status: newStatus as any });

        const diff = counted - selectedProduct.stock;
        toast({
            title: "Stock Updated",
            description: `${selectedProduct.name}: ${selectedProduct.stock} → ${counted} (${diff >= 0 ? "+" : ""}${diff})`,
        });

        setStockTakeOpen(false);
        setSelectedProduct(null);
    };

    const lowStockCount = products.filter((p) => p.status === "Low Stock" || p.status === "Critical").length;
    const outOfStockCount = products.filter((p) => p.status === "Out of Stock").length;

    return (
        <DashboardLayout role="cashier">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Inventory & Stock Take</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{products.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Stock</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{products.filter((p) => p.status === "In Stock").length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Low / Critical</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{lowStockCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{outOfStockCount}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Product List</CardTitle>
                    <div className="flex flex-col sm:flex-row gap-2 mt-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search by name or barcode..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
                        </div>
                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger className="w-full sm:w-[160px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((c) => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Stock</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>{product.category}</TableCell>
                                        <TableCell className="text-right">R {product.price.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">{product.stock}</TableCell>
                                        <TableCell>
                                            <Badge variant={statusColor(product.status) as any}>{product.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" variant="outline" onClick={() => openStockTake(product)}>
                                                <ClipboardCheck className="h-4 w-4 mr-1" /> Count
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filtered.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No products found</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={stockTakeOpen} onOpenChange={setStockTakeOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Stock Take — {selectedProduct?.name}</DialogTitle>
                        <DialogDescription>Enter the counted stock quantity for this product.</DialogDescription>
                    </DialogHeader>
                    {selectedProduct && (
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Current system stock:</span>
                                <span className="font-semibold">{selectedProduct.stock}</span>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="counted">Counted Quantity</Label>
                                <Input id="counted" type="number" min="0" value={countedStock} onChange={(e) => setCountedStock(e.target.value)} />
                            </div>
                            {countedStock && parseInt(countedStock) !== selectedProduct.stock && (
                                <div className={`text-sm font-medium ${parseInt(countedStock) < selectedProduct.stock ? "text-destructive" : "text-green-600"}`}>
                                    Difference: {parseInt(countedStock) - selectedProduct.stock >= 0 ? "+" : ""}{parseInt(countedStock) - selectedProduct.stock}
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setStockTakeOpen(false)}>Cancel</Button>
                        <Button onClick={submitStockTake}>Submit Count</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default CashierInventory;
