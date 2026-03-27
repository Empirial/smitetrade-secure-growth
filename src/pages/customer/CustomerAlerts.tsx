import DashboardLayout from "@/components/DashboardLayout";
import SystemNotifications from "@/components/SystemNotifications";
import { useNotifications } from "@/hooks/useNotifications";

const CustomerAlerts = () => {
    const { notifications, isRead, markAsRead, dismiss, markAllAsRead, loading } = useNotifications();

    return (
        <DashboardLayout role="customer">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Alerts & Notifications</h1>
                    <p className="text-muted-foreground">Stay updated on your loans, deliveries, and profile statuses.</p>
                </div>

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

export default CustomerAlerts;
