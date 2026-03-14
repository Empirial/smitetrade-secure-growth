import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { CheckCircle2, CreditCard } from "lucide-react";
import { usePaystack } from "@/hooks/usePaystack";
import { useStore } from "@/context/StoreContext";

const CustomerPayment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useStore();

    const { total: stateTotal, orderPlaced = false } = (location.state as { total?: number; orderPlaced?: boolean }) || {};
    const orderTotal = stateTotal ?? 0;

    const [success, setSuccess] = useState(orderPlaced);
    const [paymentMethod, setPaymentMethod] = useState("card");

    const { pay, processing } = usePaystack({
        amount: orderTotal,
        email: user?.email || 'customer@smitetrade.co.za',
        onSuccess: () => setSuccess(true),
        onClose: () => {},
    });

    const handlePayment = () => {
        if (paymentMethod === "card") pay();
    };

    if (success) {
        return (
            <DashboardLayout role="customer">
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in zoom-in duration-500">
                    <div className="h-24 w-24 bg-green-500/10 rounded-full flex items-center justify-center text-green-400">
                        <CheckCircle2 className="h-12 w-12" />
                    </div>
                    <h1 className="text-3xl font-bold">Payment Successful!</h1>
                    <p className="text-muted-foreground max-w-md">
                        Your order has been confirmed and sent to the shop. You can track your delivery status below.
                    </p>
                    {orderTotal > 0 && (
                        <p className="text-lg font-semibold text-emerald-600">R {orderTotal.toFixed(2)} paid</p>
                    )}
                    <div className="flex gap-4">
                        <Button onClick={() => navigate("/customer/tracking")} className="w-40">
                            Track Order
                        </Button>
                        <Button variant="outline" onClick={() => navigate("/customer/products")} className="w-40">
                            Continue Shopping
                        </Button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="customer">
            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold tracking-tight">Payment Method</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>Select Payment Option</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                            <div className={`flex items-center justify-between space-x-2 border p-4 rounded-md ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : ''}`}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="card" id="card" />
                                    <Label htmlFor="card" className="flex items-center gap-2 font-medium cursor-pointer">
                                        <CreditCard className="h-4 w-4" /> Credit / Debit Card
                                    </Label>
                                </div>
                                <span className="text-xs text-muted-foreground">via PayStack</span>
                            </div>
                        </RadioGroup>

                        {paymentMethod === "card" && (
                            <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                                <p>You'll be redirected to PayStack's secure payment page to complete your card payment.</p>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full h-12 text-lg" onClick={handlePayment} disabled={processing || orderTotal === 0}>
                            {processing ? "Processing..." : orderTotal > 0 ? `Pay R ${orderTotal.toFixed(2)}` : "No amount due"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default CustomerPayment;
