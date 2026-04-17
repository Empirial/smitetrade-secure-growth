
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Dispute {
    id: string;
    type: string;
    desc: string;
    status: string;
    priority: string;
}

const AdminDisputes = () => {
    const [disputes, setDisputes] = useState<Dispute[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "disputes"), (snap) => {
            setDisputes(snap.docs.map(d => ({
                id: d.id,
                type: d.data().type || "General",
                desc: d.data().description || d.data().desc || "",
                status: d.data().status || "Open",
                priority: d.data().priority || "Low",
            })));
            setIsLoading(false);
        }, () => setIsLoading(false));
        return () => unsub();
    }, []);

    const handleAction = async (id: string, action: string) => {
        try {
            await updateDoc(doc(db, "disputes", id), { status: action });
            toast.success(`Dispute marked as ${action}.`);
        } catch {
            toast.error("Failed to update dispute.");
        }
    };

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Disputes & Flags</h1>
                    <p className="text-muted-foreground">Manage fraud alerts and customer disputes.</p>
                </div>

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Disputes</CardTitle>
                            <AlertCircle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{disputes.filter(d => d.status !== 'Resolved').length}</div>
                            <p className="text-xs text-muted-foreground">Requires attention</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{disputes.filter(d => d.status === 'Resolved').length}</div>
                            <p className="text-xs text-muted-foreground">Total resolved cases</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Case Management</CardTitle>
                        <CardDescription>Review and resolve open cases.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <p className="text-center py-8 text-muted-foreground">Loading disputes...</p>
                        ) : disputes.length === 0 ? (
                            <p className="text-center py-8 text-muted-foreground">No disputes filed yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Priority</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {disputes.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <AlertCircle className={`h-4 w-4 ${item.priority === 'High' ? 'text-red-500' : 'text-slate-400'}`} />
                                                        {item.type}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{item.desc}</TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${item.priority === 'High' ? 'bg-red-500/10 text-red-400' :
                                                        item.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-muted text-muted-foreground'}`}>
                                                        {item.priority}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{item.status}</TableCell>
                                                <TableCell className="text-right">
                                                    {item.status !== 'Resolved' && (
                                                        <div className="flex justify-end gap-2">
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleAction(item.id, 'Resolved')}>
                                                                <CheckCircle className="h-4 w-4" />
                                                            </Button>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleAction(item.id, 'Rejected')}>
                                                                <XCircle className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    )}
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
        </DashboardLayout>
    );
};

export default AdminDisputes;
