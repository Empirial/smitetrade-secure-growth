import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, CreditCard, Banknote, Landmark, ArrowLeft } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useStore } from "@/context/StoreContext";
import { useCredit } from "@/context/CreditContext";
import { Borrower } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePayfast } from "@/hooks/usePayfast";
import { toast } from "sonner";

const CashierCheckout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { placeOrder, currentStore, user } = useStore();
    const { borrowers } = useCredit();
    const { cart, total } = location.state || { cart: [], total: 0 };
    const [success, setSuccess] = useState(false);

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState<"Select" | "Cash" | "Card" | "SS-ID">("Select");
    const [amountTendered, setAmountTendered] = useState<string>("");
    const [changeDue, setChangeDue] = useState<number>(0);

    // SS-ID Payment State
    const [ssidInput, setSsidInput] = useState("");
    const [ssidCustomer, setSsidCustomer] = useState<Borrower | null>(null);
    const [ssidError, setSsidError] = useState("");

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

    const completeTransaction = useCallback(async () => {
        await placeOrder({
            name: ssidCustomer ? ssidCustomer.name : "Walk-in Customer",
            address: "In-Store",
            items: cart,
            paymentMethod: isSplitPayment ? "Split" : paymentMethod,
        });
        setSuccess(true);
    }, [placeOrder, cart, isSplitPayment, paymentMethod, ssidCustomer]);

    const { pay: payWithCard, loading: cardProcessing } = usePayfast();

    const handleSsidSearch = () => {
        setSsidError("");
        setSsidCustomer(null);
        if (!ssidInput) {
            setSsidError("Please enter an SS-ID or Phone Number.");
            return;
        }

        const hit = borrowers?.find(b => b.id === ssidInput || b.phone === ssidInput || b.name.toLowerCase().includes(ssidInput.toLowerCase()));
        if (hit) {
            setSsidCustomer(hit);
        } else {
            setSsidError("Customer not found.");
        }
    };

    const handlePay = async () => {
        // Guard: SS-ID payments require a verified customer
        if (!isSplitPayment && paymentMethod === "SS-ID" && !ssidCustomer) {
            toast.error("Please verify the customer SS-ID / phone before completing a Store Credit payment.");
            return;
        }

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
                toast.error("Amount tendered is less than the total due.");
                return;
            }

            if (isSplitPayment && Math.abs(totalPaid - total) > 0.01) {
                if (totalPaid < total) {
                    toast.error(`Split payments are short by R ${(total - totalPaid).toFixed(2)}`);
                    return;
                }
            }
        }

        if (isSplitPayment) {
            const splitCard = parseFloat(splitAmounts.card || "0");
            const splitSsid = parseFloat(splitAmounts.ssid || "0");

            if (splitCard > 0) {
                toast.error("Split payments with a card portion are not supported yet. Please use full Card payment or remove the card amount.");
                return;
            }

            if (splitSsid > 0 && !ssidCustomer) {
                toast.error("Please verify the customer SS-ID / phone before including Store Credit in a split payment.");
                return;
            }
        }

        if (paymentMethod === "Card" && !isSplitPayment) {
            payWithCard({
                emailAddress: user?.email || 'cashier@smitetrade.co.za',
                amount: total,
                itemName: 'In-Store Purchase',
                customStr1: 'cashier',
                customStr2: currentStore?.id || '',
            });
            return;
        }

        await completeTransaction();
    };

    const handleSplitAmountChange = (method: 'cash' | 'card' | 'ssid', value: string) => {
        setSplitAmounts(prev => ({ ...prev, [method]: value }));
    };

    const splitTotalPaid = parseFloat(splitAmounts.cash || "0") + parseFloat(splitAmounts.card || "0") + parseFloat(splitAmounts.ssid || "0");
    const splitBalance = total - splitTotalPaid;

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
        );
    }

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
                            <Card className={`cursor-pointer hover:border-blue-500 transition-all border-2 border-transparent ${cardProcessing ? 'opacity-60 pointer-events-none' : ''}`} onClick={() => { setPaymentMethod("Card"); payWithCard({ emailAddress: user?.email || 'cashier@smitetrade.co.za', amount: total, itemName: 'In-Store Purchase', customStr1: 'cashier', customStr2: currentStore?.id || '' }); }}>
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className="bg-blue-100 p-3 rounded-lg"><CreditCard className="text-blue-600" /></div>
                                    <div>
                                        <CardTitle>Card Machine</CardTitle>
                                        <CardDescription>Use card terminal</CardDescription>
                                    </div>
                                </CardHeader>
                            </Card>
                            <Card className="cursor-pointer hover:border-amber-500 transition-all border-2 border-transparent" onClick={() => { setPaymentMethod("SS-ID"); setSsidInput(""); setSsidCustomer(null); setSsidError(""); }}>
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className="bg-amber-100 p-3 rounded-lg"><Landmark className="text-amber-600" /></div>
                                    <div>
                                        <CardTitle>Store Credit</CardTitle>
                                        <CardDescription>Pay using customer's Repayment behaviour account</CardDescription>
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

                    {paymentMethod === "SS-ID" && !isSplitPayment && (
                        <Card className="border-amber-500 border-2 bg-slate-900 border-slate-800 text-white">
                            <CardHeader>
                                <div className="flex items-center gap-2 pb-4">
                                    <Button variant="ghost" size="icon" onClick={() => { setPaymentMethod("Select"); setSsidCustomer(null); setSsidError(""); }} className="h-8 w-8 -ml-2 text-white hover:text-white hover:bg-slate-800">
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                    <CardTitle className="text-xl">Store Credit Payment</CardTitle>
                                </div>
                                <div className="space-y-6 pt-2">
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Customer SS-ID or Phone</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                className="text-lg h-12 bg-slate-950 border-slate-700 text-white"
                                                placeholder="e.g. 9001015009087"
                                                autoFocus
                                                value={ssidInput}
                                                onChange={(e) => setSsidInput(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handleSsidSearch()}
                                            />
                                            <Button className="h-12 bg-amber-600 hover:bg-amber-700 text-white" onClick={handleSsidSearch}>
                                                Verify
                                            </Button>
                                        </div>
                                        {ssidError && <p className="text-red-400 text-sm mt-1">{ssidError}</p>}
                                    </div>

                                    {ssidCustomer && (
                                        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-100 flex justify-between items-center animate-in fade-in slide-in-from-top-2">
                                            <div>
                                                <p className="font-bold">{ssidCustomer.name}</p>
                                                <p className="text-sm opacity-80">Store Credit Account Verified</p>
                                            </div>
                                            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                                        </div>
                                    )}

                                    <Button
                                        className="w-full h-14 text-lg bg-emerald-600 hover:bg-emerald-700"
                                        disabled={!ssidCustomer}
                                        onClick={handlePay}
                                    >
                                        Confirm & Deduct Credit
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
                                        <p className="text-xs text-muted-foreground">Partial card charges are not supported yet. Use full Card payment instead.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>SS-ID Credit (R)</Label>
                                        <Input type="number" placeholder="0.00" value={splitAmounts.ssid} onChange={(e) => handleSplitAmountChange('ssid', e.target.value)} />
                                        {parseFloat(splitAmounts.ssid || "0") > 0 && (
                                            <div className="mt-2 p-3 rounded-lg bg-amber-50 border border-amber-200 space-y-2">
                                                <Label className="text-amber-800 font-medium text-xs">Verify SS-ID Customer</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        className="text-sm h-9"
                                                        placeholder="SS-ID or Phone"
                                                        value={ssidInput}
                                                        onChange={(e) => { setSsidInput(e.target.value); setSsidCustomer(null); setSsidError(""); }}
                                                        onKeyDown={(e) => e.key === "Enter" && handleSsidSearch()}
                                                    />
                                                    <Button size="sm" className="h-9 bg-amber-600 hover:bg-amber-700 text-white" onClick={handleSsidSearch}>Verify</Button>
                                                </div>
                                                {ssidError && <p className="text-red-500 text-xs">{ssidError}</p>}
                                                {ssidCustomer && (
                                                    <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        {ssidCustomer.name} verified
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className={`p-4 rounded-lg flex justify-between items-center ${splitBalance === 0 ? 'bg-green-100' : splitBalance < 0 ? 'bg-red-100' : 'bg-slate-100'}`}>
                                        <span className="font-medium">{splitBalance > 0 ? 'Balance Remaining:' : splitBalance < 0 ? 'Overpaid (Change):' : 'Fully Paid:'}</span>
                                        <span className={`text-xl font-bold ${splitBalance === 0 ? 'text-green-700' : splitBalance < 0 ? 'text-red-700' : ''}`}>
                                            R {Math.abs(splitBalance).toFixed(2)}
                                        </span>
                                    </div>

                                    <Button
                                        className={`w-full h-12 ${splitBalance <= 0 && (!parseFloat(splitAmounts.ssid || "0") || ssidCustomer) ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                                        disabled={splitBalance > 0 || (parseFloat(splitAmounts.ssid || "0") > 0 && !ssidCustomer)}
                                        onClick={handlePay}
                                    >
                                        {parseFloat(splitAmounts.ssid || "0") > 0 && !ssidCustomer
                                            ? 'Verify SS-ID Customer First'
                                            : splitBalance === 0 ? 'Complete Payment'
                                            : splitBalance < 0 ? 'Give Change & Complete'
                                            : 'Awaiting Full Payment'}
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
