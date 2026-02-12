import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, Plus, Filter, X, Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/context/StoreContext";

const categories = ["All", "Staples", "Pantry", "Beverages", "Dairy", "Bakery", "Household"];

const CustomerProducts = () => {
    // Access Global State
    const { products, addToCart, cart, isLoading } = useStore();

    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [sortOrder, setSortOrder] = useState("default");

    // Derived State: Cart Count
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Filter Logic
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === "All" || product.category === activeCategory;
        const inStock = product.status !== "Out of Stock"; // Only show active items
        return matchesSearch && matchesCategory && inStock;
    });

    // Sort Logic
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortOrder === "price-asc") return a.price - b.price;
        if (sortOrder === "price-desc") return b.price - a.price;
        if (sortOrder === "name-asc") return a.name.localeCompare(b.name);
        return 0; // default
    });

    return (
        <DashboardLayout role="customer">
            <div className="flex flex-col gap-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Shop</h1>
                        <p className="text-muted-foreground">Order essentials from your local Spaza</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Link to="/customer/cart">
                            <Button variant="default" className="relative">
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Cart
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center border-2 border-background">
                                        {cartCount}
                                    </span>
                                )}
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Controls Section */}
                <div className="flex flex-col gap-4 bg-muted/30 p-4 rounded-xl border">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                className="pl-9 bg-background"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        <div className="w-full md:w-48">
                            <Select value={sortOrder} onValueChange={setSortOrder}>
                                <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Sort By" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">Featured</SelectItem>
                                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                                    <SelectItem value="name-asc">Name: A - Z</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Category Pills */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`
                                    px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                                    ${activeCategory === cat
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "bg-background border hover:bg-muted"
                                    }
                                `}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <Card key={i} className="overflow-hidden">
                                <div className="aspect-square bg-muted flex items-center justify-center">
                                    <Skeleton className="h-full w-full" />
                                </div>
                                <CardHeader className="p-4 pb-0 space-y-2">
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-4 w-3/4" />
                                </CardHeader>
                                <CardContent className="p-4 pt-2">
                                    <Skeleton className="h-6 w-1/3" />
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                    <Skeleton className="h-9 w-full" />
                                </CardFooter>
                            </Card>
                        ))
                    ) : sortedProducts.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <Filter className="h-12 w-12 mb-4 opacity-20" />
                            <p className="text-lg font-medium">No products found</p>
                            <p className="text-sm">Try adjusting your filters or search terms</p>
                            <Button
                                variant="link"
                                onClick={() => { setSearch(""); setActiveCategory("All"); }}
                                className="mt-2"
                            >
                                Clear all filters
                            </Button>
                        </div>
                    ) : (
                        sortedProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <Card className="overflow-hidden hover:shadow-md transition-shadow group h-full flex flex-col">
                                    <div className="aspect-square bg-white flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
                                        {product.image}
                                    </div>
                                    <CardHeader className="p-4 pb-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                                                {product.category}
                                            </Badge>
                                            {product.status === "Low Stock" && (
                                                <Badge variant="destructive" className="text-[10px] h-5 px-1.5 bg-orange-500">
                                                    Low Stock
                                                </Badge>
                                            )}
                                        </div>
                                        <CardTitle className="text-base font-medium line-clamp-1" title={product.name}>
                                            {product.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-2 flex-1">
                                        <p className="font-bold text-lg text-primary">R {product.price.toFixed(2)}</p>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0 flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="shrink-0"
                                            onClick={() => {
                                                // Mock Wishlist Add
                                                import("sonner").then(({ toast }) => toast.success("Added to Wishlist"));
                                            }}
                                        >
                                            <Heart className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                                            size="sm"
                                            onClick={() => addToCart(product)}
                                        >
                                            <Plus className="h-4 w-4 mr-2" /> Add to Cart
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CustomerProducts;
