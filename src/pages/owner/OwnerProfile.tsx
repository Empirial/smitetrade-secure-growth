import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const OwnerProfile = () => {
    return (
        <DashboardLayout role="owner">
            <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16 border-2 border-emerald-500">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">John Doe</h1>
                    <p className="text-muted-foreground">Owner • My Spaza Shop</p>
                </div>
            </div>

            <Tabs defaultValue="account" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="store">Store Settings</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="account">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Information</CardTitle>
                            <CardDescription>
                                Make changes to your account here. Click save when you're done.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" defaultValue="John Doe" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" defaultValue="@johndoe" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" defaultValue="john@example.com" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Save changes</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="store">
                    <Card>
                        <CardHeader>
                            <CardTitle>Store Configuration</CardTitle>
                            <CardDescription>
                                Manage your store details and currency.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="storename">Store Name</Label>
                                <Input id="storename" defaultValue="My Spaza Shop" />
                            </div>

                            <div className="border-t pt-2 mt-2">
                                <h3 className="font-semibold mb-3">Location Details</h3>
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="street">Street Address</Label>
                                        <Input id="street" placeholder="123 Main Street" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="suburb">Suburb</Label>
                                            <Input id="suburb" placeholder="e.g. Soweto" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="city">City</Label>
                                            <Input id="city" placeholder="e.g. Johannesburg" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="province">Province</Label>
                                            <Select defaultValue="Gauteng">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Province" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Gauteng">Gauteng</SelectItem>
                                                    <SelectItem value="KZN">KwaZulu-Natal</SelectItem>
                                                    <SelectItem value="WC">Western Cape</SelectItem>
                                                    <SelectItem value="EC">Eastern Cape</SelectItem>
                                                    <SelectItem value="FS">Free State</SelectItem>
                                                    <SelectItem value="MP">Mpumalanga</SelectItem>
                                                    <SelectItem value="NW">North West</SelectItem>
                                                    <SelectItem value="NC">Northern Cape</SelectItem>
                                                    <SelectItem value="LP">Limpopo</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="postalCode">Postal Code</Label>
                                            <Input id="postalCode" placeholder="0000" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-2 border-t pt-4">
                                <Label htmlFor="currency">Currency</Label>
                                <Input id="currency" defaultValue="ZAR (R)" disabled />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Update Store</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card className="border-red-200">
                        <CardHeader>
                            <CardTitle className="text-red-600">Danger Zone</CardTitle>
                            <CardDescription>
                                Irreversible account actions.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="destructive">Delete Account</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </DashboardLayout>
    );
};

export default OwnerProfile;
