import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Trash2, ShoppingCart, ArrowRight, Camera } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useStore } from "@/context/StoreContext";
import { Product } from "@/types";

const CashierPOS = () => {
    const { products } = useStore();
    const [cart, setCart] = useState<{ id: string; name: string; price: number; quantity: number }[]>([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

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

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(p => {
            if (p.id === id) {
                const newQty = Math.max(1, p.quantity + delta);
                return { ...p, quantity: newQty };
            }
            return p;
        }));
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    const handleCheckout = () => {
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
            status: "Active"
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

                    {/* Quick Access Grid */}
                    {!search && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-muted-foreground">Quick Access</h3>
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
                                                <span className="w-4 text-center">{item.quantity}</span>
                                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateQuantity(item.id, 1)}>+</Button>
                                                <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500" onClick={() => removeFromCart(item.id)}>
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>

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
