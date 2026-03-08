import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, Clock, CheckCircle, AlertCircle, User, Store } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Ticket {
    id: string;
    customer: string;
    subject: string;
    message: string;
    date: string;
    status: "open" | "in-progress" | "resolved";
    type: "bug" | "update" | "suggestion" | "other";
    role: "customer" | "owner" | "cashier" | "driver" | "lender";
    storeName?: string;
    replies: { from: string; message: string; date: string }[];
}

const typeLabels: Record<string, string> = {
    bug: "Bug / Issue",
    update: "Update Request",
    suggestion: "Suggestion",
    other: "Other",
};

const roleColors: Record<string, string> = {
    customer: "bg-blue-100 text-blue-700",
    owner: "bg-emerald-100 text-emerald-700",
    cashier: "bg-amber-100 text-amber-700",
    driver: "bg-purple-100 text-purple-700",
    lender: "bg-rose-100 text-rose-700",
};

const AdminSupport = () => {
    const [tickets, setTickets] = useState<Ticket[]>([
        {
            id: "TKT-001", customer: "Thandi M.", subject: "Order not delivered", date: "2026-03-08",
            message: "I placed an order 3 days ago and it still hasn't arrived. Order #1035.",
            status: "open", type: "bug", role: "customer", replies: []
        },
        {
            id: "TKT-002", customer: "Sipho K.", subject: "Wrong item received", date: "2026-03-07",
            message: "I ordered 2kg rice but received 1kg flour instead.",
            status: "in-progress", type: "bug", role: "customer",
            replies: [{ from: "Admin", message: "We're looking into this. Please keep the item, we'll send the correct one.", date: "2026-03-07" }]
        },
        {
            id: "TKT-003", customer: "Nomsa B.", subject: "Payment charged twice", date: "2026-03-06",
            message: "My card was charged R450 twice for order #1029. Please refund.",
            status: "open", type: "bug", role: "owner", storeName: "Nomsa's Spaza", replies: []
        },
        {
            id: "TKT-004", customer: "Bongani T.", subject: "Add dark mode to POS", date: "2026-03-05",
            message: "It would be great if the POS system had a dark mode for night shifts.",
            status: "resolved", type: "suggestion", role: "cashier", storeName: "Kasi Corner Store",
            replies: [
                { from: "Admin", message: "Great suggestion! We've added it to our roadmap.", date: "2026-03-05" },
                { from: "Bongani T.", message: "Awesome, thanks!", date: "2026-03-05" }
            ]
        },
        {
            id: "TKT-005", customer: "Themba D.", subject: "Route map not loading", date: "2026-03-07",
            message: "The delivery route map shows a blank screen on my phone.",
            status: "open", type: "bug", role: "driver", storeName: "Fresh Foods Spaza", replies: []
        },
    ]);

    const [replyText, setReplyText] = useState("");

    const updateStatus = (ticketId: string, status: Ticket["status"]) => {
        setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
        toast.success(`Ticket marked as ${status}`);
    };

    const sendReply = (ticketId: string) => {
        if (!replyText.trim()) return;
        setTickets(prev => prev.map(t => {
            if (t.id === ticketId) {
                return {
                    ...t,
                    status: "in-progress" as const,
                    replies: [...t.replies, { from: "Admin", message: replyText, date: new Date().toISOString().split('T')[0] }]
                };
            }
            return t;
        }));
        setReplyText("");
        toast.success("Reply sent");
    };

    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    const openCount = tickets.filter(t => t.status === "open").length;
    const inProgressCount = tickets.filter(t => t.status === "in-progress").length;
    const resolvedCount = tickets.filter(t => t.status === "resolved").length;

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
                    <p className="text-muted-foreground">Manage support requests from all portal users.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Open</CardTitle>
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold">{openCount}</div></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                            <Clock className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold">{inProgressCount}</div></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold">{resolvedCount}</div></CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">All Tickets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead className="hidden md:table-cell">Role</TableHead>
                                    <TableHead className="hidden lg:table-cell">Type</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tickets.map(ticket => (
                                    <TableRow
                                        key={ticket.id}
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => setSelectedTicket(ticket)}
                                    >
                                        <TableCell className="font-mono text-xs">{ticket.id}</TableCell>
                                        <TableCell>
                                            <div>{ticket.customer}</div>
                                            {ticket.storeName && (
                                                <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                    <Store className="h-3 w-3" />{ticket.storeName}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate">{ticket.subject}</TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${roleColors[ticket.role]}`}>
                                                {ticket.role}
                                            </span>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{typeLabels[ticket.type]}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={
                                                ticket.status === "open" ? "secondary" :
                                                ticket.status === "in-progress" ? "default" : "outline"
                                            }>
                                                {ticket.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Ticket Detail Dialog */}
            <Dialog open={!!selectedTicket} onOpenChange={(open) => { if (!open) { setSelectedTicket(null); setReplyText(""); } }}>
                <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
                    {selectedTicket && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <DialogTitle>{selectedTicket.subject}</DialogTitle>
                                    <Badge variant="outline" className="text-xs font-mono">{selectedTicket.id}</Badge>
                                </div>
                                <DialogDescription className="flex items-center gap-2 flex-wrap pt-1">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${roleColors[selectedTicket.role]}`}>
                                        {selectedTicket.role}
                                    </span>
                                    <span className="text-xs">•</span>
                                    <span className="text-xs">{typeLabels[selectedTicket.type]}</span>
                                    {selectedTicket.storeName && (
                                        <>
                                            <span className="text-xs">•</span>
                                            <span className="text-xs flex items-center gap-1"><Store className="h-3 w-3" />{selectedTicket.storeName}</span>
                                        </>
                                    )}
                                    <span className="text-xs">•</span>
                                    <Badge variant={
                                        selectedTicket.status === "open" ? "secondary" :
                                        selectedTicket.status === "in-progress" ? "default" : "outline"
                                    } className="text-xs">
                                        {selectedTicket.status}
                                    </Badge>
                                </DialogDescription>
                            </DialogHeader>

                            <ScrollArea className="flex-1 max-h-[400px] pr-4">
                                <div className="space-y-3">
                                    <div className="p-3 rounded-lg bg-muted">
                                        <div className="flex items-center gap-2 mb-1">
                                            <User className="h-3.5 w-3.5" />
                                            <p className="text-sm font-medium">{selectedTicket.customer}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{selectedTicket.message}</p>
                                        <p className="text-xs text-muted-foreground mt-2">{selectedTicket.date}</p>
                                    </div>
                                    {selectedTicket.replies.map((reply, i) => (
                                        <div key={i} className={`p-3 rounded-lg ${reply.from === 'Admin' ? 'bg-primary/10 ml-4' : 'bg-muted mr-4'}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <User className="h-3.5 w-3.5" />
                                                <p className="text-sm font-medium">{reply.from}</p>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{reply.message}</p>
                                            <p className="text-xs text-muted-foreground mt-2">{reply.date}</p>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>

                            <div className="space-y-2 pt-2 border-t">
                                <Textarea
                                    placeholder="Type your reply..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                />
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={() => sendReply(selectedTicket.id)} disabled={!replyText.trim()}>
                                        Send Reply
                                    </Button>
                                    {selectedTicket.status === "open" && (
                                        <Button size="sm" variant="outline" onClick={() => { updateStatus(selectedTicket.id, "in-progress"); setSelectedTicket(prev => prev ? { ...prev, status: "in-progress" } : null); }}>
                                            In Progress
                                        </Button>
                                    )}
                                    {selectedTicket.status !== "resolved" && (
                                        <Button size="sm" variant="outline" onClick={() => { updateStatus(selectedTicket.id, "resolved"); setSelectedTicket(prev => prev ? { ...prev, status: "resolved" } : null); }}>
                                            Mark Resolved
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default AdminSupport;
