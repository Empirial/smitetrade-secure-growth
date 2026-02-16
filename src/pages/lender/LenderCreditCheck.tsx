import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCredit } from "@/context/CreditContext";
import { Search, ShieldCheck, AlertTriangle, CreditCard, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { maskIdNumber } from "@/lib/utils";

const LenderCreditCheck = () => {
    const { borrowers } = useCredit();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState<any>(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = () => {
        setSearched(true);

        // Mock Data for specific user demo
        if (searchQuery.toLowerCase().includes("lufuno") || searchQuery.toLowerCase().includes("mphela")) {
            setSearchResult({
                id: "LM-2024-001",
                name: "Lufuno Mphela",
                email: "mphelalufuno1.0@gmail.com",
                businessName: "Mphela General Trading",
                creditScore: 780,
                rating: "Good", // Use Good/Bad/Risk terminology
                status: "Active",
                totalDebt: 0,
                totalPaid: 15,
                defaults: 0,
                limit: 50000
            });
            return;
        }

        const result = borrowers.find((b) =>
            b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.id.toString() === searchQuery
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
                            <Button onClick={handleSearch}>
                                <Search className="mr-2 h-4 w-4" /> Search
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {searched && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {searchResult ? (
                            <>
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
                                            <CardTitle>Detailed Profile: {searchResult.name}</CardTitle>
                                            <Badge className={getStatusBadge(searchResult.rating)}>
                                                {searchResult.status || "Active"}
                                            </Badge>
                                        </div>
                                        <CardDescription>Verified ID: {maskIdNumber(searchResult.id)}</CardDescription>
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
            </div>
        </DashboardLayout>
    );
};

export default LenderCreditCheck;
