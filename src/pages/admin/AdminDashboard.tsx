
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/context/StoreContext";
import { Users, Store, TrendingUp, ShoppingCart, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";
const AdminDashboard = () => {
    const { staff, stores, orders, products, customers } = useStore();

    const totalUsers = customers.length + staff.length;
    const totalRevenue = orders.filter(o => o.status === 'Delivered' || o.status === 'Paid').reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Orders grouped by day of week (real data)
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dailyTransactions = days.map(day => {
        const dayOrders = orders.filter(o => days[new Date(o.date).getDay()] === day);
        return {
            day,
            orders: dayOrders.length,
            revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
        };
    });

    const orderStatusData = [
        { name: "Delivered", value: orders.filter(o => o.status === 'Delivered').length, fill: "hsl(142, 76%, 36%)" },
        { name: "Pending", value: orders.filter(o => o.status === 'Pending').length, fill: "hsl(48, 96%, 53%)" },
        { name: "Cancelled", value: orders.filter(o => o.status === 'Cancelled').length, fill: "hsl(0, 84%, 60%)" },
        { name: "In Transit", value: orders.filter(o => o.status === 'Out for Delivery').length, fill: "hsl(199, 89%, 48%)" },
    ].filter(d => d.value > 0);

    const recentOrders = orders.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
    const recentActivity = recentOrders.map(o => ({
        type: o.status === 'Delivered' || o.status === 'Paid' ? 'payment' : 'order',
        message: `Order #${o.id.slice(-6).toUpperCase()} — ${o.customerName} · R${o.total.toLocaleString()} · ${o.status}`,
        time: new Date(o.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

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
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalUsers}</div>
                            <p className="text-xs text-muted-foreground">{customers.length} customers · {staff.length} staff</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Registered Stores</CardTitle>
                            <Store className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stores.length}</div>
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
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalOrders}</div>
                            <p className="text-xs text-muted-foreground">{orders.filter(o => o.status === 'Pending').length} pending</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row */}
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
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
                            <CardTitle className="text-base">Order Status Breakdown</CardTitle>
                            <CardDescription>Distribution across all orders</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {orderStatusData.length === 0 ? (
                                <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">No orders yet.</div>
                            ) : (
                                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                                    <PieChart>
                                        <Pie data={orderStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                                            {orderStatusData.map((entry, i) => (
                                                <Cell key={i} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                    </PieChart>
                                </ChartContainer>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Row */}
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
                    {/* Recent Activity */}
                    <Card className="col-span-full md:col-span-4">
                        <CardHeader>
                            <CardTitle className="text-base">Recent Activity</CardTitle>
                            <CardDescription>Latest platform events</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentActivity.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-4 text-center">No orders yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {recentActivity.map((item, i) => (
                                        <div key={i} className="flex items-center">
                                            <span className={`h-2 w-2 rounded-full mr-2 ${
                                                item.type === 'payment' ? 'bg-emerald-500' : 'bg-blue-500'
                                            }`} />
                                            <div className="ml-4 space-y-1 flex-1">
                                                <p className="text-sm leading-none">{item.message}</p>
                                            </div>
                                            <div className="ml-auto text-xs text-muted-foreground">{item.time}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
