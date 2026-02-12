import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCredit } from "@/context/CreditContext";
import { AlertCircle, FileText, Phone } from "lucide-react";

const LenderCollections = () => {
    const { loans } = useCredit();

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
                                overdueLoans.map((loan: any) => (
                                    <Card key={loan.id} className="border-l-4 border-l-red-500">
                                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                                            <div>
                                                <CardTitle>{loan.borrowerName}</CardTitle>
                                                <CardDescription>Due: {loan.dueDate}</CardDescription>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-red-600">R {loan.amount}</div>
                                                <div className="text-xs text-red-500 font-medium">Overdue</div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex gap-2 justify-end items-center">
                                                <div className="mr-auto">
                                                    <p className="text-xs text-muted-foreground mb-1">Promise to Pay</p>
                                                    <Input type="date" className="h-8 text-xs w-32" />
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    <Phone className="mr-2 h-4 w-4" /> Call
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    <FileText className="mr-2 h-4 w-4" /> Send Reminder
                                                </Button>
                                                <Button variant="destructive" size="sm">
                                                    Mark Default
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
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
                                collectedLoans.map((loan: any) => (
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
