import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageSquare, Clock, CheckCircle, AlertCircle, User, Store, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, updateDoc, doc, query, orderBy, arrayUnion, Timestamp } from "firebase/firestore";

interface TicketReply {
    from: string;
    message: string;
    date: string;
}

interface Ticket {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    subject: string;
    description: string;
    createdAt: Timestamp | null;
    status: "open" | "in-progress" | "resolved";
    type: "bug" | "update" | "suggestion" | "other";
    role: "customer" | "owner" | "cashier" | "driver" | "lender";
    target: "admin" | "owner";
    storeName?: string;
    reference?: string;
    replies: TicketReply[];
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
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState("");
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    useEffect(() => {
        const q = query(collection(db, "support_tickets"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ticketData = snapshot.docs.map(d => ({
                id: d.id,
                ...d.data(),
            })) as Ticket[];
            setTickets(ticketData);
            setLoading(false);

            // Keep selected ticket in sync
            if (selectedTicket) {
                const updated = ticketData.find(t => t.id === selectedTicket.id);
                if (updated) setSelectedTicket(updated);
            }
        }, (error) => {
            console.error("Error listening to tickets:", error);
            toast.error("Failed to load tickets");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateStatus = async (ticketId: string, status: Ticket["status"]) => {
        try {
            await updateDoc(doc(db, "support_tickets", ticketId), { status });
            toast.success(`Ticket marked as ${status}`);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    const sendReply = async (ticketId: string) => {
        if (!replyText.trim()) return;
        try {
            const newReply: TicketReply = {
                from: "Admin",
                message: replyText,
                date: new Date().toISOString().split('T')[0],
            };
            await updateDoc(doc(db, "support_tickets", ticketId), {
                replies: arrayUnion(newReply),
                status: "in-progress",
            });
            setReplyText("");
            toast.success("Reply sent");
        } catch (error) {
            console.error("Error sending reply:", error);
            toast.error("Failed to send reply");
        }
    };

    const formatDate = (timestamp: Timestamp | null) => {
        if (!timestamp) return "—";
        return timestamp.toDate().toLocaleDateString("en-ZA");
    };

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

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
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
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : tickets.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>No support tickets yet.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead className="hidden md:table-cell">Role</TableHead>
                                        <TableHead className="hidden lg:table-cell">Type</TableHead>
                                        <TableHead className="hidden lg:table-cell">Date</TableHead>
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
                                            <TableCell>
                                                <div>{ticket.userName}</div>
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
                                            <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{formatDate(ticket.createdAt)}</TableCell>
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
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Ticket Detail Dialog */}
            <Dialog open={!!selectedTicket} onOpenChange={(open) => { if (!open) { setSelectedTicket(null); setReplyText(""); } }}>
                <DialogContent className="w-full max-w-[95vw] sm:max-w-lg max-h-[85vh] flex flex-col">
                    {selectedTicket && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <DialogTitle>{selectedTicket.subject}</DialogTitle>
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
                                    {selectedTicket.reference && (
                                        <>
                                            <span className="text-xs">•</span>
                                            <span className="text-xs font-mono">Ref: {selectedTicket.reference}</span>
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
                                            <p className="text-sm font-medium">{selectedTicket.userName}</p>
                                            <span className="text-xs text-muted-foreground">{selectedTicket.userEmail}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{selectedTicket.description}</p>
                                        <p className="text-xs text-muted-foreground mt-2">{formatDate(selectedTicket.createdAt)}</p>
                                    </div>
                                    {selectedTicket.replies?.map((reply, i) => (
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
                                        <Button size="sm" variant="outline" onClick={() => updateStatus(selectedTicket.id, "in-progress")}>
                                            In Progress
                                        </Button>
                                    )}
                                    {selectedTicket.status !== "resolved" && (
                                        <Button size="sm" variant="outline" onClick={() => updateStatus(selectedTicket.id, "resolved")}>
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
