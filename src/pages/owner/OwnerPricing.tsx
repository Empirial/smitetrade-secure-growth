
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/context/StoreContext";
import { useState } from "react";
import { Edit2, Percent, Clock } from "lucide-react";

const OwnerPricing = () => {
    const { products } = useStore();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="owner">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Pricing & Promotions</h1>
                    <p className="text-muted-foreground">Manage product prices, discounts, and special offers.</p>
                </div>

                <Tabs defaultValue="products">
                    <TabsList>
                        <TabsTrigger value="products">Product Pricing</TabsTrigger>
                        <TabsTrigger value="combos">Combo Deals</TabsTrigger>
                        <TabsTrigger value="timed">Time-Based Specials</TabsTrigger>
                    </TabsList>

                    <TabsContent value="products" className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Input
                                placeholder="Search products..."
                                className="max-w-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Product List</CardTitle>
                                <CardDescription>Update selling prices and cost prices.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product Name</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Current Price</TableHead>
                                            <TableHead>Cost Price</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredProducts.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell className="font-medium">{product.name}</TableCell>
                                                <TableCell>{product.category}</TableCell>
                                                <TableCell>R {product.price.toFixed(2)}</TableCell>
                                                <TableCell className="text-muted-foreground">R {(product.price * 0.7).toFixed(2)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm">
                                                        <Edit2 className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="combos" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Active Combo Deals</CardTitle>
                                <CardDescription>Bundle products together for a discount.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                                <Percent className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium">No combo deals active</h3>
                                <p className="text-sm text-muted-foreground mb-4">Create your first combo deal to boost sales.</p>
                                <Button>Create Combo</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="timed" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Happy Hour & Specials</CardTitle>
                                <CardDescription>Set automatic price changes based on time of day.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium">No timed specials active</h3>
                                <p className="text-sm text-muted-foreground mb-4">Schedule price reductions for off-peak hours.</p>
                                <Button>Schedule Special</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
};

export default OwnerPricing;
