import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/context/StoreContext";
import { Switch } from "@/components/ui/switch";

const LenderProfile = () => {
    const { user } = useStore();

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
                                    <CardTitle>Personal Information</CardTitle>
                                    <CardDescription>Update your contact details.</CardDescription>
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
                                        <Input id="name" defaultValue="Lufuno Lender" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" defaultValue={user?.email || "lender@smitetrade.com"} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input id="phone" defaultValue="+27 12 345 6789" />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button>Save Changes</Button>
                                </CardFooter>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Verification Documents</CardTitle>
                                    <CardDescription>Upload business documents to verify your lender status.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-2 hover:bg-muted/50 transition-colors cursor-pointer">
                                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-muted-foreground"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                                        </div>
                                        <div className="font-medium text-sm">Upload ID / Passport</div>
                                        <div className="text-xs text-muted-foreground">PDF or JPG up to 5MB</div>
                                    </div>
                                    <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-2 hover:bg-muted/50 transition-colors cursor-pointer">
                                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-muted-foreground"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                                        </div>
                                        <div className="font-medium text-sm">Business Registration</div>
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
                                        <Input id="current-password" type="password" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="new-password">New Password</Label>
                                        <Input id="new-password" type="password" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="confirm-password">Confirm Password</Label>
                                        <Input id="confirm-password" type="password" />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline">Update Password</Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-6 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Lending Parameters</CardTitle>
                                <CardDescription>Set your default interest rates and loan terms.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="interest">Default Interest Rate (%)</Label>
                                        <Input id="interest" placeholder="e.g. 5.0" defaultValue="5.0" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="max-term">Max Loan Term (Days)</Label>
                                        <Input id="max-term" placeholder="e.g. 30" defaultValue="30" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="max-amount">Maximum Loan Amount (R)</Label>
                                    <Input id="max-amount" placeholder="e.g. 50000" defaultValue="50000" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Save Settings</Button>
                            </CardFooter>
                        </Card>

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
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
};

export default LenderProfile;
