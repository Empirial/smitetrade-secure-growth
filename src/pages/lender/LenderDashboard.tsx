import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCredit } from "@/context/CreditContext";
import { Loan } from "@/types";
import { Banknote, Users, TrendingUp, AlertTriangle, Search, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface InfoCardProps {
    title: string;
    value: string | number;
    subtext: string;
    icon: React.ElementType;
    color: string;
}

const InfoCard = ({ title, value, subtext, icon: Icon, color }: InfoCardProps) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className={`h-4 w-4 ${color}`} />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{subtext}</p>
        </CardContent>
    </Card>
);

const LenderDashboard = () => {
    const { loans, borrowers } = useCredit();

    // Metrics
    const activeLoans = loans.filter(l => l.status === 'active');
    const totalLent = activeLoans.reduce((sum, loan) => sum + loan.amount, 0);
    const paidLoans = loans.filter(l => l.status === 'paid');
    const totalRecovered = paidLoans.reduce((sum, loan) => sum + loan.amount, 0);
    const defaultRisk = borrowers.filter(b => b.rating === 'Risk').length;

    return (
        <DashboardLayout role="lender">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Lender Dashboard</h1>
                        <p className="text-muted-foreground">Welcome back, get an overview of your lending portfolio.</p>
                    </div>
                    <div className="flex gap-2">
                        <Link to="/lender/credit-check">
                            <Button variant="outline" size="sm">
                                <Search className="mr-2 h-4 w-4" /> Check Credit
                            </Button>
                        </Link>
                        <Link to="/lender/applications">
                            <Button size="sm">
                                <FileText className="mr-2 h-4 w-4" /> Review Apps
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <InfoCard
                        title="Total Active Lent"
                        value={`R ${totalLent.toFixed(2)}`}
                        subtext={`${activeLoans.length} active loans`}
                        icon={Banknote}
                        color="text-emerald-500"
                    />
                    <InfoCard
                        title="Total Recovered"
                        value={`R ${totalRecovered.toFixed(2)}`}
                        subtext="lifetime repayments"
                        icon={TrendingUp}
                        color="text-blue-500"
                    />
                    <InfoCard
                        title="Total Clients"
                        value={borrowers.length}
                        subtext="registered borrowers"
                        icon={Users}
                        color="text-indigo-500"
                    />
                    <InfoCard
                        title="Risk Alerts"
                        value={defaultRisk}
                        subtext="clients at risk"
                        icon={AlertTriangle}
                        color="text-red-500"
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Latest loan disbursements and repayments.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {loans.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No activity yet.</p>
                                ) : (
                                    loans.slice(0, 5).map((loan: Loan) => (
                                        <div key={loan.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                                            <div>
                                                <p className="font-medium text-sm">{loan.borrowerName}</p>
                                                <p className="text-xs text-muted-foreground">{loan.status === 'active' ? 'Borrowed' : 'Repaid'} on {loan.dueDate}</p>
                                            </div>
                                            <div className={`font-bold text-sm ${loan.status === 'paid' ? 'text-green-600' : 'text-slate-600'}`}>
                                                {loan.status === 'paid' ? '+' : '-'} R {loan.amount}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>


            <div className="mt-8 border-t pt-6 text-xs text-muted-foreground space-y-2">
                <p className="font-semibold">Safe Compliance Statement</p>
                <p>
                    "Smitetrade provides scoring and risk-assessment insights for decision-support purposes only.
                    The platform does not provide credit, approve or decline loans, extend goods on credit, or make tenancy decisions.
                    All lending, goods-on-credit, and rental decisions remain the sole responsibility of the lender, spaza shop owner, or landlord.
                    Smitetrade does not act as a credit provider, financial adviser, or credit bureau."
                </p>
            </div>
        </DashboardLayout >
    );
};

export default LenderDashboard;
