import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ShieldCheck, AlertCircle, Medal, Scan } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useCredit } from "@/context/CreditContext";
import { Borrower } from "@/types";

const CashierCreditReview = () => {
    const { borrowers } = useCredit(); // Use shared data
    const [query, setQuery] = useState("");
    const [result, setResult] = useState<Borrower | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    const handleSearch = () => {
        // Search by Phone or ID (SS-ID)
        const hit = borrowers?.find((b: Borrower) => b.id === query || b.phone === query || b.name.toLowerCase().includes(query.toLowerCase()));
        if (hit) {
            setResult(hit);
        } else {
            setResult(null);
        }
    };



    const getTierBadge = (rating: string) => {
        // Map rating text to badges
        switch (rating) {
            case 'Excellent': case 'Gold': return <Badge className="bg-amber-400 hover:bg-amber-500 text-black">Gold Member</Badge>;
            case 'Good': case 'Silver': return <Badge className="bg-slate-400 hover:bg-slate-500">Silver Member</Badge>;
            default: return <Badge variant="destructive">Risk / New</Badge>;
        }
    };

    return (
        <DashboardLayout role="cashier">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">Customer Credit Lookup</h1>
                    <p className="text-muted-foreground">Verify SS-ID and SpazaScore Tier before authorizing credit.</p>
                </div>

                <Card className="border-t-4 border-t-amber-500 shadow-lg bg-slate-900 border-slate-800 text-white">
                    <CardHeader>
                        <CardTitle>Search Customer</CardTitle>
                        <CardDescription className="text-slate-400">Enter SS-ID Number or Name</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="e.g. 9001015009087"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-500"
                            />
                            <Button onClick={handleSearch} className="bg-amber-600 hover:bg-amber-700 text-white">
                                <Search className="mr-2 h-4 w-4" /> Lookup
                            </Button>
                        </div>
                        <p className="text-xs text-slate-400">Try "9001015009087" (Gold) or "8505055009088" (Bronze)</p>
                    </CardContent>
                </Card>

                {result && (
                    <Card className="animate-in fade-in slide-in-from-bottom-4 border-2 border-emerald-500/20 bg-slate-900 text-white">
                        <CardHeader className="bg-slate-950/50 border-b border-slate-800">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <CardTitle className="text-xl">{result.name}</CardTitle>
                                        <ShieldCheck className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <CardDescription className="text-slate-400">{result.phone}</CardDescription>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    {getTierBadge(result.rating)}
                                    <span className="text-xs font-mono text-slate-400">BRI: {result.score}%</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 grid gap-6">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                    <div className="text-xs text-emerald-400 font-medium uppercase tracking-wider mb-1">Available Credit</div>
                                    <div className="text-2xl font-bold text-emerald-500">R {(result.limit || 0) - (result.balance || 0)}</div>
                                </div>
                                <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                                    <div className="text-xs text-red-400 font-medium uppercase tracking-wider mb-1">Due Now</div>
                                    <div className="text-2xl font-bold text-red-500">R {result.balance || 0}</div>
                                </div>
                            </div>

                            {/* Decision Support */}
                            <div className={`p-4 rounded-md border text-slate-200 ${result.rating === 'Risk' ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                                <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                                    {result.rating === 'Risk' ? <AlertCircle className="h-4 w-4 text-red-500" /> : <Medal className="h-4 w-4 text-emerald-500" />}
                                    System Recommendation
                                </h4>
                                <p className="text-sm">
                                    {result.rating === 'Good' || result.rating === 'Gold'
                                        ? "✅ SAFE TO LEND. This customer pays promptly. Apply 0% interest on staples."
                                        : result.rating === 'Silver'
                                            ? "⚠️ CAUTION. Verify ID manually. Standard interest rates apply."
                                            : "⛔ HIGH RISK. Do not extend further credit until balance is settled."}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={result.rating === 'Risk'}>
                                    Authorize New Sale
                                </Button>
                                <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white" onClick={() => setResult(null)}>Close</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* List of recent/suggested borrowers if no result */}
                {!result && !query && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Recent Customers</h3>
                        {borrowers.map((b) => (
                            <Card key={b.id} className="bg-slate-900 border-slate-800 text-white hover:border-emerald-500/50 hover:bg-slate-800/50 cursor-pointer transition-colors" onClick={() => setResult(b)}>
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-300">
                                            {b.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-semibold">{b.name}</div>
                                            <div className="text-xs text-slate-400">{b.ssid}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-sm font-bold ${b.rating === 'Good' ? 'text-emerald-500' : 'text-amber-500'}`}>{b.rating}</div>
                                        <div className="text-xs text-slate-400">{b.score}% BRI</div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {!result && query && query.length > 5 && (
                    <Card className="border-red-500/20 bg-red-500/10 text-red-400">
                        <CardContent className="flex items-center gap-4 p-6">
                            <AlertCircle />
                            <div>
                                <p className="font-bold">Customer Not Found</p>
                                <p className="text-sm text-red-300/80">Ask them to register on the Customer App to build their SpazaScore.</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="text-xs text-muted-foreground text-center max-w-2xl mx-auto space-y-1 pt-8 mt-8 border-t">
                <p className="font-semibold">Smitetrade provides scoring and risk-assessment insights for decision-support purposes only.</p>
                <p>The platform does not provide credit, approve or decline loans, extend goods on credit, or make tenancy decisions.</p>
                <p>All lending, goods-on-credit, and rental decisions remain the sole responsibility of the lender, spaza shop owner, or landlord.</p>
                <p>Smitetrade does not act as a credit provider, financial adviser, or credit bureau.</p>
            </div>
        </DashboardLayout>
    );
};

export default CashierCreditReview;
