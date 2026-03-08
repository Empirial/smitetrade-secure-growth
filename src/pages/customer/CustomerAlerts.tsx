import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, CheckCircle2, Navigation, AlertCircle, Banknote } from "lucide-react";

const CustomerAlerts = () => {
    // Mock Alerts
    const alerts = [
        {
            id: 1,
            type: "warning",
            title: "Upcoming Loan Repayment",
            message: "Reminder: Your loan repayment of R2,500 to Swift Capital is due in 3 days. Please ensure your wallet has sufficient funds.",
            date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            read: false,
            action: { label: "View Loan Details", route: "/customer/credit-status" }
        },
        {
            id: 2,
            type: "success",
            title: "Credit Pre-Approval",
            message: "Great news! Based on your SpazaScore, you have been pre-approved for an additional R1,000 credit line.",
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
            read: false,
            action: { label: "Apply Now", route: "/customer/apply-credit" }
        },
        {
            id: 3,
            type: "info",
            title: "Delivery Update",
            message: "Your recent bulk order (#ORD-9821) is expected to arrive tomorrow between 10 AM and 2 PM.",
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
            read: true,
            action: { label: "Track Order", route: "/customer/tracking" }
        },
        {
            id: 4,
            type: "error",
            title: "Overdue Notice",
            message: "Your payment of R500 for the 'EasyAccess' loan was completely missed. A strike has been applied to your SpazaScore.",
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
            read: true,
            action: { label: "Contact Support", route: "/customer/support" }
        }
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
        if (read) return "border-slate-800 bg-slate-900/50 opacity-80";
        switch (type) {
            case "warning": return "border-amber-500/50 bg-amber-950/10";
            case "error": return "border-red-500/50 bg-red-950/10";
            case "success": return "border-emerald-500/50 bg-emerald-950/10";
            default: return "border-blue-500/50 bg-blue-950/10";
        }
    };

    return (
        <DashboardLayout role="customer">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Alerts & Notifications</h1>
                        <p className="text-muted-foreground">Stay updated on your loans, deliveries, and profile statuses.</p>
                    </div>
                    <Button variant="outline" size="sm">Mark All as Read</Button>
                </div>

                <div className="space-y-4">
                    {alerts.map((alert) => (
                        <Card key={alert.id} className={`transition-all border-l-4 overflow-hidden ${getBorderColor(alert.type, alert.read)}`}>
                            <CardHeader className="p-4 pb-2">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-900 rounded-full shrink-0">
                                            {getIcon(alert.type)}
                                        </div>
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
                                <p className="text-sm text-slate-300">
                                    {alert.message}
                                </p>
                            </CardContent>
                            <CardFooter className="p-4 pt-2 pl-[3.25rem] flex items-center justify-between">
                                {alert.action && (
                                    <Button variant="link" className="p-0 h-auto text-emerald-500 hover:text-emerald-400 font-medium text-sm">
                                        {alert.action.label} <Navigation className="ml-1 h-3 w-3" />
                                    </Button>
                                )}
                                {!alert.read && (
                                    <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground">Dismiss</Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CustomerAlerts;
