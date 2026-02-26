import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, FileText, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const LenderApplications = () => {
    // Mock applications data
    const applications = [
        { id: 1, borrower: "Lufuno Mphela", amount: 5000, term: "30 Days", reason: "Inventory Restock", creditScore: 780, date: "2024-02-12", ssid: "SS-ID0001" },
        { id: 2, borrower: "Thabo Mbeki", amount: 2500, term: "14 Days", reason: "Equipment Repair", creditScore: 650, date: "2024-02-11", ssid: "SS-ID0002" },
    ];

    return (
        <DashboardLayout role="lender">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Loan Applications</h1>
                    <p className="text-muted-foreground">Review and approve new loan requests.</p>
                </div>

                <div className="grid gap-4">
                    {applications.map((app) => (
                        <Card key={app.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{app.borrower}</CardTitle>
                                        <CardDescription>{app.reason}</CardDescription>
                                    </div>
                                    <div className="text-right">
                                        <Badge
                                            className={`mb-1 ${app.creditScore >= 700 ? "bg-emerald-500 hover:bg-emerald-600" : "bg-yellow-500 hover:bg-yellow-600"}`}
                                        >
                                            Standing: {app.creditScore >= 700 ? "Good" : "Risk"}
                                        </Badge>
                                        <p className="text-xs text-muted-foreground">Score: {app.creditScore}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Amount</p>
                                        <p className="font-bold">R {app.amount}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Term</p>
                                        <p className="font-medium">{app.term}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Date Applied</p>
                                        <p className="font-medium">{app.date}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">External Debt?</p>
                                        <p className="font-medium text-orange-500">None Detected</p>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-3 rounded-md border border-slate-100 mb-4 flex items-center gap-3">
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${app.creditScore >= 700 ? "bg-emerald-100 text-emerald-600" : "bg-yellow-100 text-yellow-600"}`}>
                                        {app.creditScore >= 700 ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-semibold block">Ai Suggestion: {app.creditScore >= 700 ? "Approve" : "Manual Review"}</span>
                                        <span className="text-muted-foreground text-xs">Based on your risk thresholds.</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 justify-end pt-4 border-t">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link to={`/lender/credit-check?q=${encodeURIComponent(app.borrower)}`}>
                                            <FileText className="mr-2 h-4 w-4" /> View Report
                                        </Link>
                                    </Button>
                                    <Button variant="destructive" size="sm">
                                        <X className="mr-2 h-4 w-4" /> Reject
                                    </Button>
                                    <Button className="bg-emerald-600 hover:bg-emerald-700" size="sm" asChild>
                                        <Link to={`/lender/quote?borrower=${encodeURIComponent(app.borrower)}&amount=${app.amount}&term=${parseInt(app.term, 10)}`}>
                                            <FileText className="mr-2 h-4 w-4" /> Issue Quote (NCA)
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default LenderApplications;
