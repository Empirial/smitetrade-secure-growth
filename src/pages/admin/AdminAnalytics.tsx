
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/context/StoreContext";
import { useCredit } from "@/context/CreditContext";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const AdminAnalytics = () => {
    const { orders, stores, customers, staff } = useStore();
    const { borrowers } = useCredit();

    // User growth by month (mock trend)
    const userGrowthData = [
        { week: "W1", signups: 12 },
        { week: "W2", signups: 18 },
        { week: "W3", signups: 8 },
        { week: "W4", signups: 22 },
        { week: "W5", signups: 15 },
        { week: "W6", signups: 28 },
    ];

    // Revenue by store (mock)
    const revenueByStore = [
        { store: "Soweto Central", revenue: 24500 },
        { store: "Kasi Fresh", revenue: 18200 },
        { store: "Township Goods", revenue: 12800 },
        { store: "Mzansi Market", revenue: 9500 },
        { store: "Ubuntu Store", revenue: 7200 },
    ];

    // Order status distribution
    const orderStatusData = [
        { name: "Delivered", value: orders.filter(o => o.status === 'Delivered').length || 45, fill: "hsl(142, 76%, 36%)" },
        { name: "Pending", value: orders.filter(o => o.status === 'Pending').length || 12, fill: "hsl(48, 96%, 53%)" },
        { name: "In Transit", value: orders.filter(o => o.status === 'Out for Delivery').length || 8, fill: "hsl(199, 89%, 48%)" },
        { name: "Cancelled", value: orders.filter(o => o.status === 'Cancelled').length || 3, fill: "hsl(0, 84%, 60%)" },
    ];

    // Users by role
    const usersByRole = [
        { role: "Customers", count: customers.length || 95, fill: "hsl(199, 89%, 48%)" },
        { role: "Owners", count: stores.length || 5, fill: "hsl(142, 76%, 36%)" },
        { role: "Cashiers", count: staff.length || 12, fill: "hsl(48, 96%, 53%)" },
        { role: "Drivers", count: 8, fill: "hsl(280, 65%, 60%)" },
        { role: "Lenders", count: borrowers.length || 4, fill: "hsl(340, 82%, 52%)" },
    ];

    const chartConfig = {
        signups: { label: "Signups", color: "hsl(199, 89%, 48%)" },
        revenue: { label: "Revenue (R)", color: "hsl(142, 76%, 36%)" },
    };

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Platform Analytics</h1>
                    <p className="text-muted-foreground">Deep-dive into growth, revenue, and user engagement.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {/* User Growth */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Weekly User Signups</CardTitle>
                            <CardDescription>New registrations per week</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="h-[280px] w-full">
                                <LineChart data={userGrowthData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                    <XAxis dataKey="week" />
                                    <YAxis />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Line type="monotone" dataKey="signups" stroke="hsl(199, 89%, 48%)" strokeWidth={2} dot={{ fill: "hsl(199, 89%, 48%)" }} />
                                </LineChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Revenue by Store */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Revenue by Store</CardTitle>
                            <CardDescription>Top performing stores</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="h-[280px] w-full">
                                <BarChart data={revenueByStore} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="store" type="category" width={100} className="text-xs" />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="revenue" fill="hsl(142, 76%, 36%)" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Order Status Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Order Status Distribution</CardTitle>
                            <CardDescription>Breakdown of all orders</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center">
                            <ChartContainer config={chartConfig} className="h-[280px] w-full">
                                <PieChart>
                                    <Pie data={orderStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`}>
                                        {orderStatusData.map((entry, i) => (
                                            <Cell key={i} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Active Users by Role */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Users by Role</CardTitle>
                            <CardDescription>Platform user breakdown</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="h-[280px] w-full">
                                <BarChart data={usersByRole}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                    <XAxis dataKey="role" className="text-xs" />
                                    <YAxis />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                        {usersByRole.map((entry, i) => (
                                            <Cell key={i} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminAnalytics;
