import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/context/StoreContext";
import { useState } from "react";
import { Edit2, Percent, Clock, Plus, Tag, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

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

const initialPromotions: Promotion[] = [
    { id: "PROMO-1", name: "Weekend Braai Combo", type: "Combo", items: "Charcoal, Meat, Chakalaka", price: 150.00, status: "Active", startDate: "2026-03-06", endDate: "2026-03-08" },
    { id: "PROMO-2", name: "Bread & Milk Special", type: "Combo", items: "1x Brown Bread, 1x 2L Milk", price: 42.00, status: "Active", startDate: "2026-03-01", endDate: "2026-03-31" },
    { id: "PROMO-3", name: "End of Month Sale", type: "Discount", items: "All 2L Cool Drinks", price: "10% off", status: "Upcoming", startDate: "2026-03-25", endDate: "2026-03-31" },
];

const OwnerPricing = () => {
    const { products } = useStore();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");

    // Promotions State
    const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
    const [isAddPromoOpen, setIsAddPromoOpen] = useState(false);
    const [promoName, setPromoName] = useState("");
    const [promoType, setPromoType] = useState("Combo");
    const [promoItems, setPromoItems] = useState("");
    const [promoPrice, setPromoPrice] = useState("");
    const [promoStartDate, setPromoStartDate] = useState("");
    const [promoEndDate, setPromoEndDate] = useState("");

    // Edit Product State
    const [isEditProductOpen, setIsEditProductOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [newPrice, setNewPrice] = useState("");

    // Edit Promo State
    const [isEditPromoOpen, setIsEditPromoOpen] = useState(false);
    const [editingPromoId, setEditingPromoId] = useState<string | null>(null);

    // Schedule Special State
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddPromotion = () => {
        if (!promoName || !promoItems || !promoPrice || !promoStartDate || !promoEndDate) {
            toast({
                title: "Error",
                description: "All fields are required.",
                variant: "destructive"
            });
            return;
        }

        const newPromo = {
            id: `PROMO-${promotions.length + 1}`,
            name: promoName,
            type: promoType,
            items: promoItems,
            price: promoType === 'Discount' ? promoPrice : parseFloat(promoPrice),
            status: "Active",
            startDate: promoStartDate,
            endDate: promoEndDate
        };

        setPromotions([...promotions, newPromo]);
        setIsAddPromoOpen(false);

        // Reset
        setPromoName("");
        setPromoType("Combo");
        setPromoItems("");
        setPromoPrice("");
        setPromoStartDate("");
        setPromoEndDate("");

        toast({
            title: "Promotion Added",
            description: "The new special is now active.",
        });
    };

    const handleDeletePromo = (id: string) => {
        setPromotions(promotions.filter(p => p.id !== id));
        toast({
            title: "Promotion Removed",
            description: "The special has been ended."
        });
    };

    const handleEditProductClick = (product: any) => {
        setEditingProduct(product);
        setNewPrice(product.price.toString());
        setIsEditProductOpen(true);
    };

    const handleSaveProductPrice = () => {
        toast({
            title: "Price Updated",
            description: `The price for ${editingProduct?.name} has been updated to R ${newPrice}.`
        });
        setIsEditProductOpen(false);
    };

    const handleEditPromoClick = (promo: any) => {
        setEditingPromoId(promo.id);
        setPromoName(promo.name);
        setPromoType(promo.type);
        setPromoItems(promo.items);
        setPromoPrice(promo.price.toString());
        setPromoStartDate(promo.startDate || "");
        setPromoEndDate(promo.endDate || "");
        setIsEditPromoOpen(true);
    };

    const handleSaveEditPromo = () => {
        setPromotions(promotions.map(p => p.id === editingPromoId ? {
            ...p,
            name: promoName,
            type: promoType,
            items: promoItems,
            price: promoType === 'Discount' ? promoPrice : parseFloat(promoPrice),
            startDate: promoStartDate,
            endDate: promoEndDate
        } : p));
        toast({
            title: "Promotion Updated",
            description: "The special has been updated."
        });
        setIsEditPromoOpen(false);
        setPromoName("");
        setPromoType("Combo");
        setPromoItems("");
        setPromoPrice("");
        setPromoStartDate("");
        setPromoEndDate("");
    };

    const handleScheduleSpecial = () => {
        toast({
            title: "Special Scheduled",
            description: "The time-based special has been configured."
        });
        setIsScheduleOpen(false);
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
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditProductClick(product)}>
                                                        <Edit2 className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Product Price Edit Dialog */}
                                <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit Product Price</DialogTitle>
                                            <DialogDescription>
                                                Update the selling price for {editingProduct?.name}.
                                            </DialogDescription>
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
                                            <p className="text-sm text-muted-foreground">
                                                Cost Price: R {editingProduct ? (editingProduct.price * 0.7).toFixed(2) : '0.00'}
                                            </p>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handleSaveProductPrice}>Update Price</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="promotions" className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-lg font-medium">Active Deals</h3>
                                <p className="text-sm text-muted-foreground">Manage your current promotions, combos, and discounts.</p>
                            </div>
                            <Dialog open={isAddPromoOpen} onOpenChange={setIsAddPromoOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" /> New Deal
                                    </Button>
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
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
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
                                            <Label>{promoType === 'Combo' ? "Combo Price (R)" : "Discount Value"}</Label>
                                            <Input placeholder={promoType === 'Combo' ? "150.00" : "10% off"} value={promoPrice} onChange={e => setPromoPrice(e.target.value)} />
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
                                                <TableCell>
                                                    <Badge variant="secondary">{promo.type}</Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate" title={promo.items}>
                                                    {promo.items}
                                                </TableCell>
                                                <TableCell className="font-bold">
                                                    {promo.type === 'Combo' ? `R ${parseFloat(promo.price as string).toFixed(2)}` : promo.price}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {promo.startDate} to {promo.endDate}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={promo.status === 'Active' ? 'default' : 'outline'} className={promo.status === 'Active' ? 'bg-indigo-500' : ''}>
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
                                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                    <Percent className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                    No active promotions. Create one above!
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>

                                {/* Promotion Edit Dialog */}
                                <Dialog open={isEditPromoOpen} onOpenChange={setIsEditPromoOpen}>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit Promotion</DialogTitle>
                                            <DialogDescription>Modify the details of this deal.</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>Deal Name</Label>
                                                <Input placeholder="e.g. Weekend Braai Pack" value={promoName} onChange={e => setPromoName(e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Promotion Type</Label>
                                                <Select value={promoType} onValueChange={setPromoType}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
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
                                                <Label>{promoType === 'Combo' ? "Combo Price (R)" : "Discount Value"}</Label>
                                                <Input placeholder={promoType === 'Combo' ? "150.00" : "10% off"} value={promoPrice} onChange={e => setPromoPrice(e.target.value)} />
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

                                <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
                                    <DialogTrigger asChild>
                                        <Button>Schedule Special</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Schedule Happy Hour</DialogTitle>
                                            <DialogDescription>Automatically adjust prices for specific periods.</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4 text-left">
                                            <div className="space-y-2">
                                                <Label>Event Name</Label>
                                                <Input placeholder="e.g. Afternoon Rush Special" />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Start Time</Label>
                                                    <Input type="time" defaultValue="14:00" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>End Time</Label>
                                                    <Input type="time" defaultValue="16:00" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Discount Percentage</Label>
                                                <Input placeholder="e.g. 15%" />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handleScheduleSpecial}>Save Schedule</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
};

export default OwnerPricing;
