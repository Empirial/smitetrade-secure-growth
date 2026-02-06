import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, CreditCard, Banknote, Landmark } from "lucide-react";
import { useState } from "react";

const CashierCheckout = () => {
    const location = useLocation();
    const navigate = useNavigate();
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

    const handlePay = () => {
        // Simulate processing
        setTimeout(() => setSuccess(true), 1000);
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
                            {cart.map((item: any) => (
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
