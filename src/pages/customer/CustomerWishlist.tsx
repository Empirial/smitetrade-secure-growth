import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { useStore } from "@/context/StoreContext";
import { toast } from "sonner"; // Ensure toast is imported if used directly or use from store if desired, but store handles toggles.

const CustomerWishlist = () => {
    const { user, products, toggleWishlist, addToCart } = useStore();

    // Filter products that are in the user's wishlist
    const wishlistItems = products.filter(p => user?.wishlist?.includes(p.id));

    return (
        <DashboardLayout role="customer">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
                    <p className="text-muted-foreground">Saved items for future purchases.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {wishlistItems.map((item) => (
                        <Card key={item.id} className="overflow-hidden group">
                            <div className="h-48 bg-slate-100 flex items-center justify-center relative">
                                <Heart className="h-12 w-12 text-slate-300 fill-red-500 absolute top-4 right-4 animate-pulse" />
                                <span className="text-4xl">{item.image}</span>
                            </div>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold truncate">{item.name}</h3>
                                        <p className="text-sm text-muted-foreground">{item.status}</p>
                                    </div>
                                    <Badge variant="outline" className="font-mono">R {item.price.toFixed(2)}</Badge>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => toggleWishlist(item.id)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" /> Remove
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                        onClick={() => addToCart(item)}
                                    >
                                        <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {wishlistItems.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium text-muted-foreground">Your wishlist is empty</h3>
                            <Link to="/customer/products">
                                <Button className="mt-4">Browse Products</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CustomerWishlist;
