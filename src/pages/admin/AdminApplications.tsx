import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, updateDoc, arrayUnion, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, MapPin, Store, Eye, Phone, Mail, Calendar, FileText, User } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Application {
    id: string;
    storeId?: string;
    ownerId?: string;
    name: string;
    owner: string;
    location: string;
    date: string;
    status: "Pending" | "Approved" | "Rejected";
    email: string;
    phone: string;
    description: string;
    documents: { name: string; submitted: boolean }[];
    messages: { from: string; message: string; date: string }[];
}

const AdminApplications = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [replyText, setReplyText] = useState("");

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "applications"), (snap) => {
            setApplications(snap.docs.map((d) => ({
                id: d.id,
                storeId: d.data().storeId || "",
                ownerId: d.data().ownerId || "",
                name: d.data().name || d.data().storeName || "Unnamed Store",
                owner: d.data().owner || d.data().ownerName || "",
                location: d.data().location || d.data().address || "",
                date: d.data().date || (d.data().createdAt as string)?.split?.("T")[0] || "",
                status: d.data().status || "Pending",
                email: d.data().email || "",
                phone: d.data().phone || "",
                description: d.data().description || "",
                documents: d.data().documents || [],
                messages: d.data().messages || [],
            })));
            setIsLoading(false);
        }, () => setIsLoading(false));
        return () => unsub();
    }, []);

    const handleAction = async (id: string, action: "Approved" | "Rejected") => {
        try {
            await updateDoc(doc(db, "applications", id), { status: action });

            // Sync the store's status so the owner's access gate unlocks immediately.
            const app = applications.find(a => a.id === id);
            let storeId = app?.storeId;
            if (!storeId && app?.ownerId) {
                // Fallback: find the store by ownerId if storeId wasn't stored on the application.
                const snap = await getDocs(query(collection(db, "stores"), where("ownerId", "==", app.ownerId)));
                if (!snap.empty) storeId = snap.docs[0].id;
            }
            if (storeId) {
                const storeStatus = action === "Approved" ? "Active" : "Rejected";
                await updateDoc(doc(db, "stores", storeId), { status: storeStatus });
            }

            if (selectedApp?.id === id) setSelectedApp(prev => prev ? { ...prev, status: action } : null);
            toast.success(`Application ${action.toLowerCase()} successfully.`);
        } catch {
            toast.error("Failed to update application.");
        }
    };

    const sendMessage = async (id: string) => {
        if (!replyText.trim()) return;
        const newMsg = { from: "Admin", message: replyText, date: new Date().toISOString().split("T")[0] };
        try {
            await updateDoc(doc(db, "applications", id), { messages: arrayUnion(newMsg) });
            if (selectedApp?.id === id) setSelectedApp(prev => prev ? { ...prev, messages: [...prev.messages, newMsg] } : null);
            setReplyText("");
            toast.success("Message sent to applicant.");
        } catch {
            toast.error("Failed to send message.");
        }
    };

    const missingDocs = (app: Application) => app.documents.filter(d => !d.submitted);

    return (
        <DashboardLayout role="admin">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Store Applications</h1>
            <p className="text-muted-foreground mb-4">Review new Spaza Shop registration requests.</p>

            {isLoading ? (
                <p className="text-muted-foreground py-8 text-center">Loading applications...</p>
            ) : applications.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">No store applications yet.</p>
            ) : null}
            <div className="grid gap-4">
                {applications.map((app) => (
                    <Card key={app.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedApp(app)}>
                        <CardHeader className="pb-3">
                            <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                                <div className="space-y-1">
                                    <CardTitle className="flex items-center gap-2">
                                        <Store className="h-5 w-5 text-muted-foreground" />
                                        {app.name}
                                    </CardTitle>
                                    <CardDescription>Owner: {app.owner}</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={app.status === "Pending" ? "default" : app.status === "Approved" ? "outline" : "destructive"}>
                                        {app.status}
                                    </Badge>
                                    <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setSelectedApp(app); }}>
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                    <MapPin className="h-4 w-4" /> {app.location} • Applied {app.date}
                                </div>
                                {missingDocs(app).length > 0 && (
                                    <span className="text-xs text-destructive font-medium">
                                        {missingDocs(app).length} missing doc(s)
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={!!selectedApp} onOpenChange={(open) => { if (!open) { setSelectedApp(null); setReplyText(""); } }}>
                <DialogContent className="w-full max-w-[95vw] sm:max-w-lg max-h-[90vh] flex flex-col">
                    {selectedApp && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <DialogTitle className="flex items-center gap-2">
                                        <Store className="h-5 w-5" /> {selectedApp.name}
                                    </DialogTitle>
                                    <Badge variant={selectedApp.status === "Pending" ? "default" : selectedApp.status === "Approved" ? "outline" : "destructive"}>
                                        {selectedApp.status}
                                    </Badge>
                                </div>
                                <DialogDescription>{selectedApp.description}</DialogDescription>
                            </DialogHeader>

                            <ScrollArea className="flex-1 max-h-[500px] pr-4">
                                <div className="space-y-4">
                                    {/* Owner Info */}
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-semibold text-foreground">Owner Details</h3>
                                        <div className="grid grid-cols-1 gap-2 text-sm">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <User className="h-3.5 w-3.5" /> {selectedApp.owner}
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Mail className="h-3.5 w-3.5" /> {selectedApp.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Phone className="h-3.5 w-3.5" /> {selectedApp.phone}
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <MapPin className="h-3.5 w-3.5" /> {selectedApp.location}
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Calendar className="h-3.5 w-3.5" /> Applied {selectedApp.date}
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Documents */}
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                            <FileText className="h-4 w-4" /> Documents
                                        </h3>
                                        <div className="space-y-1.5">
                                            {selectedApp.documents.map((doc, i) => (
                                                <div key={i} className="flex items-center justify-between text-sm py-1">
                                                    <span className="text-muted-foreground">{doc.name}</span>
                                                    {doc.submitted ? (
                                                        <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                                                            <Check className="h-3 w-3 mr-1" /> Submitted
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-destructive border-destructive/20 bg-destructive/5">
                                                            <X className="h-3 w-3 mr-1" /> Missing
                                                        </Badge>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Messages */}
                                    {selectedApp.messages.length > 0 && (
                                        <>
                                            <Separator />
                                            <div className="space-y-2">
                                                <h3 className="text-sm font-semibold text-foreground">Message History</h3>
                                                {selectedApp.messages.map((msg, i) => (
                                                    <div key={i} className="p-3 rounded-lg bg-primary/10 text-sm">
                                                        <p className="font-medium text-foreground">{msg.from}</p>
                                                        <p className="text-muted-foreground mt-1">{msg.message}</p>
                                                        <p className="text-xs text-muted-foreground mt-2">{msg.date}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </ScrollArea>

                            <div className="space-y-3 pt-2 border-t">
                                <div className="space-y-2">
                                    <Label htmlFor="reply">Send Message to Applicant</Label>
                                    <Textarea
                                        id="reply"
                                        placeholder="e.g. Please submit your Business Registration document..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                    />
                                    <Button size="sm" onClick={() => sendMessage(selectedApp.id)} disabled={!replyText.trim()}>
                                        Send Message
                                    </Button>
                                </div>

                                {selectedApp.status === "Pending" && (
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            className="flex-1"
                                            variant="outline"
                                            onClick={() => handleAction(selectedApp.id, "Rejected")}
                                        >
                                            <X className="h-4 w-4 mr-1" /> Reject
                                        </Button>
                                        <Button
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                                            onClick={() => handleAction(selectedApp.id, "Approved")}
                                        >
                                            <Check className="h-4 w-4 mr-1" /> Approve
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default AdminApplications;
