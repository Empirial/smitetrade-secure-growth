import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CustomerProfile = () => {
    return (
        <DashboardLayout role="customer">
            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src="/placeholder-user.jpg" />
                            <AvatarFallback>LN</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle>Lerato Nkosi</CardTitle>
                            <CardDescription>lerato@example.com</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">First Name</Label>
                                <Input id="name" defaultValue="Lerato" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lastname">Last Name</Label>
                                <Input id="lastname" defaultValue="Nkosi" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" defaultValue="082 123 4567" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="location">Default Location</Label>
                            <Input id="location" defaultValue="Soweto, Zone 6" />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Save Changes</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">Deleting your account is permanent/irreversible.</p>
                        <Button variant="destructive">Delete Account</Button>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default CustomerProfile;
