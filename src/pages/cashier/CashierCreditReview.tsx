import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, UserCheck, ShieldCheck, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const CashierCreditReview = () => {
    const [query, setQuery] = useState("");
    const [result, setResult] = useState<any>(null);

    const handleSearch = () => {
        // Mock Search
        if (query === "0821234567" || query.toLowerCase() === "lerato") {
            setResult({
                name: "Lufuno Mphela",
                phone: "082 123 4567",
                score: 750,
                status: "Excellent",
                limit: 5000,
                balance: 1200,
                lastPurchase: "2 days ago"
            });
        } else {
            setResult(null);
        }
    };

    return (
        <DashboardLayout role="cashier">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">Customer Credit Review</h1>
                    <p className="text-muted-foreground">Check SpazaScore credit availability</p>
                </div>

                <Card className="border-t-4 border-t-amber-500 shadow-lg">
                    <CardHeader>
                        <CardTitle>Search Customer</CardTitle>
                        <CardDescription>Enter phone number or SS-ID</CardDescription>
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
                                <Search className="mr-2 h-4 w-4" /> Check
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Try searching "0821234567"</p>
                    </CardContent>
                </Card>

                {result && (
                    <Card className="animate-in fade-in slide-in-from-bottom-4">
                        <CardHeader className="bg-slate-50 border-b">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl">{result.name}</CardTitle>
                                    <CardDescription>{result.phone}</CardDescription>
                                </div>
                                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 gap-1">
                                    <ShieldCheck size={14} /> Verified
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 grid gap-6">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                                    <div className="text-2xl font-bold text-emerald-700">{result.score}</div>
                                    <div className="text-xs text-emerald-600 font-medium uppercase tracking-wider">SpazaScore</div>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="text-2xl font-bold text-blue-700">R {result.limit - result.balance}</div>
                                    <div className="text-xs text-blue-600 font-medium uppercase tracking-wider">Available Credit</div>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm border-t pt-4">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Credit Limit</span>
                                    <span className="font-medium">R {result.limit.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Current Balance Owing</span>
                                    <span className="font-medium">R {result.balance.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Last Purchase</span>
                                    <span className="font-medium">{result.lastPurchase}</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Authorize Credit Sale</Button>
                                <Button variant="outline" className="w-full" onClick={() => setResult(null)}>Clear</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {!result && query && query !== "0821234567" && (
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="flex items-center gap-4 p-6 text-red-700">
                            <AlertCircle />
                            <div>
                                <p className="font-bold">Customer Not Found</p>
                                <p className="text-sm">Please allow them to register via the Customer App.</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
};

export default CashierCreditReview;
