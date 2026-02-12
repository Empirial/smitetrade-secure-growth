import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { useCredit } from "@/context/CreditContext";
import { toast } from "sonner";

const LenderLoans = () => {
    const { loans, recordPayment } = useCredit();

    // Sort: Active first, then by date
    const sortedLoans = [...loans].sort((a, b) => {
        if (a.status === 'active' && b.status !== 'active') return -1;
        if (a.status !== 'active' && b.status === 'active') return 1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    const handleMarkPaid = async (loanId: string) => {
        await recordPayment(loanId);
        // Note: CreditContext handles the toast
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return <Badge className="bg-blue-500">Active</Badge>;
            case 'paid': return <Badge className="bg-green-500">Paid</Badge>;
            case 'late': return <Badge className="bg-red-500">Late</Badge>;
            case 'default': return <Badge variant="destructive">Defaulted</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <DashboardLayout role="lender">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Loan Management</h1>
                    <p className="text-muted-foreground">Track repayments and update statuses.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Agreements</CardTitle>
                        <CardDescription>History of all lending activities.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Borrower</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedLoans.map((loan: any) => (
                                    <TableRow key={loan.id}>
                                        <TableCell className="font-medium">{loan.borrowerName}</TableCell>
                                        <TableCell>R {loan.amount}</TableCell>
                                        <TableCell>{loan.dueDate}</TableCell>
                                        <TableCell>{getStatusBadge(loan.status)}</TableCell>
                                        <TableCell>
                                            {loan.status === 'active' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 rounded-full border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                                                    onClick={() => handleMarkPaid(loan.id)}
                                                >
                                                    <CheckCircle2 className="mr-1 h-3 w-3" /> Mark Paid
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {sortedLoans.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No loans found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default LenderLoans;
