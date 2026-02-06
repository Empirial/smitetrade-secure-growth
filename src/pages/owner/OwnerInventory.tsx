import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Package } from "lucide-react";
import { useState } from "react";

// Mock data
const initialProducts = [
    { id: 1, name: "Brown Bread 700g", price: 18.00, category: "Bakery", stock: 45, status: "In Stock" },
    { id: 2, name: "Full Cream Milk 2L", price: 28.00, category: "Dairy", stock: 12, status: "Low Stock" },
    { id: 3, name: "Coca Cola 1.5L", price: 22.00, category: "Beverages", stock: 100, status: "In Stock" },
    { id: 4, name: "Maize Meal 5kg", price: 55.00, category: "Staples", stock: 8, status: "Low Stock" },
    { id: 5, name: "White Sugar 2kg", price: 38.00, category: "Pantry", stock: 3, status: "Critical" },
    { id: 6, name: "Cooking Oil 750ml", price: 45.00, category: "Pantry", stock: 20, status: "In Stock" },
    { id: 7, name: "Airtime R10", price: 10.00, category: "Services", stock: 999, status: "In Stock" },
    { id: 8, name: "Lays Chips 120g", price: 19.00, category: "Snacks", stock: 0, status: "Out of Stock" },
];

const OwnerInventory = () => {
    const [products, setProducts] = useState(initialProducts);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Form state for add/edit
    const [formData, setFormData] = useState({ name: "", category: "", price: "", stock: "" });

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case "In Stock": return "bg-green-100 text-green-800";
            case "Low Stock": return "bg-yellow-100 text-yellow-800";
            case "Critical": return "bg-orange-100 text-orange-800";
            case "Out of Stock": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const handleAddProduct = () => {
        const newProduct = {
            id: products.length + 1,
            name: formData.name,
            category: formData.category,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            status: parseInt(formData.stock) > 20 ? "In Stock" : parseInt(formData.stock) > 5 ? "Low Stock" : parseInt(formData.stock) > 0 ? "Critical" : "Out of Stock"
        };
        setProducts([...products, newProduct]);
        setIsAddOpen(false);
        setFormData({ name: "", category: "", price: "", stock: "" });
    };

    const handleDelete = (id: number) => {
        setProducts(products.filter(p => p.id !== id));
    };

    return (
        <DashboardLayout role="owner">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
                        <p className="text-muted-foreground">Manage your products, stock levels, and pricing.</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <DialogTrigger asChild>
                                <Button className="w-full md:w-auto">
                                    <Plus className="h-4 w-4 mr-2" /> Add Product
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Product</DialogTitle>
                                    <DialogDescription>
                                        Enter the details of the new item to add to your shop's inventory.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">Name</Label>
                                        <Input
                                            id="name"
                                            className="col-span-3"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="category" className="text-right">Category</Label>
                                        <Input
                                            id="category"
                                            className="col-span-3"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="price" className="text-right">Price (R)</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            className="col-span-3"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="stock" className="text-right">Stock</Label>
                                        <Input
                                            id="stock"
                                            type="number"
                                            className="col-span-3"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleAddProduct}>Save Product</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Current Stock</CardTitle>
                                <CardDescription>Overview of all items currently in your shop.</CardDescription>
                            </div>
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search products..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock Level</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium flex items-center gap-2">
                                            <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                                                <Package className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            {product.name}
                                        </TableCell>
                                        <TableCell>{product.category}</TableCell>
                                        <TableCell>R {product.price.toFixed(2)}</TableCell>
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getStatusColor(product.status)}>
                                                {product.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive"
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
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

export default OwnerInventory;
