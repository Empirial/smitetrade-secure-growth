import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Trash2, ShoppingCart, ArrowRight, Camera, WifiOff, Save, FolderOpen, RotateCcw } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Webcam from "react-webcam";
import { BrowserMultiFormatReader } from "@zxing/library";

import { useStore } from "@/context/StoreContext";
import { Product } from "@/types";

const CashierPOS = () => {
    const { products, addToCart: syncGlobalCart, clearCart: clearGlobalCart } = useStore();
    const [cart, setCart] = useState<{ id: string; name: string; price: number; quantity: number }[]>([]);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const navigate = useNavigate();
    const { toast } = useToast();

    // Offline State
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Hold / Recall Cart State
    const [heldCarts, setHeldCarts] = useState<{ id: string, time: Date, items: typeof cart }[]>([]);

    const holdCart = () => {
        if (cart.length === 0) return;
        setHeldCarts([...heldCarts, { id: `HC-${Date.now().toString().slice(-4)}`, time: new Date(), items: [...cart] }]);
        setCart([]);
        toast({ title: "Cart Held", description: "Current transaction suspended for later." });
    };

    const recallCart = (heldId: string) => {
        if (cart.length > 0) {
            toast({ title: "Warning", description: "Please finish or hold current cart first.", variant: "destructive" });
            return;
        }
        const cartToRecall = heldCarts.find(hc => hc.id === heldId);
        if (cartToRecall) {
            setCart(cartToRecall.items);
            setHeldCarts(heldCarts.filter(hc => hc.id !== heldId));
            toast({ title: "Cart Recalled", description: `Restored cart ${heldId}` });
        }
    };

    // Void Reason State
    const [isVoidOpen, setIsVoidOpen] = useState(false);
    const [itemToVoid, setItemToVoid] = useState<string | null>(null);
    const [voidReason, setVoidReason] = useState("");

    const initiateVoid = (id: string) => {
        setItemToVoid(id);
        setIsVoidOpen(true);
    };

    const confirmVoid = () => {
        if (itemToVoid && voidReason) {
            setCart(prev => prev.filter(p => p.id !== itemToVoid));
            toast({ title: "Item Voided", description: `Reason: ${voidReason}` });
            setItemToVoid(null);
            setVoidReason("");
            setIsVoidOpen(false);
        }
    };

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(p => p.id === product.id);
            if (existing) {
                return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
            }
            return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(p => p.id !== id));
    };

    const updateQuantity = (id: string, delta: number | string) => {
        setCart(prev => prev.map(p => {
            if (p.id === id) {
                let newQty = p.quantity;
                if (typeof delta === 'string') {
                    newQty = parseInt(delta) || 1; // Direct input
                } else {
                    newQty = Math.max(1, p.quantity + delta); // Button click
                }
                return { ...p, quantity: newQty };
            }
            return p;
        }));
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Unique Categories List
    const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

    // Filter Products by Search and activeCategory
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory ? p.category === activeCategory : true;
        return matchesSearch && matchesCategory;
    });

    const handleCheckout = () => {
        // Fix Cart Disconnect: Sync local cart to global cart before navigating
        clearGlobalCart();
        cart.forEach(item => {
            // Reconstruct full product roughly for StoreContext
            syncGlobalCart({ id: item.id, name: item.name, price: item.price, category: '', stock: 0, status: 'In Stock', image: '' });
            // Note: If syncGlobalCart adds 1 qty, we might need a StoreContext method to sync a full cart array,
            // or pass explicitly in placeOrder (which we did update in Checkout).
            // For safety, the items prop passed in state is the main transport.
        });
        navigate("/cashier/checkout", { state: { cart, total } });
    };

    // Custom Item / Photo Capture Logic
    const [isCustomOpen, setIsCustomOpen] = useState(false);
    const [customItem, setCustomItem] = useState({ name: "Custom Item", price: "", image: "" });
    const [customFile, setCustomFile] = useState<File | undefined>(undefined);

    // Scanner Logic
    const webcamRef = useRef<Webcam>(null);
    const codeReader = useRef(new BrowserMultiFormatReader());
    const lastScannedTime = useRef<number>(0);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

    const handleBarcodeLookup = useCallback((barcode: string) => {
        const found = products.find(p => p.barcode === barcode || p.id === barcode);
        if (found) {
            addToCart(found);
            toast({ title: "Product Added", description: `${found.name} added to cart from scan.` });
            setIsCustomOpen(false); // Close dialog on success
        } else {
            toast({ title: "Not Found", description: `Product not found for barcode: ${barcode}`, variant: "destructive" });
        }
    }, [products]);

    const scanForBarcode = useCallback(() => {
        if (!isCustomOpen) return; // Only scan when dialog is open

        if (webcamRef.current && webcamRef.current.video) {
            const video = webcamRef.current.video;
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                codeReader.current.decodeFromVideoElement(video).then(result => {
                    if (result) {
                        const text = result.getText();
                        const now = Date.now();
                        if (now - lastScannedTime.current > 3000) {
                            lastScannedTime.current = now;
                            handleBarcodeLookup(text);
                        }
                    }
                }).catch(err => {
                    // Ignore NotFoundException
                });
            }
        }
    }, [handleBarcodeLookup, isCustomOpen]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isCustomOpen) {
            interval = setInterval(scanForBarcode, 500);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [scanForBarcode, isCustomOpen]);

    const toggleCamera = () => {
        setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    };

    const handleCameraError = () => {
        setCameraError("Unable to access camera. Please check permissions.");
    };

    const handleAddCustomItem = () => {
        if (!customItem.price) return;

        const newItem: Product = {
            id: `custom-${Date.now()}`,
            name: customItem.name || "Custom Item",
            price: Number(customItem.price),
            category: "Custom",
            stock: 1,
            image: customFile ? URL.createObjectURL(customFile) : "📸", // Mock image URL or emoji
            status: "In Stock"
        };

        addToCart(newItem);
        setIsCustomOpen(false);
        setCustomItem({ name: "Custom Item", price: "", image: "" });
        setCustomFile(undefined);
    };

    return (
        <DashboardLayout role="cashier">
            <div className="flex flex-col h-[calc(100vh-8rem)] lg:flex-row gap-6">
                {/* Product Grid */}
                <div className="flex-1 flex flex-col gap-4">

                    {/* Offline Banner */}
                    {isOffline && (
                        <div className="bg-red-500 text-white p-2 rounded-lg flex items-center justify-center gap-2 font-bold animate-pulse">
                            <WifiOff className="h-5 w-5" />
                            OFFLINE MODE - SALES SAVED LOCALLY
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                className="pl-9 bg-slate-900 border-slate-800 text-white"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    if (e.target.value) setActiveCategory(null); // Clear category filter text when searching
                                }}
                            />
                        </div>
                        {/* Camera / Custom Item Button */}
                        {/* Camera / Custom Item Button */}
                        <Dialog open={isCustomOpen} onOpenChange={setIsCustomOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="icon" className="shrink-0 bg-background hover:bg-emerald-50 text-emerald-600 border-emerald-200">
                                    <Camera className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Scan or Add Item</DialogTitle>
                                    <DialogDescription>Use camera to scan barcode or add custom item.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    {/* Live Camera View */}
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
                                                <div className="absolute inset-0 border-2 border-emerald-500/50 rounded-lg z-10 animate-pulse m-8 pointer-events-none"></div>
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

                                    <div className="text-center text-xs text-slate-400 -mt-2">
                                        Align barcode within frame to auto-add item.
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Or Add Manually</Label>
                                        <Input
                                            value={customItem.name}
                                            onChange={(e) => setCustomItem({ ...customItem, name: e.target.value })}
                                            placeholder="Item Name"
                                        />
                                        <Input
                                            type="number"
                                            value={customItem.price}
                                            onChange={(e) => setCustomItem({ ...customItem, price: e.target.value })}
                                            placeholder="Price (R)"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleAddCustomItem} disabled={!customItem.price}>Add Item</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {!search && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-slate-400 mb-2">Categories</h3>
                            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                <button
                                    onClick={() => setActiveCategory(null)}
                                    className={`shrink-0 border rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeCategory === null
                                            ? "bg-emerald-600 border-emerald-500 text-white"
                                            : "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                                        }`}
                                >
                                    All Items
                                </button>
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setActiveCategory(category)}
                                        className={`shrink-0 border rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeCategory === category
                                                ? "bg-emerald-600 border-emerald-500 text-white"
                                                : "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>

                            {/* Held Carts Section */}
                            {heldCarts.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-amber-600 mb-2 flex items-center gap-2">
                                        <FolderOpen className="h-4 w-4" /> Parked Transactions ({heldCarts.length})
                                    </h3>
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {heldCarts.map(hc => (
                                            <Button
                                                key={hc.id}
                                                variant="outline"
                                                className="border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 shrink-0"
                                                onClick={() => recallCart(hc.id)}
                                            >
                                                Recall {hc.id}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <ScrollArea className="flex-1 rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm text-white">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredProducts.map(product => (
                                <button
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    className={`group relative flex flex-col items-center justify-center p-4 rounded-xl border border-slate-800 hover:border-emerald-500 shadow-sm transition-all h-28 bg-slate-950`}
                                >
                                    <span className="font-semibold text-center text-sm line-clamp-2 mt-2 px-2 text-slate-200">{product.name}</span>
                                    <span className="mt-2 font-bold text-emerald-500 bg-slate-900 px-3 py-1 rounded-full text-sm">R{product.price.toFixed(2)}</span>
                                    <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center backdrop-blur-[1px]">
                                        <Plus className="h-8 w-8 text-emerald-500" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Cart */}
                <Card className="w-full lg:w-[350px] flex flex-col h-full shadow-lg border-slate-800 bg-slate-900">
                    <CardContent className="p-0 flex flex-col h-full text-white">
                        <div className="p-4 border-b border-slate-800 bg-slate-950">
                            <h2 className="font-semibold flex items-center gap-2">
                                <ShoppingCart size={18} /> Cart ({cart.length})
                            </h2>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 absolute right-4 top-3 text-amber-600 border-amber-200 hover:bg-amber-50"
                                onClick={holdCart}
                                disabled={cart.length === 0}
                            >
                                <Save className="h-4 w-4 mr-1" /> Park Sale
                            </Button>
                        </div>

                        <ScrollArea className="flex-1 p-4">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                                    <p>Start adding items</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex items-center justify-between p-2 bg-slate-950 border border-slate-800 rounded shadow-sm text-sm">
                                            <div className="flex-1">
                                                <div className="font-medium text-slate-200">{item.name}</div>
                                                <div className="text-emerald-500">R{item.price} x {item.quantity}</div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-300 hover:text-white" onClick={() => updateQuantity(item.id, -1)}>-</Button>
                                                <Input
                                                    className="w-12 h-6 text-center px-1 text-sm border-slate-700 bg-slate-900 text-white"
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.id, e.target.value)}
                                                />
                                                <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-300 hover:text-white" onClick={() => updateQuantity(item.id, 1)}>+</Button>
                                                <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500 hover:bg-red-500/20 hover:text-red-400" onClick={() => initiateVoid(item.id)}>
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>

                        {/* Void Reason Dialog */}
                        <Dialog open={isVoidOpen} onOpenChange={setIsVoidOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="text-red-600">Void Line Item</DialogTitle>
                                    <DialogDescription>Please provide a reason for removing this item.</DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    <select
                                        className="w-full flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={voidReason}
                                        onChange={(e) => setVoidReason(e.target.value)}
                                    >
                                        <option value="" disabled>Select Reason...</option>
                                        <option value="Customer changed mind">Customer changed mind</option>
                                        <option value="Incorrect item scanned">Incorrect item scanned</option>
                                        <option value="Item damaged">Item damaged</option>
                                        <option value="Customer doesn't have enough money">Customer doesn't have enough money</option>
                                    </select>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsVoidOpen(false)}>Cancel</Button>
                                    <Button variant="destructive" onClick={confirmVoid} disabled={!voidReason}>Confirm Void</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <div className="p-4 bg-slate-950 border-t border-slate-800">
                            <div className="flex justify-between text-lg font-bold mb-4">
                                <span className="text-slate-200">Total</span>
                                <span className="text-emerald-500">R {total.toFixed(2)}</span>
                            </div>
                            <Button
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-12 text-lg"
                                disabled={cart.length === 0}
                                onClick={handleCheckout}
                            >
                                Checkout <ArrowRight className="h-5 w-5" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    height: 6px;
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: hsl(var(--border) / 0.3);
                    border-radius: 10px;
                }
            `}</style>
        </DashboardLayout>
    );
};

export default CashierPOS;
