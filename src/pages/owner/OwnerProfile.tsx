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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Phone, Trash2, KeyRound, TrendingUp, ShoppingBag, Star } from "lucide-react";

const OwnerProfile = () => {
    const { user, updateUser } = useStore();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    // Account State
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");

    interface StoreDetails {
        id: string;
        name: string;
        address: string;
        suburb: string;
        city: string;
        province: string;
        postalCode: string;
        phone?: string;
        managerName?: string;
        status?: "Active" | "Inactive" | "Under Maintenance";
        description?: string;
        shopEmail?: string;
        openingTime?: string;
        closingTime?: string;
        acceptOnlineOrders?: boolean;
        notifyOrders?: boolean;
        notifyLowStock?: boolean;
        notifyDailySales?: boolean;
    }

    const [stores, setStores] = useState<StoreDetails[]>([]);
    const [selectedStoreIndex, setSelectedStoreIndex] = useState<number>(0);

    const activeStore = stores[selectedStoreIndex] || null;

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
            setPhone(user.phone || "");

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
                    postalCode: user.storeDetails?.postalCode || "",
                    phone: "",
                    managerName: "",
                    status: "Active",
                    description: "The best local spaza for all your daily essentials.",
                    shopEmail: "contact@store.co.za",
                    openingTime: "08:00",
                    closingTime: "20:00",
                    acceptOnlineOrders: true,
                    notifyOrders: true,
                    notifyLowStock: true,
                    notifyDailySales: false
                }]);
            }
        }
    }, [user]);

    const handleSaveAccount = async () => {
        setIsLoading(true);
        try {
            await updateUser({ name, email, phone });
            toast({ title: "Account Updated", description: "Your personal details have been saved." });
        } catch (error) {
            toast({ title: "Error", description: "Failed to update account.", variant: "destructive" });
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
            toast({ title: "Stores Updated", description: "Your store configurations have been saved successfully." });
        } catch (error) {
            toast({ title: "Error", description: "Failed to update stores.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddStore = () => {
        const newStore: StoreDetails = {
            id: `store-${Date.now()}`,
            name: "New Store " + (stores.length + 1),
            address: "",
            suburb: "",
            city: "",
            province: "Gauteng",
            postalCode: "",
            status: "Active",
            description: "",
            shopEmail: "",
            openingTime: "08:00",
            closingTime: "20:00",
            acceptOnlineOrders: true,
            notifyOrders: true,
            notifyLowStock: true,
            notifyDailySales: false
        };
        setStores([...stores, newStore]);
        setSelectedStoreIndex(stores.length); // switch to the new one
    };

    const handleUpdateStore = (id: string, field: keyof StoreDetails, value: any) => {
        setStores(stores.map(store => store.id === id ? { ...store, [field]: value } : store));
    };

    const handleRemoveStore = (id: string, index: number) => {
        if (stores.length === 1) return;
        setStores(stores.filter(store => store.id !== id));
        if (selectedStoreIndex >= index && selectedStoreIndex > 0) {
            setSelectedStoreIndex(selectedStoreIndex - 1);
        }
    };

    // Password & Security State
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handlePasswordChange = () => {
        if (newPassword !== confirmPassword) {
            toast({ title: "Error", description: "Mismatched passwords.", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            toast({ title: "Success", description: "Your password has been changed securely." });
        }, 800);
    };

    const handleDeleteAccount = () => {
        toast({ title: "Request Received", description: "Account deletion request initiated. Support will contact you within 24 hours.", variant: "destructive" });
    }

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

            <div className="grid gap-4 md:grid-cols-3 mb-6">
                <Card className="bg-emerald-500/10 border-emerald-500/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-400 flex justify-between">
                            Contact Details
                            <Phone className="h-4 w-4 text-emerald-400" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-semibold text-emerald-300">{email || "No Email"}</div>
                        <p className="text-xs text-emerald-400 mt-1">{phone || "No Phone Number"}</p>
                    </CardContent>
                </Card>
                <Card className="bg-sky-500/10 border-sky-500/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-sky-400 flex justify-between">
                            Store Ownership
                            <Building2 className="h-4 w-4 text-sky-400" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-semibold text-sky-300">{stores.length} Location(s)</div>
                        <p className="text-xs text-sky-400 mt-1">Primary: {stores[0]?.name || "None"}</p>
                    </CardContent>
                </Card>
                <Card className="bg-amber-500/10 border-amber-500/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-amber-400 flex justify-between">
                            Account Status
                            <KeyRound className="h-4 w-4 text-amber-400" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-semibold text-amber-300">Verified Owner</div>
                        <p className="text-xs text-amber-400 mt-1">Full access granted</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="account" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="store">Stores</TabsTrigger>
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
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" placeholder="+27 00 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
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
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Store Configuration</CardTitle>
                                    <CardDescription>
                                        Manage layout, contacts, and locations of your stores.
                                    </CardDescription>
                                </div>
                                <Button size="sm" onClick={handleAddStore}>
                                    <Plus className="h-4 w-4 mr-2" /> Add Location
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-[250px_1fr] gap-6 items-start">
                                {/* Sidebar: Store List */}
                                <div className="flex flex-col gap-2 border-r pr-4 max-h-[500px] overflow-y-auto">
                                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Your Locations</h4>
                                    {stores.map((store, index) => (
                                        <button
                                            key={store.id}
                                            onClick={() => setSelectedStoreIndex(index)}
                                            className={`flex items-center justify-between p-3 rounded-md transition-colors text-left ${selectedStoreIndex === index ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                <Building2 className="h-4 w-4 shrink-0" />
                                                <span className="truncate">{store.name || "Unnamed Store"}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Main Content: Store Form */}
                                <div className="space-y-6">
                                    {activeStore && (
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-medium">Editing: {activeStore.name}</h3>
                                                    {stores.length > 1 && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                            onClick={() => handleRemoveStore(activeStore.id, selectedStoreIndex)}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Remove Store
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>Store Name</Label>
                                                    <Input value={activeStore.name} onChange={(e) => handleUpdateStore(activeStore.id, 'name', e.target.value)} />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="grid gap-2">
                                                        <Label>Store Phone/Contact</Label>
                                                        <Input placeholder="+27 00..." value={activeStore.phone || ""} onChange={(e) => handleUpdateStore(activeStore.id, 'phone', e.target.value)} />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label>Manager Name</Label>
                                                        <Input placeholder="Manager's Full Name" value={activeStore.managerName || ""} onChange={(e) => handleUpdateStore(activeStore.id, 'managerName', e.target.value)} />
                                                    </div>
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>Operating Status</Label>
                                                    <Select value={activeStore.status || "Active"} onValueChange={(val) => handleUpdateStore(activeStore.id, 'status', val)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Active">🟢 Active & Open</SelectItem>
                                                            <SelectItem value="Inactive">🔴 Inactive / Closed</SelectItem>
                                                            <SelectItem value="Under Maintenance">🟡 Under Maintenance</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <Separator />

                                                <div className="grid gap-2">
                                                    <Label>Street Address</Label>
                                                    <Input placeholder="123 Main Street" value={activeStore.address} onChange={(e) => handleUpdateStore(activeStore.id, 'address', e.target.value)} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="grid gap-2">
                                                        <Label>Suburb</Label>
                                                        <Input placeholder="e.g. Soweto" value={activeStore.suburb} onChange={(e) => handleUpdateStore(activeStore.id, 'suburb', e.target.value)} />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label>City</Label>
                                                        <Input placeholder="e.g. Johannesburg" value={activeStore.city} onChange={(e) => handleUpdateStore(activeStore.id, 'city', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="grid gap-2">
                                                        <Label>Province</Label>
                                                        <Select value={activeStore.province} onValueChange={(val) => handleUpdateStore(activeStore.id, 'province', val)}>
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
                                                        <Input placeholder="0000" value={activeStore.postalCode} onChange={(e) => handleUpdateStore(activeStore.id, 'postalCode', e.target.value)} />
                                                    </div>
                                                </div>
                                            </div>

                                            <Separator className="my-6" />

                                            <div className="space-y-4">
                                                <h3 className="text-lg font-medium">Store Preferences & Operations</h3>
                                                <div className="grid gap-2">
                                                    <Label>Description (Visible to customers)</Label>
                                                    <Textarea placeholder="Describe your shop..." value={activeStore.description || ""} onChange={e => handleUpdateStore(activeStore.id, 'description', e.target.value)} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="grid gap-2">
                                                        <Label>Shop Contact Email</Label>
                                                        <Input placeholder="contact@store.co.za" value={activeStore.shopEmail || ""} onChange={e => handleUpdateStore(activeStore.id, 'shopEmail', e.target.value)} />
                                                    </div>
                                                </div>
                                            </div>

                                            <Separator className="my-6" />

                                            <div className="space-y-4">
                                                <h3 className="text-lg font-medium">Operating Hours</h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="grid gap-2">
                                                        <Label>Opening Time</Label>
                                                        <Input type="time" value={activeStore.openingTime || "08:00"} onChange={e => handleUpdateStore(activeStore.id, 'openingTime', e.target.value)} />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label>Closing Time</Label>
                                                        <Input type="time" value={activeStore.closingTime || "20:00"} onChange={e => handleUpdateStore(activeStore.id, 'closingTime', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between border rounded-lg p-4">
                                                    <div className="space-y-0.5">
                                                        <Label className="text-base">Accept Online Orders</Label>
                                                        <p className="text-sm text-muted-foreground">Turn this off to temporarily hide this store online.</p>
                                                    </div>
                                                    <Switch checked={activeStore.acceptOnlineOrders !== false} onCheckedChange={val => handleUpdateStore(activeStore.id, 'acceptOnlineOrders', val)} />
                                                </div>
                                            </div>

                                            <Separator className="my-6" />

                                            <div className="space-y-4">
                                                <h3 className="text-lg font-medium">Store Notifications</h3>
                                                <div className="grid gap-4">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="flex-1 cursor-pointer">New Order Alerts</Label>
                                                        <Switch checked={activeStore.notifyOrders !== false} onCheckedChange={val => handleUpdateStore(activeStore.id, 'notifyOrders', val)} />
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <Label className="flex-1 cursor-pointer">Low Stock Warnings</Label>
                                                        <Switch checked={activeStore.notifyLowStock !== false} onCheckedChange={val => handleUpdateStore(activeStore.id, 'notifyLowStock', val)} />
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <Label className="flex-1 cursor-pointer">Daily Sales Summary</Label>
                                                        <Switch checked={activeStore.notifyDailySales === true} onCheckedChange={val => handleUpdateStore(activeStore.id, 'notifyDailySales', val)} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-2 border-t pt-6 mt-6">
                                <Label htmlFor="currency">Global Store Currency</Label>
                                <Input id="currency" defaultValue="ZAR (R)" disabled className="max-w-xs" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSaveStore} disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save All Stores"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <KeyRound className="h-5 w-5 text-primary" />
                                Change Password
                            </CardTitle>
                            <CardDescription>Ensure your account remains highly secure.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2 max-w-sm">
                                <Label>Current Password</Label>
                                <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                            </div>
                            <div className="grid gap-2 max-w-sm">
                                <Label>New Password</Label>
                                <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                            </div>
                            <div className="grid gap-2 max-w-sm">
                                <Label>Confirm New Password</Label>
                                <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handlePasswordChange} disabled={isLoading}>Update Password</Button>
                        </CardFooter>
                    </Card>

                    <Card className="border-red-200">
                        <CardHeader>
                            <CardTitle className="text-red-600">Danger Zone</CardTitle>
                            <CardDescription>
                                Irreversible account actions. This cannot be undone.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground mr-4">Once you delete your account, there is no going back. Please be certain.</p>
                            <Button variant="destructive" onClick={handleDeleteAccount}>Delete Account</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </DashboardLayout>
    );
};

export default OwnerProfile;
