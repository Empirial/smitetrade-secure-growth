import DashboardLayout from "@/components/DashboardLayout";
import CreditComingSoon from "@/components/CreditComingSoon";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useCredit } from "@/context/CreditContext";
import { useStore } from "@/context/StoreContext";
import { useState, useEffect } from "react";
import FieldError from "@/components/ui/FieldError";
import { Navigation, MapPin } from "lucide-react";
import { getSavedLocation, saveLocation, clearLocation, getCurrentPosition, geocodeAddress, type SavedLocation } from "@/utils/locationUtils";
import { validateRequired, validateEmail, validatePhone, validateIdNumber, validatePassword, validatePasswordMatch, hasErrors } from "@/utils/validation";

const CustomerProfile = () => {
    const { user, updateUser, orders } = useStore();
    const myOrderCount = orders.filter(o => o.userId === user?.id || o.customerName === user?.name).length;
    const { profile, isLoading: isCreditLoading } = useCredit();
    const [isSaving, setIsSaving] = useState(false);

    // Address Book State
    const [savedAddresses, setSavedAddresses] = useState<{ label: string; address: string }[]>([]);
    const [addAddressOpen, setAddAddressOpen] = useState(false);
    const [newAddrLabel, setNewAddrLabel] = useState("");
    const [newAddrStreet, setNewAddrStreet] = useState("");
    const [addrErrors, setAddrErrors] = useState({ label: null as string | null, address: null as string | null });
    const [isSavingAddr, setIsSavingAddr] = useState(false);

    // Profile State
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [idNumber, setIdNumber] = useState("");
    const [defaultAddress, setDefaultAddress] = useState("");

    // Profile Errors
    const [profileErrors, setProfileErrors] = useState({
        firstName: null as string | null,
        lastName: null as string | null,
        email: null as string | null,
        phone: null as string | null,
        idNumber: null as string | null,
    });

    // Location State
    const [myLocation, setMyLocation] = useState<SavedLocation | null>(null);
    const [locationInput, setLocationInput] = useState("");
    const [isGeolocating, setIsGeolocating] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);

    // Password State
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordErrors, setPasswordErrors] = useState({
        currentPassword: null as string | null,
        newPassword: null as string | null,
        confirmPassword: null as string | null,
    });

    useEffect(() => {
        setMyLocation(getSavedLocation());
    }, []);

    const handleUseGPS = async () => {
        setIsGeolocating(true);
        try {
            const { lat, lng } = await getCurrentPosition();
            saveLocation(lat, lng, "GPS Location");
            setMyLocation({ lat, lng, address: "GPS Location" });
            toast.success("Location set using GPS");
        } catch {
            toast.error("Could not access GPS. Please check browser permissions.");
        } finally {
            setIsGeolocating(false);
        }
    };

    const handleSetAddress = async () => {
        if (!locationInput.trim()) return;
        setIsGeocoding(true);
        try {
            const coords = await geocodeAddress(locationInput.trim());
            if (coords) {
                saveLocation(coords.lat, coords.lng, locationInput.trim());
                setMyLocation({ lat: coords.lat, lng: coords.lng, address: locationInput.trim() });
                setLocationInput("");
                toast.success("Location saved");
            } else {
                toast.error("Address not found. Try a city or suburb name.");
            }
        } catch {
            toast.error("Could not geocode address.");
        } finally {
            setIsGeocoding(false);
        }
    };

    const handleClearLocation = () => {
        clearLocation();
        setMyLocation(null);
        toast.success("Location removed");
    };

    useEffect(() => {
        if (user) {
            if (user.profileDetails) {
                setFirstName(user.profileDetails.firstName || "");
                setLastName(user.profileDetails.lastName || "");
                setPhone(user.profileDetails.phone || "");
                setDefaultAddress(user.profileDetails.defaultAddress || "");
                setEmail(user.email || "");
                setIdNumber(user.profileDetails.IDNumber || "");
                setSavedAddresses(user.profileDetails.addresses || []);
            } else if (user.name) {
                const parts = user.name.split(" ");
                setFirstName(parts[0] || "");
                setLastName(parts.slice(1).join(" ") || "");
                setEmail(user.email || "");
            }
        }
    }, [user]);

    const validateProfile = () => {
        const errs = {
            firstName: validateRequired(firstName, "First name"),
            lastName: validateRequired(lastName, "Last name"),
            email: validateEmail(email),
            phone: phone ? validatePhone(phone) : null,
            idNumber: idNumber ? validateIdNumber(idNumber) : null,
        };
        setProfileErrors(errs);
        return !hasErrors(errs);
    };

    const handleSave = async () => {
        if (!validateProfile()) return;
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

    const validatePasswordChange = () => {
        const errs = {
            currentPassword: validateRequired(currentPassword, "Current password"),
            newPassword: validatePassword(newPassword),
            confirmPassword: validatePasswordMatch(newPassword, confirmPassword),
        };
        setPasswordErrors(errs);
        return !hasErrors(errs);
    };

    const handleAddAddress = async () => {
        const errs = {
            label: validateRequired(newAddrLabel, "Label"),
            address: validateRequired(newAddrStreet, "Address"),
        };
        setAddrErrors(errs);
        if (hasErrors(errs)) return;
        setIsSavingAddr(true);
        try {
            const updated = [...savedAddresses, { label: newAddrLabel.trim(), address: newAddrStreet.trim() }];
            await updateUser({
                profileDetails: {
                    firstName,
                    lastName,
                    phone,
                    defaultAddress,
                    IDNumber: idNumber,
                    addresses: updated,
                },
            });
            setSavedAddresses(updated);
            setNewAddrLabel("");
            setNewAddrStreet("");
            setAddrErrors({ label: null, address: null });
            setAddAddressOpen(false);
        } catch {
            // toast handled in context
        } finally {
            setIsSavingAddr(false);
        }
    };

    const handleRemoveAddress = async (index: number) => {
        const updated = savedAddresses.filter((_, i) => i !== index);
        try {
            await updateUser({
                profileDetails: {
                    firstName,
                    lastName,
                    phone,
                    defaultAddress,
                    IDNumber: idNumber,
                    addresses: updated,
                },
            });
            setSavedAddresses(updated);
        } catch {
            // toast handled in context
        }
    };

    const handlePasswordChange = () => {
        if (!validatePasswordChange()) return;
        toast.success("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordErrors({ currentPassword: null, newPassword: null, confirmPassword: null });
    };

    return (
        <DashboardLayout role="customer">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight">Profile & Operations</h1>
                </div>

                {/* Dashboard Widgets */}
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                    <CreditComingSoon>
                    <Card className="bg-emerald-50 border-emerald-100">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-800">BRI Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold text-emerald-700">
                                {isCreditLoading ? "..." : (profile ? (profile.tier === 'Gold' ? 'Pays On Time' : profile.tier === 'Silver' ? 'Pays But delays' : 'Does not pay at all') : "N/A")}
                            </div>
                            <p className="text-xs text-emerald-600 mt-1">Category</p>
                            <Button size="sm" variant="link" className="px-0 text-emerald-800" asChild>
                                <Link to="/customer/credit-review">View Details &rarr;</Link>
                            </Button>
                        </CardContent>
                    </Card>
                    </CreditComingSoon>
                    <CreditComingSoon>
                    <Card className="bg-blue-50 border-blue-100">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-800">Store Credit Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-700">
                                {isCreditLoading ? "..." : `R ${(profile?.balance || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`}
                            </div>
                            <p className="text-xs text-emerald-600 mt-1">Current amount owed.</p>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button size="sm" variant="link" className="px-0 text-emerald-800">
                                        View Details &rarr;
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl">Store Credit Details</DialogTitle>
                                        <DialogDescription>
                                            This credit is used for food and essentials at participating spaza shops. Pay this balance to maintain your Store Tier.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex flex-col gap-4 py-4">
                                        <div className="p-4 bg-red-50 rounded-lg border border-red-100 flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-medium text-red-800">Current Balance Owed</p>
                                                <p className="text-xs text-red-600">Must be paid</p>
                                            </div>
                                            <div className="text-2xl font-bold text-red-600">
                                                {isCreditLoading ? "..." : `R ${(profile?.balance || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
                                            <Link to="/customer/payment">Make a Payment</Link>
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                    </CreditComingSoon>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Recent Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{myOrderCount}</div>
                            <p className="text-xs text-muted-foreground mt-1">Total orders placed</p>
                            <Button size="sm" variant="link" className="px-0" asChild>
                                <Link to="/customer/orders">View All &rarr;</Link>
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Shop</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Browse</div>
                            <p className="text-xs text-muted-foreground mt-1">Find products near you</p>
                            <Button size="sm" variant="link" className="px-0" asChild>
                                <Link to="/customer/products">Go to Shop &rarr;</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
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
                                    <Input
                                        id="name"
                                        value={firstName}
                                        className={profileErrors.firstName ? "border-destructive focus-visible:ring-destructive" : ""}
                                        onChange={(e) => { setFirstName(e.target.value); setProfileErrors({ ...profileErrors, firstName: null }); }}
                                    />
                                    <FieldError message={profileErrors.firstName} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lastname">Last Name</Label>
                                    <Input
                                        id="lastname"
                                        value={lastName}
                                        className={profileErrors.lastName ? "border-destructive focus-visible:ring-destructive" : ""}
                                        onChange={(e) => { setLastName(e.target.value); setProfileErrors({ ...profileErrors, lastName: null }); }}
                                    />
                                    <FieldError message={profileErrors.lastName} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        value={phone}
                                        placeholder="082 123 4567"
                                        className={profileErrors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
                                        onChange={(e) => { setPhone(e.target.value); setProfileErrors({ ...profileErrors, phone: null }); }}
                                    />
                                    <FieldError message={profileErrors.phone} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="idNumber">ID Number</Label>
                                    <Input
                                        id="idNumber"
                                        value={idNumber}
                                        placeholder="Enter 13-digit ID"
                                        className={profileErrors.idNumber ? "border-destructive focus-visible:ring-destructive" : ""}
                                        onChange={(e) => { setIdNumber(e.target.value); setProfileErrors({ ...profileErrors, idNumber: null }); }}
                                    />
                                    <FieldError message={profileErrors.idNumber} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    placeholder="e.g. hello@example.com"
                                    className={profileErrors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                                    onChange={(e) => { setEmail(e.target.value); setProfileErrors({ ...profileErrors, email: null }); }}
                                />
                                <FieldError message={profileErrors.email} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="location">Default Location</Label>
                                <Input
                                    id="location"
                                    value={defaultAddress}
                                    placeholder="Soweto, Zone 6"
                                    onChange={(e) => setDefaultAddress(e.target.value)}
                                />
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
                        {/* My Location */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-emerald-600" /> My Location
                                </CardTitle>
                                <CardDescription>Used to show products from the nearest stores</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {myLocation ? (
                                    <div className="flex items-start justify-between gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                        <div>
                                            <p className="text-sm font-medium text-emerald-800">{myLocation.address}</p>
                                            <p className="text-xs text-emerald-600 mt-0.5">{myLocation.lat.toFixed(4)}, {myLocation.lng.toFixed(4)}</p>
                                        </div>
                                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive shrink-0" onClick={handleClearLocation}>
                                            Remove
                                        </Button>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No location set. Set one below to see nearby stores first.</p>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                    onClick={handleUseGPS}
                                    disabled={isGeolocating}
                                >
                                    <Navigation className="h-4 w-4 mr-2" />
                                    {isGeolocating ? "Detecting..." : "Use GPS"}
                                </Button>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Or type city / suburb..."
                                        value={locationInput}
                                        onChange={(e) => setLocationInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSetAddress()}
                                    />
                                    <Button
                                        size="sm"
                                        onClick={handleSetAddress}
                                        disabled={!locationInput.trim() || isGeocoding}
                                        className="shrink-0"
                                    >
                                        {isGeocoding ? "..." : "Set"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Address Book */}
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Address Book</CardTitle>
                                    <Dialog open={addAddressOpen} onOpenChange={(open) => {
                                        setAddAddressOpen(open);
                                        if (!open) {
                                            setNewAddrLabel("");
                                            setNewAddrStreet("");
                                            setAddrErrors({ label: null, address: null });
                                        }
                                    }}>
                                        <DialogTrigger asChild>
                                            <Button size="sm" variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">Add New</Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Add New Address</DialogTitle>
                                                <DialogDescription>Save a delivery location to your address book.</DialogDescription>
                                            </DialogHeader>
                                            <div className="flex flex-col gap-4 py-2">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="addrLabel">Label</Label>
                                                    <Input
                                                        id="addrLabel"
                                                        placeholder="e.g. Home, Work, Grandmother's"
                                                        value={newAddrLabel}
                                                        className={addrErrors.label ? "border-destructive focus-visible:ring-destructive" : ""}
                                                        onChange={(e) => { setNewAddrLabel(e.target.value); setAddrErrors(prev => ({ ...prev, label: null })); }}
                                                    />
                                                    <FieldError message={addrErrors.label} />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="addrStreet">Address</Label>
                                                    <Input
                                                        id="addrStreet"
                                                        placeholder="e.g. 12 Soweto Ave, Zone 6"
                                                        value={newAddrStreet}
                                                        className={addrErrors.address ? "border-destructive focus-visible:ring-destructive" : ""}
                                                        onChange={(e) => { setNewAddrStreet(e.target.value); setAddrErrors(prev => ({ ...prev, address: null })); }}
                                                    />
                                                    <FieldError message={addrErrors.address} />
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-2 pt-2">
                                                <Button variant="outline" onClick={() => setAddAddressOpen(false)}>Cancel</Button>
                                                <Button onClick={handleAddAddress} disabled={isSavingAddr} className="bg-emerald-600 hover:bg-emerald-700">
                                                    {isSavingAddr ? "Saving..." : "Save Address"}
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
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
                                {savedAddresses.map((addr, idx) => (
                                    <div key={idx} className="p-3 border rounded-md flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-sm">{addr.label}</p>
                                            <p className="text-xs text-muted-foreground">{addr.address}</p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 px-2 text-xs"
                                            onClick={() => handleRemoveAddress(idx)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                                {!defaultAddress && savedAddresses.length === 0 && (
                                    <p className="text-xs text-muted-foreground text-center py-2">No addresses saved. Click "Add New" to add one.</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Security */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Security</CardTitle>
                                <CardDescription>Change your password to keep your account secure.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <Input
                                        id="currentPassword"
                                        type="password"
                                        value={currentPassword}
                                        className={passwordErrors.currentPassword ? "border-destructive focus-visible:ring-destructive" : ""}
                                        onChange={(e) => { setCurrentPassword(e.target.value); setPasswordErrors({ ...passwordErrors, currentPassword: null }); }}
                                    />
                                    <FieldError message={passwordErrors.currentPassword} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        value={newPassword}
                                        className={passwordErrors.newPassword ? "border-destructive focus-visible:ring-destructive" : ""}
                                        onChange={(e) => { setNewPassword(e.target.value); setPasswordErrors({ ...passwordErrors, newPassword: null }); }}
                                    />
                                    <FieldError message={passwordErrors.newPassword} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        className={passwordErrors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}
                                        onChange={(e) => { setConfirmPassword(e.target.value); setPasswordErrors({ ...passwordErrors, confirmPassword: null }); }}
                                    />
                                    <FieldError message={passwordErrors.confirmPassword} />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handlePasswordChange} className="w-full bg-emerald-600 hover:bg-emerald-700">
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
