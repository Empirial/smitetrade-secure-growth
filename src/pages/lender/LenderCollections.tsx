import { AlertCircle, FileText, Phone, Mail, User, Calendar, MapPin, Building2, ExternalLink } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCredit } from "@/context/CreditContext";
import { Loan } from "@/types";
const LenderCollections = () => {
    const { loans, sendReminder } = useCredit();

    // Active overdue loans
    const overdueLoans = loans.filter(l => l.status === 'overdue' || (new Date(l.dueDate) < new Date() && l.status === 'active'));

    // Historical collected loans (mock for now, replace with true history later)
    const collectedLoans = loans.filter(l => l.status === 'paid');

    return (
        <DashboardLayout role="lender">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
                    <p className="text-muted-foreground">Manage overdue loans and view recovery history.</p>
                </div>

                <div className="grid gap-6">
                    {/* Active Overdue Section */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <AlertCircle className="text-red-500" /> Action Required ({overdueLoans.length})
                        </h2>
                        <div className="grid gap-4">
                            {overdueLoans.length === 0 ? (
                                <Card>
                                    <CardContent className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                                        <p>No overdue loans found. Great work!</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                overdueLoans.map((loan: Loan) => (
                                    <Dialog key={loan.id}>
                                        <Card className="border-l-4 border-l-red-500 hover:bg-slate-900/50 transition-colors">
                                            <CardHeader className="flex flex-row items-center justify-between py-4">
                                                <div>
                                                    <CardTitle className="text-lg">{loan.borrowerName}</CardTitle>
                                                    <CardDescription className="flex items-center gap-2 mt-1">
                                                        <span className="text-red-400 font-medium">Overdue since: {loan.dueDate}</span>
                                                    </CardDescription>
                                                </div>
                                                <div className="text-right flex items-center gap-4">
                                                    <div>
                                                        <div className="text-xl font-bold text-red-500">R {loan.amount}</div>
                                                        <div className="text-xs text-muted-foreground">Outstanding</div>
                                                    </div>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm">
                                                            View Details <ExternalLink className="ml-2 h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                </div>
                                            </CardHeader>
                                        </Card>

                                        <DialogContent className="max-w-2xl">
                                            <DialogHeader>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <DialogTitle className="text-2xl">{loan.borrowerName}</DialogTitle>
                                                        <DialogDescription>Loan ID: {loan.id}</DialogDescription>
                                                    </div>
                                                    <Badge variant="destructive" className="uppercase tracking-wider">Overdue</Badge>
                                                </div>
                                            </DialogHeader>

                                            <div className="grid md:grid-cols-2 gap-6 py-4">
                                                {/* Borrower Details */}
                                                <div className="space-y-4">
                                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b pb-2">Borrower Profile</h4>
                                                    <div className="space-y-3 text-sm">
                                                        <div className="flex items-center gap-3">
                                                            <User className="h-4 w-4 text-emerald-500" />
                                                            <div>
                                                                <p className="font-medium">Primary Contact</p>
                                                                <p className="text-muted-foreground">082 123 4567 • {loan.borrowerName.toLowerCase().replace(' ', '.')}@email.com</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <Building2 className="h-4 w-4 text-emerald-500" />
                                                            <div>
                                                                <p className="font-medium">Business / Spaza Name</p>
                                                                <p className="text-muted-foreground">{loan.borrowerName}'s Store</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <MapPin className="h-4 w-4 text-emerald-500" />
                                                            <div>
                                                                <p className="font-medium">Operating Address</p>
                                                                <p className="text-muted-foreground">45 Zone 6, Diepkloof, Soweto</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Loan Details */}
                                                <div className="space-y-4">
                                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b pb-2">Loan Summary</h4>
                                                    <div className="space-y-3 text-sm">
                                                        <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded">
                                                            <span className="text-muted-foreground">Principal Amount</span>
                                                            <span className="font-medium">R {(loan.amount * 0.9).toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded">
                                                            <span className="text-muted-foreground">Interest & Fees</span>
                                                            <span className="font-medium">R {(loan.amount * 0.1).toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center bg-red-950/20 p-2 rounded border border-red-900/50">
                                                            <span className="text-red-400 font-medium">Total Outstanding</span>
                                                            <span className="font-bold text-red-500 text-lg">R {loan.amount.toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3 mt-4">
                                                            <Calendar className="h-4 w-4 text-amber-500" />
                                                            <div>
                                                                <p className="font-medium">Original Due Date</p>
                                                                <p className="text-amber-500 font-semibold">{loan.dueDate}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <DialogFooter className="flex-col sm:flex-row gap-2 border-t pt-4">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="outline" className="w-full sm:w-auto border-emerald-600/30 hover:bg-emerald-950/20 text-emerald-500">
                                                            <Mail className="mr-2 h-4 w-4" /> Notify Customer
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-56 p-2" align="center">
                                                        <div className="space-y-1">
                                                            <p className="text-xs font-medium text-muted-foreground px-2 py-1 mb-1">Select Template</p>
                                                            <Button
                                                                variant="ghost"
                                                                className="w-full justify-start h-8 text-xs"
                                                                onClick={() => sendReminder(loan.borrowerId, "3-Day Warning")}
                                                            >
                                                                <FileText className="mr-2 h-3 w-3 text-yellow-500" /> 3-Day Warning
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                className="w-full justify-start h-8 text-xs"
                                                                onClick={() => sendReminder(loan.borrowerId, "1st Overdue Notice")}
                                                            >
                                                                <FileText className="mr-2 h-3 w-3 text-orange-500" /> 1st Overdue Notice
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                className="w-full justify-start h-8 text-xs"
                                                                onClick={() => sendReminder(loan.borrowerId, "Final Default Notice")}
                                                            >
                                                                <AlertCircle className="mr-2 h-3 w-3 text-red-500" /> Final Default Notice
                                                            </Button>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                                <Button className="w-full sm:w-auto ml-auto bg-emerald-600 hover:bg-emerald-700">
                                                    Mark Paid
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Historical Collections Section */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Collection History</h2>
                        <div className="border rounded-md">
                            <div className="grid grid-cols-4 p-4 font-medium border-b bg-muted/50">
                                <div>Borrower</div>
                                <div>Amount</div>
                                <div>Date Paid</div>
                                <div>Status</div>
                            </div>
                            {collectedLoans.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">No collection history available.</div>
                            ) : (
                                collectedLoans.map((loan: Loan) => (
                                    <div key={loan.id} className="grid grid-cols-4 p-4 border-b last:border-0 items-center">
                                        <div>{loan.borrowerName}</div>
                                        <div>R {loan.amount}</div>
                                        <div>{loan.dueDate}</div>
                                        <div className="text-green-600 font-medium text-sm">Recovered</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default LenderCollections;
