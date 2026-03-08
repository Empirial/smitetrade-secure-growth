import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { toast } from "sonner";
import { useCredit } from "@/context/CreditContext";
import { useStore } from "@/context/StoreContext";
import { useState, useEffect } from "react";

const CustomerProfile = () => {
    const { user, updateUser } = useStore();
    const { profile, isLoading: isCreditLoading } = useCredit();
    const [isSaving, setIsSaving] = useState(false);

    // Profile State
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [idNumber, setIdNumber] = useState("");
    const [defaultAddress, setDefaultAddress] = useState("");

    // Initialize state from user object
    useEffect(() => {
        if (user) {
            // Split name if first/last not set yet
            if (user.profileDetails) {
                setFirstName(user.profileDetails.firstName || "");
                setLastName(user.profileDetails.lastName || "");
                setPhone(user.profileDetails.phone || "");
                setDefaultAddress(user.profileDetails.defaultAddress || "");
                setEmail(user.email || "");
                setIdNumber(user.profileDetails.IDNumber || "");
            } else if (user.name) {
                const parts = user.name.split(" ");
                setFirstName(parts[0] || "");
                setLastName(parts.slice(1).join(" ") || "");
                setEmail(user.email || "");
            }
        }
    }, [user]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateUser({
                name: `${firstName} ${lastName}`.trim(),
                email: email,
                profileDetails: {
                    firstName,
                    lastName,
                    phone,
                    defaultAddress,
                    IDNumber: idNumber,
                }
            });
        } catch (error) {
            // Toast handled in context
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <DashboardLayout role="customer">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight">Profile & Operations</h1>
                </div>

                {/* Dashboard Widgets */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="bg-emerald-50 border-emerald-100">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-800">SpazaScore (BRI)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-700">
                                {isCreditLoading ? "..." : (profile ? `${profile.briScore.toFixed(1)}%` : "N/A")}
                            </div>
                            <p className="text-xs text-emerald-600 mt-1">
                                {profile ? profile.tier : "-"}
                            </p>
                            <Button size="sm" variant="link" className="px-0 text-emerald-800" asChild>
                                <Link to="/customer/credit-review">View Details &rarr;</Link>
                            </Button>
                        </CardContent>
                    </Card>
                    <Card className="bg-blue-50 border-blue-100">
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
                    <Card className="flex flex-col h-full">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={`https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=10b981&color=fff`} />
                                <AvatarFallback>{firstName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle>{firstName} {lastName}</CardTitle>
                                <CardDescription>{user?.email}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-6 flex-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">First Name</Label>
                                    <Input id="name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lastname">Last Name</Label>
                                    <Input id="lastname" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="082 123 4567" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="idNumber">ID Number</Label>
                                    <Input id="idNumber" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} placeholder="Enter 13-digit ID" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. hello@example.com" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="location">Default Location</Label>
                                <Input id="location" value={defaultAddress} onChange={(e) => setDefaultAddress(e.target.value)} placeholder="Soweto, Zone 6" />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 mt-auto pt-6">
                            <Button variant="outline">Cancel</Button>
                            <Button onClick={handleSave} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700">
                                {isSaving ? "Saving..." : "Save Profile"}
                            </Button>
                        </CardFooter>
                    </Card>

                    <div className="space-y-6">
                        {/* Address Book Placeholder */}
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Address Book</CardTitle>
                                    <Button size="sm" variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">Add New</Button>
                                </div>
                                <CardDescription>Manage your delivery locations.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {defaultAddress && (
                                    <div className="p-3 border rounded-md flex justify-between items-center bg-slate-50">
                                        <div>
                                            <p className="font-medium text-sm">Default Address</p>
                                            <p className="text-xs text-muted-foreground">{defaultAddress}</p>
                                        </div>
                                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none">Default</Badge>
                                    </div>
                                )}
                                <div className="p-3 border rounded-md flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-sm">Home</p>
                                        <p className="text-xs text-muted-foreground">45 Diepkloof Ext, Soweto</p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">...</Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Security</CardTitle>
                                <CardDescription>Change your password to keep your account secure.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <Input id="currentPassword" type="password" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input id="newPassword" type="password" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input id="confirmPassword" type="password" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={() => toast.success("Password updated successfully!")} className="w-full bg-emerald-600 hover:bg-emerald-700">
                                    Change Password
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CustomerProfile;
