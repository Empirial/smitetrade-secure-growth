import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, Package, ScanLine, Layers } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useCallback } from "react";
import { useStore } from "@/context/StoreContext";
import { useToast } from "@/hooks/use-toast";
import BarcodeScanner from "@/components/BarcodeScanner";

const OwnerInventory = () => {
    const { products, addProduct, deleteProduct, updateProduct } = useStore();
    const { toast } = useToast();

    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", category: "", price: "", stock: "", barcode: "", fulfillmentOptions: [] as string[] });

    const FULFILLMENT_OPTIONS = [
        { value: 'pep_courier', label: 'Pep Courier' },
        { value: 'courier', label: 'Courier (Standard)' },
        { value: 'instore_delivery', label: 'In-Store Delivery' },
        { value: 'pickup', label: 'Pickup Only' },
    ];

    const toggleFulfillment = (value: string) => {
        setFormData(prev => ({
            ...prev,
            fulfillmentOptions: prev.fulfillmentOptions.includes(value)
                ? prev.fulfillmentOptions.filter(v => v !== value)
                : [...prev.fulfillmentOptions, value]
        }));
    };

    // Scanner state
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    const handleBarcodeDetected = useCallback((barcode: string, productName?: string) => {
        const found = products.find(p => p.barcode === barcode);
        if (found) {
            setFormData({
                name: found.name,
                category: found.category,
                price: found.price.toString(),
                stock: found.stock.toString(),
                barcode: found.barcode || barcode,
                fulfillmentOptions: found.fulfillmentOptions || []
            });
            setIsScannerOpen(false);
            toast({ title: "Product Found", description: `Auto-filled details for "${found.name}"` });
        } else {
            setFormData(prev => ({ ...prev, barcode, name: productName || prev.name }));
            setIsScannerOpen(false);
            toast({
                title: "Barcode Scanned",
                description: productName ? `Product name pre-filled from Open Food Facts: "${productName}"` : `No matching product. Barcode: ${barcode}`,
            });
        }
    }, [toast, products]);

    const uniqueCategories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === "All" || p.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "In Stock": return "bg-green-500/10 text-green-400";
            case "Low Stock": return "bg-yellow-500/10 text-yellow-400";
            case "Critical": return "bg-orange-500/10 text-orange-400";
            case "Out of Stock": return "bg-red-500/10 text-red-400";
            default: return "bg-muted text-muted-foreground";
        }
    };

    const handleAddProduct = () => {
        if (editId) {
            updateProduct(editId, {
                name: formData.name,
                category: formData.category,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                barcode: formData.barcode,
                fulfillmentOptions: formData.fulfillmentOptions as any
            });
        } else {
            addProduct({
                name: formData.name,
                category: formData.category,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                barcode: formData.barcode,
                image: "📦",
                fulfillmentOptions: formData.fulfillmentOptions as any
            });
        }
        setIsAddOpen(false);
        setEditId(null);
        setFormData({ name: "", category: "", price: "", stock: "", barcode: "", fulfillmentOptions: [] });
    };

    const openEditForm = (product: any) => {
        setEditId(product.id);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price.toString(),
            stock: product.stock.toString(),
            barcode: product.barcode || "",
            fulfillmentOptions: product.fulfillmentOptions || []
        });
        setIsAddOpen(true);
    };

    const handleOpenChange = (open: boolean) => {
        setIsAddOpen(open);
        if (!open) {
            setEditId(null);
            setFormData({ name: "", category: "", price: "", stock: "", barcode: "", fulfillmentOptions: [] });
        }
    };

    return (
        <DashboardLayout role="owner">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-border pb-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-emerald-500/15">
                            <Layers className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Inventory</h1>
                            <p className="text-muted-foreground">Manage your products, stock levels, and pricing.</p>
                        </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Dialog open={isAddOpen} onOpenChange={handleOpenChange}>
                            <DialogTrigger asChild>
                                <Button className="w-full md:w-auto">
                                    <Plus className="h-4 w-4 mr-2" /> Add Product
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{editId ? "Edit Product" : "Add New Product"}</DialogTitle>
                                    <DialogDescription>
                                        {editId ? "Update the details for this inventory item." : "Enter the details of the new item to add to your shop's inventory."}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="e.g. Coca-Cola 330ml"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                                            <SelectTrigger id="category">
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Bakery">Bakery</SelectItem>
                                                <SelectItem value="Beverages">Beverages</SelectItem>
                                                <SelectItem value="Dairy">Dairy</SelectItem>
                                                <SelectItem value="Pantry">Pantry</SelectItem>
                                                <SelectItem value="Snacks">Snacks</SelectItem>
                                                <SelectItem value="Staples">Staples</SelectItem>
                                                <SelectItem value="Services">Services</SelectItem>
                                                <SelectItem value="Custom">Custom</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="price">Price (R)</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                placeholder="0.00"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="stock">Stock</Label>
                                            <Input
                                                id="stock"
                                                type="number"
                                                placeholder="0"
                                                value={formData.stock}
                                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="barcode">Barcode</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="barcode"
                                                className="flex-1"
                                                placeholder="Scan or enter barcode"
                                                value={formData.barcode}
                                                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => setIsScannerOpen(true)}
                                            >
                                                <ScanLine className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Fulfillment Options</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {FULFILLMENT_OPTIONS.map(opt => (
                                                <div key={opt.value} className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={`fulfillment-${opt.value}`}
                                                        checked={formData.fulfillmentOptions.includes(opt.value)}
                                                        onCheckedChange={() => toggleFulfillment(opt.value)}
                                                    />
                                                    <Label htmlFor={`fulfillment-${opt.value}`} className="font-normal text-sm cursor-pointer">
                                                        {opt.label}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleAddProduct}>Save Product</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Barcode Scanner Dialog */}
                <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Scan Barcode</DialogTitle>
                            <DialogDescription>Point the camera at a barcode to auto-detect it.</DialogDescription>
                        </DialogHeader>
                        <BarcodeScanner isActive={isScannerOpen} onScan={handleBarcodeDetected} />
                        <p className="text-center text-xs text-muted-foreground">
                            Align barcode within the frame — detects automatically. Supports EAN-13, UPC, Code 128, QR.
                        </p>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsScannerOpen(false)}>Cancel</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Current Stock</CardTitle>
                                <CardDescription>Overview of all items currently in your shop.</CardDescription>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <Select value={filterCategory} onValueChange={setFilterCategory}>
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Categories</SelectItem>
                                        {uniqueCategories.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search products..."
                                        className="pl-8"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Mobile View: Cards */}
                        <div className="md:hidden grid gap-4">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="border rounded-lg p-4 space-y-3 bg-card shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-lg">
                                                {product.image}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{product.name}</h3>
                                                <p className="text-xs text-muted-foreground">{product.category}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className={getStatusColor(product.status)}>
                                            {product.status}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex flex-col">
                                            <span className="text-muted-foreground text-xs">Price</span>
                                            <span className="font-medium">R {product.price.toFixed(2)}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-muted-foreground text-xs">Stock</span>
                                            <span className="font-medium">{product.stock} units</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditForm(product)}>
                                            <Edit className="h-3 w-3 mr-2" /> Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => deleteProduct(product.id)}
                                        >
                                            <Trash2 className="h-3 w-3 mr-2" /> Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop View: Table */}
                        <div className="hidden md:block">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product Name</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Stock Level</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProducts.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium flex items-center gap-2">
                                                <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                                                    <Package className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                                {product.name}
                                            </TableCell>
                                            <TableCell>{product.category}</TableCell>
                                            <TableCell>R {product.price.toFixed(2)}</TableCell>
                                            <TableCell>{product.stock}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={getStatusColor(product.status)}>
                                                    {product.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditForm(product)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive"
                                                        onClick={() => deleteProduct(product.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default OwnerInventory;
