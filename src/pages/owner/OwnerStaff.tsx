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

const initialStaff = [
    { id: 1, name: "Thandiwe Zulu", role: "Cashier", email: "thandi@spaza.com", status: "Active", joined: "2023-11-12" },
    { id: 2, name: "Bongani Mkhize", role: "Driver", email: "bongani@spaza.com", status: "Active", joined: "2024-01-05" },
    { id: 3, name: "Sarah Khumalo", role: "Cashier", email: "sarah@spaza.com", status: "On Leave", joined: "2024-02-20" },
    { id: 4, name: "David Naidoo", role: "Driver", email: "david@spaza.com", status: "Inactive", joined: "2023-10-01" },
];

const OwnerStaff = () => {
    const [staff, setStaff] = useState(initialStaff);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", role: "Cashier" });

    const handleAddStaff = () => {
        const newStaff = {
            id: staff.length + 1,
            name: formData.name,
            email: formData.email,
            role: formData.role,
            status: "Active",
            joined: new Date().toISOString().split('T')[0]
        };
        setStaff([...staff, newStaff]);
        setIsAddOpen(false);
        setFormData({ name: "", email: "", role: "Cashier" });
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
                                    {getRoleIcon(member.role)}
                                    {member.role}
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
