import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShieldCheck, TrendingUp, AlertCircle, ArrowRight } from "lucide-react";
import { useCredit } from "@/context/CreditContext";
import { Badge } from "@/components/ui/badge";

const getTierBadge = (tier: string) => {
    switch (tier) {
        case 'Platinum': return <Badge className="bg-gradient-to-r from-slate-400 to-slate-600 text-white text-lg px-4 py-1">Platinum</Badge>;
        case 'Gold': return <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-lg px-4 py-1">Gold</Badge>;
        case 'Silver': return <Badge className="bg-gradient-to-r from-gray-300 to-gray-500 text-white text-lg px-4 py-1">Silver</Badge>;
        case 'Bronze': return <Badge className="bg-gradient-to-r from-orange-400 to-orange-600 text-white text-lg px-4 py-1">Bronze</Badge>;
        default: return <Badge variant="destructive" className="text-lg px-4 py-1">Default</Badge>;
    }
};

const getTierDescription = (tier: string) => {
    switch (tier) {
        case 'Platinum': return 'Very Excellent – You pay before the due date';
        case 'Gold': return 'Excellent – You pay on the due date';
        case 'Silver': return 'Good – You pay within the month';
        case 'Bronze': return 'Needs Improvement – Late payments detected';
        default: return 'At Risk – Significant late payments';
    }
};

const CustomerCreditReview = () => {
    const { profile, isLoading } = useCredit();

    const briScore = profile?.briScore ?? 0;
    const tier = profile?.tier ?? 'Silver';
    const creditLimit = profile?.creditLimit ?? 0;
    const balance = profile?.balance ?? 0;
    const available = creditLimit - balance;

    // For progress bar: lower BRI is better. Map inversely (0-100% range for display)
    const progressValue = Math.max(0, Math.min(100, 100 - briScore));

    return (
        <DashboardLayout role="customer">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">My SpazaScore</h1>
                    <p className="text-muted-foreground">Your Behavioral Reliability Index (BRI)</p>
                </div>

                <Card className="border-t-4 border-t-primary shadow-md">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>BRI Score</CardTitle>
                                <CardDescription>Updated today</CardDescription>
                            </div>
                            <ShieldCheck className="h-8 w-8 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center py-6 bg-secondary/50 rounded-lg space-y-3">
                            <span className="text-6xl font-extrabold font-[Orbitron]">{briScore.toFixed(1)}%</span>
                            <div className="flex justify-center">
                                {getTierBadge(tier)}
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">{getTierDescription(tier)}</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Payment Reliability</span>
                                <span>Lower % = Better</span>
                            </div>
                            <Progress value={progressValue} className="h-3" />
                        </div>

                        <div className="pt-4">
                            <Link to="/customer/apply-credit">
                                <Button className="w-full" size="lg">
                                    Request Limit Increase <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Credit Limit</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">R {creditLimit.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <TrendingUp className="h-3 w-3 text-green-600" /> Based on your BRI tier
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Available to Spend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">R {available.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                R {balance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })} utilized
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-primary/5 border-none">
                    <CardContent className="flex gap-4 p-6 items-start">
                        <AlertCircle className="h-6 w-6 text-primary shrink-0" />
                        <div className="space-y-1">
                            <h4 className="font-bold">How BRI Works</h4>
                            <p className="text-sm text-muted-foreground">Your BRI score is calculated as (Payment Day ÷ Days in Month) × 100. The earlier you pay, the lower your percentage — and the higher your tier. Platinum members enjoy the best credit terms across the SMITETRADE network.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default CustomerCreditReview;
