
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Truck } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useStore } from "@/context/StoreContext";

const OwnerSuppliers = () => {
    const { suppliers, addSupplier } = useStore();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newSupplier, setNewSupplier] = useState({ name: "", products: "" });

    const handleAddSupplier = () => {
        if (!newSupplier.name || !newSupplier.products) return;
        addSupplier({
            name: newSupplier.name,
            contact: "SMITETRADE: 010 880 3456 | orders@smitetrade.co.za",
            products: newSupplier.products,
        });
        setIsAddOpen(false);
        setNewSupplier({ name: "", products: "" });
    };

    return (
        <DashboardLayout role="owner">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
                        <p className="text-muted-foreground">Manage your supplier relationships and stock sources.</p>
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
                                <DialogTitle>Add New Supplier</DialogTitle>
                                <DialogDescription>Register a new supplier. All orders will be routed via Smitetrade.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Supplier Name</Label>
                                    <Input
                                        id="name"
                                        value={newSupplier.name}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="products">Main Products</Label>
                                    <Input
                                        id="products"
                                        placeholder="e.g. Beverages, Cleaning Supplies"
                                        value={newSupplier.products}
                                        onChange={(e) => setNewSupplier({ ...newSupplier, products: e.target.value })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddSupplier}>Register Supplier</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search suppliers..."
                            className="pl-8"
                        />
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Supplier List</CardTitle>
                        <CardDescription>Directory of all registered suppliers.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Supplier Name</TableHead>
                                    <TableHead>Contact Info</TableHead>
                                    <TableHead>Main Products</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {suppliers.map((supplier) => (
                                    <TableRow key={supplier.id}>
                                        <TableCell className="font-medium flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                <Truck className="h-4 w-4 text-slate-500" />
                                            </div>
                                            {supplier.name}
                                        </TableCell>
                                        <TableCell>{supplier.contact}</TableCell>
                                        <TableCell>{supplier.products}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${supplier.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {supplier.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">Details</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default OwnerSuppliers;
