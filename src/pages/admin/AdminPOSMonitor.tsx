import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, DollarSign, Server } from "lucide-react";

const AdminPOSMonitor = () => {
    return (
        <DashboardLayout role="admin">
            <h1 className="text-3xl font-bold tracking-tight mb-6">POS System Monitor</h1>

            <div className="grid md:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Terminals</CardTitle>
                        <Server className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">142</div>
                        <p className="text-xs text-muted-foreground">+12 since last hour</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Transactions (1h)</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,893</div>
                        <p className="text-xs text-muted-foreground">98% Success Rate</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Load</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">6%</div>
                        <p className="text-xs text-muted-foreground">Healthy</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Volume (1h)</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R 45.2k</div>
                        <p className="text-xs text-muted-foreground">+18% from yesterday</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Live Transaction Feed</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                                <div>
                                    <p className="font-medium text-sm">Thabo's Spaza (Terminal #882)</p>
                                    <p className="text-xs text-muted-foreground">Sale • Items: 3 • ID: {Math.floor(Math.random() * 1000)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-sm">R {Math.floor(Math.random() * 200)}.00</p>
                                    <p className="text-xs text-muted-foreground">Just now</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </DashboardLayout>
    );
};

export default AdminPOSMonitor;
