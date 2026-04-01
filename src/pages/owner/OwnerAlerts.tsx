import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/context/StoreContext";
import { ArrowDownCircle, Info } from "lucide-react";
import SystemNotifications from "@/components/SystemNotifications";
import { useNotifications } from "@/hooks/useNotifications";

const OwnerAlerts = () => {
    const { products } = useStore();
    const { notifications, isRead, markAsRead, dismiss, markAllAsRead, loading } = useNotifications();

    const lowStockItems = products.filter(p => p.status === 'Low Stock' || p.status === 'Critical');

    return (
        <DashboardLayout role="owner">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Alerts & Notifications</h1>
                    <p className="text-muted-foreground">Critical updates requiring your attention.</p>
                </div>

                <div className="space-y-4">
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
