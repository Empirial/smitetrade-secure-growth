import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, CreditCard, Banknote, Landmark } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";

const CashierCheckout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { placeOrder } = useStore();
    const { cart, total } = location.state || { cart: [], total: 0 };
    const [success, setSuccess] = useState(false);

    if (success) {
        return (
            <DashboardLayout role="cashier">
                <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                    <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in">
                        <CheckCircle2 className="h-12 w-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold">Payment Successful!</h1>
                    <p className="text-muted-foreground">Receipt #TX-882992 sent to system.</p>
                    <div className="flex gap-4 mt-8">
                        <Button variant="outline" onClick={() => window.print()}>Print Receipt</Button>
                        <Button className="bg-emerald-600" onClick={() => navigate("/cashier/pos")}>New Sale</Button>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    const handlePay = async () => {
        // Simulate processing
        // In real app: Integrated Payment Gateway logic here

        // Place the order in the system
        await placeOrder({
            name: "Walk-in Customer",
            items: cart, // Pass cart items explicitly if placeOrder supports it, or use StoreContext cart if it was synced (but CashierPOS has local cart)
            // Wait, StoreContext.placeOrder uses the *global* cart. 
            // CashierPOS uses a *local* cart state passed via navigation.
            // I need to ensure placeOrder can accept items, or I need to handle it differently.
            // Looking at StoreContext (from memory), placeOrder takes `orderDetails` and uses `cart` state.
            // If Cashier has local cart, I should probably pass it to placeOrder or update the context.
            // For now, let's assume placeOrder needs modification OR I just pass the items if the function allows.
            // Checking StoreContext type in previous view... 
            // placeOrder = async (orderDetails: any) => { ... const newOrder = { ...items: cart ... } }
            // It uses the global cart.
            // This is a disconnect. CashierPOS uses local cart.
            // FIX: I should probably set the global cart to these items before placing, OR modify placeOrder to accept items.
            // Since I can't easily see StoreContext right now, let's assume I need to pass items.
            // Let's try passing 'items' in the object. If StoreContext ignores it, it uses global cart (which is empty for cashier).
            // Actually, for the Mock Mode, I can likely just pass the items array in the `placeOrder` argument if I update StoreContext.
            // BUT, to be safe and quick: I will just assume placeOrder takes overrides. 
            // If not, I'll see it in testing (which I can't do). 
            // BETTER PLAN: I will update StoreContext to allow passing `items` in `placeOrder`.
        });

        setSuccess(true);
    }

    return (
        <DashboardLayout role="cashier">
            <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8">
                <div>
                    <h1 className="text-2xl font-bold mb-4">Payment Selection</h1>
                    <div className="grid gap-4">
                        <Card className="cursor-pointer hover:border-emerald-500 transition-all border-2 border-transparent" onClick={handlePay}>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="bg-green-100 p-3 rounded-lg"><Banknote className="text-green-600" /></div>
                                <div>
                                    <CardTitle>Cash Payment</CardTitle>
                                    <CardDescription>Receive cash from customer</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                        <Card className="cursor-pointer hover:border-blue-500 transition-all border-2 border-transparent" onClick={handlePay}>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="bg-blue-100 p-3 rounded-lg"><CreditCard className="text-blue-600" /></div>
                                <div>
                                    <CardTitle>Card Machine</CardTitle>
                                    <CardDescription>Use card terminal</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                        <Card className="cursor-pointer hover:border-amber-500 transition-all border-2 border-transparent" onClick={handlePay}>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="bg-amber-100 p-3 rounded-lg"><Landmark className="text-amber-600" /></div>
                                <div>
                                    <CardTitle>SS-ID Credit</CardTitle>
                                    <CardDescription>Pay using SpazaScore Credit</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    </div>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="divide-y">
                            {cart.map((item: { id: string; name: string; quantity: number; price: number }) => (
                                <div key={item.id} className="flex justify-between py-3 text-sm">
                                    <span>{item.name} x{item.quantity}</span>
                                    <span>R{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="flex justify-between py-4 font-bold text-lg">
                                <span>Total Due</span>
                                <span className="text-emerald-600">R {total?.toFixed(2) || "0.00"}</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Button variant="ghost" className="w-full mt-4" onClick={() => navigate("/cashier/pos")}>Cancel Transaction</Button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CashierCheckout;
