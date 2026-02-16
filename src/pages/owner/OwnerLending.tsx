import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, UserCheck, QrCode, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useCredit } from "@/context/CreditContext";
import { toast } from "sonner";
import { maskIdNumber } from "@/lib/utils";

const OwnerLending = () => {
    const { borrowers, addBorrower, loans, createLoan, recordPayment } = useCredit(); // We'll implement this next
    const [search, setSearch] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isLoanOpen, setIsLoanOpen] = useState(false);
    const [selectedBorrower, setSelectedBorrower] = useState<string | null>(null);

    // Form States
    const [newBorrower, setNewBorrower] = useState({ name: "", phone: "", idNumber: "" });
    const [newLoan, setNewLoan] = useState({ amount: "", date: "" });

    const handleAddBorrower = () => {
        addBorrower(newBorrower.name, newBorrower.phone, newBorrower.idNumber);
        setIsAddOpen(false);
        setNewBorrower({ name: "", phone: "", idNumber: "" });
        toast.success("Borrower Profile Created");
    };

    const handleCreateLoan = () => {
        if (!selectedBorrower) return;
        createLoan(selectedBorrower, Number(newLoan.amount), newLoan.date);
        setIsLoanOpen(false);
        setNewLoan({ amount: "", date: "" });
        toast.success("Loan Agreement Created");
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
        <DashboardLayout role="owner">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Lending Management</h1>
                        <p className="text-muted-foreground">Manage peer-to-peer loans and borrower reputation.</p>
                    </div>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-emerald-600 hover:bg-emerald-700">
                                <Plus className="mr-2 h-4 w-4" /> New Borrower
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Borrower Profile</DialogTitle>
                                <DialogDescription>Generate a new SS-ID for a customer.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label>Full Name</Label>
                                    <Input value={newBorrower.name} onChange={e => setNewBorrower({ ...newBorrower, name: e.target.value })} placeholder="e.g. John Doe" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>ID Number</Label>
                                    <Input value={newBorrower.idNumber} onChange={e => setNewBorrower({ ...newBorrower, idNumber: e.target.value })} placeholder="SA ID Number" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Phone Number</Label>
                                    <Input value={newBorrower.phone} onChange={e => setNewBorrower({ ...newBorrower, phone: e.target.value })} placeholder="082..." />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddBorrower}>Create Profile</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Active Loans Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Active Agreements</CardTitle>
                        <CardDescription>Track repayments due this month.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Borrower</TableHead>
                                    <TableHead>SS-ID</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loans?.map((loan: any) => (
                                    <TableRow key={loan.id}>
                                        <TableCell className="font-medium">{loan.borrowerName}</TableCell>
                                        <TableCell className="font-mono text-xs">{loan.borrowerId}</TableCell>
                                        <TableCell>R {loan.amount}</TableCell>
                                        <TableCell>{loan.dueDate}</TableCell>
                                        <TableCell>{getStatusBadge(loan.status)}</TableCell>
                                        <TableCell>
                                            {loan.status === 'active' && (
                                                <Button size="sm" variant="outline" className="h-8 rounded-full border-emerald-500 text-emerald-600 hover:bg-emerald-50" onClick={() => recordPayment(loan.id)}>
                                                    <CheckCircle2 className="mr-1 h-3 w-3" /> Mark Paid
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {(!loans || loans.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                            No active loans found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Create Loan Dialog (Hidden structure, controlled by state) */}
                <Dialog open={isLoanOpen} onOpenChange={setIsLoanOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>New Loan Agreement</DialogTitle>
                            <DialogDescription>Authorize credit for {selectedBorrower ? borrowers?.find((b: any) => b.id === selectedBorrower)?.name : "customer"}.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Amount (R)</Label>
                                <Input type="number" value={newLoan.amount} onChange={e => setNewLoan({ ...newLoan, amount: e.target.value })} placeholder="0.00" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Repayment Date</Label>
                                <Input type="date" value={newLoan.date} onChange={e => setNewLoan({ ...newLoan, date: e.target.value })} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreateLoan}>Confirm Agreement</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Borrowers Grid */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Registered Borrowers</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {borrowers?.map((borrower: any) => (
                            <Card key={borrower.id} className="hover:border-emerald-500 transition-colors cursor-pointer" onClick={() => { setSelectedBorrower(borrower.id); setIsLoanOpen(true); }}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <div className="font-bold">{borrower.name}</div>
                                    <QrCode className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xs text-muted-foreground mb-1">SS-ID: {borrower.id}</div>
                                    {borrower.idNumber && <div className="text-xs text-muted-foreground mb-2">ID: {maskIdNumber(borrower.idNumber)}</div>}
                                    <div className="flex justify-between items-center">
                                        <Badge variant={borrower.rating === 'Good' ? 'default' : 'secondary'} className={borrower.rating === 'Good' ? 'bg-emerald-500' : ''}>
                                            {borrower.rating || "New"}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">Score: {borrower.score}%</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default OwnerLending;
