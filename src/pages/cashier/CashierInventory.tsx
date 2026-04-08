import { useState, useCallback, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Package, AlertTriangle, CheckCircle, ClipboardCheck, Plus, Camera, X, Layers } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useToast } from "@/hooks/use-toast";
import BarcodeScanner from "@/components/BarcodeScanner";

const CashierInventory = () => {
    const { products, addProduct, updateProduct } = useStore();
    const { toast } = useToast();

    // --- existing stock-take state ---
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [stockTakeOpen, setStockTakeOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
    const [countedStock, setCountedStock] = useState("");

    // --- product info panel state ---
    const [infoOpen, setInfoOpen] = useState(false);
    const [infoProduct, setInfoProduct] = useState<typeof products[0] | null>(null);

    // --- add product form state ---
    const [addOpen, setAddOpen] = useState(false);
    const [addForm, setAddForm] = useState({
        name: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        barcode: "",
    });
    const [addLoading, setAddLoading] = useState(false);

    // --- barcode scanner state ---
    const [scannerActive, setScannerActive] = useState(false);

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

    // ---- stock-take handlers (unchanged) ----
    const openStockTake = (product: typeof products[0], e: React.MouseEvent) => {
        e.stopPropagation();
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

    // ---- product info panel ----
    const openInfo = (product: typeof products[0]) => {
        setInfoProduct(product);
        setInfoOpen(true);
    };

    // ---- barcode scanner ----
    const handleBarcodeScanned = useCallback((barcode: string) => {
        setAddForm(prev => ({ ...prev, barcode }));
        setScannerActive(false);
        toast({ title: "Barcode scanned", description: barcode });
    }, [toast]);

    const stopScanner = useCallback(() => {
        setScannerActive(false);
    }, []);

    // stop scanner when dialog closes
    useEffect(() => {
        if (!addOpen) {
            stopScanner();
            setAddForm({ name: "", category: "", price: "", stock: "", description: "", barcode: "" });
        }
    }, [addOpen, stopScanner]);

    // ---- add product submit ----
    const handleAddProduct = async () => {
        const { name, category, price, stock, description, barcode } = addForm;
        if (!name.trim() || !category.trim() || !price || !stock || !description.trim()) {
            toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
            return;
        }
        const priceNum = parseFloat(price);
        const stockNum = parseInt(stock);
        if (isNaN(priceNum) || priceNum < 0) {
            toast({ title: "Invalid price", description: "Enter a valid positive number.", variant: "destructive" });
            return;
        }
        if (isNaN(stockNum) || stockNum < 0) {
            toast({ title: "Invalid stock", description: "Enter a valid non-negative number.", variant: "destructive" });
            return;
        }
        setAddLoading(true);
        try {
            await addProduct({
                name: name.trim(),
                category: category.trim(),
                price: priceNum,
                stock: stockNum,
                description: description.trim(),
                barcode: barcode.trim() || undefined,
            });
            toast({ title: "Product added", description: `${name} has been added to inventory.` });
            setAddOpen(false);
        } catch (err) {
            toast({ title: "Failed to add product", description: "Please try again.", variant: "destructive" });
        } finally {
            setAddLoading(false);
        }
    };

    const lowStockCount = products.filter((p) => p.status === "Low Stock" || p.status === "Critical").length;
    const outOfStockCount = products.filter((p) => p.status === "Out of Stock").length;

    return (
        <DashboardLayout role="cashier">
            <div className="flex items-center justify-between border-b border-border pb-6 mb-6">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-emerald-500/15">
                        <Layers className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Inventory & Stock Take</h1>
                        <p className="text-muted-foreground">View product levels and submit stock counts</p>
                    </div>
                </div>
                <Button onClick={() => setAddOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Add Product
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
                                    <TableRow
                                        key={product.id}
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => openInfo(product)}
                                    >
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>{product.category}</TableCell>
                                        <TableCell className="text-right">R {product.price.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">{product.stock}</TableCell>
                                        <TableCell>
                                            <Badge variant={statusColor(product.status) as any}>{product.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" variant="outline" onClick={(e) => openStockTake(product, e)}>
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

            {/* ---- Stock Take Dialog (unchanged logic) ---- */}
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

            {/* ---- Product Info Panel ---- */}
            <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{infoProduct?.name}</DialogTitle>
                        <DialogDescription>{infoProduct?.category}</DialogDescription>
                    </DialogHeader>
                    {infoProduct && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Price</p>
                                    <p className="text-lg font-semibold">R {infoProduct.price.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Stock</p>
                                    <p className="text-lg font-semibold">{infoProduct.stock} units</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Status</p>
                                <Badge variant={statusColor(infoProduct.status) as any}>{infoProduct.status}</Badge>
                            </div>
                            {infoProduct.description && (
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Description</p>
                                    <p className="text-sm">{infoProduct.description}</p>
                                </div>
                            )}
                            {infoProduct.barcode && (
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Barcode</p>
                                    <p className="text-sm font-mono">{infoProduct.barcode}</p>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setInfoOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ---- Add Product Dialog ---- */}
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogContent className="w-full max-w-[95vw] sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Add Product</DialogTitle>
                        <DialogDescription>Fill in the product details to add it to inventory.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="ap-name">Name <span className="text-destructive">*</span></Label>
                            <Input
                                id="ap-name"
                                placeholder="e.g. Coca-Cola 330ml"
                                value={addForm.name}
                                onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ap-category">Category <span className="text-destructive">*</span></Label>
                            <Input
                                id="ap-category"
                                placeholder="e.g. Beverages"
                                value={addForm.category}
                                onChange={(e) => setAddForm((p) => ({ ...p, category: e.target.value }))}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="ap-price">Price (R) <span className="text-destructive">*</span></Label>
                                <Input
                                    id="ap-price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={addForm.price}
                                    onChange={(e) => setAddForm((p) => ({ ...p, price: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ap-stock">Stock <span className="text-destructive">*</span></Label>
                                <Input
                                    id="ap-stock"
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={addForm.stock}
                                    onChange={(e) => setAddForm((p) => ({ ...p, stock: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ap-description">Description <span className="text-destructive">*</span></Label>
                            <Textarea
                                id="ap-description"
                                placeholder="Describe the product for customers..."
                                value={addForm.description}
                                onChange={(e) => setAddForm((p) => ({ ...p, description: e.target.value }))}
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ap-barcode">Barcode</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="ap-barcode"
                                    placeholder="Scan or type barcode"
                                    value={addForm.barcode}
                                    onChange={(e) => setAddForm((p) => ({ ...p, barcode: e.target.value }))}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={scannerActive ? stopScanner : () => setScannerActive(true)}
                                    title={scannerActive ? "Stop scanner" : "Scan barcode"}
                                >
                                    {scannerActive ? <X className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                        {scannerActive && (
                            <div className="space-y-2">
                                <BarcodeScanner isActive={scannerActive} onScan={handleBarcodeScanned} />
                                <p className="text-center text-xs text-muted-foreground">Align barcode within the frame — it detects automatically.</p>
                            </div>
                        )}
                    </div>
                    <DialogFooter className="mt-2">
                        <Button variant="outline" onClick={() => setAddOpen(false)} disabled={addLoading}>Cancel</Button>
                        <Button onClick={handleAddProduct} disabled={addLoading}>
                            {addLoading ? "Adding…" : "Add Product"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default CashierInventory;
