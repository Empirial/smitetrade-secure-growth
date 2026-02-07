
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldCheck } from "lucide-react";

const AdminAuditLogs = () => {
    // Mock audit logs
    const logs = [
        { id: 1, action: "Price Updated", user: "John Owner", details: "Changed 'Bread' price from R15.00 to R16.00", timestamp: "2024-05-15 14:30" },
        { id: 2, action: "Refund Processed", user: "Sarah Cashier", details: "Refunded Order #1002 (Items Damaged)", timestamp: "2024-05-15 12:45" },
        { id: 3, action: "User Suspended", user: "System Admin", details: "Suspended user 'Old Employee'", timestamp: "2024-05-14 09:15" },
        { id: 4, action: "Stock Adjustment", user: "John Owner", details: "Added 50 units to 'Milk 1L'", timestamp: "2024-05-14 08:30" },
        { id: 5, action: "Credit Limit Increased", user: "Admin", details: "Increased credit limit for 'Tshepo' to R1000", timestamp: "2024-05-13 16:20" },
    ];

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
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                                            {log.timestamp}
                                        </TableCell>
                                        <TableCell className="font-medium">{log.user}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-xs font-semibold">
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
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default AdminAuditLogs;
