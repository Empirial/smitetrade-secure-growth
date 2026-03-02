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

    const { products, addToCart } = useStore();

    const codeReader = useRef(new BrowserMultiFormatReader());
    const lastScannedTime = useRef<number>(0);

    const handleBarcodeLookup = useCallback((barcode: string) => {
        // For test use, assume barcode '6001234567890' exists if mock is used
        const found = products.find(p => p.barcode === barcode || p.id === barcode);
        if (found) {
            setMatchedProduct(found);
            toast.success(`Found: ${found.name}`);
        } else {
            setMatchedProduct(null);
            toast.error(`Product not found for barcode: ${barcode}`);
        }
    }, [products]);

    const scanForBarcode = useCallback(() => {
        if (webcamRef.current && webcamRef.current.video) {
            const video = webcamRef.current.video;
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                codeReader.current.decodeFromVideoElement(video).then(result => {
                    if (result) {
                        const text = result.getText();
                        const now = Date.now();
                        // Prevent repeated scans of the same barcode too quickly (every 3 seconds)
                        if (now - lastScannedTime.current > 3000) {
                            setBarcodeInput(text);
                            lastScannedTime.current = now;
                            handleBarcodeLookup(text);
                        }
                    }
                }).catch(err => {
                    // Ignore NotFoundException, it happens constantly when no barcode is in view
                });
            }
        }
    }, [handleBarcodeLookup]);

    useEffect(() => {
        const interval = setInterval(scanForBarcode, 500); // Check for barcodes twice a second
        return () => clearInterval(interval);
    }, [scanForBarcode]);

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
            console.error("Error creating PDF:", error);
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
                        <h1 className="text-2xl font-bold">Document & Product Scanner</h1>
                        <p className="text-muted-foreground">Capture documents or products to save as PDF</p>
                    </div>
                </div>

                {/* Camera Feed */}
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

                            {/* Camera Controls Overlay */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={toggleCamera}
                                    className="bg-background/80 backdrop-blur-sm hover:bg-background"
                                >
                                    <RotateCcw className="h-5 w-5" />
                                </Button>

                                <Button
                                    size="lg"
                                    onClick={capture}
                                    className="h-16 w-16 rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-1 transition-transform"
                                >
                                    <Camera className="h-8 w-8 text-white" />
                                </Button>

                                <div className="w-10" />
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
                    <div className="animate-in fade-in slide-in-from-bottom-4 mt-4">
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
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <Button
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                        onClick={() => addToCart(matchedProduct)}
                                    >
                                        Add to Cart
                                    </Button>
                                </div>
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
