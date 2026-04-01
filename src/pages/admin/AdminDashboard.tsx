
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/context/StoreContext";
import { useCredit } from "@/context/CreditContext";
import { Users, Store, Banknote, Activity, TrendingUp, ShoppingCart, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const AdminDashboard = () => {
    const { suppliers, staff, stores, orders, products, customers } = useStore();
    const { borrowers, loans } = useCredit();

    const totalUsers = customers.length + staff.length + borrowers.length;
    const activeLoans = loans.filter(l => l.status === 'active').length;
    const totalPortfolio = loans.reduce((sum, l) => sum + l.amount, 0);
    const totalRevenue = orders.filter(o => o.status === 'Delivered' || o.status === 'Paid').reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Mock daily transaction data for charts
    const dailyTransactions = [
        { day: "Mon", orders: 24, revenue: 4200 },
        { day: "Tue", orders: 18, revenue: 3100 },
        { day: "Wed", orders: 31, revenue: 5800 },
        { day: "Thu", orders: 27, revenue: 4600 },
        { day: "Fri", orders: 42, revenue: 7200 },
        { day: "Sat", orders: 55, revenue: 9400 },
        { day: "Sun", orders: 38, revenue: 6100 },
    ];

    const userGrowth = [
        { month: "Oct", users: 85 },
        { month: "Nov", users: 102 },
        { month: "Dec", users: 118 },
        { month: "Jan", users: 134 },
        { month: "Feb", users: 155 },
        { month: "Mar", users: totalUsers },
    ];

    const orderStatusData = [
        { name: "Delivered", value: orders.filter(o => o.status === 'Delivered').length || 12, fill: "hsl(142, 76%, 36%)" },
        { name: "Pending", value: orders.filter(o => o.status === 'Pending').length || 5, fill: "hsl(48, 96%, 53%)" },
        { name: "Cancelled", value: 2, fill: "hsl(0, 84%, 60%)" },
        { name: "In Transit", value: orders.filter(o => o.status === 'Out for Delivery').length || 3, fill: "hsl(199, 89%, 48%)" },
    ];

    const recentActivity = [
        { type: "order", message: "New order #1042 placed — R350", time: "12 min ago" },
        { type: "user", message: "New customer registered: Thandi M.", time: "28 min ago" },
        { type: "payment", message: "PayStack payment confirmed — R1,200", time: "45 min ago" },
        { type: "store", message: "Store 'Kasi Fresh' updated inventory", time: "1h ago" },
        { type: "loan", message: "Loan #loan_1 payment received — R500", time: "2h ago" },
        { type: "alert", message: "Low stock alert: Bread (3 remaining)", time: "3h ago" },
    ];

    const chartConfig = {
        orders: { label: "Orders", color: "hsl(199, 89%, 48%)" },
        revenue: { label: "Revenue", color: "hsl(142, 76%, 36%)" },
        users: { label: "Users", color: "hsl(48, 96%, 53%)" },
    };

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
                    <p className="text-muted-foreground">Platform-wide performance and operational metrics.</p>
                </div>

                {/* KPI Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalUsers}</div>
                            <p className="text-xs text-muted-foreground">+12% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Registered Stores</CardTitle>
                            <Store className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stores.length || 5}</div>
                            <p className="text-xs text-muted-foreground">{products.length} products listed</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">R {totalRevenue.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">{totalOrders} orders · Avg R{avgOrderValue.toFixed(0)}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Lending Portfolio</CardTitle>
                            <Banknote className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">R {totalPortfolio.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">{activeLoans} active loans</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Daily Transaction Volume</CardTitle>
                            <CardDescription>Orders and revenue this week</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="h-[250px] w-full">
                                <BarChart data={dailyTransactions}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                    <XAxis dataKey="day" className="text-xs" />
                                    <YAxis className="text-xs" />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="orders" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">User Growth</CardTitle>
                            <CardDescription>Monthly registered users</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="h-[250px] w-full">
                                <LineChart data={userGrowth}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                    <XAxis dataKey="month" className="text-xs" />
                                    <YAxis className="text-xs" />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Line type="monotone" dataKey="users" stroke="hsl(48, 96%, 53%)" strokeWidth={2} dot={{ fill: "hsl(48, 96%, 53%)" }} />
                                </LineChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Row */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Recent Activity */}
                    <Card className="col-span-full md:col-span-4">
                        <CardHeader>
                            <CardTitle className="text-base">Recent Activity</CardTitle>
                            <CardDescription>Latest platform events</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivity.map((item, i) => (
                                    <div key={i} className="flex items-center">
                                        <span className={`h-2 w-2 rounded-full mr-2 ${
                                            item.type === 'order' ? 'bg-blue-500' :
                                            item.type === 'payment' ? 'bg-emerald-500' :
                                            item.type === 'user' ? 'bg-yellow-500' :
                                            item.type === 'alert' ? 'bg-red-500' :
                                            'bg-muted-foreground'
                                        }`} />
                                        <div className="ml-4 space-y-1 flex-1">
                                            <p className="text-sm leading-none">{item.message}</p>
                                        </div>
                                        <div className="ml-auto text-xs text-muted-foreground">{item.time}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Access */}
                    <Card className="col-span-full md:col-span-3">
                        <CardHeader>
                            <CardTitle className="text-base">Quick Actions</CardTitle>
                            <CardDescription>Navigate to management tools</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            <Button variant="outline" className="justify-start" asChild>
                                <Link to="/admin/analytics"><TrendingUp className="mr-2 h-4 w-4" /> Platform Analytics</Link>
                            </Button>
                            <Button variant="outline" className="justify-start" asChild>
                                <Link to="/admin/stores"><Store className="mr-2 h-4 w-4" /> Manage Stores</Link>
                            </Button>
                            <Button variant="outline" className="justify-start" asChild>
                                <Link to="/admin/revenue"><CreditCard className="mr-2 h-4 w-4" /> Revenue & Payments</Link>
                            </Button>
                            <Button variant="outline" className="justify-start" asChild>
                                <Link to="/admin/users"><Users className="mr-2 h-4 w-4" /> Manage Users</Link>
                            </Button>
                            <Button variant="outline" className="justify-start" asChild>
                                <Link to="/admin/credit-overview"><Banknote className="mr-2 h-4 w-4" /> Credit Overview</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
