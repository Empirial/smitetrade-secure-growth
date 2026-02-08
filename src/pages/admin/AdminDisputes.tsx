
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

const AdminDisputes = () => {
    // Mock disputes
    const disputes = [
        { id: "1", type: "Fraud Flag", desc: "Multiple high-value transactions from same IP in 5 mins", status: "Pending", priority: "High" },
        { id: "2", type: "Delivery Complaint", desc: "Customer claims driver never arrived (Order #1023)", status: "Investigating", priority: "Medium" },
        { id: "3", user: "Customer A", issue: "Late Delivery", status: "Open" },
        { id: "4", user: "Driver B", issue: "Wrong Address", status: "Resolved", priority: "Low" },
    ];

    const handleAction = (id: string, action: string) => {
        toast.success(`Dispute #${id} marked as ${action}.`);
    };

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Disputes & Flags</h1>
                    <p className="text-muted-foreground">Manage fraud alerts and customer disputes.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Disputes</CardTitle>
                            <AlertCircle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">2</div>
                            <p className="text-xs text-muted-foreground">Requires attention</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Resolved This Week</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">15</div>
                            <p className="text-xs text-muted-foreground">+20% from last week</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Case Management</CardTitle>
                        <CardDescription>Review and resolve open cases.</CardDescription>
                    </CardHeader>
                    <CardContent>
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
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${item.priority === 'High' ? 'bg-red-100 text-red-800' :
                                                item.priority === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                                                }`}>
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
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default AdminDisputes;
