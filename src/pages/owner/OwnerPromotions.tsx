import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Tag, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const initialPromotions = [
    { id: "PROMO-1", name: "Weekend Braai Combo", type: "Combo", items: "Charcoal, Meat, Chakalaka", price: 150.00, status: "Active" },
    { id: "PROMO-2", name: "Bread & Milk Special", type: "Combo", items: "1x Brown Bread, 1x 2L Milk", price: 42.00, status: "Active" },
    { id: "PROMO-3", name: "End of Month Sale", type: "Discount", items: "All 2L Cool Drinks", price: "10% off", status: "Upcoming" },
];

const OwnerPromotions = () => {
    const { toast } = useToast();
    const [promotions, setPromotions] = useState(initialPromotions);
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Form state
    const [name, setName] = useState("");
    const [type, setType] = useState("Combo");
    const [items, setItems] = useState("");
    const [price, setPrice] = useState("");

    const handleAddPromotion = () => {
        if (!name || !items || !price) {
            toast({
                title: "Error",
                description: "All fields are required.",
                variant: "destructive"
            });
            return;
        }

        const newPromo = {
            id: `PROMO-${promotions.length + 1}`,
            name,
            type,
            items,
            price: type === 'Discount' ? price : parseFloat(price),
            status: "Active"
        };

        setPromotions([...promotions, newPromo]);
        setIsAddOpen(false);

        // Reset
        setName("");
        setType("Combo");
        setItems("");
        setPrice("");

        toast({
            title: "Promotion Added",
            description: "The new special is now active.",
        });
    };

    const handleDelete = (id: string) => {
        setPromotions(promotions.filter(p => p.id !== id));
        toast({
            title: "Promotion Removed",
            description: "The special has been ended."
        });
    };

    return (
        <DashboardLayout role="owner">
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center sm:flex-row flex-col gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Promotions & Specials</h1>
                        <p className="text-muted-foreground">Configure combo deals and manual price overrides.</p>
                    </div>

                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
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
                                    <Input placeholder="e.g. Weekend Braai Pack" value={name} onChange={e => setName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Promotion Type</Label>
                                    <Select value={type} onValueChange={setType}>
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
                                    <Input placeholder="e.g. 2x Coke, 1x Bread" value={items} onChange={e => setItems(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>{type === 'Combo' ? "Combo Price (R)" : "Discount Value"}</Label>
                                    <Input placeholder={type === 'Combo' ? "150.00" : "10% off"} value={price} onChange={e => setPrice(e.target.value)} />
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
                                        <TableCell>
                                            <Badge variant={promo.status === 'Active' ? 'default' : 'outline'} className={promo.status === 'Active' ? 'bg-indigo-500' : ''}>
                                                {promo.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(promo.id)}>
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

export default OwnerPromotions;
