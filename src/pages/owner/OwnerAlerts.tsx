import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useStore } from "@/context/StoreContext";
import { AlertTriangle, AlertCircle, ArrowDownCircle, Info } from "lucide-react";
import SystemNotifications from "@/components/SystemNotifications";
import { useNotifications } from "@/hooks/useNotifications";

const OwnerAlerts = () => {
    const { products } = useStore();
    const { notifications, isRead, markAsRead, dismiss, markAllAsRead, loading } = useNotifications();

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
                                    <AlertDescription>{alert.description}</AlertDescription>
                                </Alert>
                            ))}
                        </CardContent>
                    </Card>

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
                                        <div key={item.id} className="flex items-center justify-between p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                                            <span className="font-medium">{item.name}</span>
                                            <span className="text-sm text-amber-500 font-bold">{item.stock} remaining</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <SystemNotifications
                        notifications={notifications}
                        isRead={isRead}
                        onMarkAsRead={markAsRead}
                        onDismiss={dismiss}
                        onMarkAllAsRead={markAllAsRead}
                        loading={loading}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default OwnerAlerts;
