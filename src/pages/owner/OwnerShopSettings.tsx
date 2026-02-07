import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Clock, MapPin, Store, Bell } from "lucide-react";

import { toast } from "sonner";
import { useState } from "react";

const OwnerShopSettings = () => {
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        // Simulate API
        setTimeout(() => {
            setLoading(false);
            toast.success("Shop settings saved successfully.");
        }, 1000);
    };

    return (
        <DashboardLayout role="owner">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Shop Settings</h1>
                    <p className="text-muted-foreground">Manage your shop's profile, appearance, and preferences.</p>
                </div>

                <div className="grid gap-6">
                    {/* General Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Store className="h-5 w-5" /> General Information</CardTitle>
                            <CardDescription>
                                This information will be displayed to customers on the app.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="shopName">Shop Name</Label>
                                <Input id="shopName" defaultValue="Lufuno's Super Spaza" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" placeholder="Describe your shop..." defaultValue="The best local spaza for all your daily essentials. Fresh stock daily!" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Location & Contact */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" /> Location & Contact</CardTitle>
                            <CardDescription>
                                Where customers can find you and how they can contact you.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="address">Physical Address</Label>
                                <Input id="address" defaultValue="123 Vilakazi Street, Soweto" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" defaultValue="+27 12 345 6789" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" defaultValue="owner@lufunospaza.co.za" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Operating Hours */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Operating Hours</CardTitle>
                            <CardDescription>
                                Set when your shop is open for orders.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Opening Time</Label>
                                    <Input type="time" defaultValue="08:00" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Closing Time</Label>
                                    <Input type="time" defaultValue="20:00" />
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Accept Online Orders</Label>
                                    <p className="text-sm text-muted-foreground">Turn this off to temporarily stash your online store.</p>
                                </div>
                                <Switch checked={true} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" /> Notifications</CardTitle>
                            <CardDescription>
                                Choose what alerts you want to receive.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="flex-1">New Order Alerts</Label>
                                <Switch checked={true} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="flex-1">Low Stock Warnings</Label>
                                <Switch checked={true} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="flex-1">Daily Sales Summary</Label>
                                <Switch checked={false} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={handleSave} disabled={loading}>
                                {loading ? "Saving..." : "Save All Changes"}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default OwnerShopSettings;
