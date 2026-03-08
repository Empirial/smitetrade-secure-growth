import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileSignature, CheckCircle } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoanQuote = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [accepted, setAccepted] = useState(false);

    // Initial data from URL
    const borrowerName = searchParams.get('borrower') || "Unknown Borrower";
    const initialPrincipal = parseFloat(searchParams.get('amount') || "0");
    const initialTermDays = parseInt(searchParams.get('term') || "30", 10);

    // Editable Quote State
    const [principal, setPrincipal] = useState<number>(initialPrincipal);
    const [termDays, setTermDays] = useState<number>(initialTermDays);
    const [initiationFee, setInitiationFee] = useState<number>(Math.min(1050, (initialPrincipal * 0.15)));
    const [monthlyServiceFee, setMonthlyServiceFee] = useState<number>(60);
    const [interestRate, setInterestRate] = useState<number>(5.0); // 5% default

    // Real-time calculations
    const interestAmount = principal * (interestRate / 100) * (termDays / 30);
    const totalCostOfCredit = principal + initiationFee + monthlyServiceFee + interestAmount;

    // Reset fees if principal changes significantly (optional helper, but good UX)
    useEffect(() => {
        // Automatically cap the initiation fee by NCA rule if the user increases principal
        const recommendedInitFee = Math.min(1050, (principal * 0.15));
        if (initiationFee > recommendedInitFee) {
            setInitiationFee(recommendedInitFee);
        }
    }, [principal]);

    const handleSendQuote = () => {
        setAccepted(true);
        toast.success(`Custom Quote Sent to ${borrowerName}!`);
        // In a real app, this would ping the backend to change application status to 'Pending Customer Acceptance'
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
                        <h1 className="text-3xl font-bold tracking-tight">Draft Loan Quote</h1>
                        <p className="text-muted-foreground">Adjust terms and send a counter-offer to the applicant.</p>
                    </div>
                </div>

                <Card className="border-2 border-slate-200 shadow-sm">
                    <CardHeader className="bg-secondary/20 border-b pb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-xl">Quotation for {borrowerName}</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">Review the requested numbers and adjust them to finalize your offer.</p>
                            </div>
                            <FileSignature className="h-8 w-8 text-slate-400" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-8">
                        {/* Section 1: Loan Details */}
                        <section className="space-y-3">
                            <h3 className="font-semibold text-sm uppercase text-slate-500 tracking-wider">1. Loan Configuration</h3>
                            <div className="grid grid-cols-2 gap-6 bg-secondary/20 p-4 rounded-lg">
                                <div className="space-y-2">
                                    <Label htmlFor="principal">Principal Amount (R)</Label>
                                    <Input
                                        id="principal"
                                        type="number"
                                        value={principal}
                                        onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)}
                                    />
                                    <p className="text-xs text-muted-foreground">Requested: R {initialPrincipal.toFixed(2)}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="termDays">Term Duration (Days)</Label>
                                    <Input
                                        id="termDays"
                                        type="number"
                                        value={termDays}
                                        onChange={(e) => setTermDays(parseInt(e.target.value, 10) || 0)}
                                    />
                                    <p className="text-xs text-muted-foreground">Requested: {initialTermDays} Days</p>
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Cost Breakdown */}
                        <section className="space-y-3">
                            <h3 className="font-semibold text-sm uppercase text-slate-500 tracking-wider">2. Cost of Credit Breakdown</h3>
                            <div className="space-y-4 border rounded-lg p-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Principal Loan Amount</span>
                                    <span className="font-medium text-emerald-600">R {principal.toFixed(2)}</span>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between sm:items-center text-sm gap-2 mt-4 pt-4 border-t">
                                    <Label htmlFor="initiationFee" className="text-muted-foreground">Initiation Fee (Once-off)</Label>
                                    <div className="flex items-center max-w-[150px]">
                                        <span className="mr-2 text-muted-foreground">R</span>
                                        <Input
                                            id="initiationFee"
                                            type="number"
                                            className="h-8"
                                            value={initiationFee}
                                            onChange={(e) => setInitiationFee(parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between sm:items-center text-sm gap-2">
                                    <Label htmlFor="serviceFee" className="text-muted-foreground">Service Fee (Monthly)</Label>
                                    <div className="flex items-center max-w-[150px]">
                                        <span className="mr-2 text-muted-foreground">R</span>
                                        <Input
                                            id="serviceFee"
                                            type="number"
                                            className="h-8"
                                            value={monthlyServiceFee}
                                            onChange={(e) => setMonthlyServiceFee(parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between sm:items-center text-sm gap-2">
                                    <div className="space-y-1">
                                        <Label htmlFor="interestRate" className="text-muted-foreground">Interest Rate (% per month)</Label>
                                        <p className="text-xs text-muted-foreground hidden sm:block">Calculated Amount: R {interestAmount.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center max-w-[150px]">
                                        <Input
                                            id="interestRate"
                                            type="number"
                                            step="0.1"
                                            className="h-8 mr-2"
                                            value={interestRate}
                                            onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                                        />
                                        <span className="text-muted-foreground">%</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground sm:hidden mt-1">Calculated Amount: R {interestAmount.toFixed(2)}</p>
                                </div>

                                <div className="border-t pt-3 mt-4 flex justify-between items-center font-bold text-lg bg-emerald-50 p-3 rounded-md border-emerald-100 text-emerald-900">
                                    <span>Total Repayment Value</span>
                                    <span>R {totalCostOfCredit.toFixed(2)}</span>
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Legal Terms */}
                        <section className="space-y-3">
                            <h3 className="font-semibold text-sm uppercase text-slate-500 tracking-wider">3. Statutory Declarations</h3>
                            <div className="text-xs text-muted-foreground space-y-2 bg-secondary/20 p-4 rounded-lg">
                                <p>By sending this quotation, you propose a legal credit agreement under the National Credit Act 34 of 2005. The applicant must review and accept these finalized terms before disbursement.</p>
                            </div>
                        </section>
                    </CardContent>

                    <CardFooter className="bg-secondary/20 border-t p-6 flex justify-end gap-4">
                        <Button variant="outline" onClick={() => navigate(-1)} disabled={accepted}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700"
                            disabled={accepted}
                            onClick={handleSendQuote}
                        >
                            {accepted ? (
                                <> <CheckCircle className="mr-2 h-4 w-4" /> Quote Sent! </>
                            ) : (
                                <> <FileSignature className="mr-2 h-4 w-4" /> Send Quote to Customer </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default LoanQuote;
