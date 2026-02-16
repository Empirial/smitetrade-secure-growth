import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCredit } from "@/context/CreditContext";
import { Borrower } from "@/types";
import { Search, ShieldCheck, AlertTriangle, CreditCard, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { maskIdNumber } from "@/lib/utils";

const LenderCreditCheck = () => {
    const { borrowers } = useCredit();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState<Borrower & { businessName?: string; totalDebt?: number; totalPaid?: number; defaults?: number; limit?: number; status?: string } | null>(null);
    const [searched, setSearched] = useState(false);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const query = searchParams.get("q");
        if (query) {
            setSearchQuery(query);
            // Small timeout to allow state update before searching
            setTimeout(() => {
                handleSearch(query);
            }, 100);
        }
    }, [searchParams]);

    const handleSearch = (overrideQuery?: string) => {
        const queryToUse = overrideQuery || searchQuery;
        setSearched(true);

        if (!queryToUse) return;

        // Mock Data for specific user demo
        if (queryToUse.toLowerCase().includes("lufuno") || queryToUse.toLowerCase().includes("mphela")) {
            setSearchResult({
                id: "9001015009087",
                ssid: "SS-ID0001",
                name: "Lufuno Mphela",
                phone: "082 123 4567",
                email: "mphelalufuno1.0@gmail.com",
                businessName: "Mphela General Trading",
                creditScore: 780,
                rating: "Good", // Use Good/Bad/Risk terminology
                status: "Active",
                totalDebt: 0,
                totalPaid: 15,
                defaults: 0,
                limit: 50000,
                photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
            });
            return;
        }

        const result = borrowers.find((b: Borrower) =>
            b.name.toLowerCase().includes(queryToUse.toLowerCase()) ||
            b.id.toString() === queryToUse ||
            b.ssid?.toLowerCase() === queryToUse.toLowerCase()
        );
        setSearchResult(result);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Good": return "text-emerald-500";
            case "Risk": return "text-yellow-500";
            case "Bad": return "text-red-500";
            default: return "text-muted-foreground";
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Good": return "bg-emerald-500 hover:bg-emerald-600";
            case "Risk": return "bg-yellow-500 hover:bg-yellow-600";
            case "Bad": return "bg-red-500 hover:bg-red-600";
            default: return "bg-gray-500";
        }
    };

    return (
        <DashboardLayout role="lender">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Credit Check Tool</h1>
                    <p className="text-muted-foreground">Verify borrower risk profile before approving loans.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Search Borrower</CardTitle>
                        <CardDescription>Enter name, ID, or email to retrieve risk profile.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Try searching for 'Lufuno Mphela'..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button onClick={() => handleSearch()}>
                                <Search className="mr-2 h-4 w-4" /> Search
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {searched && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {searchResult ? (
                            <>
                                {/* Identity Header */}
                                <div className="flex items-center gap-6 bg-white p-6 rounded-lg border shadow-sm">
                                    <div className="h-24 w-24 rounded-full bg-gray-100 overflow-hidden border-4 border-gray-50 shadow-inner">
                                        {searchResult.photoUrl ? (
                                            <img src={searchResult.photoUrl} alt={searchResult.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-gray-400">No Photo</div>
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold tracking-tight">{searchResult.name}</h2>
                                        <div className="flex items-center gap-3 mt-2">
                                            <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200 px-3 py-1 text-sm font-mono">
                                                {searchResult.ssid || "NO SS:ID"}
                                            </Badge>
                                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Identity Verified
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <Card className="border-t-4 border-t-emerald-500">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Risk Profile</CardTitle>
                                            <ShieldCheck className={`h-4 w-4 ${getStatusColor(searchResult.rating)}`} />
                                        </CardHeader>
                                        <CardContent>
                                            <div className={`text-2xl font-bold ${getStatusColor(searchResult.rating)}`}>
                                                {searchResult.rating || "Unknown"}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Based on your thresholds
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                                            <CreditCard className="h-4 w-4 text-blue-500" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">R {searchResult.totalDebt || 0}</div>
                                            <p className="text-xs text-muted-foreground">Total outstanding debt</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Repayment History</CardTitle>
                                            <History className="h-4 w-4 text-purple-500" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{searchResult.totalPaid || 0} Paid</div>
                                            <p className="text-xs text-muted-foreground">Loans successfully repaid</p>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle>Detailed Profile</CardTitle>
                                            <Badge className={getStatusBadge(searchResult.rating)}>
                                                {searchResult.status || "Active"}
                                            </Badge>
                                        </div>
                                        <CardDescription>
                                            Verified ID: <span className="font-mono text-zinc-900 font-medium">
                                                {maskIdNumber(searchResult.id)}
                                            </span>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <Label className="text-muted-foreground">Email</Label>
                                                <p className="font-medium">{searchResult.email || "N/A"}</p>
                                            </div>
                                            <div>
                                                <Label className="text-muted-foreground">Business Name</Label>
                                                <p className="font-medium">{searchResult.businessName || "Individual"}</p>
                                            </div>
                                            <div>
                                                <Label className="text-muted-foreground">Approved Limit</Label>
                                                <p className="font-medium">R {searchResult.limit}</p>
                                            </div>
                                            <div>
                                                <Label className="text-muted-foreground">History of Defaults</Label>
                                                <p className={`font-medium ${searchResult.defaults > 0 ? "text-red-500" : "text-emerald-500"}`}>
                                                    {searchResult.defaults || "None"}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        ) : (
                            <Card className="border-dashed">
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                                    <AlertTriangle className="h-12 w-12 mb-4 opacity-20" />
                                    <p>No borrower found with that information.</p>
                                    <p className="text-sm">Try searching for "Lufuno Mphela".</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}

                <div className="mt-8 pt-6 border-t text-center text-xs text-muted-foreground">
                    <p>Safe Compliance Statement: All credit checks and lending activities on Smitetrade are subject to the National Credit Act (NCA) and Fair Lending Practices.</p>
                    <p>Lenders are responsible for ensuring affordability assessments are conducted responsibly.</p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default LenderCreditCheck;
