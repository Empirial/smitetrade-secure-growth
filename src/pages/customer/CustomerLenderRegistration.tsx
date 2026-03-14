import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Building2, UploadCloud, CheckCircle2 } from "lucide-react";

const CustomerLenderRegistration = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const idUploadRef = useRef<HTMLInputElement>(null);
    const addressUploadRef = useRef<HTMLInputElement>(null);
    const [idFileName, setIdFileName] = useState<string | null>(null);
    const [addressFileName, setAddressFileName] = useState<string | null>(null);

    const handleNext = () => setStep(2);
    const handleBack = () => setStep(1);

    const handleSubmit = () => {
        setLoading(true);
        // Simulate API Processing
        setTimeout(() => {
            setLoading(false);
            toast.success("Registration complete! Your application is now in review.");
            navigate('/customer/credit-status'); // Navigate to status page or similar
        }, 2000);
    };

    return (
        <DashboardLayout role="customer">
            <div className="max-w-3xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Lender Registration</h1>
                    <p className="text-muted-foreground">Complete your profile with the specific lender to finalize your loan application.</p>
                </div>

                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>1</div>
                        <span className={`text-sm font-medium ${step >= 1 ? 'text-emerald-500' : 'text-slate-500'}`}>Business Info</span>
                    </div>
                    <div className={`flex-1 h-1 mx-4 rounded-full ${step >= 2 ? 'bg-emerald-600' : 'bg-slate-800'}`} />
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>2</div>
                        <span className={`text-sm font-medium ${step >= 2 ? 'text-emerald-500' : 'text-slate-500'}`}>Documents</span>
                    </div>
                </div>

                <Card className="border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {step === 1 ? <Building2 className="h-5 w-5 text-emerald-500" /> : <UploadCloud className="h-5 w-5 text-emerald-500" />}
                            {step === 1 ? "Business Operations Details" : "Required Documentation"}
                        </CardTitle>
                        <CardDescription>
                            {step === 1
                                ? "The lender requires additional details about your Spaza shop operations before approving the loan."
                                : "Please upload the following documents to verify your business and identity."
                            }
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {step === 1 ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="tradingMonths">Months in Operation</Label>
                                    <Input id="tradingMonths" type="number" placeholder="e.g. 24" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="avgRevenue">Average Monthly Revenue (R)</Label>
                                    <Input id="avgRevenue" type="number" placeholder="e.g. 15000" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="shopType">Shop Ownership</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="rented">Rented Container / Property</SelectItem>
                                            <SelectItem value="owned">Owned Property</SelectItem>
                                            <SelectItem value="informal">Informal Stand</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="employees">Number of Employees</Label>
                                    <Input id="employees" type="number" placeholder="e.g. 2" />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <input
                                    ref={idUploadRef}
                                    type="file"
                                    accept="image/*,.pdf"
                                    className="hidden"
                                    onChange={e => {
                                        const f = e.target.files?.[0];
                                        if (f) { setIdFileName(f.name); toast.success(`ID document "${f.name}" selected.`); }
                                    }}
                                />
                                <div
                                    className="border border-dashed border-slate-700 rounded-lg p-6 bg-slate-900/50 flex flex-col items-center justify-center text-center space-y-2 hover:bg-slate-900 transition-colors cursor-pointer"
                                    onClick={() => idUploadRef.current?.click()}
                                >
                                    <div className="p-3 bg-slate-800 rounded-full">
                                        <UploadCloud className={`h-6 w-6 ${idFileName ? 'text-emerald-400' : 'text-emerald-500'}`} />
                                    </div>
                                    <div className="font-medium">{idFileName ?? "Upload ID Document"}</div>
                                    <div className="text-xs text-muted-foreground">{idFileName ? "Click to change" : "Clear photo of your South African ID or Passport"}</div>
                                </div>

                                <input
                                    ref={addressUploadRef}
                                    type="file"
                                    accept="image/*,.pdf"
                                    className="hidden"
                                    onChange={e => {
                                        const f = e.target.files?.[0];
                                        if (f) { setAddressFileName(f.name); toast.success(`Address document "${f.name}" selected.`); }
                                    }}
                                />
                                <div
                                    className="border border-dashed border-slate-700 rounded-lg p-6 bg-slate-900/50 flex flex-col items-center justify-center text-center space-y-2 hover:bg-slate-900 transition-colors cursor-pointer"
                                    onClick={() => addressUploadRef.current?.click()}
                                >
                                    <div className="p-3 bg-slate-800 rounded-full">
                                        <UploadCloud className={`h-6 w-6 ${addressFileName ? 'text-emerald-400' : 'text-emerald-500'}`} />
                                    </div>
                                    <div className="font-medium">{addressFileName ?? "Proof of Address / Operating Location"}</div>
                                    <div className="text-xs text-muted-foreground">{addressFileName ? "Click to change" : "Utility bill or affidavit not older than 3 months"}</div>
                                </div>

                                <div className="border border-emerald-900/50 rounded-lg p-4 bg-emerald-900/10 flex items-start gap-3 mt-4">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                                    <div className="text-sm text-slate-300">
                                        <strong>Bank Statements:</strong> Because you use Smitetrade for POS and ordering, the lender will automatically verify your revenue based on your Smitetrade history securely. No bank statement upload required!
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex justify-between border-t border-slate-800 pt-6">
                        {step === 1 ? (
                            <>
                                <Button variant="outline" onClick={() => navigate('/customer/apply-credit')}>Cancel Application</Button>
                                <Button onClick={handleNext} className="bg-emerald-600 hover:bg-emerald-700">Next: Upload Documents</Button>
                            </>
                        ) : (
                            <>
                                <Button variant="outline" onClick={handleBack}>Back</Button>
                                <Button onClick={handleSubmit} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                                    {loading ? "Submitting..." : "Submit Registration & Application"}
                                </Button>
                            </>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default CustomerLenderRegistration;
