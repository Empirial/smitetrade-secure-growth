import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, CheckCircle2, Navigation, AlertCircle } from "lucide-react";

const AdminAlerts = () => {
    const alerts = [
        {
            id: 1, type: "error", title: "Security Alert — Suspicious Login",
            message: "Multiple failed login attempts detected for user account owner@kasifresh.co.za from an unrecognized IP address. Account temporarily locked.",
            date: new Date(Date.now() - 1000 * 60 * 45).toISOString(), read: false,
            action: { label: "View Users", route: "/admin/users" }
        },
        {
            id: 2, type: "warning", title: "High Default Rate — Lending Module",
            message: "The platform-wide loan default rate has exceeded 8% this month (threshold: 5%). 14 accounts are flagged for review.",
            date: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), read: false,
            action: { label: "Credit Overview", route: "/admin/credit-overview" }
        },
        {
            id: 3, type: "success", title: "New Store Onboarded",
            message: "Mama's Corner Shop (Tembisa) has completed registration and verification. Store is now live on the platform.",
            date: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), read: false,
            action: { label: "View Stores", route: "/admin/stores" }
        },
        {
            id: 4, type: "info", title: "Monthly Revenue Report Ready",
            message: "February 2026 revenue report is available. Platform GMV: R2.4M (+12% MoM). Transaction fees collected: R48,000.",
            date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), read: true,
            action: { label: "View Revenue", route: "/admin/revenue" }
        },
        {
            id: 5, type: "warning", title: "Support Ticket Backlog",
            message: "There are 23 unresolved support tickets older than 48 hours. SLA compliance is at 67% (target: 90%).",
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), read: true,
            action: { label: "View Tickets", route: "/admin/support" }
        },
        {
            id: 6, type: "info", title: "System Maintenance Completed",
            message: "Database migration and index optimization completed successfully. Query performance improved by ~30%.",
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), read: true,
            action: null
        },
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case "warning": return <AlertTriangle className="h-5 w-5 text-amber-500" />;
            case "error": return <AlertCircle className="h-5 w-5 text-red-500" />;
            case "success": return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
            default: return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    const getBorderColor = (type: string, read: boolean) => {
        if (read) return "border-muted bg-muted/30 opacity-80";
        switch (type) {
            case "warning": return "border-amber-500/50 bg-amber-950/10";
            case "error": return "border-red-500/50 bg-red-950/10";
            case "success": return "border-emerald-500/50 bg-emerald-950/10";
            default: return "border-blue-500/50 bg-blue-950/10";
        }
    };

    return (
        <DashboardLayout role="admin">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Alerts & Notifications</h1>
                        <p className="text-muted-foreground">Platform security, metrics, and system notifications.</p>
                    </div>
                    <Button variant="outline" size="sm">Mark All as Read</Button>
                </div>
                <div className="space-y-4">
                    {alerts.map((alert) => (
                        <Card key={alert.id} className={`transition-all border-l-4 overflow-hidden ${getBorderColor(alert.type, alert.read)}`}>
                            <CardHeader className="p-4 pb-2">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-muted rounded-full shrink-0">{getIcon(alert.type)}</div>
                                        <div>
                                            <CardTitle className="text-base flex items-center gap-2">
                                                {alert.title}
                                                {!alert.read && <Badge variant="default" className="bg-emerald-600 text-[10px] h-4 px-1">New</Badge>}
                                            </CardTitle>
                                            <CardDescription className="text-xs">
                                                {new Date(alert.date).toLocaleDateString()} at {new Date(alert.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-2 pb-2 pl-[3.25rem]">
                                <p className="text-sm text-muted-foreground">{alert.message}</p>
                            </CardContent>
                            <CardFooter className="p-4 pt-2 pl-[3.25rem] flex items-center justify-between">
                                {alert.action && (
                                    <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80 font-medium text-sm">
                                        {alert.action.label} <Navigation className="ml-1 h-3 w-3" />
                                    </Button>
                                )}
                                {!alert.read && <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground">Dismiss</Button>}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminAlerts;
