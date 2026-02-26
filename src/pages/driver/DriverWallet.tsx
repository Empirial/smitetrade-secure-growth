import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowUpRight, ArrowDownRight, Smartphone, CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DriverWallet = () => {
    // Mock Data
    const [availableBalance, setAvailableBalance] = useState(450.00);
    const [pendingPayouts, setPendingPayouts] = useState(150.00);
    const [totalEarned, setTotalEarned] = useState(1250.00);

    const [isPayoutOpen, setIsPayoutOpen] = useState(false);
    const [payoutAmount, setPayoutAmount] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("082 123 4567"); // Mock predefined number

    const transactions = [
        { id: "TX-991", type: "earned", amount: 25.00, date: "Today, 14:30", description: "Delivery Fee: Order #1042" },
        { id: "TX-990", type: "earned", amount: 25.00, date: "Today, 13:15", description: "Delivery Fee: Order #1041" },
        { id: "TX-989", type: "earned", amount: 35.00, date: "Today, 12:00", description: "Delivery Fee (Long Distance): Order #1040" },
        { id: "TX-988", type: "payout", amount: 300.00, date: "Yesterday, 18:00", description: "CashSend Payout Processing" },
        { id: "TX-987", type: "earned", amount: 25.00, date: "Yesterday, 14:10", description: "Delivery Fee: Order #1039" },
    ];

    const handleRequestPayout = () => {
        const amount = parseFloat(payoutAmount);
        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid amount.");
            return;
        }
        if (amount > availableBalance) {
            toast.error("Insufficient funds in available balance.");
            return;
        }

        // Simulate Request
        setAvailableBalance(prev => prev - amount);
        setPendingPayouts(prev => prev + amount);
        setIsPayoutOpen(false);
        setPayoutAmount("");

        toast.success(`Payout of R${amount.toFixed(2)} requested via CashSend to ${phoneNumber}.`);
    };

    return (
        <DashboardLayout role="driver">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Driver Wallet</h1>
                    <p className="text-muted-foreground">Track your earnings and request payouts.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="bg-emerald-600 text-primary-foreground">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-emerald-100">Available to Withdraw</CardTitle>
                            <Wallet className="w-4 h-4 text-emerald-100" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">R {availableBalance.toFixed(2)}</div>
                            <p className="text-xs text-emerald-200 mt-1">Ready for CashSend</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
                            <Clock className="w-4 h-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">R {pendingPayouts.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground mt-1">Processing...</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Total Earned (All Time)</CardTitle>
                            <ArrowUpRight className="w-4 h-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">R {totalEarned.toFixed(2)}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-start">
                    <Dialog open={isPayoutOpen} onOpenChange={setIsPayoutOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 h-12 px-8">
                                <Smartphone className="mr-2 h-5 w-5" />
                                Request CashSend Payout
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Request Payout</DialogTitle>
                                <DialogDescription>
                                    Withdraw your earnings to your registered phone number via instant CashSend.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label>Available Balance</Label>
                                    <div className="text-xl font-bold text-emerald-600">R {availableBalance.toFixed(2)}</div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Withdrawal Amount (R)</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="0.00"
                                        value={payoutAmount}
                                        onChange={(e) => setPayoutAmount(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-2 border-t pt-4">
                                    <Label>Receiving Phone Number</Label>
                                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border rounded-md text-slate-500">
                                        <Smartphone className="h-4 w-4" />
                                        <span>{phoneNumber}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">To change your registered number, please contact Owner Support.</p>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsPayoutOpen(false)}>Cancel</Button>
                                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleRequestPayout}>Confirm Payout</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>Your latest earnings and withdrawals.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {transactions.map((tx) => (
                                <div key={tx.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-full ${tx.type === 'earned' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                                            {tx.type === 'earned' ? (
                                                <ArrowDownRight className={`h-4 w-4 text-emerald-600`} />
                                            ) : (
                                                <ArrowUpRight className={`h-4 w-4 text-amber-600`} />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{tx.description}</p>
                                            <p className="text-xs text-muted-foreground">{tx.date} • {tx.id}</p>
                                        </div>
                                    </div>
                                    <div className={`font-bold ${tx.type === 'earned' ? 'text-emerald-600' : ''}`}>
                                        {tx.type === 'earned' ? '+' : '-'} R{tx.amount.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default DriverWallet;
