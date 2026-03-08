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
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Banknote, Percent, CheckCircle, Info } from "lucide-react";
import { useCredit } from "@/context/CreditContext";
import GamificationStatus from "@/components/credit/GamificationStatus";

const CustomerCreditApplication = () => {
    const { profile, lenderOffers } = useCredit();
    const navigate = useNavigate();
    const [selectedLender, setSelectedLender] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const [viewLender, setViewLender] = useState<any>(null);

    // Form State
    const [amount, setAmount] = useState("");
    const [term, setTerm] = useState("");
    const [reason, setReason] = useState("");
    const [paymentDate, setPaymentDate] = useState("");

    // Banking Details
    const [bankName, setBankName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [branchCode, setBranchCode] = useState("");



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
                <Card className="border-t-4 border-t-indigo-500 shadow-xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent pointer-events-none" />
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-indigo-500" />
                            Your BIR Score
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {profile ? (
                            <GamificationStatus tier={profile.tier} score={profile.briScore} />
                        ) : (
                            <div className="text-muted-foreground animate-pulse">Loading Profile...</div>
                        )}
                    </CardContent>
                </Card>

                {/* Lender Offers List */}
                <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
                    {lenderOffers.map((offer) => (
                        <Card
                            key={offer.id}
                            className={`min-w-[300px] md:min-w-[320px] shrink-0 snap-start cursor-pointer transition-all border-2 relative ${selectedLender === offer.id ? "border-emerald-500 shadow-md bg-emerald-950/20" : "border-transparent hover:border-slate-700"}`}
                            onClick={() => setViewLender(offer)}
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
                <div className="flex flex-col gap-6 bg-slate-900 p-6 rounded-lg border border-slate-800 text-slate-100 shadow-xl">
                    <div className="space-y-6">
                        <h3 className="font-semibold text-lg">Loan Details</h3>
                        <div className="grid md:grid-cols-2 gap-6">
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

                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="reason">Reason for Loan (Purpose)</Label>
                                <Textarea
                                    id="reason"
                                    placeholder="e.g. Stock replenishment for weekend trade..."
                                    className="min-h-[100px] resize-none"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-slate-800">
                        <h3 className="font-semibold text-lg">Banking Details</h3>
                        <p className="text-sm text-slate-400">Where should the approved funds be deposited?</p>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="bankName">Bank Name</Label>
                                <Select onValueChange={setBankName} value={bankName}>
                                    <SelectTrigger id="bankName">
                                        <SelectValue placeholder="Select bank" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fnb">First National Bank (FNB)</SelectItem>
                                        <SelectItem value="standard">Standard Bank</SelectItem>
                                        <SelectItem value="absa">ABSA</SelectItem>
                                        <SelectItem value="nedbank">Nedbank</SelectItem>
                                        <SelectItem value="capitec">Capitec</SelectItem>
                                        <SelectItem value="tymebank">TymeBank</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="accountNumber">Account Number</Label>
                                <Input
                                    id="accountNumber"
                                    type="text"
                                    placeholder="e.g. 62123456789"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="branchCode">Branch Code</Label>
                                <Input
                                    id="branchCode"
                                    type="text"
                                    placeholder="e.g. 250655"
                                    value={branchCode}
                                    onChange={(e) => setBranchCode(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center pt-4 border-t border-slate-800 gap-4">
                        <div className="text-sm text-slate-400 order-2 md:order-1">
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

                    <Dialog open={!!viewLender} onOpenChange={(open) => !open && setViewLender(null)}>
                        <DialogContent className="sm:max-w-[450px]">
                            <DialogHeader>
                                <DialogTitle className="text-2xl">{viewLender?.name}</DialogTitle>
                                <DialogDescription>Lender Information & Terms</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <p className="text-sm text-slate-300">{viewLender?.description}</p>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-md">
                                        <div className="text-xs text-slate-400">Interest Rate</div>
                                        <div className="font-semibold text-lg text-emerald-400">{viewLender?.rate}</div>
                                    </div>
                                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-md">
                                        <div className="text-xs text-slate-400">Max Term</div>
                                        <div className="font-semibold text-lg">{viewLender?.term}</div>
                                    </div>
                                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-md">
                                        <div className="text-xs text-slate-400">Max Amount</div>
                                        <div className="font-semibold text-lg">R {viewLender?.maxAmount}</div>
                                    </div>
                                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-md">
                                        <div className="text-xs text-slate-400">Min. BIR Score</div>
                                        <div className="font-semibold text-lg">{viewLender?.minScore}</div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="text-sm font-medium mb-2 text-slate-300">Features</div>
                                    <div className="flex flex-wrap gap-2">
                                        {viewLender?.features.map((f: string, i: number) => (
                                            <Badge key={i} variant="secondary" className="bg-slate-800">{f}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="ghost" onClick={() => setViewLender(null)}>Close</Button>
                                <Button
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                    onClick={() => {
                                        setSelectedLender(viewLender.id);
                                        setViewLender(null);
                                    }}
                                >
                                    {selectedLender === viewLender?.id ? "Selected" : "Select this Lender"}
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
