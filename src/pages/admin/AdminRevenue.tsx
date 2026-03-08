
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/context/StoreContext";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { DollarSign, TrendingUp, CreditCard, Banknote } from "lucide-react";

const AdminRevenue = () => {
    const { orders } = useStore();

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0) || 72300;
    const successfulPayments = orders.filter(o => o.status !== 'Cancelled').length || 68;
    const totalPayments = orders.length || 73;
    const successRate = totalPayments > 0 ? ((successfulPayments / totalPayments) * 100).toFixed(1) : "93.2";
    const avgOrderValue = totalPayments > 0 ? (totalRevenue / totalPayments).toFixed(0) : "990";

    // Payment method breakdown
    const paymentMethods = [
        { method: "Card (PayStack)", value: 45, fill: "hsl(199, 89%, 48%)" },
        { method: "Cash", value: 30, fill: "hsl(142, 76%, 36%)" },
        { method: "Credit (BRI)", value: 15, fill: "hsl(48, 96%, 53%)" },
        { method: "Split", value: 10, fill: "hsl(280, 65%, 60%)" },
    ];

    // Weekly revenue
    const weeklyRevenue = [
        { week: "W1 Feb", revenue: 15200 },
        { week: "W2 Feb", revenue: 18400 },
        { week: "W3 Feb", revenue: 12800 },
        { week: "W4 Feb", revenue: 21600 },
        { week: "W1 Mar", revenue: 19200 },
        { week: "W2 Mar", revenue: 24100 },
    ];

    // Recent transactions
    const recentTransactions = [
        { id: "TXN-001", date: "2026-03-08", customer: "Sipho K.", amount: 350, method: "Card", status: "Success" },
        { id: "TXN-002", date: "2026-03-08", customer: "Thandi M.", amount: 1200, method: "Cash", status: "Success" },
        { id: "TXN-003", date: "2026-03-07", customer: "Lufuno M.", amount: 580, method: "Credit", status: "Success" },
        { id: "TXN-004", date: "2026-03-07", customer: "John D.", amount: 90, method: "Card", status: "Failed" },
        { id: "TXN-005", date: "2026-03-07", customer: "Nomsa B.", amount: 2100, method: "Card", status: "Success" },
        { id: "TXN-006", date: "2026-03-06", customer: "Bongani T.", amount: 450, method: "Split", status: "Success" },
    ];

    const chartConfig = {
        revenue: { label: "Revenue (R)", color: "hsl(142, 76%, 36%)" },
    };

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Revenue & Payments</h1>
                    <p className="text-muted-foreground">Transaction history and payment performance across the platform.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total GMV</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">R {totalRevenue.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{successRate}%</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">R {avgOrderValue}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                            <Banknote className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalPayments}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Weekly Revenue Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="h-[280px] w-full">
                                <BarChart data={weeklyRevenue}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                    <XAxis dataKey="week" className="text-xs" />
                                    <YAxis />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="revenue" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Payment Method Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center">
                            <ChartContainer config={chartConfig} className="h-[280px] w-full">
                                <PieChart>
                                    <Pie data={paymentMethods} dataKey="value" nameKey="method" cx="50%" cy="50%" outerRadius={100} label={({ method, value }) => `${method}: ${value}%`}>
                                        {paymentMethods.map((entry, i) => (
                                            <Cell key={i} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Transaction ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentTransactions.map(txn => (
                                    <TableRow key={txn.id}>
                                        <TableCell className="font-mono text-xs">{txn.id}</TableCell>
                                        <TableCell>{txn.date}</TableCell>
                                        <TableCell>{txn.customer}</TableCell>
                                        <TableCell>{txn.method}</TableCell>
                                        <TableCell className="text-right">R {txn.amount.toLocaleString()}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={txn.status === "Success" ? "default" : "destructive"}>
                                                {txn.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default AdminRevenue;
