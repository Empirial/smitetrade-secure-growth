import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, CheckCircle2, Navigation, AlertCircle, Plus, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import SystemNotifications from "@/components/SystemNotifications";
import { useNotifications } from "@/hooks/useNotifications";
import { toast } from "sonner";

const AdminAlerts = () => {
    const { notifications, isRead, markAsRead, dismiss, markAllAsRead, createNotification, loading } = useNotifications();
    const [open, setOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [newType, setNewType] = useState<string>("info");
    const [newTarget, setNewTarget] = useState<string>("all");
    const [sending, setSending] = useState(false);

    const localAlerts = [
        {
            id: 1, type: "error", title: "Security Alert — Suspicious Login",
            message: "Multiple failed login attempts detected for owner@kasifresh.co.za. Account temporarily locked.",
            date: new Date(Date.now() - 1000 * 60 * 45).toISOString(), read: false,
            action: { label: "View Users", route: "/admin/users" }
        },
        {
            id: 2, type: "warning", title: "High Default Rate — Lending Module",
            message: "Platform-wide loan default rate has exceeded 8% this month (threshold: 5%).",
            date: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), read: false,
            action: { label: "Credit Overview", route: "/admin/credit-overview" }
        },
        {
            id: 3, type: "warning", title: "Support Ticket Backlog",
            message: "23 unresolved support tickets older than 48 hours. SLA compliance at 67%.",
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), read: true,
            action: { label: "View Tickets", route: "/admin/support" }
        },
    ];

    const handleBroadcast = async () => {
        if (!newTitle.trim() || !newMessage.trim()) {
            toast.error("Title and message are required");
            return;
        }
        setSending(true);
        try {
            const targetRoles = newTarget === 'all' ? ['all'] : [newTarget];
            await createNotification({
                title: newTitle,
                message: newMessage,
                type: newType as any,
                targetRoles,
                action: null,
            });
            toast.success("Notification broadcast successfully!");
            setNewTitle("");
            setNewMessage("");
            setNewType("info");
            setNewTarget("all");
            setOpen(false);
        } catch (e) {
            toast.error("Failed to broadcast notification");
        }
        setSending(false);
    };

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
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" /> Broadcast Notification
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Broadcast System Notification</DialogTitle>
                                <DialogDescription>Send a notification to all users or specific portal roles.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label>Title</Label>
                                    <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Scheduled Maintenance" />
                                </div>
                                <div>
                                    <Label>Message</Label>
                                    <Textarea value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Describe the notification..." rows={3} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Type</Label>
                                        <Select value={newType} onValueChange={setNewType}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="info">Info</SelectItem>
                                                <SelectItem value="warning">Warning</SelectItem>
                                                <SelectItem value="error">Critical</SelectItem>
                                                <SelectItem value="success">Success</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Target</Label>
                                        <Select value={newTarget} onValueChange={setNewTarget}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Portals</SelectItem>
                                                <SelectItem value="owner">Owners</SelectItem>
                                                <SelectItem value="cashier">Cashiers</SelectItem>
                                                <SelectItem value="customer">Customers</SelectItem>
                                                <SelectItem value="driver">Drivers</SelectItem>
                                                <SelectItem value="lender">Lenders</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleBroadcast} disabled={sending} className="gap-2">
                                    <Send className="h-4 w-4" /> {sending ? "Sending..." : "Broadcast"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="space-y-4">
                    {localAlerts.map((alert) => (
                        <Card key={alert.id} className={`transition-all border-l-4 overflow-hidden ${getBorderColor(alert.type, alert.read)}`}>
                            <CardHeader className="p-4 pb-2">
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
                            </CardHeader>
                            <CardContent className="p-4 pt-2 pb-2 pl-[3.25rem]">
                                <p className="text-sm text-muted-foreground">{alert.message}</p>
                            </CardContent>
                            <CardFooter className="p-4 pt-2 pl-[3.25rem]">
                                {alert.action && (
                                    <Button asChild variant="link" className="p-0 h-auto text-primary hover:text-primary/80 font-medium text-sm">
                                        <Link to={alert.action.route}>
                                            {alert.action.label} <Navigation className="ml-1 h-3 w-3" />
                                        </Link>
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
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

export default AdminAlerts;
