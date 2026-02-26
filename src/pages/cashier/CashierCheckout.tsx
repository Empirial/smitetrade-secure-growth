import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, CreditCard, Banknote, Landmark, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CashierCheckout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { placeOrder } = useStore();
    const { cart, total } = location.state || { cart: [], total: 0 };
    const [success, setSuccess] = useState(false);

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState<"Select" | "Cash" | "Card" | "SS-ID">("Select");
    const [amountTendered, setAmountTendered] = useState<string>("");
    const [changeDue, setChangeDue] = useState<number>(0);

    // Split Payments State
    const [isSplitPayment, setIsSplitPayment] = useState(false);
    const [splitAmounts, setSplitAmounts] = useState({ cash: "", card: "", ssid: "" });

    // Calculate change dynamically
    useEffect(() => {
        if (paymentMethod === "Cash" && amountTendered) {
            const tendered = parseFloat(amountTendered);
            if (!isNaN(tendered) && tendered >= total) {
                setChangeDue(tendered - total);
            } else {
                setChangeDue(0);
            }
        }
    }, [amountTendered, total, paymentMethod]);

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
        // Validate Cash payment
        if (paymentMethod === "Cash" || isSplitPayment) {
            let totalPaid = 0;
            if (isSplitPayment) {
                totalPaid += parseFloat(splitAmounts.cash || "0");
                totalPaid += parseFloat(splitAmounts.card || "0");
                totalPaid += parseFloat(splitAmounts.ssid || "0");
            } else if (paymentMethod === "Cash") {
                totalPaid = parseFloat(amountTendered || "0");
            }

            if (!isSplitPayment && paymentMethod === "Cash" && totalPaid < total) {
                // For simple cash pay, cannot be less than total
                alert("Amount tendered is less than the total due.");
                return;
            }

            if (isSplitPayment && Math.abs(totalPaid - total) > 0.01) {
                // For split payments, must match exactly
                // Provide small tolerance for float issues
                if (totalPaid < total) {
                    alert(`Split payments are short by R ${(total - totalPaid).toFixed(2)}`);
                    return;
                }
            }
        }

        // Place the order in the system
        await placeOrder({
            name: "Walk-in Customer",
            address: "In-Store",
            items: cart, // CashierPOS local cart synced to this payload
            paymentMethod: isSplitPayment ? "Split" : paymentMethod,
        });

        setSuccess(true);
    };

    const handleSplitAmountChange = (method: 'cash' | 'card' | 'ssid', value: string) => {
        setSplitAmounts(prev => ({ ...prev, [method]: value }));
    };

    const splitTotalPaid = parseFloat(splitAmounts.cash || "0") + parseFloat(splitAmounts.card || "0") + parseFloat(splitAmounts.ssid || "0");
    const splitBalance = total - splitTotalPaid;

    return (
        <DashboardLayout role="cashier">
            <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8">
                <div>
                    <h1 className="text-2xl font-bold mb-4">Payment Selection</h1>

                    {!isSplitPayment && paymentMethod === "Select" && (
                        <div className="grid gap-4">
                            <Card className="cursor-pointer hover:border-emerald-500 transition-all border-2 border-transparent" onClick={() => setPaymentMethod("Cash")}>
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className="bg-green-100 p-3 rounded-lg"><Banknote className="text-green-600" /></div>
                                    <div>
                                        <CardTitle>Cash Payment</CardTitle>
                                        <CardDescription>Receive cash from customer</CardDescription>
                                    </div>
                                </CardHeader>
                            </Card>
                            <Card className="cursor-pointer hover:border-blue-500 transition-all border-2 border-transparent" onClick={() => { setPaymentMethod("Card"); handlePay(); }}>
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className="bg-blue-100 p-3 rounded-lg"><CreditCard className="text-blue-600" /></div>
                                    <div>
                                        <CardTitle>Card Machine</CardTitle>
                                        <CardDescription>Use card terminal</CardDescription>
                                    </div>
                                </CardHeader>
                            </Card>
                            <Card className="cursor-pointer hover:border-amber-500 transition-all border-2 border-transparent" onClick={() => { setPaymentMethod("SS-ID"); handlePay(); }}>
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className="bg-amber-100 p-3 rounded-lg"><Landmark className="text-amber-600" /></div>
                                    <div>
                                        <CardTitle>SS-ID Credit</CardTitle>
                                        <CardDescription>Pay using SpazaScore Credit</CardDescription>
                                    </div>
                                </CardHeader>
                            </Card>

                            <Button variant="outline" className="w-full mt-4 h-12 border-dashed" onClick={() => setIsSplitPayment(true)}>
                                Split Payment (Multiple Methods)
                            </Button>
                        </div>
                    )}

                    {paymentMethod === "Cash" && !isSplitPayment && (
                        <Card className="border-emerald-500 border-2">
                            <CardHeader>
                                <div className="flex items-center gap-2 pb-4">
                                    <Button variant="ghost" size="icon" onClick={() => setPaymentMethod("Select")} className="h-8 w-8 -ml-2">
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                    <CardTitle className="text-xl">Cash Payment</CardTitle>
                                </div>
                                <div className="space-y-6 pt-2">
                                    <div className="space-y-2">
                                        <Label className="text-lg">Amount Tendered (R)</Label>
                                        <Input
                                            type="number"
                                            className="text-2xl h-14 font-bold tracking-wider"
                                            placeholder="0.00"
                                            autoFocus
                                            value={amountTendered}
                                            onChange={(e) => setAmountTendered(e.target.value)}
                                        />
                                    </div>
                                    <div className={`p-4 rounded-lg flex justify-between items-center ${changeDue > 0 ? 'bg-emerald-100' : (amountTendered && parseFloat(amountTendered) < total) ? 'bg-red-100' : 'bg-slate-100'}`}>
                                        <span className="text-lg font-medium">
                                            {changeDue > 0 ? 'Change Due:' : (amountTendered && parseFloat(amountTendered) < total) ? 'Short By:' : 'Change Due:'}
                                        </span>
                                        <span className={`text-2xl font-bold ${changeDue > 0 ? 'text-emerald-700' : (amountTendered && parseFloat(amountTendered) < total) ? 'text-red-700' : 'text-muted-foreground'}`}>
                                            R {changeDue > 0 ? changeDue.toFixed(2) : (amountTendered && parseFloat(amountTendered) < total) ? (total - parseFloat(amountTendered)).toFixed(2) : '0.00'}
                                        </span>
                                    </div>
                                    <Button
                                        className="w-full h-14 text-lg bg-emerald-600 hover:bg-emerald-700"
                                        disabled={!amountTendered || parseFloat(amountTendered) < total}
                                        onClick={handlePay}
                                    >
                                        Confirm & Print Receipt
                                    </Button>
                                </div>
                            </CardHeader>
                        </Card>
                    )}

                    {isSplitPayment && (
                        <Card className="border-indigo-500 border-2">
                            <CardHeader>
                                <div className="flex items-center gap-2 pb-4">
                                    <Button variant="ghost" size="icon" onClick={() => setIsSplitPayment(false)} className="h-8 w-8 -ml-2">
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                    <CardTitle className="text-xl">Split Payment</CardTitle>
                                </div>
                                <div className="space-y-4 pt-2">
                                    <div className="space-y-2">
                                        <Label>Cash Amount (R)</Label>
                                        <Input type="number" placeholder="0.00" value={splitAmounts.cash} onChange={(e) => handleSplitAmountChange('cash', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Card Amount (R)</Label>
                                        <Input type="number" placeholder="0.00" value={splitAmounts.card} onChange={(e) => handleSplitAmountChange('card', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>SS-ID Credit (R)</Label>
                                        <Input type="number" placeholder="0.00" value={splitAmounts.ssid} onChange={(e) => handleSplitAmountChange('ssid', e.target.value)} />
                                    </div>

                                    <div className={`p-4 rounded-lg flex justify-between items-center ${splitBalance === 0 ? 'bg-green-100' : splitBalance < 0 ? 'bg-red-100' : 'bg-slate-100'}`}>
                                        <span className="font-medium">{splitBalance > 0 ? 'Balance Remaining:' : splitBalance < 0 ? 'Overpaid (Change):' : 'Fully Paid:'}</span>
                                        <span className={`text-xl font-bold ${splitBalance === 0 ? 'text-green-700' : splitBalance < 0 ? 'text-red-700' : ''}`}>
                                            R {Math.abs(splitBalance).toFixed(2)}
                                        </span>
                                    </div>

                                    <Button
                                        className={`w-full h-12 ${splitBalance === 0 ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                                        disabled={splitBalance > 0}
                                        onClick={handlePay}
                                    >
                                        {splitBalance === 0 ? 'Complete Payment' : splitBalance < 0 ? 'Give Change & Complete' : 'Awaiting Full Payment'}
                                    </Button>
                                </div>
                            </CardHeader>
                        </Card>
                    )}
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
