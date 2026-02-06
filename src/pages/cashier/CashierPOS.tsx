import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input"; // Added missing import
import { Search, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const products = [
    { id: 1, name: "Brown Bread 700g", price: 18.00, color: "bg-orange-100 text-orange-700" },
    { id: 2, name: "Full Cream Milk 2L", price: 28.00, color: "bg-blue-100 text-blue-700" },
    { id: 3, name: "Coca Cola 1.5L", price: 22.00, color: "bg-red-100 text-red-700" },
    { id: 4, name: "Maize Meal 5kg", price: 55.00, color: "bg-yellow-100 text-yellow-700" },
    { id: 5, name: "White Sugar 2kg", price: 38.00, color: "bg-neutral-100 text-neutral-700" },
    { id: 6, name: "Cooking Oil 750ml", price: 45.00, color: "bg-yellow-200 text-yellow-800" },
    { id: 7, name: "Airtime R10", price: 10.00, color: "bg-green-100 text-green-700" },
    { id: 8, name: "Lays Chips 120g", price: 19.00, color: "bg-red-200 text-red-800" },
];

const CashierPOS = () => {
    const [cart, setCart] = useState<{ id: number; name: string; price: number; quantity: number }[]>([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const addToCart = (product: typeof products[0]) => {
        setCart(prev => {
            const existing = prev.find(p => p.id === product.id);
            if (existing) {
                return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(p => p.id !== id));
    };

    const updateQuantity = (id: number, delta: number) => {
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
                    </div>

                    <ScrollArea className="flex-1 rounded-xl border bg-white/50 p-4 shadow-sm">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredProducts.map(product => (
                                <button
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    className="group relative flex flex-col items-center justify-center p-4 rounded-xl border border-dashed hover:border-solid hover:border-emerald-500 bg-white hover:shadow-md transition-all h-28"
                                >
                                    <div className={`mb-2 h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm ${product.color}`}>
                                        {product.name.charAt(0)}
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
}; // Added missing closing brace

export default CashierPOS;
