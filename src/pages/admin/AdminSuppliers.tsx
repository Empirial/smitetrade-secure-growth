import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Briefcase, Trash2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { toast } from "sonner";
import { USE_MOCK_DATA } from "@/lib/constants";
import { PlatformSupplier } from "@/types";

const MOCK_PLATFORM_SUPPLIERS: PlatformSupplier[] = [
    { id: "ps1", name: "Unilever SA", status: "Active", createdAt: new Date().toISOString() },
    { id: "ps2", name: "Pioneer Foods", status: "Active", createdAt: new Date().toISOString() },
    { id: "ps3", name: "Tiger Brands", status: "Active", createdAt: new Date().toISOString() },
    { id: "ps4", name: "Clover SA", status: "Active", createdAt: new Date().toISOString() },
];

const AdminSuppliers = () => {
    const [suppliers, setSuppliers] = useState<PlatformSupplier[]>([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (USE_MOCK_DATA) {
            setSuppliers(MOCK_PLATFORM_SUPPLIERS);
            return;
        }
        const unsub = onSnapshot(collection(db, "platform_suppliers"), (snap) => {
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as PlatformSupplier[];
            setSuppliers(data);
        });
        return unsub;
    }, []);

    const handleAdd = async () => {
        if (!newName.trim()) return;
        setIsSubmitting(true);
        try {
            if (USE_MOCK_DATA) {
                setSuppliers(prev => [...prev, {
                    id: `ps${Date.now()}`,
                    name: newName.trim(),
                    status: "Active",
                    createdAt: new Date().toISOString(),
                }]);
            } else {
                await addDoc(collection(db, "platform_suppliers"), {
                    name: newName.trim(),
                    status: "Active",
                    createdAt: new Date().toISOString(),
                });
            }
            toast.success(`${newName.trim()} added to platform suppliers`);
            setNewName("");
            setIsAddOpen(false);
        } catch {
            toast.error("Failed to add supplier");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (supplier: PlatformSupplier) => {
        try {
            if (USE_MOCK_DATA) {
                setSuppliers(prev => prev.filter(s => s.id !== supplier.id));
            } else {
                await deleteDoc(doc(db, "platform_suppliers", supplier.id));
            }
            toast.success(`${supplier.name} removed`);
        } catch {
            toast.error("Failed to remove supplier");
        }
    };

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Platform Suppliers</h1>
                        <p className="text-muted-foreground">
                            Manage suppliers visible to all store owners across the platform.
                        </p>
                    </div>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Supplier
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Platform Supplier</DialogTitle>
                                <DialogDescription>
                                    This supplier will be visible to all store owners on SmiteTrade.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="supplier_name">Supplier Name</Label>
                                    <Input
                                        id="supplier_name"
                                        placeholder="e.g. Unilever SA"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    onClick={handleAdd}
                                    disabled={!newName.trim() || isSubmitting}
                                >
                                    {isSubmitting ? "Adding..." : "Add Supplier"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Supplier Directory</CardTitle>
                        <CardDescription>
                            {suppliers.length} platform supplier{suppliers.length !== 1 ? "s" : ""} registered
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {suppliers.length === 0 ? (
                            <div className="text-center py-16 text-muted-foreground">
                                <Briefcase className="mx-auto h-12 w-12 mb-4 opacity-20" />
                                <p className="font-medium">No platform suppliers yet</p>
                                <p className="text-sm mt-1">Add suppliers above — they'll appear on every owner's Suppliers page.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Supplier Name</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date Added</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {suppliers.map((supplier) => (
                                        <TableRow key={supplier.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                        <Briefcase className="h-4 w-4 text-primary" />
                                                    </div>
                                                    {supplier.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={supplier.status === "Active" ? "default" : "secondary"}>
                                                    {supplier.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {new Date(supplier.createdAt).toLocaleDateString("en-ZA")}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleDelete(supplier)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default AdminSuppliers;
