import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { toast } from "sonner";

const CustomerProfile = () => {
    const handleSave = () => {
        toast.success("Profile updated successfully");
    };

    return (
        <DashboardLayout role="customer">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight">Profile & Operations</h1>
                </div>

                {/* Dashboard Widgets */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="bg-emerald-50 border-emerald-100">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-800">Active Loan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-700">None</div>
                            <p className="text-xs text-emerald-600 mt-1">You are eligible to apply.</p>
                            <Button size="sm" variant="link" className="px-0 text-emerald-800" asChild>
                                <Link to="/customer/apply-credit">Apply Now &rarr;</Link>
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Recent Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">3</div>
                            <p className="text-xs text-muted-foreground mt-1">Last order: 2 days ago</p>
                            <Button size="sm" variant="link" className="px-0" asChild>
                                <Link to="/customer/orders">View All &rarr;</Link>
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Wishlist</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">5 Items</div>
                            <p className="text-xs text-muted-foreground mt-1">Saved for later</p>
                            <Button size="sm" variant="link" className="px-0" asChild>
                                <Link to="/customer/wishlist">Go to Wishlist &rarr;</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
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
                            <Button onClick={handleSave}>Save Changes</Button>
                        </CardFooter>
                    </Card>

                    {/* Address Book Placeholder */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Address Book</CardTitle>
                                <Button size="sm" variant="outline">Add New</Button>
                            </div>
                            <CardDescription>Manage your delivery locations.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-3 border rounded-md flex justify-between items-center bg-slate-50">
                                <div>
                                    <p className="font-medium text-sm">Zone 6 Store</p>
                                    <p className="text-xs text-muted-foreground">123 Vilakazi St, Soweto</p>
                                </div>
                                <Badge>Default</Badge>
                            </div>
                            <div className="p-3 border rounded-md flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-sm">Home</p>
                                    <p className="text-xs text-muted-foreground">45 Diepkloof Ext, Soweto</p>
                                </div>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">...</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CustomerProfile;
