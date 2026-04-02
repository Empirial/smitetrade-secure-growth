import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/context/StoreContext";
import { useCredit } from "@/context/CreditContext";
import { Switch } from "@/components/ui/switch";
import { Globe, ShieldCheck, Upload } from "lucide-react";
import { toast } from "sonner";
import { useState, useRef } from "react";

const LenderProfile = () => {
    const { user } = useStore();
    const { addLenderOffer } = useCredit();

    // Profile form state
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");

    // Password form state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Marketplace / lending settings state
    const [interest, setInterest] = useState("5.0");
    const [maxTerm, setMaxTerm] = useState("30");
    const [maxAmount, setMaxAmount] = useState("50000");
    const [businessName, setBusinessName] = useState("Smitetrade Secured Partner");
    const [pubAddress, setPubAddress] = useState("123 Financial District, Sandton, 2196");
    const [pubEmail, setPubEmail] = useState("contact@smitetrade.com");
    const [pubPhone, setPubPhone] = useState("+27 11 123 4567");

    // Document upload refs
    const idUploadRef = useRef<HTMLInputElement>(null);
    const bizUploadRef = useRef<HTMLInputElement>(null);
    const [idFileName, setIdFileName] = useState<string | null>(null);
    const [bizFileName, setBizFileName] = useState<string | null>(null);

    const handleSaveProfile = () => {
        if (!name.trim() || !email.trim()) {
            toast.error("Name and email are required.");
            return;
        }
        toast.success("Profile saved!", { description: "Your personal details have been updated." });
    };

    const handleUpdatePassword = () => {
        if (!currentPassword) {
            toast.error("Please enter your current password.");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast.success("Password updated successfully.");
    };

    const handlePublishProfile = () => {
        const rate = parseFloat(interest);
        const maxAmt = parseFloat(maxAmount);
        const term = parseInt(maxTerm);

        if (isNaN(rate) || isNaN(maxAmt) || isNaN(term)) {
            toast.error("Please fill in all lending parameters before publishing.");
            return;
        }

        const newOffer = {
            id: `lender-${Date.now()}`,
            name: businessName || "Smitetrade Secured Partner",
            rate: `${rate}%`,
            term: `${term} Days`,
            maxAmount: maxAmt,
            minScore: 680,
            features: ["Verified Lender", "Custom Terms"],
            description: `${businessName} offering competitive terms for growing Spaza shops.`
        };
        addLenderOffer(newOffer);
        toast.success("Profile Published!", { description: "Your lending offer is now live on the Customer Marketplace." });
    };

    return (
        <DashboardLayout role="lender">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
                    <p className="text-muted-foreground">Manage your personal information, security, and lending preferences.</p>
                </div>

                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                        <TabsTrigger value="profile">Profile & Security</TabsTrigger>
                        <TabsTrigger value="settings">Lending Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-6 mt-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Personal & Business Information</CardTitle>
                                    <CardDescription>Update your contact and business details.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-4 mb-4">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage src="/avatars/01.png" alt="@lender" />
                                            <AvatarFallback>LD</AvatarFallback>
                                        </Avatar>
                                        <Button variant="outline" size="sm">Change Avatar</Button>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" value={name} onChange={e => setName(e.target.value)} />
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" value={email} onChange={e => setEmail(e.target.value)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button onClick={handleSaveProfile}>Save Changes</Button>
                                </CardFooter>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Verification Documents</CardTitle>
                                    <CardDescription>Upload business documents to verify your lender status.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <input
                                        ref={idUploadRef}
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="hidden"
                                        onChange={e => {
                                            const f = e.target.files?.[0];
                                            if (f) { setIdFileName(f.name); toast.success(`ID document "${f.name}" ready to upload.`); }
                                        }}
                                    />
                                    <div
                                        className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-2 hover:bg-muted/50 transition-colors cursor-pointer"
                                        onClick={() => idUploadRef.current?.click()}
                                    >
                                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                            <Upload className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div className="font-medium text-sm">{idFileName ?? "Upload ID / Passport"}</div>
                                        <div className="text-xs text-muted-foreground">PDF or JPG up to 5MB</div>
                                    </div>

                                    <input
                                        ref={bizUploadRef}
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="hidden"
                                        onChange={e => {
                                            const f = e.target.files?.[0];
                                            if (f) { setBizFileName(f.name); toast.success(`Business document "${f.name}" ready to upload.`); }
                                        }}
                                    />
                                    <div
                                        className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-2 hover:bg-muted/50 transition-colors cursor-pointer"
                                        onClick={() => bizUploadRef.current?.click()}
                                    >
                                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                            <Upload className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div className="font-medium text-sm">{bizFileName ?? "Business Registration"}</div>
                                        <div className="text-xs text-muted-foreground">PDF or JPG up to 5MB</div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Security</CardTitle>
                                    <CardDescription>Manage your password and security settings.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="current-password">Current Password</Label>
                                        <Input id="current-password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="new-password">New Password</Label>
                                        <Input id="new-password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="confirm-password">Confirm Password</Label>
                                        <Input id="confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" onClick={handleUpdatePassword}>Update Password</Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-6 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notifications</CardTitle>
                                <CardDescription>Manage your notification preferences.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between space-x-2">
                                    <Label htmlFor="new-app" className="flex flex-col space-y-1">
                                        <span>New Application Alerts</span>
                                        <span className="font-normal text-xs text-muted-foreground">Receive emails when new loans are requested.</span>
                                    </Label>
                                    <Switch id="new-app" defaultChecked />
                                </div>
                                <div className="flex items-center justify-between space-x-2">
                                    <Label htmlFor="overdue" className="flex flex-col space-y-1">
                                        <span>Overdue Alerts</span>
                                        <span className="font-normal text-xs text-muted-foreground">Receive emails when loans become overdue.</span>
                                    </Label>
                                    <Switch id="overdue" defaultChecked />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-emerald-500/20 shadow-sm bg-card">
                            <CardHeader className="pb-4 border-b border-emerald-500/20 bg-emerald-500/5">
                                <div className="flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-emerald-500" />
                                    <CardTitle>Marketplace Visibility</CardTitle>
                                </div>
                                <CardDescription>Allow customers to see your profile and apply matching your interest rates.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-8">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-medium">Lending Parameters</h3>
                                        <p className="text-sm text-muted-foreground">Set your default interest rates and loan terms.</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="interest">Default Interest Rate (%)</Label>
                                            <Input id="interest" placeholder="e.g. 5.0" value={interest} onChange={e => setInterest(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="max-term">Max Loan Term (Days)</Label>
                                            <Input id="max-term" placeholder="e.g. 30" value={maxTerm} onChange={e => setMaxTerm(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="max-amount">Maximum Loan Amount (R)</Label>
                                        <Input id="max-amount" placeholder="e.g. 50000" value={maxAmount} onChange={e => setMaxAmount(e.target.value)} />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-emerald-500/20">
                                    <h3 className="text-lg font-medium">Public Profile</h3>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="pubBusinessName">Public Business Name</Label>
                                            <Input id="pubBusinessName" value={businessName} onChange={e => setBusinessName(e.target.value)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="pubAddress">Public Office Address</Label>
                                            <Input id="pubAddress" value={pubAddress} onChange={e => setPubAddress(e.target.value)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="pubEmail">Public Email Address</Label>
                                            <Input id="pubEmail" type="email" value={pubEmail} onChange={e => setPubEmail(e.target.value)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="pubPhone">Public Phone Number</Label>
                                            <Input id="pubPhone" type="tel" value={pubPhone} onChange={e => setPubPhone(e.target.value)} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 border rounded-lg border-emerald-500/20 bg-emerald-500/5">
                                    <ShieldCheck className="h-8 w-8 text-emerald-500 shrink-0" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Verification Status</p>
                                        <p className="text-xs text-muted-foreground">Your business documents have been verified. You are clear to publish your offers to the Smitetrade ecosystem.</p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700" onClick={handlePublishProfile}>
                                    Upload Profile to System
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
};

export default LenderProfile;
