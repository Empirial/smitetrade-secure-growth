import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Send } from "lucide-react";
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
    const [newType, setNewType] = useState<'info' | 'warning' | 'error' | 'success'>("info");
    const [newTarget, setNewTarget] = useState<string>("all");
    const [sending, setSending] = useState(false);

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
                type: newType,
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Type</Label>
                                        <Select value={newType} onValueChange={(v) => setNewType(v as typeof newType)}>
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
