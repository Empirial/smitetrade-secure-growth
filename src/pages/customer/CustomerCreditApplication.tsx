import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ShieldCheck, Banknote, Percent, CheckCircle, Info } from "lucide-react";

const CustomerCreditApplication = () => {
    const [selectedLender, setSelectedLender] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showDisclaimer, setShowDisclaimer] = useState(false);

    // Form State
    const [amount, setAmount] = useState("");
    const [term, setTerm] = useState("");
    const [reason, setReason] = useState("");
    const [paymentDate, setPaymentDate] = useState("");

    // Mock Customer Data
    const customerCreditScore = 750;
    const creditStatus = "Excellent";

    // Mock Lender Offers
    const lenderOffers = [
        { id: "lender-1", name: "Swift Capital", rate: "12%", term: "30 Days", maxAmount: 5000, minScore: 650, features: ["Instant Approval", "No hidden fees"] },
        { id: "lender-2", name: "Growth Fund", rate: "10.5%", term: "14 Days", maxAmount: 3000, minScore: 700, features: ["Low Rates", "Flexible Repayment"] },
        { id: "lender-3", name: "EasyAccess Loans", rate: "15%", term: "60 Days", maxAmount: 10000, minScore: 600, features: ["High Limits", "Longer Terms"] },
    ];

    const handleApply = () => {
        if (!selectedLender) {
            toast.error("Please select a lender to proceed.");
            return;
        }
        if (!amount || !term || !reason) {
            toast.error("Please fill in all application details.");
            return;
        }
        setShowDisclaimer(true);
    };

    const confirmApplication = () => {
        setShowDisclaimer(false);
        setLoading(true);
        // Simulate API Processing
        setTimeout(() => {
            setLoading(false);
            toast.success("Application Submitted to Lender!");
            // In a real app, this would redirect to a specific application details or status page
        }, 1500);
    };

    return (
        <DashboardLayout role="customer">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Lender Marketplace</h1>
                    <p className="text-muted-foreground">Compare rates and apply for credit from our trusted partners.</p>
                </div>

                {/* Credit Score Overview */}
                <Card className="bg-slate-900 text-white border-none">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-emerald-400" />
                            Your Credit Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-6">
                        <div className="text-center md:text-left">
                            <p className="text-sm text-slate-400 mb-1">Current Score</p>
                            <div className="flex items-baseline gap-2 justify-center md:justify-start">
                                <span className="text-4xl font-bold text-emerald-400">{customerCreditScore}</span>
                                <span className="text-sm font-medium text-emerald-500">GOOD</span>
                            </div>
                        </div>
                        <div className="col-span-2 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Credit Health</span>
                                <span>{customerCreditScore} / 850</span>
                            </div>
                            <Progress value={(customerCreditScore / 850) * 100} className="h-2 bg-slate-700" />
                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                <Info className="h-3 w-3" />
                                Updated today based on your trading history.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Lender Offers Grid */}
                <div className="grid gap-6 md:grid-cols-3">
                    {lenderOffers.map((offer) => (
                        <Card
                            key={offer.id}
                            className={`cursor-pointer transition-all border-2 relative ${selectedLender === offer.id ? "border-emerald-500 shadow-md bg-emerald-50/50" : "border-transparent hover:border-slate-200"}`}
                            onClick={() => setSelectedLender(offer.id)}
                        >
                            {selectedLender === offer.id && (
                                <div className="absolute top-2 right-2 text-emerald-600">
                                    <CheckCircle className="h-5 w-5" />
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle>{offer.name}</CardTitle>
                                <CardDescription>Matches your profile</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-3xl font-bold">{offer.rate}</span>
                                    <span className="text-sm text-muted-foreground">Interest Rate</span>
                                </div>
                                <div className="space-y-2 pt-2 border-t">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Max Amount:</span>
                                        <span className="font-semibold">R {offer.maxAmount}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Term:</span>
                                        <span className="font-semibold">{offer.term}</span>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    {offer.features.map((feature, i) => (
                                        <Badge key={i} variant="secondary" className="mr-1 mb-1 text-xs">{feature}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                            <div className={`h-1.5 w-full absolute bottom-0 left-0 ${selectedLender === offer.id ? "bg-emerald-500" : "bg-transparent"}`} />
                        </Card>
                    ))}
                </div>

                {/* Application Action */}
                <div className="flex flex-col gap-6 bg-slate-50 p-6 rounded-lg border border-slate-100">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Loan Details</h3>
                            <div className="grid gap-2">
                                <Label htmlFor="amount">Loan Amount (R)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="e.g. 2500"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lender">Select Lender</Label>
                                <Select onValueChange={setSelectedLender} value={selectedLender || ""}>
                                    <SelectTrigger id="lender">
                                        <SelectValue placeholder="Choose a partner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {lenderOffers.map(lender => (
                                            <SelectItem key={lender.id} value={lender.id}>
                                                {lender.name} ({lender.rate})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="paymentDate">Proposed Payment Date</Label>
                                <Input
                                    id="paymentDate"
                                    type="date"
                                    value={paymentDate}
                                    onChange={(e) => setPaymentDate(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="term">Repayment Term</Label>
                                <Select onValueChange={setTerm} value={term}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select term" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="14">14 Days</SelectItem>
                                        <SelectItem value="30">30 Days</SelectItem>
                                        <SelectItem value="60">60 Days</SelectItem>
                                        <SelectItem value="90">90 Days</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Reason for Loan</h3>
                            <div className="grid gap-2 h-full">
                                <Label htmlFor="reason">Purpose</Label>
                                <Textarea
                                    id="reason"
                                    placeholder="e.g. Stock replenishment for weekend trade..."
                                    className="h-full min-h-[100px]"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center pt-4 border-t gap-4">
                        <div className="text-sm text-muted-foreground order-2 md:order-1">
                            By clicking Apply, you agree to the terms of the selected lender.
                        </div>
                        <Button
                            size="lg"
                            className="bg-emerald-600 hover:bg-emerald-700 w-full md:w-auto order-1 md:order-2"
                            onClick={handleApply}
                            disabled={loading || !selectedLender}
                        >
                            {loading ? "Processing..." : `Apply for R${amount || '0'}`}
                        </Button>
                    </div>

                    <Dialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Loan Application Disclaimer</DialogTitle>
                                <DialogDescription>
                                    Please review the following terms before proceeding.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 text-sm text-muted-foreground">
                                <p>By submitting this application, you acknowledge and agree to the following:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>You are applying for a loan from the selected lender, not Smitetrade directly.</li>
                                    <li>You agree to the interest rate and repayment terms specified in the offer.</li>
                                    <li>Failure to repay on time may negatively impact your SpazaScore and future borrowing ability.</li>
                                    <li>Your personal and business information will be shared with the lender for assessment purposes.</li>
                                </ul>
                                <div className="bg-yellow-50 p-3 rounded border border-yellow-200 text-yellow-800 text-xs">
                                    <strong>Important:</strong> Ensure you have sufficient funds or cash flow to meet the repayment obligation on the due date.
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setShowDisclaimer(false)}>Cancel</Button>
                                <Button onClick={confirmApplication} className="bg-emerald-600 hover:bg-emerald-700">
                                    I Agree & Submit Application
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CustomerCreditApplication;
