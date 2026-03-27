import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCredit } from "@/context/CreditContext";
import GamificationStatus from "@/components/credit/GamificationStatus";
import { format } from "date-fns";
import { useStore } from "@/context/StoreContext";
import { Loan } from "@/types";

const BehavioralReliabilityIndex = () => {
    const { profile, isLoading, loans } = useCredit();
    const { user } = useStore(); // Get user for filtering loans
    const navigate = useNavigate();

    if (isLoading || !profile) {
        return (
            <DashboardLayout role="customer">
                <div className="flex items-center justify-center h-[50vh]">
                    <div className="animate-pulse text-muted-foreground">Loading Financial Profile...</div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="customer">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-cyan-600">
                        BRI
                    </h1>
                    <p className="text-muted-foreground">Your BRI category unlocks future purchasing power.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Gamification Card */}
                    <Card className="border-t-4 border-t-indigo-500 shadow-xl overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent pointer-events-none" />
                        <CardHeader>
                            <CardTitle>Repayment Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <GamificationStatus tier={profile.tier} score={profile.briScore} />
                        </CardContent>
                    </Card>

                    {/* Credit Limit & Balance */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Available Credit</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold font-[Orbitron]">R {(profile.creditLimit - profile.balance).toFixed(2)}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Limit: R {profile.creditLimit.toFixed(2)}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-red-50 border-red-100">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between">
                                    <CardTitle className="text-sm font-medium text-red-800">Outstanding Balance</CardTitle>
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-red-700">R {profile.balance.toFixed(2)}</div>
                                <p className="text-xs text-red-600 mt-1 font-medium">Due by: {format(new Date(profile.dueDate), "MMM do, yyyy")}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Active Loans Section (New) */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold tracking-tight">Active Loans</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {loans?.filter(l => l.borrowerName === user?.name && l.status === 'active').map(loan => (
                            <Card key={loan.id} className="border-l-4 border-l-emerald-500 shadow-sm">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-base">Loan #{loan.id.split('_')[1]}</CardTitle>
                                        <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200">
                                            Active
                                        </Badge>
                                    </div>
                                    <CardDescription>Due: {loan.dueDate}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Amount Due</p>
                                            <p className="text-2xl font-bold">R {loan.amount.toFixed(2)}</p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => navigate('/customer/payment', { state: { total: loan.amount, loanId: loan.id } })}
                                        >
                                            Pay Now
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {(!loans || loans.filter(l => l.borrowerName === user?.name && l.status === 'active').length === 0) && (
                            <Card className="col-span-full border-dashed bg-slate-50/50">
                                <CardContent className="flex flex-col items-center justify-center py-8 text-muted-foreground text-center">
                                    <p>No active loans.</p>
                                    <Button variant="link" asChild className="text-emerald-600">
                                        <Link to="/customer/apply-credit">Apply for a new loan &rarr;</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>


                {/* Compliance Footer */}
                <div className="text-xs text-muted-foreground text-center max-w-2xl mx-auto space-y-1 pt-8 border-t">
                    <p className="font-semibold">Smitetrade provides scoring and risk-assessment insights for decision-support purposes only.</p>
                    <p>The platform does not provide credit, approve or decline loans, extend goods on credit, or make tenancy decisions.</p>
                    <p>All lending, goods-on-credit, and rental decisions remain the sole responsibility of the lender, spaza shop owner, or landlord.</p>
                    <p>Smitetrade does not act as a credit provider, financial adviser, or credit bureau.</p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BehavioralReliabilityIndex;
