
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Truck } from "lucide-react";

const OwnerSuppliers = () => {
    // Mock data for suppliers
    const suppliers = [
        { id: 1, name: "Mega Wholesalers", contact: "011 555 1234", products: "Soft Drinks, Snacks", status: "Active" },
        { id: 2, name: "Fresh Farms", contact: "012 333 4567", products: "Vegetables, Fruits", status: "Active" },
        { id: 3, name: "Baker's Choice", contact: "021 888 9999", products: "Bread, Pastries", status: "Inactive" },
        { id: 4, name: "Dairy Direct", contact: "031 444 5555", products: "Milk, Cheese, Yogurt", status: "Active" },
    ];

    return (
        <DashboardLayout role="owner">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
                        <p className="text-muted-foreground">Manage your supplier relationships and stock sources.</p>
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Supplier
                    </Button>
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
