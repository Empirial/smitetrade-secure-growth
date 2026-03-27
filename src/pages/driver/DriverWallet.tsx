import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useStore } from "@/context/StoreContext";
import { usePayfast } from "@/hooks/usePayfast";

const DriverWallet = () => {
    const { user } = useStore();
    const { pay, loading } = usePayfast();

    const [availableBalance, setAvailableBalance] = useState(0);
    const [pendingPayouts, setPendingPayouts] = useState(0);
    const [totalEarned, setTotalEarned] = useState(0);
    const [transactions, setTransactions] = useState<{ id: string; type: string; amount: number; date: string; description: string }[]>([]);

    useEffect(() => {
        if (!user?.uid) return;

        const q = query(collection(db, "driver_payouts"), where("driverId", "==", user.uid));
        const unsub = onSnapshot(q, (snapshot) => {
            let earned = 0;
            let pending = 0;
            const txList: typeof transactions = [];

            snapshot.forEach((docSnap) => {
                const d = docSnap.data();
                const amount = d.amount ?? 0;
                const status = d.status ?? "pending";
                const type = d.type ?? "earned";

                if (type === "earned") earned += amount;
                if (status === "pending" && type === "payout") pending += amount;

                txList.push({
                    id: docSnap.id,
                    type,
                    amount,
                    date: d.createdAt
                        ? new Date(d.createdAt).toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short" })
                        : "—",
                    description: d.description ?? (type === "earned" ? "Delivery Fee" : "Payout"),
                });
            });

            txList.sort((a, b) => b.id.localeCompare(a.id));

            setTotalEarned(earned);
            setPendingPayouts(pending);
            setAvailableBalance(Math.max(0, earned - pending));
            setTransactions(txList);
        });

        return () => unsub();
    }, [user?.uid]);

    const handleRequestPayout = () => {
        if (!user) return;
        pay({
            emailAddress: user.email,
            amount: availableBalance,
            itemName: "Driver Earnings Payout",
            customStr1: "driver_payout",
            customStr2: user.uid,
        });
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

                <div className="flex flex-col items-start gap-2">
                    <Button
                        className="bg-emerald-600 hover:bg-emerald-700 h-12 px-8"
                        onClick={handleRequestPayout}
                        disabled={availableBalance <= 0 || loading}
                    >
                        <Wallet className="mr-2 h-5 w-5" />
                        {loading ? "Redirecting..." : "Request Payout via PayFast"}
                    </Button>
                    <p className="text-xs text-muted-foreground">Payouts are processed within 1-2 business days</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>Your latest earnings and withdrawals.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {transactions.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-6">No transactions yet.</p>
                            ) : (
                                transactions.map((tx) => (
                                    <div key={tx.id} className="flex justify-between items-center p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-full ${tx.type === 'earned' ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
                                                {tx.type === 'earned' ? (
                                                    <ArrowDownRight className="h-4 w-4 text-emerald-500" />
                                                ) : (
                                                    <ArrowUpRight className="h-4 w-4 text-amber-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{tx.description}</p>
                                                <p className="text-xs text-muted-foreground">{tx.date} • {tx.id}</p>
                                            </div>
                                        </div>
                                        <div className={`font-bold ${tx.type === 'earned' ? 'text-emerald-500' : ''}`}>
                                            {tx.type === 'earned' ? '+' : '-'} R{tx.amount.toFixed(2)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default DriverWallet;
