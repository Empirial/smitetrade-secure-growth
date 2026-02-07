
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useStore } from "@/context/StoreContext";
import { AlertTriangle, AlertCircle, ArrowDownCircle, Info } from "lucide-react";

const OwnerAlerts = () => {
    const { products } = useStore();

    // Mock Alerts Logic
    const lowStockItems = products.filter(p => p.status === 'Low Stock' || p.status === 'Critical');
    const criticalAlerts = [
        { id: 1, title: "High Refund Rate", description: "Cashier terminal #2 has processed an unusual number of refunds today.", severity: "critical" },
        { id: 2, title: "Cash Discrepancy", description: "Closing balance for shift #405 short by R50.00.", severity: "warning" },
    ];

    return (
        <DashboardLayout role="owner">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Alerts & Notifications</h1>
                    <p className="text-muted-foreground">Critical updates requiring your attention.</p>
                </div>

                <div className="space-y-4">
                    {/* Critical Business Alerts */}
                    <Card className="border-l-4 border-l-red-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-600">
                                <AlertTriangle className="h-5 w-5" />
                                Critical Attention Needed
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {criticalAlerts.map(alert => (
                                <Alert key={alert.id} variant={alert.severity === "critical" ? "destructive" : "default"}>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>{alert.title}</AlertTitle>
                                    <AlertDescription>
                                        {alert.description}
                                    </AlertDescription>
                                </Alert>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Stock Alerts */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ArrowDownCircle className="h-5 w-5 text-amber-500" />
                                Low Stock Alerts
                            </CardTitle>
                            <CardDescription>Items falling below reorder levels.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {lowStockItems.length === 0 ? (
                                <div className="text-center py-4 text-muted-foreground flex flex-col items-center">
                                    <Info className="h-8 w-8 mb-2 opacity-50" />
                                    Stock levels are healthy.
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {lowStockItems.map(item => (
                                        <div key={item.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                                            <span className="font-medium">{item.name}</span>
                                            <span className="text-sm text-amber-700 font-bold">{item.stock} remaining</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* System Notifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Info className="h-5 w-5 text-blue-500" />
                                System Notifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                <div className="h-2 w-2 mt-2 rounded-full bg-blue-500" />
                                <div>
                                    <p className="font-medium text-sm">System Update Scheduled</p>
                                    <p className="text-xs text-muted-foreground">Maintenance scheduled for Sunday at 02:00 AM.</p>
                                </div>
                                <span className="ml-auto text-xs text-muted-foreground">2h ago</span>
                            </div>
                            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                <div className="h-2 w-2 mt-2 rounded-full bg-gray-300" />
                                <div>
                                    <p className="font-medium text-sm">Backup Completed</p>
                                    <p className="text-xs text-muted-foreground">Daily database backup completed successfully.</p>
                                </div>
                                <span className="ml-auto text-xs text-muted-foreground">5h ago</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default OwnerAlerts;
