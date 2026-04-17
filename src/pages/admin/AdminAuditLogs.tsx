
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldCheck } from "lucide-react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AuditLog {
    id: string;
    action: string;
    user: string;
    details: string;
    timestamp: string;
}

const AdminAuditLogs = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            setIsLoading(true);
            try {
                const q = query(
                    collection(db, "audit_logs"),
                    orderBy("timestamp", "desc"),
                    limit(50)
                );
                const snapshot = await getDocs(q);
                if (snapshot.empty) {
                    setLogs([]);
                } else {
                    const fetched = snapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            action: data.action || "",
                            user: data.user || data.userId || "",
                            details: data.details || "",
                            timestamp: data.timestamp?.toDate
                                ? data.timestamp.toDate().toLocaleString()
                                : String(data.timestamp || ""),
                        } as AuditLog;
                    });
                    setLogs(fetched);
                }
            } catch (error) {
                console.error("Error fetching audit logs:", error);
                setLogs([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogs();
    }, []);

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
                    <p className="text-muted-foreground">Immutable record of all sensitive system actions.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-blue-600" />
                            Activity Log
                        </CardTitle>
                        <CardDescription>All actions are permanently recorded here.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                        <Table className="min-w-[600px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8">Loading audit logs...</TableCell>
                                    </TableRow>
                                ) : logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No audit log entries yet.</TableCell>
                                    </TableRow>
                                ) : logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                                            {log.timestamp}
                                        </TableCell>
                                        <TableCell className="font-medium">{log.user}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2 py-1 rounded bg-slate-700 text-slate-100 text-xs font-semibold">
                                                {log.action}
                                            </span>
                                        </TableCell>
                                        <TableCell className="max-w-md truncate" title={log.details}>
                                            {log.details}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default AdminAuditLogs;
