import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { DollarSign, TrendingUp, AlertTriangle, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/context/StoreContext";
import { Link } from "react-router-dom";

// Reusable Stat Card Component
// Reusable Stat Card Component
interface StatCardProps {
    title: string;
    value: string | number;
    subtext: string;
    icon: React.ElementType;
    color: string;
    isLoading?: boolean;
}

const StatCard = ({ title, value, subtext, icon: Icon, color, isLoading }: StatCardProps) => (
    <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium leading-tight">{title}</CardTitle>
            <Icon className={`h-4 w-4 shrink-0 ${color}`} />
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <Skeleton className="h-8 w-1/2 mb-1" />
            ) : (
                <div className="text-2xl font-bold">{value}</div>
            )}
            <p className="text-xs text-muted-foreground">{subtext}</p>
        </CardContent>
    </Card>
);

const OwnerDashboard = () => {
    const { orders, products, isLoading } = useStore();

    // --- Calculate Metrics ---

    // 1. Total Revenue (Sum of all order totals)
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    // 2. Net Profit (Mock: 30% margin)
    const netProfit = totalRevenue * 0.3;

    // 3. Low Stock Items
    const lowStockCount = products.filter(p => p.status === 'Low Stock' || p.status === 'Critical' || p.status === 'Out of Stock').length;

    // 4. Active Customers (Unique customer names in orders)
    const uniqueCustomers = new Set(orders.map(o => o.customerName)).size;

    // --- Prepare Chart Data ---
    // Group orders by day (Mocking last 7 days for the chart structure)
    // In a real app, this would dynamically group the 'orders' array by date.
    // For now, we will map real revenue into the "today" slot or spread it out mockingly to keep the chart functional visually.
    const chartData = [
        { name: 'Mon', sales: 0, profit: 0 },
        { name: 'Tue', sales: 0, profit: 0 },
        { name: 'Wed', sales: 0, profit: 0 },
        { name: 'Thu', sales: 0, profit: 0 },
        { name: 'Fri', sales: 0, profit: 0 },
        { name: 'Sat', sales: 0, profit: 0 },
        { name: 'Sun', sales: totalRevenue, profit: netProfit }, // All current sales shown on Sun for demo
    ];

    // --- Recent Activity ---
    // Take the last 5 orders
    const recentActivity = [...orders].reverse().slice(0, 5);

    return (
        <DashboardLayout role="owner">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your business performance.</p>
            </div>

            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                <StatCard
                    title="Total Revenue"
                    value={`R ${totalRevenue.toFixed(2)}`}
                    subtext="lifetime sales"
                    icon={DollarSign}
                    color="text-green-500"
                />
                <StatCard
                    title="Net Profit"
                    value={`R ${netProfit.toFixed(2)}`}
                    subtext="estimated 30% margin"
                    icon={TrendingUp}
                    color="text-amber-500"
                />
                <StatCard
                    title="Stock Alerts"
                    value={lowStockCount}
                    subtext="Items need attention"
                    icon={AlertTriangle}
                    color="text-red-500"
                />
                <StatCard
                    title="Unique Customers"
                    value={uniqueCustomers}
                    subtext="from order history"
                    icon={Users}
                    color="text-blue-500"
                />
                <Link to="/owner/credit-review" className="h-full">
                    <Card className="hover:border-indigo-500 transition-all cursor-pointer h-full border-dashed border-2 flex flex-col justify-between">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 gap-2">
                            <CardTitle className="text-sm font-medium leading-tight">Credit Check</CardTitle>
                            <Users className="h-4 w-4 shrink-0 text-indigo-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Lookup</div>
                            <p className="text-xs text-muted-foreground">Check BRI Score</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            <div className="grid gap-4 grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 mt-4">
                <Card className="lg:col-span-2 xl:col-span-3">
                    <CardHeader>
                        <CardTitle>Sales Overview</CardTitle>
                        <CardDescription>
                            Comparing daily sales and profit margins.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 sm:p-6 sm:pl-2">
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R${value}`} dx={-10} />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Legend verticalAlign="top" height={36} iconType="circle" />
                                    <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} name="Sales" />
                                    <Bar dataKey="profit" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Profit" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-1 xl:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Latest {recentActivity.length} transactions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivity.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">No recent orders.</p>
                            ) : (
                                recentActivity.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between border-b pb-2 last:border-0 gap-2">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs shrink-0">
                                                {order.customerName.charAt(0)}
                                            </div>
                                            <div className="min-w-0 pr-2">
                                                <p className="text-sm font-medium truncate" title={`${order.id} - ${order.customerName}`}>{order.id} - {order.customerName}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleTimeString()}</p>
                                            </div>
                                        </div>
                                        <div className="font-medium text-sm text-right shrink-0 whitespace-nowrap whitespace-pre">+R {order.total.toFixed(2)}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default OwnerDashboard;
