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
import { Borrower, Loan } from "@/types";
import { toast } from "sonner";
import { maskIdNumber } from "@/lib/utils";

const LenderClients = () => {
    const { borrowers, loans, addBorrower, createLoan, confirmTransfer } = useCredit();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isLoanOpen, setIsLoanOpen] = useState(false);
    const [selectedBorrower, setSelectedBorrower] = useState<string | null>(null);

    // Form States
    const [newBorrower, setNewBorrower] = useState({ name: "", phone: "", idNumber: "" });
    const [photoFile, setPhotoFile] = useState<File | undefined>(undefined);
    const [newLoan, setNewLoan] = useState({ amount: "", date: "" });

    const handleAddBorrower = async () => {
        if (!newBorrower.name || !newBorrower.idNumber) {
            toast.error("Name and ID are required");
            return;
        }
        await addBorrower(newBorrower.name, newBorrower.phone, newBorrower.idNumber, photoFile);
        setIsAddOpen(false);
        setNewBorrower({ name: "", phone: "", idNumber: "" });
        setPhotoFile(undefined);
        toast.success("Borrower Profile Created & SS:ID Generated");
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
                                <DialogDescription>Create a profile. An SS:ID will be auto-generated.</DialogDescription>
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
                                <div className="grid gap-2">
                                    <Label>Client Photo</Label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setPhotoFile(e.target.files?.[0])}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddBorrower}>Register & Generate SS:ID</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {borrowers.map((borrower: Borrower) => (
                        <Card key={borrower.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div className="flex items-center gap-3">
                                    {/* Avatar */}
                                    <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                                        {borrower.photoUrl ? (
                                            <img src={borrower.photoUrl} alt={borrower.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <User className="h-6 w-6 m-2 text-gray-400" />
                                        )}
                                    </div>
                                    <CardTitle className="text-base font-bold">{borrower.name}</CardTitle>
                                </div>
                                <Badge variant={borrower.rating === 'Risk' ? 'destructive' : 'outline'}>
                                    {borrower.rating || 'New'}
                                </Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground space-y-1 mb-4">
                                    <div className="flex justify-between items-center">
                                        <span>SS:ID:</span>
                                        <span className="font-mono font-bold text-emerald-600">{borrower.ssid || 'Generating...'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>ID Number:</span>
                                        <span className="font-mono text-xs">
                                            {borrower.id ? `${borrower.id.substring(0, 6)}......${borrower.id.slice(-2)}` : 'N/A'}
                                        </span>
                                    </div>
                                    {borrower.nationalId && (
                                        <div className="flex justify-between">
                                            <span>ID Number:</span>
                                            <span className="font-mono">{maskIdNumber(borrower.nationalId)}</span>
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
                                {/* Pending Loans Check */}
                                {(() => {
                                    const pendingLoan = loans.find(l => l.borrowerId === borrower.id && l.status === "pending");
                                    if (pendingLoan) {
                                        return (
                                            <Button
                                                className="w-full bg-blue-600 hover:bg-blue-700 mt-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    confirmTransfer(pendingLoan.id);
                                                    setIsLoanOpen(false);
                                                }}
                                            >
                                                Confirm Transfer (R {pendingLoan.amount})
                                            </Button>
                                        );
                                    }

                                    return (
                                        <Button
                                            className="w-full mt-2"
                                            variant="secondary"
                                            onClick={() => { setSelectedBorrower(borrower.id); setIsLoanOpen(true); }}
                                        >
                                            <FileText className="mr-2 h-4 w-4" /> Confirm loan
                                        </Button>
                                    );
                                })()}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Client Profile & Loan Dialog */}
                <Dialog open={isLoanOpen} onOpenChange={setIsLoanOpen}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        {selectedBorrower && (() => {
                            const client = borrowers.find(b => b.id === selectedBorrower);
                            const clientLoans = loans.filter((l: Loan) => l.borrowerId === selectedBorrower);
                            const activeLoans = clientLoans.filter((l: Loan) => l.status === 'active');
                            const pastLoans = clientLoans.filter((l: Loan) => l.status === 'paid' || l.status === 'default');

                            if (!client) return null;

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
                                        {/* Left Col: Profile & History */}
                                        <div className="space-y-6">
                                            <div className="bg-secondary/20 p-4 rounded-lg space-y-3">
                                                <h3 className="font-semibold border-b border-border pb-2 text-sm uppercase tracking-wider text-muted-foreground">Client Details</h3>
                                                <div className="grid grid-cols-2 gap-y-2 text-sm">
                                                    <span className="text-muted-foreground">ID Number</span>
                                                    <span className="font-mono text-right">{client.nationalId ? maskIdNumber(client.nationalId) : client.id?.substring(0, 8) + '...'}</span>
                                                    <span className="text-muted-foreground">Phone</span>
                                                    <span className="text-right">{client.phone}</span>
                                                    <span className="text-muted-foreground">Risk Score</span>
                                                    <span className="text-right font-medium text-emerald-500">{client.score}%</span>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                                                    <span>Active Loans</span>
                                                    <Badge variant="secondary">{activeLoans.length}</Badge>
                                                </h3>
                                                {activeLoans.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {activeLoans.map((loan: Loan) => (
                                                            <div key={loan.id} className="bg-secondary/10 border border-border rounded-md p-3 flex justify-between items-center text-sm">
                                                                <div>
                                                                    <div className="font-medium">R {loan.amount}</div>
                                                                    <div className="text-xs text-muted-foreground">Due: {loan.dueDate}</div>
                                                                </div>
                                                                <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30">Active</Badge>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-muted-foreground bg-secondary/10 p-4 rounded-md text-center">No active loans</div>
                                                )}
                                            </div>

                                            {pastLoans.length > 0 && (
                                                <div className="space-y-3">
                                                    <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                                                        <span>Past Loans</span>
                                                        <Badge variant="outline">{pastLoans.length}</Badge>
                                                    </h3>
                                                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                                        {pastLoans.map((loan: Loan) => (
                                                            <div key={loan.id} className="bg-secondary/5 border border-border rounded-md p-3 flex justify-between items-center text-sm opacity-80">
                                                                <div>
                                                                    <div className="font-medium">R {loan.amount}</div>
                                                                    <div className="text-xs text-muted-foreground">Due: {loan.dueDate}</div>
                                                                </div>
                                                                <Badge variant={loan.status === 'paid' ? 'outline' : 'destructive'} className={loan.status === 'paid' ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10' : ''}>
                                                                    {loan.status === 'paid' ? 'Paid' : 'Defaulted'}
                                                                </Badge>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right Col: Issue New Loan */}
                                        <div className="space-y-4 bg-secondary/10 p-5 rounded-xl border border-border">
                                            <div>
                                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-emerald-500" />
                                                    Issue New Loan
                                                </h3>
                                                <p className="text-sm text-muted-foreground mt-1 mb-4">Authorize new funds for {client.name}.</p>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="grid gap-2">
                                                    <Label>Amount (R)</Label>
                                                    <Input type="number" value={newLoan.amount} onChange={e => setNewLoan({ ...newLoan, amount: e.target.value })} placeholder="0.00" className="bg-background text-lg py-6 font-medium" />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label>Due Date</Label>
                                                    <Input type="date" value={newLoan.date} onChange={e => setNewLoan({ ...newLoan, date: e.target.value })} className="bg-background" />
                                                </div>
                                            </div>

                                            <div className="pt-4 mt-6 border-t border-border">
                                                <Button
                                                    className="w-full bg-emerald-600 hover:bg-emerald-700 py-6 text-base shadow-lg shadow-emerald-900/20"
                                                    onClick={handleCreateLoan}
                                                    disabled={!newLoan.amount || !newLoan.date}
                                                >
                                                    Confirm Loan Transfer
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
};

export default LenderClients;
