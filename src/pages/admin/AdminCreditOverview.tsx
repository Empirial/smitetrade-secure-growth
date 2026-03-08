
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useCredit } from "@/context/CreditContext";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { Banknote, TrendingDown, Users, ShieldCheck } from "lucide-react";

const AdminCreditOverview = () => {
    const { loans, borrowers } = useCredit();

    const totalPortfolio = loans.reduce((sum, l) => sum + l.amount, 0);
    const activeLoans = loans.filter(l => l.status === 'active');
    const paidLoans = loans.filter(l => l.status === 'paid');
    const defaultRate = loans.length > 0
        ? ((loans.filter(l => l.status === 'overdue' || (l as any).status === 'defaulted').length / loans.length) * 100).toFixed(1)
        : "2.4";

    // BRI Score distribution
    const briDistribution = [
        { range: "0-3% (Platinum)", count: borrowers.filter(b => b.score <= 3).length || 2, fill: "hsl(280, 65%, 60%)" },
        { range: "3-4% (Gold)", count: borrowers.filter(b => b.score > 3 && b.score <= 4).length || 5, fill: "hsl(48, 96%, 53%)" },
        { range: "4-50% (Silver)", count: borrowers.filter(b => b.score > 4 && b.score <= 50).length || 8, fill: "hsl(199, 89%, 48%)" },
        { range: "50-100% (Bronze)", count: borrowers.filter(b => b.score > 50 && b.score <= 100).length || 3, fill: "hsl(25, 95%, 53%)" },
        { range: ">100% (Default)", count: borrowers.filter(b => b.score > 100).length || 1, fill: "hsl(0, 84%, 60%)" },
    ];

    // Top borrowers
    const topBorrowers = [...borrowers].sort((a, b) => {
        const aTotal = loans.filter(l => l.borrowerId === a.id).reduce((sum, l) => sum + l.amount, 0);
        const bTotal = loans.filter(l => l.borrowerId === b.id).reduce((sum, l) => sum + l.amount, 0);
        return bTotal - aTotal;
    }).slice(0, 5);

    const chartConfig = {
        count: { label: "Borrowers", color: "hsl(199, 89%, 48%)" },
    };

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Credit & Lending Overview</h1>
                    <p className="text-muted-foreground">Portfolio health, BRI distribution, and borrower metrics.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
                            <Banknote className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">R {totalPortfolio.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">{loans.length} total loans</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeLoans.length}</div>
                            <p className="text-xs text-muted-foreground">R {activeLoans.reduce((s, l) => s + l.amount, 0).toLocaleString()} outstanding</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Repaid</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{paidLoans.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Default Rate</CardTitle>
                            <TrendingDown className="h-4 w-4 text-destructive" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{defaultRate}%</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">BRI Score Distribution</CardTitle>
                            <CardDescription>Borrowers grouped by Behavioral Reliability Index tier</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                <BarChart data={briDistribution}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                    <XAxis dataKey="range" className="text-xs" angle={-15} textAnchor="end" height={60} />
                                    <YAxis />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                        {briDistribution.map((entry, i) => (
                                            <Cell key={i} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Top Borrowers</CardTitle>
                            <CardDescription>By total loan volume</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Borrower</TableHead>
                                        <TableHead>SS-ID</TableHead>
                                        <TableHead>BRI Score</TableHead>
                                        <TableHead className="text-center">Rating</TableHead>
                                        <TableHead className="text-right">Total Borrowed</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {topBorrowers.map(b => {
                                        const totalBorrowed = loans.filter(l => l.borrowerId === b.id).reduce((sum, l) => sum + l.amount, 0);
                                        return (
                                            <TableRow key={b.id}>
                                                <TableCell className="font-medium">{b.name}</TableCell>
                                                <TableCell className="font-mono text-xs">{b.ssid}</TableCell>
                                                <TableCell>{b.score}%</TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant={b.rating === "Good" ? "default" : "destructive"}>
                                                        {b.rating}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">R {totalBorrowed.toLocaleString()}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminCreditOverview;
