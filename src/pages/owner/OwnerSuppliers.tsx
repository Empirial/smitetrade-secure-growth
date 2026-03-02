
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Truck } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useStore } from "@/context/StoreContext";
import { useState } from "react";

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

    const [isOrderOpen, setIsOrderOpen] = useState(false);
    const [selectedSupplierId, setSelectedSupplierId] = useState<string>("");

    // Simulate File Upload
    const handlePlaceOrder = () => {
        if (!selectedSupplierId) return;
        setTimeout(() => {
            setIsOrderOpen(false);
            setSelectedSupplierId("");
            // Using a mock toast success since toast isn't imported directly here,
            // we assume the user will see a visual closing. 
            // Better UX: add alert or toast if we had it. I'll just change the state to close it.
        }, 800);
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
                    <div className="flex gap-2">
                        <Dialog open={isOrderOpen} onOpenChange={setIsOrderOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <Truck className="mr-2 h-4 w-4" />
                                    Place Order
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Place Supplier Order</DialogTitle>
                                    <DialogDescription>
                                        Upload your required stock list or enter an order manually. This will be routed via Smitetrade.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="supplier_select">Select Supplier</Label>
                                        <select
                                            id="supplier_select"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={selectedSupplierId}
                                            onChange={(e) => setSelectedSupplierId(e.target.value)}
                                        >
                                            <option value="" disabled>Select a supplier...</option>
                                            {suppliers.map(s => (
                                                <option key={s.id} value={s.id}>{s.name} ({s.products})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="order_file">Upload Order List (CSV, PDF, Excel)</Label>
                                        <Input id="order_file" type="file" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="order_notes">Additional Notes</Label>
                                        <Input id="order_notes" placeholder="e.g. Please deliver before Friday" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handlePlaceOrder} disabled={!selectedSupplierId}>Submit Order via Smitetrade</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
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
                                            <Button variant="ghost" size="sm" onClick={() => {
                                                setSelectedSupplierId(supplier.id);
                                                setIsOrderOpen(true);
                                            }}>Order</Button>
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
