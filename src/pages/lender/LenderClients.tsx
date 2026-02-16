import DashboardLayout from "@/components/DashboardLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, User, FileText, Search, MoreHorizontal, UserPlus } from "lucide-react";
import { useState } from "react";
import { useCredit } from "@/context/CreditContext";
import { toast } from "sonner";
import { maskIdNumber } from "@/lib/utils";

const LenderClients = () => {
    const { borrowers, addBorrower, createLoan } = useCredit();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isLoanOpen, setIsLoanOpen] = useState(false);
    const [selectedBorrower, setSelectedBorrower] = useState<string | null>(null);

    // Form States
    const [newBorrower, setNewBorrower] = useState({ name: "", phone: "", idNumber: "" });
    const [newLoan, setNewLoan] = useState({ amount: "", date: "" });

    const handleAddBorrower = async () => {
        if (!newBorrower.name || !newBorrower.idNumber) {
            toast.error("Name and ID are required");
            return;
        }
        await addBorrower(newBorrower.name, newBorrower.phone, newBorrower.idNumber);
        setIsAddOpen(false);
        setNewBorrower({ name: "", phone: "", idNumber: "" });
        toast.success("Borrower Profile Created");
    };

    const handleCreateLoan = async () => {
        if (!selectedBorrower || !newLoan.amount || !newLoan.date) return;
        await createLoan(selectedBorrower, Number(newLoan.amount), newLoan.date);
        setIsLoanOpen(false);
        setNewLoan({ amount: "", date: "" });
        toast.success("Loan Agreement Created");
    };

    return (
        <DashboardLayout role="lender">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Clients</h1>
                        <p className="text-muted-foreground">Manage your borrower relationships.</p>
                    </div>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-emerald-600 hover:bg-emerald-700">
                                <Plus className="mr-2 h-4 w-4" /> Register Client
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Register New Client</DialogTitle>
                                <DialogDescription>Create a profile for a new borrower.</DialogDescription>
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
                                <Button onClick={handleAddBorrower}>Register</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {borrowers.map((borrower: any) => (
                        <Card key={borrower.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-base font-bold">{borrower.name}</CardTitle>
                                <Badge variant={borrower.rating === 'Risk' ? 'destructive' : 'outline'}>
                                    {borrower.rating || 'New'}
                                </Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground space-y-1 mb-4">
                                    <div className="flex justify-between">
                                        <span>SS-ID:</span>
                                        <span className="font-mono">{borrower.id}</span>
                                    </div>
                                    {borrower.idNumber && (
                                        <div className="flex justify-between">
                                            <span>ID Number:</span>
                                            <span className="font-mono">{maskIdNumber(borrower.idNumber)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span>Phone:</span>
                                        <span>{borrower.phone}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Risk Standing:</span>
                                        <Badge variant={borrower.score >= 70 ? "default" : borrower.score >= 40 ? "secondary" : "destructive"}>
                                            {borrower.score >= 70 ? "Good" : borrower.score >= 40 ? "Moderate" : "High Risk"}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Credit Score:</span>
                                        <span className={borrower.score > 3 ? 'text-green-600 font-bold' : ''}>{borrower.score}%</span>
                                    </div>
                                </div>
                                <Button
                                    className="w-full"
                                    variant="secondary"
                                    onClick={() => { setSelectedBorrower(borrower.id); setIsLoanOpen(true); }}
                                >
                                    <FileText className="mr-2 h-4 w-4" /> New Loan
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Create Loan Dialog */}
                <Dialog open={isLoanOpen} onOpenChange={setIsLoanOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Issue Loan</DialogTitle>
                            <DialogDescription>
                                Authorize funds for {selectedBorrower ? borrowers.find(b => b.id === selectedBorrower)?.name : 'Client'}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Amount (R)</Label>
                                <Input type="number" value={newLoan.amount} onChange={e => setNewLoan({ ...newLoan, amount: e.target.value })} placeholder="0.00" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Due Date</Label>
                                <Input type="date" value={newLoan.date} onChange={e => setNewLoan({ ...newLoan, date: e.target.value })} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreateLoan}>Confirm Transfer</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
};

export default LenderClients;
