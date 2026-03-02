import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "@/context/StoreContext";

const CustomerCart = () => {
    const { cart, removeFromCart, updateCartQuantity, cartTotal } = useStore();

    return (
        <DashboardLayout role="customer">
            <div className="max-w-4xl mx-auto flex flex-col gap-6 h-[calc(100vh-8rem)]">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
                    <span className="text-muted-foreground">{cart.length} Items</span>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 h-full overflow-hidden">
                    <Card className="lg:col-span-2 flex flex-col h-full overflow-hidden border-0 shadow-none md:border md:shadow-sm bg-transparent md:bg-card">
                        <ScrollArea className="flex-1">
                            <CardContent className="p-0 md:p-6 space-y-4">
                                {cart.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed rounded-xl">
                                        <p className="text-lg font-medium mb-2">Your cart is empty</p>
                                        <Link to="/customer/products">
                                            <Button variant="link">Browse Products</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    cart.map((item) => (
                                        <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-card text-card-foreground border rounded-xl shadow-sm gap-4">
                                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                                <div className="h-16 w-16 bg-muted/30 rounded-lg flex items-center justify-center text-3xl shrink-0">
                                                    {item.image}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">{item.name}</h3>
                                                    <p className="text-muted-foreground text-sm">R{item.price.toFixed(2)} each</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                                                <div className="flex items-center border rounded-lg bg-background">
                                                    <button
                                                        className="px-3 py-1 hover:bg-muted rounded-l-lg transition-colors"
                                                        onClick={() => updateCartQuantity(item.id, -1)}
                                                    >-</button>
                                                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                    <button
                                                        className="px-3 py-1 hover:bg-muted rounded-r-lg transition-colors"
                                                        onClick={() => updateCartQuantity(item.id, 1)}
                                                    >+</button>
                                                </div>
                                                <div className="font-bold text-lg min-w-[80px] text-right">
                                                    R {(item.price * item.quantity).toFixed(2)}
                                                </div>
                                                <Button size="icon" variant="ghost" className="text-destructive h-8 w-8 ml-2" onClick={() => removeFromCart(item.id)}>
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </ScrollArea>
                    </Card>

                    <div className="lg:col-span-1">
                        <Card className="sticky top-6">
                            <CardContent className="p-6 space-y-6">
                                <h2 className="font-semibold text-lg">Order Summary</h2>

                                <div className="space-y-3 text-sm flex-1">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>R {cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Delivery Fee</span>
                                        <span>R 15.00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Service Fee</span>
                                        <span>R 5.00</span>
                                    </div>
                                    <div className="border-t pt-3 flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>R {(cartTotal + 20).toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    {cartTotal > 0 && cartTotal < 100 && (
                                        <div className="mb-3 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                                            Minimum order for delivery is <strong>R 100.00</strong>. Please add R {(100 - cartTotal).toFixed(2)} more to your cart.
                                        </div>
                                    )}
                                    <Link to={cartTotal >= 100 ? "/customer/checkout" : "#"} onClick={(e) => {
                                        if (cartTotal < 100) e.preventDefault();
                                    }}>
                                        <Button className="w-full h-12 text-lg" disabled={cart.length === 0 || cartTotal < 100}>
                                            Checkout <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CustomerCart;
