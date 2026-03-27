import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { useCredit } from "@/context/CreditContext";
import { Loan } from "@/types";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { User, Settings2 } from "lucide-react";
import { useState } from "react";
import { maskIdNumber } from "@/lib/utils";
import { Borrower } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePayfast } from "@/hooks/usePayfast";
import { useStore } from "@/context/StoreContext";

const LenderLoans = () => {
    const { loans, borrowers, recordPayment, restructureLoan } = useCredit();
    const { user } = useStore();
    const { pay, loading: payfastLoading } = usePayfast();
    const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isRestructureOpen, setIsRestructureOpen] = useState(false);
    const [restructureData, setRestructureData] = useState({ amount: "", dueDate: "" });

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

    const handleDisburse = (loan: Loan) => {
        const borrower = borrowers.find(b => b.id === loan.borrowerId);
        pay({
            emailAddress: user?.email || '',
            amount: loan.amount,
            itemName: 'Loan Disbursement - ' + (borrower?.name || loan.borrowerName),
            customStr1: 'lender_disburse',
            customStr2: user?.storeId,
            customStr3: loan.id,
        });
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
                                {sortedLoans.map((loan: Loan) => (
                                    <TableRow
                                        key={loan.id}
                                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() => {
                                            setSelectedLoan(loan);
                                            setIsProfileOpen(true);
                                        }}
                                    >
                                        <TableCell className="font-medium">{loan.borrowerName}</TableCell>
                                        <TableCell>R {loan.amount}</TableCell>
                                        <TableCell>{loan.dueDate}</TableCell>
                                        <TableCell>{getStatusBadge(loan.status)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {loan.status === 'active' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 rounded-full border-emerald-500 text-emerald-500 hover:bg-emerald-900/30 hover:text-emerald-400"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMarkPaid(loan.id);
                                                        }}
                                                    >
                                                        <CheckCircle2 className="mr-1 h-3 w-3" /> Mark Paid
                                                    </Button>
                                                )}
                                                {loan.status === 'approved' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 rounded-full border-blue-500 text-blue-400 hover:bg-blue-900/30 hover:text-blue-300"
                                                        disabled={payfastLoading}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDisburse(loan);
                                                        }}
                                                    >
                                                        Disburse via PayFast
                                                    </Button>
                                                )}
                                            </div>
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

                {/* Client Profile & Loan Dialog */}
                <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                    <DialogContent className="max-w-2xl">
                        {selectedLoan && (() => {
                            const client = borrowers.find(b => b.id === selectedLoan.borrowerId);

                            if (!client) return (
                                <div className="p-4 text-center text-muted-foreground">Borrower details not found.</div>
                            );

                            return (
                                <>
                                    <DialogHeader>
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="h-16 w-16 rounded-full bg-secondary/30 flex items-center justify-center overflow-hidden">
                                                {client.photoUrl ? (
                                                    <img src={client.photoUrl} alt={client.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <User className="h-8 w-8 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div>
                                                <DialogTitle className="text-2xl">{client.name}</DialogTitle>
                                                <DialogDescription className="font-mono mt-1 text-emerald-500">
                                                    SS:ID {client.ssid}
                                                </DialogDescription>
                                            </div>
                                        </div>
                                    </DialogHeader>

                                    <div className="grid md:grid-cols-2 gap-6 py-4">
                                        <div className="space-y-4">
                                            <h3 className="font-semibold border-b border-border pb-2 text-sm uppercase tracking-wider text-muted-foreground">Client Details</h3>
                                            <div className="bg-secondary/20 p-4 rounded-lg space-y-3">
                                                <div className="grid grid-cols-2 gap-y-2 text-sm">
                                                    <span className="text-muted-foreground">ID Number</span>
                                                    <span className="font-mono text-right">{client.nationalId ? maskIdNumber(client.nationalId) : client.id?.substring(0, 8) + '...'}</span>
                                                    <span className="text-muted-foreground">Phone</span>
                                                    <span className="text-right">{client.phone}</span>
                                                    <span className="text-muted-foreground">Risk Score</span>
                                                    <span className="text-right font-medium text-emerald-500">{client.score}%</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="font-semibold border-b border-border pb-2 text-sm uppercase tracking-wider text-muted-foreground">Loan Agreement</h3>
                                            <div className="bg-secondary/10 border border-border rounded-lg p-4 space-y-4">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-muted-foreground">Principal Balance</span>
                                                    <span className="font-bold text-lg">R {selectedLoan.amount}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-muted-foreground">Due Date</span>
                                                    <span className="font-medium">{selectedLoan.dueDate}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm pt-2 border-t border-border/50">
                                                    <span className="text-muted-foreground">Status</span>
                                                    {getStatusBadge(selectedLoan.status)}
                                                </div>

                                                {selectedLoan.status !== 'paid' && (
                                                    <div className="pt-4 mt-2 border-t border-border/50">
                                                        <Button
                                                            variant="outline"
                                                            className="w-full"
                                                            onClick={() => {
                                                                setRestructureData({ amount: selectedLoan.amount.toString(), dueDate: selectedLoan.dueDate });
                                                                setIsRestructureOpen(true);
                                                                setIsProfileOpen(false); // Close profile dialog to show restructure dialog
                                                            }}
                                                        >
                                                            <Settings2 className="mr-2 h-4 w-4" /> Adjust Terms
                                                        </Button>
                                                        <p className="text-xs text-muted-foreground text-center mt-2">Modify the agreement instead of defaulting</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </DialogContent>
                </Dialog>

                {/* Restructure Loan Dialog */}
                <Dialog open={isRestructureOpen} onOpenChange={setIsRestructureOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Adjust Loan Terms</DialogTitle>
                            <DialogDescription>
                                Restructuring the loan allows the client more time to pay or splits the payments into manageable chunks.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>New Balance / Installment Amount (R)</Label>
                                <Input
                                    type="number"
                                    value={restructureData.amount}
                                    onChange={(e) => setRestructureData({ ...restructureData, amount: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>New Due Date</Label>
                                <Input
                                    type="date"
                                    value={restructureData.dueDate}
                                    onChange={(e) => setRestructureData({ ...restructureData, dueDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsRestructureOpen(false)}>Cancel</Button>
                            <Button
                                onClick={() => {
                                    const amount = Number(restructureData.amount);
                                    if (!restructureData.amount || isNaN(amount) || amount <= 0) {
                                        toast.error("Please enter a valid amount greater than R0.");
                                        return;
                                    }
                                    if (!restructureData.dueDate) {
                                        toast.error("Please select a new due date.");
                                        return;
                                    }
                                    if (new Date(restructureData.dueDate) <= new Date()) {
                                        toast.error("New due date must be in the future.");
                                        return;
                                    }
                                    if (selectedLoan) {
                                        restructureLoan(selectedLoan.id, amount, restructureData.dueDate);
                                        setIsRestructureOpen(false);
                                    }
                                }}
                            >
                                Confirm Restructure
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Compliance Disclaimer */}
                <div className="text-xs text-muted-foreground text-center max-w-2xl mx-auto space-y-1 pt-8 border-t">
                    <p className="font-semibold">Smitetrade provides repayment behavioural insights for decision-support purposes only.</p>
                    <p>The platform does not provide credit, approve or decline loans, extend goods on credit, or make tenancy decisions.</p>
                    <p>All lending, goods-on-credit, and rental decisions remain the sole responsibility of the lender, spaza shop owner, or landlord.</p>
                    <p>Smitetrade does not act as a credit provider, financial adviser, or credit bureau.</p>
                </div>
            </div>

        </DashboardLayout>
    );
};

export default LenderLoans;
