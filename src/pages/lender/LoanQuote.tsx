import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileSignature, CheckCircle } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const LoanQuote = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [accepted, setAccepted] = useState(false);

    // Mock incoming data from URL or state
    const borrowerName = searchParams.get('borrower') || "Unknown Borrower";
    const principalStr = searchParams.get('amount') || "0";
    const termStr = searchParams.get('term') || "30";

    const principal = parseFloat(principalStr);
    const termDays = parseInt(termStr, 10);

    // NCA Form 20 Mock Calculations
    // Note: In real life these are strictly capped by NCA regulations
    const initiationFee = Math.min(1050, (principal * 0.15)); // Mock NCA cap rule
    const monthlyServiceFee = 60; // Max R60 per month
    const interestRatePerMonth = 0.05; // 5% per month mock rate (NCA max for short term is 5%)

    const interestAmount = principal * interestRatePerMonth * (termDays / 30);
    const totalCostOfCredit = principal + initiationFee + monthlyServiceFee + interestAmount;

    const handleAcceptQuote = () => {
        setAccepted(true);
        toast.success("Quote Accepted. Funds ready for disbursement.");
        // In a real app, this would ping the backend to change application status to 'Disburse'
        setTimeout(() => {
            navigate('/lender/applications');
        }, 1500);
    };

    return (
        <DashboardLayout role="lender">
            <div className="max-w-3xl mx-auto space-y-6">
                <Button variant="ghost" className="pl-0 hover:pl-2 transition-all" onClick={() => navigate(-1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Applications
                </Button>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Pre-Agreement Statement</h1>
                        <p className="text-muted-foreground">National Credit Act (NCA) Form 20 Compliance</p>
                    </div>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                </div>

                <Card className="border-2 border-slate-200 shadow-sm">
                    <CardHeader className="bg-slate-50 border-b pb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-xl">Quotation for {borrowerName}</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">Valid for 5 business days</p>
                            </div>
                            <FileSignature className="h-8 w-8 text-slate-400" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-8">
                        {/* Section 1: Loan Details */}
                        <section className="space-y-3">
                            <h3 className="font-semibold text-sm uppercase text-slate-500 tracking-wider">1. Loan Configuration</h3>
                            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                                <div>
                                    <p className="text-xs text-muted-foreground">Requested Principal</p>
                                    <p className="font-bold text-lg">R {principal.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Term Duration</p>
                                    <p className="font-bold text-lg">{termDays} Days</p>
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Cost Breakdown */}
                        <section className="space-y-3">
                            <h3 className="font-semibold text-sm uppercase text-slate-500 tracking-wider">2. Cost of Credit Breakdown</h3>
                            <div className="space-y-2 border rounded-lg p-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Principal Loan Amount</span>
                                    <span>R {principal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Initiation Fee (Once-off)</span>
                                    <span>R {initiationFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Service Fee (Monthly)</span>
                                    <span>R {monthlyServiceFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Interest ({interestRatePerMonth * 100}% p/m)</span>
                                    <span>R {interestAmount.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-3 mt-3 flex justify-between items-center font-bold text-lg bg-emerald-50 p-3 rounded-md border-emerald-100 text-emerald-900">
                                    <span>Total Repayment Value</span>
                                    <span>R {totalCostOfCredit.toFixed(2)}</span>
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Legal Terms */}
                        <section className="space-y-3">
                            <h3 className="font-semibold text-sm uppercase text-slate-500 tracking-wider">3. Statutory Declarations</h3>
                            <div className="text-xs text-muted-foreground space-y-2 bg-slate-50 p-4 rounded-lg">
                                <p>By accepting this quotation, the borrower acknowledges that they understand the costs, risks, and obligations associated with this credit agreement as stipulated under the National Credit Act 34 of 2005.</p>
                                <p>Defaulting on this exact total repayment value may result in the account being handed over for collection, additional penalty interest, and adverse reporting to credit bureaus (e.g., affecting the Behavioral Reliability Index).</p>
                            </div>
                        </section>
                    </CardContent>

                    <CardFooter className="bg-slate-50 border-t p-6 flex justify-end gap-4">
                        <Button variant="outline" onClick={() => navigate(-1)} disabled={accepted}>
                            Cancel / Modify Terms
                        </Button>
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700"
                            disabled={accepted}
                            onClick={handleAcceptQuote}
                        >
                            {accepted ? (
                                <> <CheckCircle className="mr-2 h-4 w-4" /> Quote Accepted </>
                            ) : (
                                <> <FileSignature className="mr-2 h-4 w-4" /> Client Accepts Quote </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default LoanQuote;
