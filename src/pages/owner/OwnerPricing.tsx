import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/context/StoreContext";
import { useState, useEffect } from "react";
import { Edit2, Percent, Clock, Plus, Tag, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { db } from "@/lib/firebase";
import {
    addDoc, collection, onSnapshot, query, where, orderBy,
    deleteDoc, doc, updateDoc, serverTimestamp
} from "firebase/firestore";

export interface Promotion {
    id: string;
    name: string;
    type: string;
    items: string;
    price: string | number;
    status: string;
    startDate: string;
    endDate: string;
}

interface TimedSpecial {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    discountPercent: string;
}

const OwnerPricing = () => {
    const { products, user, updateProduct } = useStore();
    const { toast } = useToast();
    const storeId = user?.storeId;
    const [searchTerm, setSearchTerm] = useState("");

    // Promotions
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [isAddPromoOpen, setIsAddPromoOpen] = useState(false);
    const [promoName, setPromoName] = useState("");
    const [promoType, setPromoType] = useState("Combo");
    const [promoItems, setPromoItems] = useState("");
    const [promoPrice, setPromoPrice] = useState("");
    const [promoStartDate, setPromoStartDate] = useState("");
    const [promoEndDate, setPromoEndDate] = useState("");
    const [isEditPromoOpen, setIsEditPromoOpen] = useState(false);
    const [editingPromoId, setEditingPromoId] = useState<string | null>(null);

    // Timed specials
    const [timedSpecials, setTimedSpecials] = useState<TimedSpecial[]>([]);
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [specialName, setSpecialName] = useState("");
    const [specialStartTime, setSpecialStartTime] = useState("14:00");
    const [specialEndTime, setSpecialEndTime] = useState("16:00");
    const [specialDiscount, setSpecialDiscount] = useState("");

    // Edit product price
    const [isEditProductOpen, setIsEditProductOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [newPrice, setNewPrice] = useState("");
    const [isSavingPrice, setIsSavingPrice] = useState(false);

    // Load promotions from Firestore
    useEffect(() => {
        if (!storeId) return;
        const q = query(
            collection(db, "promotions"),
            where("storeId", "==", storeId),
            orderBy("createdAt", "desc")
        );
        return onSnapshot(q, (snap) => {
            setPromotions(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Promotion[]);
        });
    }, [storeId]);

    // Load timed specials from Firestore
    useEffect(() => {
        if (!storeId) return;
        const q = query(
            collection(db, "timed_specials"),
            where("storeId", "==", storeId),
            orderBy("createdAt", "desc")
        );
        return onSnapshot(q, (snap) => {
            setTimedSpecials(snap.docs.map(d => ({ id: d.id, ...d.data() })) as TimedSpecial[]);
        });
    }, [storeId]);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const resetPromoForm = () => {
        setPromoName(""); setPromoType("Combo"); setPromoItems("");
        setPromoPrice(""); setPromoStartDate(""); setPromoEndDate("");
        setEditingPromoId(null);
    };

    const handleAddPromotion = async () => {
        if (!promoName || !promoItems || !promoPrice || !promoStartDate || !promoEndDate) {
            toast({ title: "Error", description: "All fields are required.", variant: "destructive" });
            return;
        }
        try {
            await addDoc(collection(db, "promotions"), {
                storeId,
                name: promoName,
                type: promoType,
                items: promoItems,
                price: promoType === "Discount" ? promoPrice : parseFloat(promoPrice),
                status: "Active",
                startDate: promoStartDate,
                endDate: promoEndDate,
                createdAt: serverTimestamp(),
            });
            setIsAddPromoOpen(false);
            resetPromoForm();
            toast({ title: "Promotion Added", description: "The new special is now active." });
        } catch {
            toast({ title: "Error", description: "Failed to save promotion.", variant: "destructive" });
        }
    };

    const handleDeletePromo = async (id: string) => {
        try {
            await deleteDoc(doc(db, "promotions", id));
            toast({ title: "Promotion Removed", description: "The special has been ended." });
        } catch {
            toast({ title: "Error", description: "Failed to delete promotion.", variant: "destructive" });
        }
    };

    const handleEditPromoClick = (promo: Promotion) => {
        setEditingPromoId(promo.id);
        setPromoName(promo.name);
        setPromoType(promo.type);
        setPromoItems(promo.items);
        setPromoPrice(promo.price.toString());
        setPromoStartDate(promo.startDate || "");
        setPromoEndDate(promo.endDate || "");
        setIsEditPromoOpen(true);
    };

    const handleSaveEditPromo = async () => {
        if (!editingPromoId) return;
        try {
            await updateDoc(doc(db, "promotions", editingPromoId), {
                name: promoName,
                type: promoType,
                items: promoItems,
                price: promoType === "Discount" ? promoPrice : parseFloat(promoPrice),
                startDate: promoStartDate,
                endDate: promoEndDate,
            });
            toast({ title: "Promotion Updated", description: "The special has been updated." });
            setIsEditPromoOpen(false);
            resetPromoForm();
        } catch {
            toast({ title: "Error", description: "Failed to update promotion.", variant: "destructive" });
        }
    };

    const handleEditProductClick = (product: any) => {
        setEditingProduct(product);
        setNewPrice(product.price.toString());
        setIsEditProductOpen(true);
    };

    const handleSaveProductPrice = async () => {
        if (!editingProduct) return;
        const parsed = parseFloat(newPrice);
        if (isNaN(parsed) || parsed <= 0) {
            toast({ title: "Error", description: "Enter a valid price.", variant: "destructive" });
            return;
        }
        setIsSavingPrice(true);
        try {
            await updateProduct(editingProduct.id, { price: parsed });
            toast({ title: "Price Updated", description: `${editingProduct.name} updated to R ${parsed.toFixed(2)}.` });
            setIsEditProductOpen(false);
        } catch {
            toast({ title: "Error", description: "Failed to update price.", variant: "destructive" });
        } finally {
            setIsSavingPrice(false);
        }
    };

    const handleScheduleSpecial = async () => {
        if (!specialName || !specialDiscount) {
            toast({ title: "Error", description: "Name and discount are required.", variant: "destructive" });
            return;
        }
        try {
            await addDoc(collection(db, "timed_specials"), {
                storeId,
                name: specialName,
                startTime: specialStartTime,
                endTime: specialEndTime,
                discountPercent: specialDiscount,
                createdAt: serverTimestamp(),
            });
            toast({ title: "Special Scheduled", description: "The time-based special has been configured." });
            setIsScheduleOpen(false);
            setSpecialName(""); setSpecialDiscount("");
            setSpecialStartTime("14:00"); setSpecialEndTime("16:00");
        } catch {
            toast({ title: "Error", description: "Failed to save schedule.", variant: "destructive" });
        }
    };

    const handleDeleteTimedSpecial = async (id: string) => {
        try {
            await deleteDoc(doc(db, "timed_specials", id));
            toast({ title: "Special Removed" });
        } catch {
            toast({ title: "Error", description: "Failed to delete special.", variant: "destructive" });
        }
    };

    return (
        <DashboardLayout role="owner">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Pricing & Promotions</h1>
                    <p className="text-muted-foreground">Manage product prices, discounts, combo deals, and special offers.</p>
                </div>

                <Tabs defaultValue="products">
                    <TabsList>
                        <TabsTrigger value="products">Product Pricing</TabsTrigger>
                        <TabsTrigger value="promotions">Promotions & Combos</TabsTrigger>
                        <TabsTrigger value="timed">Time-Based Specials</TabsTrigger>
                    </TabsList>

                    {/* ── Product Pricing ── */}
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
                                <CardDescription>Update selling prices.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product Name</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Current Price</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredProducts.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell className="font-medium">{product.name}</TableCell>
                                                <TableCell>{product.category}</TableCell>
                                                <TableCell>R {product.price.toFixed(2)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditProductClick(product)}>
                                                        <Edit2 className="h-4 w-4 mr-2" /> Edit
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit Product Price</DialogTitle>
                                            <DialogDescription>Update the selling price for {editingProduct?.name}.</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>New Selling Price (R)</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={newPrice}
                                                    onChange={e => setNewPrice(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handleSaveProductPrice} disabled={isSavingPrice}>
                                                {isSavingPrice ? "Saving..." : "Update Price"}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ── Promotions & Combos ── */}
                    <TabsContent value="promotions" className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-lg font-medium">Active Deals</h3>
                                <p className="text-sm text-muted-foreground">Manage your current promotions, combos, and discounts.</p>
                            </div>
                            <Dialog open={isAddPromoOpen} onOpenChange={(v) => { setIsAddPromoOpen(v); if (!v) resetPromoForm(); }}>
                                <DialogTrigger asChild>
                                    <Button><Plus className="h-4 w-4 mr-2" /> New Deal</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Create Promotion</DialogTitle>
                                        <DialogDescription>Set up a new combo or discount to drive sales.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Deal Name</Label>
                                            <Input placeholder="e.g. Weekend Braai Pack" value={promoName} onChange={e => setPromoName(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Promotion Type</Label>
                                            <Select value={promoType} onValueChange={setPromoType}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Combo">Combo Deal (Fixed Price)</SelectItem>
                                                    <SelectItem value="Discount">Percentage % Off</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Included Item(s) / Category</Label>
                                            <Input placeholder="e.g. 2x Coke, 1x Bread" value={promoItems} onChange={e => setPromoItems(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{promoType === "Combo" ? "Combo Price (R)" : "Discount Value"}</Label>
                                            <Input placeholder={promoType === "Combo" ? "150.00" : "10% off"} value={promoPrice} onChange={e => setPromoPrice(e.target.value)} />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Start Date</Label>
                                                <Input type="date" value={promoStartDate} onChange={e => setPromoStartDate(e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>End Date</Label>
                                                <Input type="date" value={promoEndDate} onChange={e => setPromoEndDate(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleAddPromotion}>Activate Deal</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Tag className="h-5 w-5 text-indigo-500" />
                                    <CardTitle>Active & Upcoming Deals</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Deal Name</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Included Items</TableHead>
                                            <TableHead>Price/Value</TableHead>
                                            <TableHead>Duration</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {promotions.map((promo) => (
                                            <TableRow key={promo.id}>
                                                <TableCell className="font-medium">{promo.name}</TableCell>
                                                <TableCell><Badge variant="secondary">{promo.type}</Badge></TableCell>
                                                <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate" title={promo.items}>
                                                    {promo.items}
                                                </TableCell>
                                                <TableCell className="font-bold">
                                                    {promo.type === "Combo" ? `R ${parseFloat(promo.price as string).toFixed(2)}` : promo.price}
                                                </TableCell>
                                                <TableCell className="text-sm">{promo.startDate} to {promo.endDate}</TableCell>
                                                <TableCell>
                                                    <Badge variant={promo.status === "Active" ? "default" : "outline"} className={promo.status === "Active" ? "bg-indigo-500" : ""}>
                                                        {promo.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditPromoClick(promo)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeletePromo(promo.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {promotions.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                    <Percent className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                    No active promotions. Create one above!
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>

                                {/* Edit Promo Dialog */}
                                <Dialog open={isEditPromoOpen} onOpenChange={(v) => { setIsEditPromoOpen(v); if (!v) resetPromoForm(); }}>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit Promotion</DialogTitle>
                                            <DialogDescription>Modify the details of this deal.</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>Deal Name</Label>
                                                <Input value={promoName} onChange={e => setPromoName(e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Promotion Type</Label>
                                                <Select value={promoType} onValueChange={setPromoType}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Combo">Combo Deal (Fixed Price)</SelectItem>
                                                        <SelectItem value="Discount">Percentage % Off</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Included Item(s) / Category</Label>
                                                <Input value={promoItems} onChange={e => setPromoItems(e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>{promoType === "Combo" ? "Combo Price (R)" : "Discount Value"}</Label>
                                                <Input value={promoPrice} onChange={e => setPromoPrice(e.target.value)} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Start Date</Label>
                                                    <Input type="date" value={promoStartDate} onChange={e => setPromoStartDate(e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>End Date</Label>
                                                    <Input type="date" value={promoEndDate} onChange={e => setPromoEndDate(e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handleSaveEditPromo}>Save Changes</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ── Time-Based Specials ── */}
                    <TabsContent value="timed" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Happy Hour & Specials</CardTitle>
                                        <CardDescription>Set automatic price changes based on time of day.</CardDescription>
                                    </div>
                                    <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
                                        <DialogTrigger asChild>
                                            <Button>Schedule Special</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Schedule Happy Hour</DialogTitle>
                                                <DialogDescription>Automatically adjust prices for specific periods.</DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label>Event Name</Label>
                                                    <Input placeholder="e.g. Afternoon Rush Special" value={specialName} onChange={e => setSpecialName(e.target.value)} />
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Start Time</Label>
                                                        <Input type="time" value={specialStartTime} onChange={e => setSpecialStartTime(e.target.value)} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>End Time</Label>
                                                        <Input type="time" value={specialEndTime} onChange={e => setSpecialEndTime(e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Discount Percentage</Label>
                                                    <Input placeholder="e.g. 15" value={specialDiscount} onChange={e => setSpecialDiscount(e.target.value)} />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button onClick={handleScheduleSpecial}>Save Schedule</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {timedSpecials.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-medium">No timed specials active</h3>
                                        <p className="text-sm text-muted-foreground">Schedule price reductions for off-peak hours.</p>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Time Window</TableHead>
                                                <TableHead>Discount</TableHead>
                                                <TableHead className="text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {timedSpecials.map((special) => (
                                                <TableRow key={special.id}>
                                                    <TableCell className="font-medium">{special.name}</TableCell>
                                                    <TableCell>{special.startTime} – {special.endTime}</TableCell>
                                                    <TableCell>{special.discountPercent}% off</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteTimedSpecial(special.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
};

export default OwnerPricing;
