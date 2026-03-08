import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, CheckCircle2, Navigation, AlertCircle } from "lucide-react";
import { Notification } from "@/hooks/useNotifications";

interface SystemNotificationsProps {
    notifications: Notification[];
    isRead: (id: string) => boolean;
    onMarkAsRead: (id: string) => void;
    onDismiss: (id: string) => void;
    onMarkAllAsRead: () => void;
    loading?: boolean;
}

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

const SystemNotifications = ({ notifications, isRead, onMarkAsRead, onDismiss, onMarkAllAsRead, loading }: SystemNotificationsProps) => {
    if (loading) {
        return (
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    Loading system notifications...
                </CardContent>
            </Card>
        );
    }

    if (notifications.length === 0) {
        return (
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No system notifications at this time.
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-500" />
                    System Notifications
                </h2>
                <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>Mark All as Read</Button>
            </div>
            {notifications.map((notif) => {
                const read = isRead(notif.id);
                return (
                    <Card key={notif.id} className={`transition-all border-l-4 overflow-hidden ${getBorderColor(notif.type, read)}`}>
                        <CardHeader className="p-4 pb-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-muted rounded-full shrink-0">{getIcon(notif.type)}</div>
                                <div>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        {notif.title}
                                        {!read && <Badge variant="default" className="bg-emerald-600 text-[10px] h-4 px-1">New</Badge>}
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2 pb-2 pl-[3.25rem]">
                            <p className="text-sm text-muted-foreground">{notif.message}</p>
                        </CardContent>
                        <CardFooter className="p-4 pt-2 pl-[3.25rem] flex items-center justify-between">
                            {notif.action && (
                                <Button asChild variant="link" className="p-0 h-auto text-primary hover:text-primary/80 font-medium text-sm">
                                    <Link to={notif.action.route}>
                                        {notif.action.label} <Navigation className="ml-1 h-3 w-3" />
                                    </Link>
                                </Button>
                            )}
                            <div className="flex gap-2 ml-auto">
                                {!read && (
                                    <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground" onClick={() => onMarkAsRead(notif.id)}>
                                        Mark Read
                                    </Button>
                                )}
                                {!read && (
                                    <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground" onClick={() => onDismiss(notif.id)}>
                                        Dismiss
                                    </Button>
                                )}
                            </div>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
};

export default SystemNotifications;
