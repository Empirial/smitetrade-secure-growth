import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, TrendingUp, AlertCircle } from "lucide-react";

const CustomerCreditReview = () => {
    return (
        <DashboardLayout role="customer">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">My SpazaScore</h1>
                    <p className="text-muted-foreground">Your financial health passport</p>
                </div>

                <Card className="border-t-4 border-t-primary shadow-md">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Current Score</CardTitle>
                                <CardDescription>Updated today</CardDescription>
                            </div>
                            <ShieldCheck className="h-8 w-8 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center py-6 bg-secondary/50 rounded-lg">
                            <span className="text-6xl font-extrabold font-[Orbitron]">750</span>
                            <p className="text-sm text-primary font-medium mt-2">EXCELLENT</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Score Range</span>
                                <span>0 - 850</span>
                            </div>
                            <Progress value={88} className="h-3" />
                        </div>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Credit Limit</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">R 5,000.00</div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <TrendingUp className="h-3 w-3 text-green-600" /> Increased last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Available to Spend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">R 3,800.00</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                R 1,200.00 utilized
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-primary/5 border-none">
                    <CardContent className="flex gap-4 p-6 items-start">
                        <AlertCircle className="h-6 w-6 text-primary shrink-0" />
                        <div className="space-y-1">
                            <h4 className="font-bold">Did you know?</h4>
                            <p className="text-sm text-muted-foreground">Paying your Spaza credit on time improves your score across the entire network, unlocking lower prices.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default CustomerCreditReview;
