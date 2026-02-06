import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { DollarSign, TrendingUp, AlertTriangle, Users } from "lucide-react";

const data = [
    { name: 'Mon', sales: 4000, profit: 2400 },
    { name: 'Tue', sales: 3000, profit: 1398 },
    { name: 'Wed', sales: 2000, profit: 9800 },
    { name: 'Thu', sales: 2780, profit: 3908 },
    { name: 'Fri', sales: 1890, profit: 4800 },
    { name: 'Sat', sales: 2390, profit: 3800 },
    { name: 'Sun', sales: 3490, profit: 4300 },
];

const StatCard = ({ title, value, subtext, icon: Icon, color }: any) => (
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

const OwnerDashboard = () => {
    return (
        <DashboardLayout role="owner">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your business performance.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Revenue" value="R 45,231.89" subtext="+20.1% from last month" icon={DollarSign} color="text-green-500" />
                <StatCard title="Net Profit" value="R 12,345.00" subtext="+15% from last month" icon={TrendingUp} color="text-amber-500" />
                <StatCard title="Low Stock Items" value="12" subtext="Requires attention" icon={AlertTriangle} color="text-red-500" />
                <StatCard title="Active Customers" value="573" subtext="+201 since last hour" icon={Users} color="text-blue-500" />
            </div>

            <div className="grid gap-4 md:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Weekly Sales Overview</CardTitle>
                        <CardDescription>
                            Comparing daily sales and profit margins.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R${value}`} />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Legend />
                                    <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} name="Sales" />
                                    <Bar dataKey="profit" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Profit" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Latest transactions and alerts.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">{i}</div>
                                        <div>
                                            <p className="text-sm font-medium">Sale #10{i}3</p>
                                            <p className="text-xs text-muted-foreground">Just now</p>
                                        </div>
                                    </div>
                                    <div className="font-medium text-sm">+R 150.00</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default OwnerDashboard;
