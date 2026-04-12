import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Truck, Shield, UserPlus, Users, Check, Flag, Wallet } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

import { useStore } from "@/context/StoreContext";
import { StaffMember } from "@/types";

// ─── Role visual config ───────────────────────────────────────────────────────
const getRoleConfig = (role: string) => {
    switch (role?.toLowerCase()) {
        case "cashier":
            return {
                bar: "from-emerald-500 via-emerald-400 to-emerald-500",
                avatarBg: "bg-emerald-500/15 border-emerald-500/30",
                avatarText: "text-emerald-300",
                roleBg: "bg-emerald-500/10 border-emerald-500/20",
                roleText: "text-emerald-400",
                icon: <User className="h-3.5 w-3.5" />,
            };
        case "driver":
            return {
                bar: "from-blue-500 via-cyan-400 to-blue-500",
                avatarBg: "bg-blue-500/15 border-blue-500/30",
                avatarText: "text-blue-300",
                roleBg: "bg-blue-500/10 border-blue-500/20",
                roleText: "text-blue-400",
                icon: <Truck className="h-3.5 w-3.5" />,
            };
        default:
            return {
                bar: "from-amber-500 via-yellow-400 to-amber-500",
                avatarBg: "bg-amber-500/15 border-amber-500/30",
                avatarText: "text-amber-300",
                roleBg: "bg-amber-500/10 border-amber-500/20",
                roleText: "text-amber-400",
                icon: <Shield className="h-3.5 w-3.5" />,
            };
    }
};

// ─── Status visual config ─────────────────────────────────────────────────────
const getStatusConfig = (status: string) => {
    switch (status) {
        case "Active":   return { dot: "bg-emerald-400", text: "text-emerald-400", pulse: true };
        case "On Leave": return { dot: "bg-amber-400",   text: "text-amber-400",   pulse: false };
        case "Inactive": return { dot: "bg-red-400",     text: "text-red-400",     pulse: false };
        default:         return { dot: "bg-slate-400",   text: "text-slate-400",   pulse: false };
    }
};

// ─── Initials helper ──────────────────────────────────────────────────────────
const getInitials = (name: string) =>
    name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

// ─── Format joined date ───────────────────────────────────────────────────────
const formatJoined = (joined?: string) => {
    if (!joined) return "—";
    try {
        return new Date(joined).toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "numeric" });
    } catch {
        return joined;
    }
};

const OwnerStaff = () => {
    const { staff, addStaff, updateStaff, deleteStaff, shifts } = useStore();
    const { toast } = useToast();

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", email: "", role: "cashier", username: "", password: "", pin: "" });

    const handleAddStaff = async () => {
        try {
            if (editId) {
                await updateStaff(editId, {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role as 'cashier' | 'driver' | 'admin',
                    username: formData.username,
                    password: formData.password as string,
                    pin: formData.pin
                } as Partial<StaffMember>);
            } else {
                await addStaff({
                    name: formData.name,
                    email: formData.email,
                    role: formData.role as 'cashier' | 'driver' | 'admin',
                    username: formData.username,
                    status: "Active",
                    joined: new Date().toISOString().split('T')[0],
                    pin: formData.pin,
                    password: formData.password as string
                } as Omit<StaffMember, 'id'>);
            }
            setIsAddOpen(false);
            setEditId(null);
            setFormData({ name: "", email: "", role: "cashier", username: "", password: "", pin: "" });
        } catch {
            // Error toast already shown by context — keep dialog open so user can fix inputs
        }
    };

    const handleEditClick = (member: any) => {
        setEditId(member.id);
        setFormData({
            name: member.name,
            email: member.email || "",
            role: member.role,
            username: member.username || "",
            password: member.password || "",
            pin: member.pin || ""
        });
        setIsAddOpen(true);
    };

    const handleOpenChange = (open: boolean) => {
        setIsAddOpen(open);
        if (!open) {
            setEditId(null);
            setFormData({ name: "", email: "", role: "cashier", username: "", password: "", pin: "" });
        }
    };

    const handleShiftAction = async (id: string, action: 'Resolved' | 'Flagged') => {
        toast({
            title: `Shift ${action}`,
            description: `Shift ${id} has been marked as ${action.toLowerCase()}.`,
            variant: action === 'Flagged' ? "destructive" : "default",
        });
    };

    const getShiftStatusColor = (status: string) => {
        switch (status) {
            case "Resolved": return "bg-green-500/10 text-green-400 border-green-500/20";
            case "Pending":  return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
            case "Flagged":  return "bg-red-500/10 text-red-400 border-red-500/20";
            default:         return "bg-muted text-muted-foreground";
        }
    };

    const getShiftVarianceColor = (variance: number) => {
        if (variance < 0) return "text-red-500 font-medium";
        if (variance > 0) return "text-green-400 font-medium";
        return "text-muted-foreground";
    };

    // ─── Shortage stats (last 7 days, negative discrepancy) ──────────────────
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const shortageShifts = shifts.filter(s => {
        const d = new Date(s.startTime);
        return d >= sevenDaysAgo && (s.discrepancy ?? 0) < 0;
    });
    const totalShortageAmount = shortageShifts.reduce((sum, s) => sum + Math.abs(s.discrepancy ?? 0), 0);
    const shortageShiftCount = shortageShifts.length;

    return (
        <DashboardLayout role="owner">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Staff & Shifts</h1>
                        <p className="text-muted-foreground">Manage your employees, roles, and review daily shifts.</p>
                    </div>
                </div>

                <Tabs defaultValue="staff" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                        <TabsTrigger value="staff">Staff Management</TabsTrigger>
                        <TabsTrigger value="shifts">Shift Reviews</TabsTrigger>
                    </TabsList>

                    {/* ── STAFF TAB ─────────────────────────────────────────── */}
                    <TabsContent value="staff" className="space-y-6 mt-6">
                        <div className="flex justify-end">
                            <Dialog open={isAddOpen} onOpenChange={handleOpenChange}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <UserPlus className="h-4 w-4 mr-2" /> Add Staff Member
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{editId ? "Edit Employee Details" : "Add New Employee"}</DialogTitle>
                                        <DialogDescription>
                                            {editId ? "Update access credentials and details" : "Create a profile for a new cashier or driver."}
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
                                                    <SelectItem value="cashier">Cashier</SelectItem>
                                                    <SelectItem value="driver">Driver</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4 border-t pt-4 mt-2">
                                            <h3 className="col-span-4 font-semibold mb-2">Login Credentials</h3>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="username" className="text-right">Username</Label>
                                            <Input
                                                id="username"
                                                className="col-span-3"
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                placeholder="johndoe"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="password" className="text-right">Password</Label>
                                            <Input
                                                id="password"
                                                className="col-span-3"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                placeholder="Secret123!"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="pin" className="text-right">PIN</Label>
                                            <Input
                                                id="pin"
                                                maxLength={4}
                                                className="col-span-3"
                                                value={formData.pin}
                                                onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                                                placeholder="1234 (For POS)"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleAddStaff}>{editId ? "Save Changes" : "Create Account"}</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* ── STAFF CARD GRID ───────────────────────────────── */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <AnimatePresence>
                                {staff.length === 0 ? (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="col-span-full flex flex-col items-center justify-center py-16 rounded-xl border-2 border-dashed border-white/10"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                                            <Users className="h-6 w-6 text-muted-foreground/40" />
                                        </div>
                                        <p className="text-sm font-medium text-foreground/60">No staff members yet</p>
                                        <p className="text-xs text-muted-foreground/40 mt-1">Click "Add Staff Member" to get started</p>
                                    </motion.div>
                                ) : (
                                    staff.map((member, index) => {
                                        const role = getRoleConfig(member.role);
                                        const status = getStatusConfig(member.status || "");

                                        return (
                                            <motion.div
                                                key={member.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.25, delay: index * 0.05 }}
                                                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                                                className="relative rounded-xl overflow-hidden bg-card/60 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-colors duration-300"
                                            >
                                                {/* Role accent bar */}
                                                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${role.bar}`} />

                                                <div className="p-5 pt-6">
                                                    {/* Header: avatar + name + status */}
                                                    <div className="flex items-start gap-3 mb-4">
                                                        {/* Avatar */}
                                                        <div className={`flex-shrink-0 w-11 h-11 rounded-xl border ${role.avatarBg} flex items-center justify-center`}>
                                                            <span className={`text-sm font-bold font-mono ${role.avatarText}`}>
                                                                {getInitials(member.name)}
                                                            </span>
                                                        </div>

                                                        {/* Name + role badge */}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-sm text-foreground truncate leading-tight">
                                                                {member.name}
                                                            </p>
                                                            <div className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full border text-[11px] font-medium ${role.roleBg} ${role.roleText}`}>
                                                                {role.icon}
                                                                <span>{member.role.charAt(0).toUpperCase() + member.role.slice(1)}</span>
                                                            </div>
                                                        </div>

                                                        {/* Status dot */}
                                                        <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
                                                            <span className="relative flex h-2 w-2">
                                                                {status.pulse && (
                                                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${status.dot}`} />
                                                                )}
                                                                <span className={`relative inline-flex h-2 w-2 rounded-full ${status.dot}`} />
                                                            </span>
                                                            <span className={`text-[11px] font-medium ${status.text}`}>
                                                                {member.status || "Unknown"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Email row */}
                                                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5 mb-4">
                                                        <span className="text-xs text-muted-foreground font-mono truncate">
                                                            {member.email || "—"}
                                                        </span>
                                                    </div>

                                                    {/* Credentials block */}
                                                    <div className="rounded-lg bg-black/30 border border-white/5 px-3 pt-2.5 pb-3 mb-4">
                                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-mono mb-2">
                                                            Credentials
                                                        </p>
                                                        <div className="space-y-1.5 font-mono">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">User</span>
                                                                <span className="text-xs text-foreground/80">{member.username || "—"}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Pass</span>
                                                                <span className="text-xs text-foreground/80">
                                                                    {(member as StaffMember).password ? "••••••••" : "—"}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">PIN</span>
                                                                <span className="text-xs text-foreground/80">
                                                                    {member.pin ? "••••" : "—"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Joined */}
                                                    <p className="text-[11px] text-muted-foreground/50 mb-4">
                                                        Member since {formatJoined(member.joined)}
                                                    </p>

                                                    {/* Actions */}
                                                    <div className="flex gap-2 pt-3 border-t border-white/5">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="flex-1 h-8 text-xs border border-white/10 hover:border-white/25 hover:bg-white/5"
                                                            onClick={() => handleEditClick(member)}
                                                        >
                                                            Edit Details
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="flex-1 h-8 text-xs border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/35"
                                                            onClick={() => deleteStaff(member.id)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </AnimatePresence>
                        </div>
                    </TabsContent>

                    {/* ── SHIFTS TAB ────────────────────────────────────────── */}
                    <TabsContent value="shifts" className="space-y-6 mt-6">
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                                    <Wallet className="h-4 w-4 text-amber-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{shifts.filter(s => s.status === 'Pending').length}</div>
                                    <p className="text-xs text-muted-foreground">Shifts waiting for approval</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Flagged Shifts</CardTitle>
                                    <Flag className="h-4 w-4 text-red-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{shifts.filter(s => s.status === 'Flagged').length}</div>
                                    <p className="text-xs text-muted-foreground">Requires immediate attention</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Total Shortage</CardTitle>
                                    <span className="text-red-500 text-sm font-bold">
                                        {totalShortageAmount > 0 ? `-R ${totalShortageAmount.toFixed(2)}` : "R 0.00"}
                                    </span>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{shortageShiftCount} {shortageShiftCount === 1 ? "Shift" : "Shifts"}</div>
                                    <p className="text-xs text-muted-foreground">Impacted by shortages (7 Days)</p>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Shifts</CardTitle>
                                <CardDescription>Review and approve end-of-day till declarations.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Shift ID</TableHead>
                                            <TableHead>Cashier</TableHead>
                                            <TableHead>Date / Time</TableHead>
                                            <TableHead className="text-right">System Expected</TableHead>
                                            <TableHead className="text-right">Actual Count</TableHead>
                                            <TableHead className="text-right">Variance</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {shifts.map((shift) => (
                                            <TableRow key={shift.id}>
                                                <TableCell className="font-medium">{shift.id}</TableCell>
                                                <TableCell>{shift.cashierName}</TableCell>
                                                <TableCell>{new Date(shift.endTime || shift.startTime).toLocaleString('en-ZA')}</TableCell>
                                                <TableCell className="text-right">R {(shift.totalSales + shift.openingFloat).toFixed(2)}</TableCell>
                                                <TableCell className="text-right font-medium">R {(shift.closingCash || 0).toFixed(2)}</TableCell>
                                                <TableCell className={`text-right ${getShiftVarianceColor(shift.discrepancy || 0)}`}>
                                                    {(shift.discrepancy && shift.discrepancy > 0) ? '+' : ''}R {(shift.discrepancy || 0).toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={getShiftStatusColor(shift.status)}>
                                                        {shift.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {shift.status === 'Pending' && (
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 border-green-500/20 hover:bg-green-500/10 hover:text-green-400"
                                                                onClick={() => handleShiftAction(shift.id, 'Resolved')}
                                                            >
                                                                <Check className="h-4 w-4 mr-1" /> Accept
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 border-red-500/20 hover:bg-red-500/10 text-red-400 hover:text-red-300"
                                                                onClick={() => handleShiftAction(shift.id, 'Flagged')}
                                                            >
                                                                <Flag className="h-4 w-4 mr-1" /> Flag
                                                            </Button>
                                                        </div>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
};

export default OwnerStaff;
