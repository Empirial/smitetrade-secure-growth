import { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const OwnerProfile = () => {
    const { user, updateUser } = useStore();
    const [isLoading, setIsLoading] = useState(false);

    // Account State
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");

    // Store State
    const [storeName, setStoreName] = useState(user?.storeName || "");
    const [storeAddress, setStoreAddress] = useState(user?.storeDetails?.address || "");
    const [storeSuburb, setStoreSuburb] = useState(user?.storeDetails?.suburb || "");
    const [storeCity, setStoreCity] = useState(user?.storeDetails?.city || "");
    const [storeProvince, setStoreProvince] = useState(user?.storeDetails?.province || "Gauteng");
    const [storePostalCode, setStorePostalCode] = useState(user?.storeDetails?.postalCode || "");

    // Update local state when user updates (e.g. initial load)
    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
            setStoreName(user.storeName || "");
            if (user.storeDetails) {
                setStoreAddress(user.storeDetails.address || "");
                setStoreSuburb(user.storeDetails.suburb || "");
                setStoreCity(user.storeDetails.city || "");
                setStoreProvince(user.storeDetails.province || "Gauteng");
                setStorePostalCode(user.storeDetails.postalCode || "");
            }
        }
    }, [user]);

    const handleSaveAccount = async () => {
        setIsLoading(true);
        try {
            await updateUser({ name, email });
        } catch (error) {
            // Toast handled in context
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveStore = async () => {
        setIsLoading(true);
        try {
            await updateUser({
                storeName,
                storeDetails: {
                    address: storeAddress,
                    suburb: storeSuburb,
                    city: storeCity,
                    province: storeProvince,
                    postalCode: storePostalCode,
                    currency: "ZAR (R)"
                }
            });
        } catch (error) {
            // Toast handled in context
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout role="owner">
            <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16 border-2 border-emerald-500">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${name.replace(" ", "+")}&background=10b981&color=fff`} />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{name || "Store Owner"}</h1>
                    <p className="text-muted-foreground">Owner • {storeName || "My Spaza Shop"}</p>
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
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSaveAccount} disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save changes"}
                            </Button>
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
                                <Input id="storename" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
                            </div>

                            <div className="border-t pt-2 mt-2">
                                <h3 className="font-semibold mb-3">Location Details</h3>
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="street">Street Address</Label>
                                        <Input id="street" placeholder="123 Main Street" value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="suburb">Suburb</Label>
                                            <Input id="suburb" placeholder="e.g. Soweto" value={storeSuburb} onChange={(e) => setStoreSuburb(e.target.value)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="city">City</Label>
                                            <Input id="city" placeholder="e.g. Johannesburg" value={storeCity} onChange={(e) => setStoreCity(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="province">Province</Label>
                                            <Select value={storeProvince} onValueChange={setStoreProvince}>
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
                                            <Input id="postalCode" placeholder="0000" value={storePostalCode} onChange={(e) => setStorePostalCode(e.target.value)} />
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
                            <Button onClick={handleSaveStore} disabled={isLoading}>
                                {isLoading ? "Saving..." : "Update Store"}
                            </Button>
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
