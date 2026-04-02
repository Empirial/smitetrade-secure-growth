import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Trash2, ShoppingCart, CreditCard, Banknote, Camera, RotateCcw } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import { DecodeHintType } from "@zxing/library";
import { useStore } from "@/context/StoreContext";
import { usePayfast } from "@/hooks/usePayfast";

interface POSProduct {
    id: string;
    name: string;
    price: number;
    category: string;
    color: string;
    image?: string;
    barcode?: string;
}

const OwnerPOS = () => {
    const { products, placeOrder, user, currentStore } = useStore();
    const { pay, loading: payfastLoading } = usePayfast();
    const [cart, setCart] = useState<{ id: string; name: string; price: number; quantity: number }[]>([]);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const { toast } = useToast();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const storeId = currentStore?.id || '';

    const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

    // Custom Item / Photo Capture Logic
    const [isCustomOpen, setIsCustomOpen] = useState(false);
    const [customItem, setCustomItem] = useState({ name: "Custom Item", price: "", image: "" });
    const [customFile, setCustomFile] = useState<File | undefined>(undefined);

    const handleAddCustomItem = () => {
        if (!customItem.price) return;

        const newItem = {
            id: `custom-${Date.now()}`,
            name: customItem.name || "Custom Item",
            price: Number(customItem.price),
            category: "Custom",
            color: "bg-background text-foreground",
            image: customFile ? URL.createObjectURL(customFile) : "📸",
            quantity: 1
        };

        setCart(prev => [...prev, newItem]);
        setIsCustomOpen(false);
        setCustomItem({ name: "Custom Item", price: "", image: "" });
        setCustomFile(undefined);
    };

    const addToCart = (product: POSProduct) => {
        setCart(prev => {
            const existing = prev.find(p => p.id === product.id);
            if (existing) {
                return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(p => p.id !== id));
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(p => {
            if (p.id === id) {
                const newQty = Math.max(1, p.quantity + delta);
                return { ...p, quantity: newQty };
            }
            return p;
        }));
    };

    // Scanner Logic
    const videoRef = useRef<HTMLVideoElement>(null);
    const controlsRef = useRef<IScannerControls | null>(null);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [deviceIndex, setDeviceIndex] = useState(0);
    const [cameraError, setCameraError] = useState<string | null>(null);

    const codeReader = useRef((() => {
        const hints = new Map();
        hints.set(DecodeHintType.TRY_HARDER, true);
        return new BrowserMultiFormatReader(hints);
    })());

    const handleBarcodeLookup = useCallback((barcode: string) => {
        const found = products.find(p => p.id === barcode || p.barcode === barcode);
        if (found) {
            addToCart({ ...found, color: "bg-background text-foreground" });
            toast({ title: "Product Added", description: `${found.name} added to cart from scan.` });
            setIsCustomOpen(false);
        } else {
            toast({ title: "Not Found", description: `Product not found for barcode: ${barcode}`, variant: "destructive" });
        }
    }, [products]);

    const startScanning = useCallback(async () => {
        if (!videoRef.current) return;
        setCameraError(null);
        try {
            const deviceList = await BrowserMultiFormatReader.listVideoInputDevices();
            setDevices(deviceList);
            const deviceId = deviceList[deviceIndex]?.deviceId;
            controlsRef.current = await codeReader.current.decodeFromVideoDevice(
                deviceId,
                videoRef.current,
                (result) => { if (result) handleBarcodeLookup(result.getText()); }
            );
        } catch {
            setCameraError("Unable to access camera. Please check permissions.");
        }
    }, [deviceIndex, handleBarcodeLookup]);

    useEffect(() => {
        if (isCustomOpen) startScanning();
        else controlsRef.current?.stop();
        return () => { controlsRef.current?.stop(); };
    }, [isCustomOpen, deviceIndex]);

    const toggleCamera = () => {
        controlsRef.current?.stop();
        setDeviceIndex(prev => (prev + 1) % Math.max(devices.length, 1));
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory ? p.category === activeCategory : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <DashboardLayout role="owner">
            <div className="flex flex-col h-[calc(100vh-8rem)] lg:flex-row gap-6">
                {/* Product Grid - Left Side */}
                <div className="flex-1 flex flex-col gap-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-500 shrink-0">POS Register</h1>
                        <div className="flex items-center gap-2 flex-1">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search products..."
                                    className="pl-9 bg-slate-900 border-slate-800 text-white"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
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
                                    <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
                                        {cameraError ? (
                                            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                                                <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                                                <p className="text-white text-sm">{cameraError}</p>
                                                <Button variant="outline" size="sm" className="mt-2" onClick={startScanning}>Retry</Button>
                                            </div>
                                        ) : (
                                            <>
                                                <video ref={videoRef} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <div className="w-48 h-24 border-2 border-emerald-400/70 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
                                                </div>
                                                <Button variant="secondary" size="icon" onClick={toggleCamera} className="absolute bottom-2 right-2 h-8 w-8 bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm">
                                                    <RotateCcw className="h-4 w-4" />
                                                </Button>
                                            </>
                                        )}
                                    </div>

                                    <div className="text-center text-xs text-slate-400 -mt-2">
                                        Align barcode within frame to auto-add item.
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Item Name (Optional)</Label>
                                        <Input
                                            value={customItem.name}
                                            onChange={(e) => setCustomItem({ ...customItem, name: e.target.value })}
                                            placeholder="e.g. Loose Vegetables"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Price (R)</Label>
                                        <Input
                                            type="number"
                                            value={customItem.price}
                                            onChange={(e) => setCustomItem({ ...customItem, price: e.target.value })}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Capture Photo</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                capture="environment" // Hints mobile to use camera
                                                onChange={(e) => setCustomFile(e.target.files?.[0])}
                                            />
                                            <Camera className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleAddCustomItem} disabled={!customItem.price}>Add to Cart</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        </div>
                    </div>

                    {!search && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-slate-400 mb-2">Categories</h3>
                            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                <button
                                    onClick={() => setActiveCategory(null)}
                                    className={`shrink-0 border rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeCategory === null
                                        ? "bg-emerald-600 border-emerald-500 text-white"
                                        : "bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
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
                                            : "bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <ScrollArea className="flex-1 rounded-xl border border-slate-800/50 bg-slate-900/20 p-4 shadow-sm text-white mt-2">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredProducts.map(product => (
                                <button
                                    key={product.id}
                                    onClick={() => addToCart(product as any)}
                                    className="group flex flex-col items-center justify-center p-4 rounded-xl border border-slate-800/80 hover:border-emerald-500 shadow-sm transition-all h-28 bg-slate-950"
                                >
                                    <span className="font-semibold text-center text-sm line-clamp-2 px-2 text-slate-200">{product.name}</span>
                                    <span className="mt-2 font-semibold text-emerald-400 bg-emerald-900/30 px-3 py-1 rounded-full text-xs border border-emerald-800/50">R{product.price.toFixed(2)}</span>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Cart - Right Side */}
                <Card className="w-full lg:w-[350px] flex flex-col h-full shadow-lg border-slate-800 bg-slate-950">
                    <CardContent className="p-0 flex flex-col h-full text-white">
                        <div className="p-4 border-b border-slate-800 bg-slate-950">
                            <h2 className="font-semibold flex items-center gap-2">
                                <ShoppingCart size={18} /> Cart ({cart.length})
                            </h2>
                        </div>

                        <ScrollArea className="flex-1 p-4 bg-slate-950">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full min-h-[10rem] text-slate-400">
                                    <p>Start adding items</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-800 rounded shadow-sm text-sm">
                                            <div className="flex-1">
                                                <div className="font-medium text-slate-200">{item.name}</div>
                                                <div className="text-emerald-500">R{item.price} x {item.quantity}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-white" onClick={() => updateQuantity(item.id, -1)}>-</Button>
                                                <span className="w-6 text-center text-sm">{item.quantity}</span>
                                                <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-white" onClick={() => updateQuantity(item.id, 1)}>+</Button>
                                                <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:bg-red-500/20 hover:text-red-400" onClick={() => removeFromCart(item.id)}>
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>

                        <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-4">
                            <div className="flex justify-between text-lg font-bold">
                                <span className="text-white">Total</span>
                                <span className="text-emerald-500">R {total.toFixed(2)}</span>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    className="flex-1 bg-emerald-700/90 hover:bg-emerald-600 text-white"
                                    disabled={cart.length === 0 || isCheckingOut}
                                    onClick={async () => {
                                        setIsCheckingOut(true);
                                        try {
                                            await placeOrder({
                                                name: "In-Store Walk-in",
                                                address: "In-Store",
                                                items: cart as any[],
                                                paymentMethod: "Cash"
                                            });
                                            setCart([]);
                                        } finally {
                                            setIsCheckingOut(false);
                                        }
                                    }}
                                >
                                    <Banknote className="h-4 w-4 mr-1" />
                                    {isCheckingOut ? "Processing..." : "Cash"}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 border-blue-500 text-blue-400 hover:bg-blue-500/10"
                                    disabled={cart.length === 0 || isCheckingOut || payfastLoading}
                                    onClick={() => {
                                        pay({
                                            emailAddress: user?.email || 'pos@smitetrade.co.za',
                                            amount: total,
                                            itemName: 'POS Sale',
                                            customStr1: 'owner_pos',
                                            customStr2: storeId,
                                        });
                                    }}
                                >
                                    <CreditCard className="h-4 w-4 mr-1" />
                                    {payfastLoading ? "Redirecting..." : "Card"}
                                </Button>
                            </div>
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

export default OwnerPOS;
