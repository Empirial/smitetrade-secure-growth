import DashboardLayout from "@/components/DashboardLayout";
import CreditComingSoon from "@/components/CreditComingSoon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, X, Store, MapPin, Truck, Package, Minus, Calendar, CreditCard, Banknote, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useStore } from "@/context/StoreContext";
import { useCredit } from "@/context/CreditContext";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { USE_MOCK_DATA } from "@/lib/constants";
import {
    getSavedLocation,
    haversineDistance,
    geocodeAddress,
    getCachedStoreCoords,
    cacheStoreCoords,
    type SavedLocation,
} from "@/utils/locationUtils";

const categories = ["All", "Staples", "Pantry", "Beverages", "Dairy", "Bakery", "Household"];
const popularSearches = ["Bread", "Milk", "Maize Meal", "Sugar", "Cooking Oil", "Airtime"];

const FULFILLMENT_LABELS: Record<string, string> = {
    pep_courier: "Pep Courier",
    courier: "Courier",
    instore_delivery: "In-Store Delivery",
    pickup: "Pickup",
};

const DELIVERY_OPTIONS = ["pep_courier", "courier", "instore_delivery"];


const CustomerProducts = () => {
    const { allProducts, addToCart, isLoading, stores, user } = useStore();
    const { profile } = useCredit();

    // Wallet balance derived from credit profile (available credit = creditLimit - balance)
    const walletBalance = profile ? (profile.creditLimit - profile.balance) : 0;

    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [sortOrder, setSortOrder] = useState("default");
    const [selectedStore, setSelectedStore] = useState("all");
    const [fulfillmentFilter, setFulfillmentFilter] = useState("all");

    // Location state
    const [customerLocation, setCustomerLocation] = useState<SavedLocation | null>(null);
    const [storeCoords, setStoreCoords] = useState<Record<string, { lat: number; lng: number }>>({});

    // Pre-order state
    const [preorderProduct, setPreorderProduct] = useState<any>(null);
    const [preorderOpen, setPreorderOpen] = useState(false);
    const [preorderStep, setPreorderStep] = useState(1);
    const [preorderQty, setPreorderQty] = useState(1);
    const [preorderDate, setPreorderDate] = useState("");
    const [preorderPayment, setPreorderPayment] = useState("card");
    const [isPlacingPreorder, setIsPlacingPreorder] = useState(false);

    useEffect(() => {
        setCustomerLocation(getSavedLocation());
    }, []);

    useEffect(() => {
        if (!stores.length) return;
        const load = async () => {
            const coords: Record<string, { lat: number; lng: number }> = {};
            for (const store of stores) {
                if (store.lat && store.lng) {
                    coords[store.id] = { lat: store.lat, lng: store.lng };
                    continue;
                }
                const cached = getCachedStoreCoords(store.id);
                if (cached) { coords[store.id] = cached; continue; }
                const query = [store.suburb, store.city, store.province].filter(Boolean).join(", ");
                if (query) {
                    const result = await geocodeAddress(query);
                    if (result) { coords[store.id] = result; cacheStoreCoords(store.id, result.lat, result.lng); }
                }
            }
            setStoreCoords(coords);
        };
        load();
    }, [stores]);

    const availableStores = stores.filter(s => s.status === "Active");

    // Include out-of-stock products so they can be pre-ordered
    const filteredProducts = allProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === "All" || product.category === activeCategory;
        const matchesStore = selectedStore === "all" || product.storeId === selectedStore;
        const opts = product.fulfillmentOptions;
        const matchesFulfillment =
            fulfillmentFilter === "all" ||
            (!!opts?.length && (
                (fulfillmentFilter === "delivery" && opts.some(o => DELIVERY_OPTIONS.includes(o))) ||
                (fulfillmentFilter === "pickup" && opts.includes("pickup"))
            ));
        return matchesSearch && matchesCategory && matchesStore && matchesFulfillment;
    });

    const getDistance = (storeId?: string): number => {
        if (!customerLocation || !storeId || !storeCoords[storeId]) return Infinity;
        const s = storeCoords[storeId];
        return haversineDistance(customerLocation.lat, customerLocation.lng, s.lat, s.lng);
    };

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortOrder === "nearest") return getDistance(a.storeId) - getDistance(b.storeId);
        if (sortOrder === "price-asc") return a.price - b.price;
        if (sortOrder === "price-desc") return b.price - a.price;
        if (sortOrder === "name-asc") return a.name.localeCompare(b.name);
        return 0;
    });

    // Pre-order handlers
    const openPreorder = (product: any) => {
        setPreorderProduct(product);
        setPreorderQty(1);
        setPreorderDate("");
        setPreorderPayment("card");
        setPreorderStep(1);
        setPreorderOpen(true);
    };

    const handlePlacePreorder = async () => {
        if (!preorderProduct || !preorderDate) return;
        const total = preorderProduct.price * preorderQty;

        if (preorderPayment === "wallet" && total > walletBalance) {
            toast.error("Insufficient wallet balance.");
            return;
        }
        if (preorderPayment === "credit" && profile && total > (profile.creditLimit - profile.balance)) {
            toast.error("Insufficient credit limit.");
            return;
        }

        setIsPlacingPreorder(true);
        const orderData = {
            customerName: user?.name || "Customer",
            customerAddress: user?.profileDetails?.defaultAddress || "To be confirmed",
            items: [{ id: preorderProduct.id, name: preorderProduct.name, quantity: preorderQty, price: preorderProduct.price }],
            total,
            status: "Pre-order",
            date: new Date().toISOString(),
            storeId: preorderProduct.storeId || "",
            storeName: preorderProduct.storeName || "",
            userId: user?.id || user?.uid || "",
            isPreorder: true,
            requestedDate: preorderDate,
            paymentMethod: preorderPayment,
            type: "online",
        };

        try {
            if (!USE_MOCK_DATA) {
                await addDoc(collection(db, "orders"), orderData);
            }
            toast.success(`Pre-order placed for ${preorderProduct.name}!`, {
                description: `Requested for ${new Date(preorderDate + "T00:00:00").toLocaleDateString("en-ZA")}. The owner will confirm the delivery date.`,
            });
            setPreorderOpen(false);
        } catch {
            toast.error("Failed to place pre-order. Please try again.");
        } finally {
            setIsPlacingPreorder(false);
        }
    };

    const preorderTotal = preorderProduct ? preorderProduct.price * preorderQty : 0;
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    const minDateStr = minDate.toISOString().split("T")[0];

    return (
        <DashboardLayout role="customer">
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Shop</h1>
                        <p className="text-muted-foreground">Browse products from local Spaza shops near you</p>
                    </div>
                </div>

                {/* Location Alert Banner */}
                {!customerLocation && (
                    <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 text-amber-700 rounded-xl px-4 py-3 text-sm">
                        <MapPin className="h-4 w-4 shrink-0 text-amber-500" />
                        <span>
                            Set your location to see products from the closest stores first.{" "}
                            <Link to="/customer/profile" className="font-semibold underline underline-offset-2">
                                Set location →
                            </Link>
                        </span>
                    </div>
                )}

                {/* Controls */}
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
                                <button onClick={() => setSearch("")} className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground">
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        <div className="w-full md:w-48">
                            <Select value={selectedStore} onValueChange={setSelectedStore}>
                                <SelectTrigger className="bg-background"><SelectValue placeholder="All Stores" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Stores</SelectItem>
                                    {availableStores.map(store => (
                                        <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full md:w-52">
                            <Select value={sortOrder} onValueChange={setSortOrder}>
                                <SelectTrigger className="bg-background"><SelectValue placeholder="Sort By" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">Featured</SelectItem>
                                    {customerLocation && <SelectItem value="nearest">Nearest First</SelectItem>}
                                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                                    <SelectItem value="name-asc">Name: A - Z</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Popular Searches */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 pb-2 border-b border-dashed mb-1">
                        <span className="text-xs text-muted-foreground mr-1">Popular:</span>
                        {popularSearches.map(term => (
                            <button key={term} onClick={() => setSearch(term)} className="text-xs bg-muted hover:bg-emerald-500/20 hover:text-emerald-400 px-2.5 py-1 rounded-full border transition-colors">
                                {term}
                            </button>
                        ))}
                    </div>

                    {/* Category Pills */}
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground shadow-sm" : "bg-background border hover:bg-muted"}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Fulfillment Filter Pills */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-muted-foreground">Fulfillment:</span>
                        {[
                            { value: "all", label: "All", icon: null },
                            { value: "delivery", label: "Delivery", icon: <Truck className="h-3 w-3" /> },
                            { value: "pickup", label: "Pickup", icon: <Package className="h-3 w-3" /> },
                        ].map(f => (
                            <button
                                key={f.value}
                                onClick={() => setFulfillmentFilter(f.value)}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${fulfillmentFilter === f.value ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted"}`}
                            >
                                {f.icon}{f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <Card key={i} className="overflow-hidden">
                                <CardHeader className="p-4 pb-0 space-y-2"><Skeleton className="h-4 w-1/2" /><Skeleton className="h-4 w-3/4" /></CardHeader>
                                <CardContent className="p-4 pt-2"><Skeleton className="h-6 w-1/3" /></CardContent>
                                <CardFooter className="p-4 pt-0"><Skeleton className="h-9 w-full" /></CardFooter>
                            </Card>
                        ))
                    ) : sortedProducts.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <Filter className="h-12 w-12 mb-4 opacity-20" />
                            <p className="text-lg font-medium">No products found</p>
                            <p className="text-sm">Try adjusting your filters or search terms</p>
                            <Button variant="link" onClick={() => { setSearch(""); setActiveCategory("All"); setSelectedStore("all"); setFulfillmentFilter("all"); }} className="mt-2">
                                Clear all filters
                            </Button>
                        </div>
                    ) : (
                        sortedProducts.map((product, index) => {
                            const dist = getDistance(product.storeId);
                            const isOutOfStock = product.status === "Out of Stock";
                            const hasDelivery = product.fulfillmentOptions?.some(o => DELIVERY_OPTIONS.includes(o));
                            const hasPickup = product.fulfillmentOptions?.includes("pickup");

                            return (
                                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                                    <Card className={`overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col ${isOutOfStock ? "opacity-80" : ""}`}>
                                        <CardHeader className="p-4 pb-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <Badge variant="secondary" className="text-[10px] h-5 px-1.5">{product.category}</Badge>
                                                {isOutOfStock ? (
                                                    <Badge className="text-[10px] h-5 px-1.5 bg-purple-500/10 text-purple-600 border-purple-200">Pre-order</Badge>
                                                ) : product.status === "Low Stock" ? (
                                                    <Badge variant="destructive" className="text-[10px] h-5 px-1.5 bg-orange-500">Low Stock</Badge>
                                                ) : null}
                                            </div>
                                            <CardTitle className="text-base font-medium line-clamp-1" title={product.name}>{product.name}</CardTitle>
                                            {product.storeName && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Store className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-[11px] text-muted-foreground truncate">{product.storeName}</span>
                                                    {dist !== Infinity && (
                                                        <span className="text-[10px] text-emerald-500 ml-auto shrink-0">
                                                            {dist < 1 ? `${(dist * 1000).toFixed(0)}m` : `${dist.toFixed(1)}km`}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </CardHeader>
                                        <CardContent className="p-4 pt-2 flex-1">
                                            <p className="font-bold text-lg text-primary">R {product.price.toFixed(2)}</p>
                                            {(hasDelivery || hasPickup) && (
                                                <div className="flex flex-wrap gap-1 mt-1.5">
                                                    {hasDelivery && (
                                                        <span className="inline-flex items-center gap-0.5 text-[10px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded">
                                                            <Truck className="h-2.5 w-2.5" /> Delivery
                                                        </span>
                                                    )}
                                                    {hasPickup && (
                                                        <span className="inline-flex items-center gap-0.5 text-[10px] bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded">
                                                            <Package className="h-2.5 w-2.5" /> Pickup
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </CardContent>
                                        <CardFooter className="p-4 pt-0 flex flex-col gap-2">
                                            {isOutOfStock ? (
                                                <Button
                                                    className="w-full bg-purple-600 hover:bg-purple-700"
                                                    size="sm"
                                                    onClick={() => openPreorder(product)}
                                                >
                                                    <Calendar className="h-4 w-4 mr-2" /> Pre-order
                                                </Button>
                                            ) : (
                                                <>
                                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700" size="sm" onClick={() => addToCart(product)}>
                                                        <Plus className="h-4 w-4 mr-2" /> Add to Cart
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50" onClick={() => openPreorder(product)}>
                                                        <Calendar className="h-3 w-3 mr-1.5" /> Pre-order
                                                    </Button>
                                                </>
                                            )}
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Pre-order Dialog */}
            <Dialog open={preorderOpen} onOpenChange={(open) => { if (!open) setPreorderOpen(false); }}>
                <DialogContent className="w-full max-w-[95vw] sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-purple-600" />
                            Pre-order — {preorderProduct?.name}
                        </DialogTitle>
                        <DialogDescription>
                            {preorderStep === 1
                                ? "Choose quantity and your requested date. The owner will confirm actual delivery."
                                : "Confirm and pay upfront to secure your pre-order."}
                        </DialogDescription>
                    </DialogHeader>

                    {preorderStep === 1 ? (
                        <div className="space-y-5 py-2">
                            {/* Quantity */}
                            <div className="space-y-2">
                                <Label>Quantity</Label>
                                <div className="flex items-center gap-3">
                                    <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setPreorderQty(q => Math.max(1, q - 1))}>
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-10 text-center font-semibold text-lg">{preorderQty}</span>
                                    <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setPreorderQty(q => q + 1)}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                    <span className="text-sm text-muted-foreground ml-2">× R {preorderProduct?.price.toFixed(2)} = <strong>R {preorderTotal.toFixed(2)}</strong></span>
                                </div>
                            </div>

                            {/* Requested Date */}
                            <div className="space-y-2">
                                <Label htmlFor="preorder-date">Requested Date</Label>
                                <Input
                                    id="preorder-date"
                                    type="date"
                                    min={minDateStr}
                                    value={preorderDate}
                                    onChange={(e) => setPreorderDate(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">This is your preferred date. The owner sets the final delivery date.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-5 py-2">
                            {/* Order summary */}
                            <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Product</span>
                                    <span className="font-medium">{preorderProduct?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Quantity</span>
                                    <span className="font-medium">{preorderQty}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Requested Date</span>
                                    <span className="font-medium">{new Date(preorderDate + "T00:00:00").toLocaleDateString("en-ZA")}</span>
                                </div>
                                <div className="flex justify-between border-t pt-2 mt-1">
                                    <span className="font-bold">Total (upfront)</span>
                                    <span className="font-bold text-primary">R {preorderTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Payment method */}
                            <div className="space-y-2">
                                <Label>Payment Method</Label>
                                <RadioGroup value={preorderPayment} onValueChange={setPreorderPayment} className="space-y-2">
                                    <div className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer has-[:checked]:border-primary">
                                        <RadioGroupItem value="card" id="po-card" />
                                        <Label htmlFor="po-card" className="flex items-center gap-2 cursor-pointer font-normal">
                                            <CreditCard className="h-4 w-4" /> Card (PayFast)
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer has-[:checked]:border-primary">
                                        <RadioGroupItem value="wallet" id="po-wallet" />
                                        <Label htmlFor="po-wallet" className="flex items-center gap-2 cursor-pointer font-normal">
                                            <Wallet className="h-4 w-4" /> Spaza Wallet
                                            <span className="ml-auto text-xs text-muted-foreground">R {walletBalance.toFixed(2)}</span>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="flex gap-2">
                        {preorderStep === 1 ? (
                            <>
                                <Button variant="outline" onClick={() => setPreorderOpen(false)}>Cancel</Button>
                                <Button
                                    className="bg-purple-600 hover:bg-purple-700"
                                    disabled={!preorderDate}
                                    onClick={() => setPreorderStep(2)}
                                >
                                    Next — Payment →
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="outline" onClick={() => setPreorderStep(1)}>← Back</Button>
                                <Button
                                    className="bg-purple-600 hover:bg-purple-700"
                                    disabled={isPlacingPreorder}
                                    onClick={handlePlacePreorder}
                                >
                                    {isPlacingPreorder ? "Placing..." : `Pay R ${preorderTotal.toFixed(2)} & Pre-order`}
                                </Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default CustomerProducts;
