import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, CheckCircle2, Navigation, AlertCircle } from "lucide-react";

const LenderAlerts = () => {
    const alerts = [
        {
            id: 1, type: "success", title: "New Loan Application",
            message: "Thabo Mokoena has submitted a loan application for R5,000. SpazaScore: 72/100. Review and respond within 48 hours.",
            date: new Date(Date.now() - 1000 * 60 * 60).toISOString(), read: false,
            action: { label: "Review Application", route: "/lender/applications" }
        },
        {
            id: 2, type: "error", title: "Overdue Repayment Alert",
            message: "Client Nomsa Dlamini has missed her R1,200 repayment due on March 5. This is her second consecutive missed payment.",
            date: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), read: false,
            action: { label: "View Collections", route: "/lender/collections" }
        },
        {
            id: 3, type: "warning", title: "Compliance Reminder",
            message: "Monthly NCR compliance report is due by March 15. Ensure all active loan records are up to date before submission.",
            date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), read: false,
            action: { label: "View Active Loans", route: "/lender/loans" }
        },
        {
            id: 4, type: "info", title: "Portfolio Summary Available",
            message: "Your February lending portfolio summary is ready. Total disbursed: R45,000 across 12 clients. Default rate: 4.2%.",
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), read: true,
            action: { label: "View Dashboard", route: "/lender/dashboard" }
        },
        {
            id: 5, type: "info", title: "Platform Update — Credit Check Enhancements",
            message: "SpazaScore credit checks now include transaction frequency and repayment consistency metrics for more accurate assessments.",
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), read: true,
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
        <DashboardLayout role="lender">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Alerts & Notifications</h1>
                        <p className="text-muted-foreground">Loan applications, repayment alerts, and compliance notices.</p>
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

export default LenderAlerts;
