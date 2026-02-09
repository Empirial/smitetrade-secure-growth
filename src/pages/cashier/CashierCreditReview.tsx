import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ShieldCheck, AlertCircle, Medal } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

// Mock Data for Cashier View (In real app, we'd fetch this using a function from CreditContext exposed for "Admin/Cashier")
const mockDatabase: Record<string, any> = {
    "0821234567": { name: "Lufuno Mphela", phone: "082 123 4567", score: 3.2, tier: "Gold", limit: 5000, balance: 1200 },
    "0729998888": { name: "Thabo Mbeki", phone: "072 999 8888", score: 105, tier: "Bronze", limit: 1000, balance: 900 }
};

const CashierCreditReview = () => {
    const [query, setQuery] = useState("");
    const [result, setResult] = useState<any>(null);

    const handleSearch = () => {
        // In real app: await searchCustomerByPhone(query)
        const hit = mockDatabase[query];
        if (hit) {
            setResult(hit);
        } else {
            setResult(null);
        }
    };

    const getTierBadge = (tier: string) => {
        switch (tier) {
            case 'Platinum': return <Badge className="bg-indigo-500 hover:bg-indigo-600">Platinum Member</Badge>;
            case 'Gold': return <Badge className="bg-amber-400 hover:bg-amber-500 text-black">Gold Member</Badge>;
            case 'Silver': return <Badge className="bg-slate-400 hover:bg-slate-500">Silver Member</Badge>;
            default: return <Badge variant="destructive">Risk Alert</Badge>;
        }
    };

    return (
        <DashboardLayout role="cashier">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">Customer Credit Lookup</h1>
                    <p className="text-muted-foreground">Verify SS-ID and SpazaScore Tier before authorizing credit.</p>
                </div>

                <Card className="border-t-4 border-t-amber-500 shadow-lg">
                    <CardHeader>
                        <CardTitle>Search Customer</CardTitle>
                        <CardDescription>Enter Phone Number or Scan SS-ID QR</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="e.g. 082 123 4567"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                            <Button onClick={handleSearch} className="bg-amber-600 hover:bg-amber-700">
                                <Search className="mr-2 h-4 w-4" /> Lookup
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Try "0821234567" (Gold) or "0729998888" (Bronze)</p>
                    </CardContent>
                </Card>

                {result && (
                    <Card className="animate-in fade-in slide-in-from-bottom-4 border-2 border-emerald-500/20">
                        <CardHeader className="bg-slate-50 border-b">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <CardTitle className="text-xl">{result.name}</CardTitle>
                                        <ShieldCheck className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <CardDescription>{result.phone}</CardDescription>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    {getTierBadge(result.tier)}
                                    <span className="text-xs font-mono text-muted-foreground">BRI: {result.score}%</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 grid gap-6">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                                    <div className="text-xs text-emerald-600 font-medium uppercase tracking-wider mb-1">Available Credit</div>
                                    <div className="text-2xl font-bold text-emerald-700">R {result.limit - result.balance}</div>
                                </div>
                                <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                                    <div className="text-xs text-red-600 font-medium uppercase tracking-wider mb-1">Due Now</div>
                                    <div className="text-2xl font-bold text-red-700">R {result.balance}</div>
                                </div>
                            </div>

                            {/* Decision Support */}
                            <div className={`p-4 rounded-md border ${result.tier === 'Bronze' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                                <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                                    {result.tier === 'Bronze' ? <AlertCircle className="h-4 w-4 text-red-600" /> : <Medal className="h-4 w-4 text-green-600" />}
                                    System Recommendation
                                </h4>
                                <p className="text-sm">
                                    {result.tier === 'Gold' || result.tier === 'Platinum'
                                        ? "✅ SAFE TO LEND. This customer pays promptly. Apply 0% interest on staples."
                                        : result.tier === 'Silver'
                                            ? "⚠️ CAUTION. Verify ID manually. Standard interest rates apply."
                                            : "⛔ HIGH RISK. Do not extend further credit until balance is settled."}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={result.tier === 'Bronze'}>
                                    Authorize New Sale
                                </Button>
                                <Button variant="outline" className="w-full" onClick={() => setResult(null)}>Close</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {!result && query && query.length > 5 && (
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="flex items-center gap-4 p-6 text-red-700">
                            <AlertCircle />
                            <div>
                                <p className="font-bold">Customer Not Found</p>
                                <p className="text-sm">Ask them to register on the Customer App to build their SpazaScore.</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
};

export default CashierCreditReview;
