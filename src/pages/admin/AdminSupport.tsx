
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Ticket {
    id: string;
    customer: string;
    subject: string;
    message: string;
    date: string;
    status: "open" | "in-progress" | "resolved";
    replies: { from: string; message: string; date: string }[];
}

const AdminSupport = () => {
    const [tickets, setTickets] = useState<Ticket[]>([
        {
            id: "TKT-001", customer: "Thandi M.", subject: "Order not delivered", date: "2026-03-08",
            message: "I placed an order 3 days ago and it still hasn't arrived. Order #1035.",
            status: "open", replies: []
        },
        {
            id: "TKT-002", customer: "Sipho K.", subject: "Wrong item received", date: "2026-03-07",
            message: "I ordered 2kg rice but received 1kg flour instead.",
            status: "in-progress", replies: [{ from: "Admin", message: "We're looking into this. Please keep the item, we'll send the correct one.", date: "2026-03-07" }]
        },
        {
            id: "TKT-003", customer: "Nomsa B.", subject: "Payment charged twice", date: "2026-03-06",
            message: "My card was charged R450 twice for order #1029. Please refund.",
            status: "open", replies: []
        },
        {
            id: "TKT-004", customer: "Bongani T.", subject: "Cannot login to account", date: "2026-03-05",
            message: "I've been locked out after entering wrong password. Reset link not working.",
            status: "resolved", replies: [
                { from: "Admin", message: "Password reset link has been re-sent to your email.", date: "2026-03-05" },
                { from: "Bongani T.", message: "Got it, thanks! Working now.", date: "2026-03-05" }
            ]
        },
    ]);

    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
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

    const openCount = tickets.filter(t => t.status === "open").length;
    const inProgressCount = tickets.filter(t => t.status === "in-progress").length;
    const resolvedCount = tickets.filter(t => t.status === "resolved").length;

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
                    <p className="text-muted-foreground">Manage customer support requests and issues.</p>
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
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tickets.map(ticket => (
                                    <TableRow key={ticket.id}>
                                        <TableCell className="font-mono text-xs">{ticket.id}</TableCell>
                                        <TableCell>{ticket.customer}</TableCell>
                                        <TableCell>{ticket.subject}</TableCell>
                                        <TableCell className="text-muted-foreground">{ticket.date}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={
                                                ticket.status === "open" ? "secondary" :
                                                ticket.status === "in-progress" ? "default" : "outline"
                                            }>
                                                {ticket.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right space-x-1">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button size="sm" variant="ghost" onClick={() => setSelectedTicket(ticket)}>
                                                        <MessageSquare className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-lg">
                                                    <DialogHeader>
                                                        <DialogTitle>{ticket.subject}</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div className="p-3 rounded-lg bg-muted">
                                                            <p className="text-sm font-medium">{ticket.customer}</p>
                                                            <p className="text-sm text-muted-foreground mt-1">{ticket.message}</p>
                                                            <p className="text-xs text-muted-foreground mt-2">{ticket.date}</p>
                                                        </div>
                                                        {ticket.replies.map((reply, i) => (
                                                            <div key={i} className={`p-3 rounded-lg ${reply.from === 'Admin' ? 'bg-primary/10 ml-4' : 'bg-muted mr-4'}`}>
                                                                <p className="text-sm font-medium">{reply.from}</p>
                                                                <p className="text-sm text-muted-foreground mt-1">{reply.message}</p>
                                                                <p className="text-xs text-muted-foreground mt-2">{reply.date}</p>
                                                            </div>
                                                        ))}
                                                        <div className="space-y-2">
                                                            <Textarea
                                                                placeholder="Type your reply..."
                                                                value={replyText}
                                                                onChange={(e) => setReplyText(e.target.value)}
                                                            />
                                                            <div className="flex gap-2">
                                                                <Button size="sm" onClick={() => sendReply(ticket.id)}>Send Reply</Button>
                                                                {ticket.status !== "resolved" && (
                                                                    <Button size="sm" variant="outline" onClick={() => updateStatus(ticket.id, "resolved")}>
                                                                        Mark Resolved
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                            {ticket.status === "open" && (
                                                <Button size="sm" variant="ghost" onClick={() => updateStatus(ticket.id, "in-progress")}>
                                                    <Clock className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default AdminSupport;
