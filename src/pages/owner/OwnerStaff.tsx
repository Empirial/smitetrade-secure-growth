import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Truck, Shield, MoreHorizontal, UserPlus } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, addDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useStore } from "@/context/StoreContext";

// Define interface locally if not exported from context, or import it.
// Assuming User interface matches mostly.
interface StaffMember {
    id: string;
    name: string;
    email: string;
    role: string;
    status?: string; // Optional in User type?
    joined?: string;
}

const OwnerStaff = () => {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", role: "cashier" }); // lowercase role to match types

    useEffect(() => {
        // Fetch users who are cashiers or drivers
        // In a real app, we would filter by storeId as well
        const q = query(collection(db, "users"), where("role", "in", ["cashier", "driver"]));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const staffData = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    status: "Active", // Default for now
                    joined: "2024-01-01" // Default
                } as StaffMember;
            });
            setStaff(staffData);
        });
        return () => unsubscribe();
    }, []);

    const handleAddStaff = () => {
        // In a real app, this should probably create a user invitation or 
        // create a user document directly (if using a different auth flow).
        // For now, we'll just close the dialog as we can't create Auth users 
        // without their password here easily.
        console.log("Add staff feature would send invite to:", formData.email);
        setIsAddOpen(false);
        setFormData({ name: "", email: "", role: "cashier" });
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case "Cashier": return <User className="h-4 w-4" />;
            case "Driver": return <Truck className="h-4 w-4" />;
            case "Owner": return <Shield className="h-4 w-4" />;
            default: return <User className="h-4 w-4" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active": return "default";
            case "On Leave": return "secondary";
            case "Inactive": return "destructive";
            default: return "outline";
        }
    };

    return (
        <DashboardLayout role="owner">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
                        <p className="text-muted-foreground">Manage your employees, roles, and access.</p>
                    </div>
                    <div>
                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <UserPlus className="h-4 w-4 mr-2" /> Add Staff Member
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Employee</DialogTitle>
                                    <DialogDescription>
                                        Create a profile for a new cashier or driver.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">Full Name</Label>
                                        <Input
                                            id="name"
                                            className="col-span-3"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="email" className="text-right">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            className="col-span-3"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="role" className="text-right">Role</Label>
                                        <Select
                                            value={formData.role}
                                            onValueChange={(value) => setFormData({ ...formData, role: value })}
                                        >
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Cashier">Cashier</SelectItem>
                                                <SelectItem value="Driver">Driver</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleAddStaff}>Create Account</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {staff.map((member) => (
                        <Card key={member.id}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-base font-medium">
                                    {member.name}
                                </CardTitle>
                                <Badge variant={getStatusColor(member.status) as any}>{member.status}</Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                    {getRoleIcon(member.role.charAt(0).toUpperCase() + member.role.slice(1))}
                                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                                </div>
                                <div className="text-xs text-muted-foreground mb-4">
                                    Joined: {member.joined} <br />
                                    Email: {member.email}
                                </div>
                                <div className="flex justify-end">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                                            <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600">Deactivate User</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default OwnerStaff;
