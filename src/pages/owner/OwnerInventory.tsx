import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, Package, ScanLine, Camera, RotateCcw } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useStore } from "@/context/StoreContext";
import { useToast } from "@/hooks/use-toast";
import Webcam from "react-webcam";
import { BrowserMultiFormatReader } from "@zxing/library";

const OwnerInventory = () => {
    const { products, addProduct, deleteProduct, updateProduct } = useStore();
    const { toast } = useToast();

    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", category: "", price: "", stock: "", barcode: "" });

    // Scanner state
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const webcamRef = useRef<Webcam>(null);
    const codeReader = useRef(new BrowserMultiFormatReader());
    const lastScannedTime = useRef<number>(0);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

    const handleBarcodeDetected = useCallback((barcode: string) => {
        // Look up existing product by barcode
        const found = products.find(p => p.barcode === barcode);
        if (found) {
            setFormData({
                name: found.name,
                category: found.category,
                price: found.price.toString(),
                stock: found.stock.toString(),
                barcode: found.barcode || barcode
            });
            setIsScannerOpen(false);
            toast({ title: "Product Found", description: `Auto-filled details for "${found.name}"` });
        } else {
            setFormData(prev => ({ ...prev, barcode }));
            setIsScannerOpen(false);
            toast({ title: "Barcode Scanned", description: `No matching product found. Barcode: ${barcode}` });
        }
    }, [toast, products]);

    const scanForBarcode = useCallback(() => {
        if (!isScannerOpen) return;
        if (webcamRef.current && webcamRef.current.video) {
            const video = webcamRef.current.video;
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                codeReader.current.decodeFromVideoElement(video).then(result => {
                    if (result) {
                        const text = result.getText();
                        const now = Date.now();
                        if (now - lastScannedTime.current > 3000) {
                            lastScannedTime.current = now;
                            handleBarcodeDetected(text);
                        }
                    }
                }).catch(() => {
                    // Ignore NotFoundException
                });
            }
        }
    }, [handleBarcodeDetected, isScannerOpen]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isScannerOpen) {
            interval = setInterval(scanForBarcode, 500);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [scanForBarcode, isScannerOpen]);

    const toggleCamera = () => {
        setFacingMode(prev => (prev === "user" ? "environment" : "user"));
    };

    const handleCameraError = () => {
        setCameraError("Unable to access camera. Please check permissions.");
    };

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
                barcode: formData.barcode
            });
        } else {
            addProduct({
                name: formData.name,
                category: formData.category,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                barcode: formData.barcode,
                image: "📦"
            });
        }
        setIsAddOpen(false);
        setEditId(null);
        setFormData({ name: "", category: "", price: "", stock: "", barcode: "" });
    };

    const openEditForm = (product: any) => {
        setEditId(product.id);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price.toString(),
            stock: product.stock.toString(),
            barcode: product.barcode || ""
        });
        setIsAddOpen(true);
    };

    const handleOpenChange = (open: boolean) => {
        setIsAddOpen(open);
        if (!open) {
            setEditId(null);
            setFormData({ name: "", category: "", price: "", stock: "", barcode: "" });
        }
    };

    return (
        <DashboardLayout role="owner">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
                        <p className="text-muted-foreground">Manage your products, stock levels, and pricing.</p>
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
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">Name</Label>
                                        <Input
                                            id="name"
                                            className="col-span-3"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="category" className="text-right">Category</Label>
                                        <div className="col-span-3">
                                            <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                                                <SelectTrigger>
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
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="price" className="text-right">Price (R)</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            className="col-span-3"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="stock" className="text-right">Stock</Label>
                                        <Input
                                            id="stock"
                                            type="number"
                                            className="col-span-3"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        />
                                    </div>
                                    {/* Barcode field with scan button */}
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="barcode" className="text-right">Barcode</Label>
                                        <div className="col-span-3 flex gap-2">
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
                        <div className="aspect-video bg-black rounded-lg relative overflow-hidden flex items-center justify-center">
                            {cameraError ? (
                                <div className="flex flex-col items-center p-4 text-center">
                                    <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="text-white text-sm">{cameraError}</p>
                                    <Button variant="outline" size="sm" className="mt-2" onClick={() => setCameraError(null)}>Retry</Button>
                                </div>
                            ) : (
                                <>
                                    <Webcam
                                        ref={webcamRef}
                                        audio={false}
                                        screenshotFormat="image/jpeg"
                                        videoConstraints={{ width: 640, height: 480, facingMode }}
                                        onUserMediaError={handleCameraError}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 border-2 border-primary/50 rounded-lg z-10 animate-pulse m-8 pointer-events-none"></div>
                                    <div className="absolute bottom-2 left-2 text-white text-xs bg-black/60 px-2 py-1 rounded backdrop-blur-sm">Scanning...</div>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        onClick={toggleCamera}
                                        className="absolute bottom-2 right-2 h-8 w-8 bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm"
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                        </div>
                        <p className="text-center text-xs text-muted-foreground">
                            Align barcode within frame to auto-detect. Supports EAN-13, UPC, Code 128, QR codes.
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
