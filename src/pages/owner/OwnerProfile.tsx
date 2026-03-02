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

    interface StoreDetails {
        id: string;
        name: string;
        address: string;
        suburb: string;
        city: string;
        province: string;
        postalCode: string;
    }

    const [stores, setStores] = useState<StoreDetails[]>([]);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");

            // Migrate single store to array if needed
            if (user.stores) {
                setStores(user.stores);
            } else if (user.storeName) {
                setStores([{
                    id: 'default-1',
                    name: user.storeName,
                    address: user.storeDetails?.address || "",
                    suburb: user.storeDetails?.suburb || "",
                    city: user.storeDetails?.city || "",
                    province: user.storeDetails?.province || "Gauteng",
                    postalCode: user.storeDetails?.postalCode || ""
                }]);
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
                stores: stores,
                // Keep the first store as primary for backward compatibility
                ...(stores.length > 0 && {
                    storeName: stores[0].name,
                    storeDetails: {
                        address: stores[0].address,
                        suburb: stores[0].suburb,
                        city: stores[0].city,
                        province: stores[0].province,
                        postalCode: stores[0].postalCode,
                        currency: "ZAR (R)"
                    }
                })
            });
        } catch (error) {
            // Toast handled in context
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddStore = () => {
        setStores([...stores, {
            id: `store-${Date.now()}`,
            name: "New Store",
            address: "",
            suburb: "",
            city: "",
            province: "Gauteng",
            postalCode: ""
        }]);
    };

    const handleUpdateStore = (id: string, field: keyof StoreDetails, value: string) => {
        setStores(stores.map(store => store.id === id ? { ...store, [field]: value } : store));
    };

    const handleRemoveStore = (id: string) => {
        setStores(stores.filter(store => store.id !== id));
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
                    <p className="text-muted-foreground">Owner • {stores[0]?.name || "My Spaza Shop"}{stores.length > 1 ? ` (+${stores.length - 1} more)` : ''}</p>
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
                            <div className="flex justify-between items-center">
                                <Label htmlFor="currency">Currency</Label>
                                <Button size="sm" variant="outline" onClick={handleAddStore}>+ Add Another Store</Button>
                            </div>

                            {stores.map((store, index) => (
                                <div key={store.id} className="border rounded-lg p-4 relative bg-card text-card-foreground">
                                    {stores.length > 1 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 h-8 w-8 p-0"
                                            onClick={() => handleRemoveStore(store.id)}
                                        >
                                            X
                                        </Button>
                                    )}
                                    <h3 className="font-semibold mb-3">Store #{index + 1}</h3>
                                    <div className="grid gap-4">
                                        <div className="grid gap-2">
                                            <Label>Store Name</Label>
                                            <Input value={store.name} onChange={(e) => handleUpdateStore(store.id, 'name', e.target.value)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Street Address</Label>
                                            <Input placeholder="123 Main Street" value={store.address} onChange={(e) => handleUpdateStore(store.id, 'address', e.target.value)} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label>Suburb</Label>
                                                <Input placeholder="e.g. Soweto" value={store.suburb} onChange={(e) => handleUpdateStore(store.id, 'suburb', e.target.value)} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>City</Label>
                                                <Input placeholder="e.g. Johannesburg" value={store.city} onChange={(e) => handleUpdateStore(store.id, 'city', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label>Province</Label>
                                                <Select value={store.province} onValueChange={(val) => handleUpdateStore(store.id, 'province', val)}>
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
                                                <Label>Postal Code</Label>
                                                <Input placeholder="0000" value={store.postalCode} onChange={(e) => handleUpdateStore(store.id, 'postalCode', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

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
