import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const products = [
    { id: 1, name: "Maize Meal 10kg", price: 120.00, image: "🌽" },
    { id: 2, name: "Cooking Oil 2L", price: 85.00, image: "🌻" },
    { id: 3, name: "White Sugar 2kg", price: 45.00, image: "🍬" },
    { id: 4, name: "Tea Bags 100s", price: 35.00, image: "☕" },
    { id: 5, name: "Full Cream Milk 1L", price: 18.00, image: "🥛" },
    { id: 6, name: "Brown Bread", price: 16.00, image: "🍞" },
];

const CustomerProducts = () => {
    return (
        <DashboardLayout role="customer">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Shop</h1>
                        <p className="text-muted-foreground">Order essentials from your local Spaza</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search products..." className="pl-8" />
                        </div>
                        <Link to="/customer/cart">
                            <Button variant="outline" className="relative">
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Cart
                                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary" />
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                        <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <div className="aspect-square bg-muted flex items-center justify-center text-4xl">
                                {product.image}
                            </div>
                            <CardHeader className="p-4 pb-0">
                                <CardTitle className="text-base font-medium line-clamp-1">{product.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                                <p className="font-bold">R {product.price.toFixed(2)}</p>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                                <Button className="w-full" size="sm">
                                    <Plus className="h-4 w-4 mr-2" /> Add
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CustomerProducts;
