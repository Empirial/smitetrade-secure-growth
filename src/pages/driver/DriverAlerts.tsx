import DashboardLayout from "@/components/DashboardLayout";
import { Bell } from "lucide-react";
import SystemNotifications from "@/components/SystemNotifications";
import { useNotifications } from "@/hooks/useNotifications";

const DriverAlerts = () => {
    const { notifications, isRead, markAsRead, dismiss, markAllAsRead, loading } = useNotifications();

    return (
        <DashboardLayout role="driver">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Alerts & Notifications</h1>
                    <p className="text-muted-foreground">Delivery assignments, route updates, and system notices.</p>
                </div>

                {!loading && notifications.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 bg-muted/30 rounded-xl border border-dashed">
                        <Bell className="h-10 w-10 text-muted-foreground opacity-40" />
                        <p className="font-medium text-muted-foreground">No alerts right now</p>
                        <p className="text-sm text-muted-foreground">New delivery assignments and updates will appear here.</p>
                    </div>
                )}

                <SystemNotifications
                    notifications={notifications}
                    isRead={isRead}
                    onMarkAsRead={markAsRead}
                    onDismiss={dismiss}
                    onMarkAllAsRead={markAllAsRead}
                    loading={loading}
                />
            </div>
        </DashboardLayout>
    );
};

export default DriverAlerts;
