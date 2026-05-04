import { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, query, where } from "firebase/firestore";
import { Store, Order, StorePayout, PayoutDetails } from "@/types";
import { Wallet, Banknote, CreditCard, ChevronDown, ChevronUp, Building2, CheckCircle2 } from "lucide-react";

interface StoreWithPayout extends Store {
    payoutDetails?: PayoutDetails;
    payfastMerchantId?: string;
}

const AdminPayouts = () => {
    const { user } = useStore();
    const { toast } = useToast();

    const [stores, setStores] = useState<StoreWithPayout[]>([]);
    const [deliveredOrders, setDeliveredOrders] = useState<Order[]>([]);
    const [payouts, setPayouts] = useState<StorePayout[]>([]);
    const [expandedStore, setExpandedStore] = useState<string | null>(null);
    const [payoutDialog, setPayoutDialog] = useState<{
        storeId: string;
        storeName: string;
        outstanding: number;
        bankDetails?: PayoutDetails;
        payfastMerchantId?: string;
    } | null>(null);
    const [payoutAmount, setPayoutAmount] = useState('');
    const [payoutNote, setPayoutNote] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        return onSnapshot(collection(db, 'stores'), snap => {
            setStores(snap.docs.map(d => ({ id: d.id, ...d.data() } as StoreWithPayout)));
        });
    }, []);

    useEffect(() => {
        const q = query(collection(db, 'orders'), where('status', '==', 'Delivered'));
        return onSnapshot(q, snap => {
            setDeliveredOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
        });
    }, []);

    useEffect(() => {
        return onSnapshot(collection(db, 'payouts'), snap => {
            setPayouts(snap.docs.map(d => ({ id: d.id, ...d.data() } as StorePayout)));
        });
    }, []);

    const summaries = stores
        .filter(s => s.status === 'Active')
        .map(store => {
            const earnings = deliveredOrders
                .filter(o => o.storeId === store.id)
                .reduce((sum, o) => sum + o.total, 0);
            const paidOut = payouts
                .filter(p => p.storeId === store.id)
                .reduce((sum, p) => sum + p.amount, 0);
            const payoutHistory = payouts
                .filter(p => p.storeId === store.id)
                .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime());
            return { store, earnings, paidOut, outstanding: Math.max(0, earnings - paidOut), payoutHistory };
        });

    const totalEarnings = summaries.reduce((sum, s) => sum + s.earnings, 0);
    const totalPaidOut = summaries.reduce((sum, s) => sum + s.paidOut, 0);
    const totalOutstanding = summaries.reduce((sum, s) => sum + s.outstanding, 0);

    const openPayoutDialog = (summary: typeof summaries[0]) => {
        setPayoutAmount(summary.outstanding.toFixed(2));
        setPayoutNote('');
        setPayoutDialog({
            storeId: summary.store.id,
            storeName: summary.store.name,
            outstanding: summary.outstanding,
            bankDetails: summary.store.payoutDetails,
            payfastMerchantId: summary.store.payfastMerchantId,
        });
    };

    const handlePayout = async () => {
        if (!payoutDialog || !user) return;
        const amount = parseFloat(payoutAmount);
        if (isNaN(amount) || amount <= 0) { toast({ title: 'Invalid amount', variant: 'destructive' }); return; }
        setIsProcessing(true);
        try {
            await addDoc(collection(db, 'payouts'), {
                storeId: payoutDialog.storeId,
                storeName: payoutDialog.storeName,
                amount,
                note: payoutNote.trim(),
                paidAt: new Date().toISOString(),
                processedBy: user.uid,
            });
            toast({ title: 'Payout recorded', description: `R ${amount.toFixed(2)} recorded for ${payoutDialog.storeName}` });
            setPayoutDialog(null);
        } catch {
            toast({ title: 'Error', description: 'Failed to record payout.', variant: 'destructive' });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <DashboardLayout role="admin">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Store Payouts</h1>
                <p className="text-muted-foreground">Manage earnings and process payouts for all store owners.</p>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-6">
                <Card className="bg-emerald-500/10 border-emerald-500/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-400 flex justify-between">Platform Revenue <Wallet className="h-4 w-4" /></CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-300">R {totalEarnings.toFixed(2)}</div>
                        <p className="text-xs text-emerald-400 mt-1">All delivered orders</p>
                    </CardContent>
                </Card>
                <Card className="bg-sky-500/10 border-sky-500/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-sky-400 flex justify-between">Total Paid Out <Banknote className="h-4 w-4" /></CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-sky-300">R {totalPaidOut.toFixed(2)}</div>
                        <p className="text-xs text-sky-400 mt-1">Processed payouts</p>
                    </CardContent>
                </Card>
                <Card className="bg-amber-500/10 border-amber-500/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-amber-400 flex justify-between">Outstanding <CreditCard className="h-4 w-4" /></CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-300">R {totalOutstanding.toFixed(2)}</div>
                        <p className="text-xs text-amber-400 mt-1">Awaiting payout</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Store Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {summaries.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">No active stores found.</div>
                    ) : (
                        <div className="divide-y">
                            {summaries.map(({ store, earnings, paidOut, outstanding, payoutHistory }) => {
                                const isExpanded = expandedStore === store.id;
                                const method = store.payfastMerchantId ? 'payfast' : store.payoutDetails?.accountNumber ? 'bank' : 'none';
                                return (
                                    <div key={store.id}>
                                        <div className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors">
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                    <Building2 className="h-4 w-4 text-primary" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-medium truncate">{store.name}</div>
                                                    <div className="text-xs text-muted-foreground truncate">{store.city || store.address || '—'}</div>
                                                </div>
                                            </div>
                                            <div className="hidden sm:flex items-center gap-8 mx-6">
                                                <div className="text-right">
                                                    <div className="text-xs text-muted-foreground">Earnings</div>
                                                    <div className="font-semibold text-sm">R {earnings.toFixed(2)}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs text-muted-foreground">Paid Out</div>
                                                    <div className="font-semibold text-sm text-sky-500">R {paidOut.toFixed(2)}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs text-muted-foreground">Outstanding</div>
                                                    <div className={`font-bold text-sm ${outstanding > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                                        R {outstanding.toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4 shrink-0">
                                                <Badge variant="outline" className={
                                                    method === 'payfast' ? 'border-blue-500/40 text-blue-400' :
                                                    method === 'bank' ? 'border-emerald-500/40 text-emerald-400' :
                                                    'border-muted text-muted-foreground'
                                                }>
                                                    {method === 'payfast' ? 'PayFast' : method === 'bank' ? 'Bank' : 'No details'}
                                                </Badge>
                                                <Button size="sm" disabled={outstanding <= 0}
                                                    onClick={() => openPayoutDialog({ store, earnings, paidOut, outstanding, payoutHistory })}>
                                                    Pay Out
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => setExpandedStore(isExpanded ? null : store.id)}>
                                                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="px-6 pb-4 bg-muted/20">
                                                <div className="sm:hidden grid grid-cols-3 gap-4 py-3 border-b mb-3 text-sm">
                                                    <div><div className="text-xs text-muted-foreground">Earnings</div><div className="font-semibold">R {earnings.toFixed(2)}</div></div>
                                                    <div><div className="text-xs text-muted-foreground">Paid Out</div><div className="font-semibold text-sky-500">R {paidOut.toFixed(2)}</div></div>
                                                    <div><div className="text-xs text-muted-foreground">Outstanding</div><div className={`font-bold ${outstanding > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>R {outstanding.toFixed(2)}</div></div>
                                                </div>

                                                {method === 'bank' && store.payoutDetails && (
                                                    <div className="text-sm py-2 space-y-1">
                                                        <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider mb-2">Bank Details</p>
                                                        <p><span className="text-muted-foreground">Holder:</span> {store.payoutDetails.accountHolder}</p>
                                                        <p><span className="text-muted-foreground">Bank:</span> {store.payoutDetails.bankName} — {store.payoutDetails.accountType}</p>
                                                        <p><span className="text-muted-foreground">Account:</span> {store.payoutDetails.accountNumber} | Branch: {store.payoutDetails.branchCode}</p>
                                                    </div>
                                                )}
                                                {method === 'payfast' && (
                                                    <div className="text-sm py-2">
                                                        <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider mb-2">PayFast Details</p>
                                                        <p><span className="text-muted-foreground">Merchant ID:</span> {store.payfastMerchantId}</p>
                                                    </div>
                                                )}
                                                {method === 'none' && (
                                                    <p className="text-sm text-muted-foreground py-2">Owner has not added payout details yet.</p>
                                                )}

                                                <Separator className="my-3" />
                                                <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider mb-2">Payout History</p>
                                                {payoutHistory.length === 0 ? (
                                                    <p className="text-sm text-muted-foreground">No payouts recorded yet.</p>
                                                ) : (
                                                    <div className="space-y-2">
                                                        {payoutHistory.map(p => (
                                                            <div key={p.id} className="flex items-center justify-between text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                                                    <span className="text-muted-foreground">
                                                                        {new Date(p.paidAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                        {p.note && ` — ${p.note}`}
                                                                    </span>
                                                                </div>
                                                                <span className="font-semibold text-emerald-400">R {p.amount.toFixed(2)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={!!payoutDialog} onOpenChange={() => setPayoutDialog(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Record Payout</DialogTitle>
                        <DialogDescription>
                            Recording a payout for <strong>{payoutDialog?.storeName}</strong>.
                            Outstanding: <strong>R {payoutDialog?.outstanding.toFixed(2)}</strong>
                        </DialogDescription>
                    </DialogHeader>
                    {payoutDialog?.bankDetails && (
                        <div className="rounded-lg border p-3 bg-muted/30 text-sm space-y-1">
                            <p className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-1">Transfer To</p>
                            <p>{payoutDialog.bankDetails.accountHolder} — {payoutDialog.bankDetails.bankName}</p>
                            <p>Acc: {payoutDialog.bankDetails.accountNumber} | Branch: {payoutDialog.bankDetails.branchCode}</p>
                        </div>
                    )}
                    {payoutDialog?.payfastMerchantId && !payoutDialog.bankDetails && (
                        <div className="rounded-lg border p-3 bg-blue-500/5 border-blue-500/20 text-sm">
                            <p className="text-muted-foreground">PayFast Merchant ID: <strong>{payoutDialog.payfastMerchantId}</strong></p>
                        </div>
                    )}
                    <div className="space-y-4 py-2">
                        <div className="grid gap-2">
                            <Label>Payout Amount (R)</Label>
                            <Input type="number" step="0.01" min="0" value={payoutAmount} onChange={e => setPayoutAmount(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Note (optional)</Label>
                            <Input placeholder="e.g. April 2026 payout" value={payoutNote} onChange={e => setPayoutNote(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPayoutDialog(null)}>Cancel</Button>
                        <Button onClick={handlePayout} disabled={isProcessing}>
                            {isProcessing ? 'Recording...' : 'Confirm Payout'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default AdminPayouts;
