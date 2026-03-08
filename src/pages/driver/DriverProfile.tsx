import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Mail, Car, MapPin, ShieldCheck, Camera } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const DriverProfile = () => {
    // Mock user data
    const [profile, setProfile] = useState({
        name: "Thabo Bester",
        email: "thabo.driver@example.com",
        phone: "082 123 4567",
        vehicleType: "Motorcycle - Honda 125cc",
        licensePlate: "CA 123-456",
        region: "Cape Town CBD",
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        // Mock save action
        setIsEditing(false);
        toast.success("Profile information updated successfully.");
    };

    return (
        <DashboardLayout role="driver">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Driver Profile</h1>
                    <p className="text-muted-foreground">Manage your personal information, vehicle details, and account settings.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Left Column: Avatar & Quick Info */}
                    <Card className="md:col-span-1">
                        <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                            <div className="relative">
                                <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center border-4 border-background shadow-sm overflow-hidden">
                                    <User className="h-12 w-12 text-slate-400" />
                                </div>
                                <Button size="icon" variant="outline" className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-sm bg-background">
                                    <Camera className="h-4 w-4" />
                                </Button>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{profile.name}</h3>
                                <p className="text-sm text-muted-foreground">Certified Driver</p>
                                <Badge variant="secondary" className="mt-2 text-emerald-600 bg-emerald-100/50">Active Status</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right Column: Edit Form */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Update your contact and vehicle details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input id="name" name="name" value={profile.name} onChange={handleChange} disabled={!isEditing} className="pl-9" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input id="email" name="email" type="email" value={profile.email} onChange={handleChange} disabled={!isEditing} className="pl-9" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input id="phone" name="phone" value={profile.phone} onChange={handleChange} disabled={!isEditing} className="pl-9" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="region">Operating Region</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input id="region" name="region" value={profile.region} onChange={handleChange} disabled={!isEditing} className="pl-9" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t mt-6">
                                <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Vehicle Details</h4>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="vehicleType">Vehicle Type & Model</Label>
                                        <div className="relative">
                                            <Car className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input id="vehicleType" name="vehicleType" value={profile.vehicleType} onChange={handleChange} disabled={!isEditing} className="pl-9" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="licensePlate">License Plate</Label>
                                        <div className="relative">
                                            <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input id="licensePlate" name="licensePlate" value={profile.licensePlate} onChange={handleChange} disabled={!isEditing} className="pl-9" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 border-t pt-4">
                            {isEditing ? (
                                <>
                                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                                    <Button onClick={handleSave}>Save Changes</Button>
                                </>
                            ) : (
                                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                            )}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DriverProfile;
