
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Banknote, Briefcase } from "lucide-react";

const CustomerCreditApplication = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API Processing
        setTimeout(() => {
            setLoading(false);
            toast.success("Application Submitted! Your credit limit has been increased.");
            navigate("/customer/credit-review");
        }, 2000);
    };

    return (
        <DashboardLayout role="customer">
            <div className="max-w-2xl mx-auto space-y-6">
                <Button variant="ghost" onClick={() => navigate(-1)} className="pl-0 hover:pl-2">
                    ← Back to Review
                </Button>

                <div className="text-center space-y-2 mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Apply for Spaza Credit</h1>
                    <p className="text-muted-foreground">Unlock stronger buying power for your household.</p>
                </div>

                <Card className="border-t-4 border-t-emerald-600 shadow-lg">
                    <CardHeader>
                        <CardTitle>Financial Information</CardTitle>
                        <CardDescription>We need a few details to calculate your affordability.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">
                            {/* Interactive Form Sections */}
                            <div className="space-y-4">
                                <Label className="text-base font-semibold flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-emerald-600" /> Personal Identity
                                </Label>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="id_number">SA ID Number</Label>
                                        <Input id="id_number" placeholder="Enter 13-digit ID" required maxLength={13} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dob">Date of Birth</Label>
                                        <Input id="dob" type="date" required />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-base font-semibold flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-emerald-600" /> Employment
                                </Label>
                                <div className="space-y-2">
                                    <Label>Employment Status</Label>
                                    <Select required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="permanent">Permanent Full-time</SelectItem>
                                            <SelectItem value="contract">Contract / Temporary</SelectItem>
                                            <SelectItem value="self-employed">Self Employed / Informal Trader</SelectItem>
                                            <SelectItem value="unemployed">Unemployed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-base font-semibold flex items-center gap-2">
                                    <Banknote className="h-4 w-4 text-emerald-600" /> Income
                                </Label>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="income">Monthly Income (After Tax)</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-muted-foreground">R</span>
                                            <Input id="income" className="pl-8" placeholder="0.00" type="number" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="expenses">Total Monthly Expenses</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-muted-foreground">R</span>
                                            <Input id="expenses" className="pl-8" placeholder="0.00" type="number" required />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start space-x-2 pt-4 border-t">
                                <Checkbox id="terms" required />
                                <div className="grid gap-1.5 leading-none">
                                    <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        I consent to a credit check
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        By checking this box, you agree to our Terms of Service and Privacy Policy.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                                {loading ? "Processing Application..." : "Submit Application"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default CustomerCreditApplication;
