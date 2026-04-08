import { useState, useRef, useCallback } from "react";
import { Camera, Trash2, FileDown, X, Scan, Search, ArrowRight, Package } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import DownloadDialog from "@/components/DownloadDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { imagesToPDF, downloadPDF } from "@/utils/pdfUtils";
import { toast } from "sonner";
import { useStore } from "@/context/StoreContext";
import { Product } from "@/types";
import BarcodeScanner from "@/components/BarcodeScanner";

const CashierScanner = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [captures, setCaptures] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showDownloadDialog, setShowDownloadDialog] = useState(false);
    const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
    const [barcodeInput, setBarcodeInput] = useState("");
    const [matchedProduct, setMatchedProduct] = useState<Product | null>(null);
    const [barcodeNotFound, setBarcodeNotFound] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newProductForm, setNewProductForm] = useState({ name: "", price: "", category: "", stock: "1" });
    const [addingToInventory, setAddingToInventory] = useState(false);

    const { products, addToCart, addProduct, updateProduct } = useStore();

    const handleBarcodeLookup = useCallback((barcode: string) => {
        const found = products.find(p => p.barcode === barcode || p.id === barcode);
        if (found) {
            setMatchedProduct(found);
            setBarcodeNotFound(false);
            setShowAddForm(false);
            toast.success(`Found: ${found.name}`);
        } else {
            setMatchedProduct(null);
            setBarcodeNotFound(true);
            setNewProductForm(prev => ({ ...prev }));
            toast.error(`Product not found for barcode: ${barcode}`);
        }
    }, [products]);

    const handleScan = useCallback((barcode: string) => {
        setBarcodeInput(barcode);
        handleBarcodeLookup(barcode);
    }, [handleBarcodeLookup]);

    const handleAddStock = async () => {
        if (!matchedProduct) return;
        setAddingToInventory(true);
        try {
            await updateProduct(matchedProduct.id, { stock: matchedProduct.stock + 1 });
            toast.success(`Stock updated: ${matchedProduct.name} (+1)`);
        } catch {
            toast.error("Failed to update stock");
        } finally {
            setAddingToInventory(false);
        }
    };

    const handleAddNewProduct = async () => {
        if (!newProductForm.name || !newProductForm.price || !newProductForm.category) {
            toast.error("Please fill in name, price and category");
            return;
        }
        setAddingToInventory(true);
        try {
            await addProduct({
                name: newProductForm.name,
                price: parseFloat(newProductForm.price),
                category: newProductForm.category,
                stock: parseInt(newProductForm.stock) || 1,
                barcode: barcodeInput,
            });
            toast.success(`${newProductForm.name} added to inventory!`);
            setShowAddForm(false);
            setBarcodeNotFound(false);
            handleBarcodeLookup(barcodeInput);
        } catch {
            toast.error("Failed to add product");
        } finally {
            setAddingToInventory(false);
        }
    };

    const capture = useCallback(() => {
        if (!videoRef.current) return;
        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d")?.drawImage(video, 0, 0);
        const imageSrc = canvas.toDataURL("image/jpeg");
        setCaptures((prev) => [...prev, imageSrc]);
        toast.success("Photo captured!");
    }, []);

    const removeCapture = (index: number) => {
        setCaptures((prev) => prev.filter((_, i) => i !== index));
        toast.success("Photo removed");
    };

    const clearAll = () => {
        setCaptures([]);
        setPdfBytes(null);
        toast.success("All photos cleared");
    };



    const handleSaveAsPDF = async () => {
        if (captures.length === 0) {
            toast.error("Please capture at least one photo");
            return;
        }

        setIsProcessing(true);
        try {
            const bytes = await imagesToPDF(captures);
            setPdfBytes(bytes);
            setShowDownloadDialog(true);
            toast.success("PDF created successfully!");
        } catch (error) {
            toast.error("Failed to create PDF. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = (filename: string) => {
        if (pdfBytes) {
            downloadPDF(pdfBytes, `${filename}.pdf`);
            toast.success("Download started!");
        }
    };


    return (
        <DashboardLayout role="cashier">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4 border-b border-border pb-6">
                    <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-emerald-500/15">
                        <Scan className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Barcode Scanner</h1>
                        <p className="text-muted-foreground">Scan products to look them up and add them to the POS</p>
                    </div>
                </div>

                {/* Camera Feed */}
                <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                    <BarcodeScanner ref={videoRef} isActive={true} onScan={handleScan}>
                        <div className="absolute bottom-14 left-0 right-0 flex justify-center pointer-events-none">
                            <span className="text-xs text-white/80 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                                Point at barcode — <span className="text-emerald-400 font-medium">detects automatically</span>
                            </span>
                        </div>

                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-auto">
                            <Button
                                variant="secondary"
                                size="icon"
                                onClick={capture}
                                className="h-8 w-8 bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm border-0"
                                title="Capture photo"
                            >
                                <Camera className="h-4 w-4" />
                            </Button>
                        </div>
                    </BarcodeScanner>
                </div>

                {/* Captured Photos Filmstrip */}
                {captures.length > 0 && (
                    <div className="space-y-4 bg-card rounded-xl border border-border p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-foreground">
                                Captured Page Images ({captures.length})
                            </h3>
                            <Button variant="ghost" size="sm" onClick={clearAll} className="text-destructive hover:text-destructive/90 hover:bg-destructive/10">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Clear All
                            </Button>
                        </div>

                        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                            {captures.map((src, index) => (
                                <div key={index} className="relative shrink-0 group">
                                    <img
                                        src={src}
                                        alt={`Capture ${index + 1}`}
                                        className="h-32 w-44 object-cover rounded-lg border border-border"
                                    />
                                    <button
                                        onClick={() => removeCapture(index)}
                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                    <span className="absolute bottom-2 left-2 text-xs font-medium bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
                                        {index + 1}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end pt-2 border-t border-border mt-4 block">
                            <Button
                                size="lg"
                                onClick={handleSaveAsPDF}
                                disabled={captures.length === 0 || isProcessing}
                                className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                            >
                                <FileDown className="h-5 w-5" />
                                {isProcessing ? "Creating PDF..." : "Export to PDF"}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Manual Barcode Entry */}
                <div className="flex flex-col sm:flex-row items-end gap-4 justify-between rounded-xl border border-border bg-card p-4">
                    <div className="space-y-2 w-full sm:w-1/2">
                        <label className="text-sm font-semibold text-foreground/80">Manual Entry <span className="text-muted-foreground font-normal">(auto-fills on scan)</span></label>
                        <div className="flex gap-2">
                            <Input
                                value={barcodeInput}
                                onChange={(e) => setBarcodeInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleBarcodeLookup(barcodeInput)}
                                placeholder="Enter product barcode number"
                                className="h-10"
                            />
                            <Button
                                size="icon"
                                onClick={() => handleBarcodeLookup(barcodeInput)}
                                className="h-10 w-10 bg-emerald-600 hover:bg-emerald-700 shrink-0"
                            >
                                <Search size={18} />
                            </Button>
                        </div>
                    </div>

                    <Link to="/cashier/pos" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto h-10 px-6 gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl">
                            Proceed to POS <ArrowRight size={16} />
                        </Button>
                    </Link>
                </div>

                {/* Product Lookup Result */}
                {matchedProduct && (
                    <div className="animate-in fade-in slide-in-from-bottom-4">
                        <Card className="border-2 border-emerald-500/20 bg-slate-900 text-white">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-lg bg-slate-800 flex items-center justify-center">
                                            <Package className="h-6 w-6 text-emerald-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{matchedProduct.name}</h3>
                                            <p className="text-sm text-slate-400">{matchedProduct.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-slate-400">Price</p>
                                        <p className="font-bold text-xl text-emerald-500">R {matchedProduct.price.toFixed(2)}</p>
                                        <p className="text-xs text-slate-400 mt-1">Stock: {matchedProduct.stock}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <Button
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                                        onClick={() => addToCart(matchedProduct)}
                                    >
                                        Add to POS
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-slate-600 text-white hover:bg-slate-800"
                                        onClick={handleAddStock}
                                        disabled={addingToInventory}
                                    >
                                        {addingToInventory ? "Updating..." : "Add Stock (+1)"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Quick-add form when barcode not found in inventory */}
                {barcodeNotFound && !matchedProduct && (
                    <div className="animate-in fade-in slide-in-from-bottom-4">
                        <Card className="border-2 border-amber-500/30">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-base">Product Not Found</h3>
                                        <p className="text-sm text-muted-foreground">Barcode: <span className="font-mono text-foreground">{barcodeInput}</span></p>
                                    </div>
                                    {!showAddForm && (
                                        <Button size="sm" onClick={() => setShowAddForm(true)} className="bg-amber-600 hover:bg-amber-700 text-white">
                                            + Add to Inventory
                                        </Button>
                                    )}
                                </div>

                                {showAddForm && (
                                    <div className="space-y-3 border-t border-border pt-4">
                                        <p className="text-sm font-medium text-muted-foreground">Add as new product</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="col-span-2">
                                                <Input
                                                    placeholder="Product name *"
                                                    value={newProductForm.name}
                                                    onChange={e => setNewProductForm(p => ({ ...p, name: e.target.value }))}
                                                />
                                            </div>
                                            <Input
                                                placeholder="Price (R) *"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={newProductForm.price}
                                                onChange={e => setNewProductForm(p => ({ ...p, price: e.target.value }))}
                                            />
                                            <Input
                                                placeholder="Category *"
                                                value={newProductForm.category}
                                                onChange={e => setNewProductForm(p => ({ ...p, category: e.target.value }))}
                                            />
                                            <Input
                                                placeholder="Initial stock"
                                                type="number"
                                                min="0"
                                                value={newProductForm.stock}
                                                onChange={e => setNewProductForm(p => ({ ...p, stock: e.target.value }))}
                                            />
                                        </div>
                                        <div className="flex gap-3 pt-1">
                                            <Button
                                                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                                onClick={handleAddNewProduct}
                                                disabled={addingToInventory}
                                            >
                                                {addingToInventory ? "Adding..." : "Save to Inventory"}
                                            </Button>
                                            <Button variant="outline" onClick={() => { setShowAddForm(false); setBarcodeNotFound(false); }}>
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                <DownloadDialog
                    open={showDownloadDialog}
                    onOpenChange={setShowDownloadDialog}
                    onDownload={handleDownload}
                />
            </div>
            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: hsl(var(--border));
          border-radius: 20px;
        }
      `}</style>
        </DashboardLayout>
    );
};

export default CashierScanner;
