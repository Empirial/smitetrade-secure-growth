import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Trash2, ShoppingCart, ArrowRight, Camera, WifiOff, Save, FolderOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import { useStore } from "@/context/StoreContext";
import { Product } from "@/types";

const CashierPOS = () => {
    const { products, addToCart: syncGlobalCart, clearCart: clearGlobalCart } = useStore();
    const [cart, setCart] = useState<{ id: string; name: string; price: number; quantity: number }[]>([]);
    const [search, setSearch] = useState("");
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
    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

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
                                className="pl-9 bg-white"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        {/* Camera / Custom Item Button */}
                        {/* Camera / Custom Item Button */}
                        <Dialog open={isCustomOpen} onOpenChange={setIsCustomOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="icon" className="shrink-0 bg-white hover:bg-emerald-50 text-emerald-600 border-emerald-200">
                                    <Camera className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Scan or Add Item</DialogTitle>
                                    <DialogDescription>Use camera to scan barcode or add custom item.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    {/* Mock Camera View */}
                                    <div className="aspect-video bg-black rounded-lg relative overflow-hidden flex items-center justify-center">
                                        <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center"></div>
                                        <div className="w-64 h-32 border-2 border-red-500/50 rounded-lg relative z-10 animate-pulse"></div>
                                        <div className="absolute bottom-2 text-white text-xs bg-black/50 px-2 py-1 rounded">Scanning...</div>
                                    </div>

                                    <div className="text-center text-xs text-muted-foreground -mt-2">
                                        Camera active. Align barcode within frame.
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
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Quick Access</h3>
                            <div className="grid grid-cols-4 gap-2">
                                {products.slice(0, 4).map(product => (
                                    <button
                                        key={`quick-${product.id}`}
                                        onClick={() => addToCart(product)}
                                        className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg p-2 text-center transition-colors"
                                    >
                                        <div className="text-xl mb-1">{product.image || "📦"}</div>
                                        <div className="text-xs font-medium truncate">{product.name}</div>
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

                    <ScrollArea className="flex-1 rounded-xl border bg-white/50 p-4 shadow-sm">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredProducts.map(product => (
                                <button
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    className="group relative flex flex-col items-center justify-center p-4 rounded-xl border border-dashed hover:border-solid hover:border-emerald-500 bg-white hover:shadow-md transition-all h-28"
                                >
                                    <div className={`mb-2 h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm bg-emerald-100 text-emerald-700`}>
                                        {/* Show Image if available (for custom items), else initial */}
                                        {product.image && product.image.startsWith('blob') ? (
                                            <img src={product.image} alt={product.name} className="h-full w-full rounded-full object-cover" />
                                        ) : (
                                            product.image || product.name.charAt(0)
                                        )}
                                    </div>
                                    <span className="font-medium text-center text-sm line-clamp-2">{product.name}</span>
                                    <span className="mt-1 font-bold text-emerald-600">R{product.price.toFixed(2)}</span>
                                    <div className="absolute inset-0 bg-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                        <Plus className="h-8 w-8 text-emerald-600" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Cart */}
                <Card className="w-full lg:w-[350px] flex flex-col h-full shadow-lg">
                    <CardContent className="p-0 flex flex-col h-full">
                        <div className="p-4 border-b bg-slate-50">
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
                                        <div key={item.id} className="flex items-center justify-between p-2 bg-white border rounded shadow-sm text-sm">
                                            <div className="flex-1">
                                                <div className="font-medium">{item.name}</div>
                                                <div className="text-muted-foreground">R{item.price} x {item.quantity}</div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateQuantity(item.id, -1)}>-</Button>
                                                <Input
                                                    className="w-12 h-6 text-center px-1 text-sm border-0 bg-slate-50"
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.id, e.target.value)}
                                                />
                                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateQuantity(item.id, 1)}>+</Button>
                                                <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500 hover:bg-red-50 hover:text-red-700" onClick={() => initiateVoid(item.id)}>
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

                        <div className="p-4 bg-emerald-50 border-t">
                            <div className="flex justify-between text-lg font-bold mb-4">
                                <span>Total</span>
                                <span className="text-emerald-700">R {total.toFixed(2)}</span>
                            </div>
                            <Button
                                className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2 h-12 text-lg"
                                disabled={cart.length === 0}
                                onClick={handleCheckout}
                            >
                                Checkout <ArrowRight className="h-5 w-5" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default CashierPOS;
