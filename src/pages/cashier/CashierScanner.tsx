import { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { BrowserMultiFormatReader } from "@zxing/library";
import { Camera, Trash2, FileDown, RotateCcw, X, Scan, Search, ArrowRight, Package } from "lucide-react";
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

const CashierScanner = () => {
    const webcamRef = useRef<Webcam>(null);
    const [captures, setCaptures] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showDownloadDialog, setShowDownloadDialog] = useState(false);
    const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
    const [barcodeInput, setBarcodeInput] = useState("");
    const [matchedProduct, setMatchedProduct] = useState<Product | null>(null);
    const [barcodeNotFound, setBarcodeNotFound] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newProductForm, setNewProductForm] = useState({ name: "", price: "", category: "", stock: "1" });
    const [addingToInventory, setAddingToInventory] = useState(false);

    const { products, addToCart, addProduct, updateProduct } = useStore();

    const codeReader = useRef(new BrowserMultiFormatReader());
    const lastScannedTime = useRef<number>(0);

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

    const scanForBarcode = useCallback(() => {
        if (webcamRef.current && webcamRef.current.video) {
            const video = webcamRef.current.video;
            if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0) {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                try {
                    const result = codeReader.current.decodeFromCanvas(canvas);
                    const text = result.getText();
                    const now = Date.now();
                    // Prevent repeated scans of the same barcode too quickly (every 3 seconds)
                    if (now - lastScannedTime.current > 3000) {
                        setBarcodeInput(text);
                        lastScannedTime.current = now;
                        handleBarcodeLookup(text);
                    }
                } catch {
                    // Ignore NotFoundException, it happens constantly when no barcode is in view
                }
            }
        }
    }, [handleBarcodeLookup]);

    useEffect(() => {
        const interval = setInterval(scanForBarcode, 500); // Check for barcodes twice a second
        return () => clearInterval(interval);
    }, [scanForBarcode]);

    const captureBarcode = useCallback(() => {
        if (webcamRef.current && webcamRef.current.video) {
            const video = webcamRef.current.video;
            if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0) {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                try {
                    const result = codeReader.current.decodeFromCanvas(canvas);
                    const text = result.getText();
                    setBarcodeInput(text);
                    lastScannedTime.current = Date.now();
                    handleBarcodeLookup(text);
                } catch {
                    toast.error("No barcode detected. Hold the barcode steady and try again.");
                }
            }
        }
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
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                setCaptures((prev) => [...prev, imageSrc]);
                toast.success("Photo captured!");
            }
        }
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

    const toggleCamera = () => {
        setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
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

    const handleCameraError = () => {
        setCameraError("Unable to access camera. Please ensure you have granted camera permissions.");
    };

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode,
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
                <p className="text-sm text-muted-foreground -mt-2">Point camera at a barcode and press the <span className="text-emerald-600 font-medium">green scan button</span>, or wait for auto-detection.</p>
                <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                    {cameraError ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <Camera className="h-16 w-16 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">{cameraError}</p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => setCameraError(null)}
                            >
                                Try Again
                            </Button>
                        </div>
                    ) : (
                        <div className="relative aspect-video">
                            <Webcam
                                ref={webcamRef}
                                audio={false}
                                screenshotFormat="image/jpeg"
                                videoConstraints={videoConstraints}
                                onUserMediaError={handleCameraError}
                                className="w-full h-full object-cover"
                            />

                            {/* Scan guide overlay */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-64 h-32 border-2 border-emerald-400/70 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
                            </div>

                            {/* Camera Controls Overlay */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={toggleCamera}
                                    className="bg-background/80 backdrop-blur-sm hover:bg-background"
                                    title="Flip camera"
                                >
                                    <RotateCcw className="h-5 w-5" />
                                </Button>

                                <Button
                                    size="lg"
                                    onClick={captureBarcode}
                                    className="h-16 w-16 rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-1 transition-transform"
                                    title="Scan barcode"
                                >
                                    <Scan className="h-8 w-8 text-white" />
                                </Button>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={capture}
                                    className="bg-background/80 backdrop-blur-sm hover:bg-background"
                                    title="Capture photo"
                                >
                                    <Camera className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    )}
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

                {/* Manual Barcode Entry Component */}
                <Card>
                    <CardContent className="p-4 space-y-4 flex flex-col sm:flex-row items-end gap-6 justify-between border-none shadow-none bg-transparent">
                        <div className="space-y-3 w-full sm:w-1/2">
                            <label className="text-sm font-semibold text-foreground/80">Manual Barcode Entry (Auto-fills on Scan)</label>
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

                        <Link to="/cashier/pos" className="w-full sm:w-auto mt-4 sm:mt-0">
                            <Button className="w-full sm:w-auto h-12 px-6 gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl">
                                Proceed to POS <ArrowRight size={16} />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

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
                                        <div className="grid grid-cols-2 gap-3">
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
