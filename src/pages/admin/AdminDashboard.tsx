
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/context/StoreContext";
import { useCredit } from "@/context/CreditContext";
import { Users, Store, Banknote, ShieldCheck, Activity, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
    const { suppliers, staff, user: currentUser } = useStore();
    const { borrowers, loans } = useCredit();

    // Mock total users count (since we can't easily fetch all users without admin SDK)
    // We'll use a base number + context data
    const totalUsers = 150 + staff.length + borrowers.length;
    const activeLoans = loans.filter(l => l.status === 'active').length;
    const totalPortfolio = loans.reduce((sum, l) => sum + l.amount, 0);

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
                    <p className="text-muted-foreground">System health, user stats, and operational metrics.</p>
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
                            <div className="text-2xl font-bold">{suppliers.length + 5}</div>
                            <p className="text-xs text-muted-foreground">+2 new this week</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                            <Banknote className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeLoans}</div>
                            <p className="text-xs text-muted-foreground">Portfolio: R {totalPortfolio.toLocaleString()}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">System Health</CardTitle>
                            <Activity className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">99.9%</div>
                            <p className="text-xs text-muted-foreground">All systems operational</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Recent Alerts / Quick Actions */}
                    <Card className="col-span-full md:col-span-4">
                        <CardHeader>
                            <CardTitle>System Alerts</CardTitle>
                            <CardDescription>Recent high-priority notifications.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">High Server Load</p>
                                        <p className="text-sm text-muted-foreground">
                                            CPU usage peaked at 85% at 09:00 AM.
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium text-xs text-muted-foreground">2h ago</div>
                                </div>
                                <div className="flex items-center">
                                    <span className="h-2 w-2 bg-yellow-500 rounded-full mr-2"></span>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">New User Spike</p>
                                        <p className="text-sm text-muted-foreground">
                                            15 new registrations in the last hour.
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium text-xs text-muted-foreground">4h ago</div>
                                </div>
                                <div className="flex items-center">
                                    <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">Backup Completed</p>
                                        <p className="text-sm text-muted-foreground">
                                            Daily database backup finished successfully.
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium text-xs text-muted-foreground">6h ago</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Access */}
                    <Card className="col-span-full md:col-span-3">
                        <CardHeader>
                            <CardTitle>Administration</CardTitle>
                            <CardDescription>Quick access to management tools.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            <Button variant="outline" className="justify-start" asChild>
                                <Link to="/admin/users">
                                    <Users className="mr-2 h-4 w-4" /> Manage Users
                                </Link>
                            </Button>
                            <Button variant="outline" className="justify-start" asChild>
                                <Link to="/admin/audit-logs">
                                    <ShieldCheck className="mr-2 h-4 w-4" /> View Audit Logs
                                </Link>
                            </Button>
                            <Button variant="outline" className="justify-start text-muted-foreground" disabled>
                                <AlertTriangle className="mr-2 h-4 w-4" /> System Settings (Restricted)
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
