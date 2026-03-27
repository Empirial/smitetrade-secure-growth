import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Truck, Briefcase, ChevronLeft, ChevronRight, ClipboardList, Trash2, PackageSearch } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useStore } from "@/context/StoreContext";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { addDoc, collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { USE_MOCK_DATA } from "@/lib/constants";
import { PlatformSupplier } from "@/types";
import { usePayfast } from "@/hooks/usePayfast";

// ─── Types ──────────────────────────────────────────────────────────────────
interface PreorderItem {
    name: string;
    quantity: string;
    unit: string;
}

interface SupplierPreorder {
    id: string;
    supplierId: string;
    supplierName: string;
    storeId: string;
    submittedBy: string;
    items: PreorderItem[];
    notes: string;
    status: "Pending Quote" | "Quote Received" | "Approved" | "Paid" | "Delivered" | "Cancelled";
    quoteAmount?: number;
    quoteNotes?: string;
    submittedAt: string;
    quotedAt?: string;
    paidAt?: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_PLATFORM_SUPPLIERS: PlatformSupplier[] = [
    { id: "ps1", name: "Unilever SA", status: "Active", createdAt: new Date().toISOString() },
    { id: "ps2", name: "Pioneer Foods", status: "Active", createdAt: new Date().toISOString() },
    { id: "ps3", name: "Tiger Brands", status: "Active", createdAt: new Date().toISOString() },
    { id: "ps4", name: "Clover SA", status: "Active", createdAt: new Date().toISOString() },
    { id: "ps5", name: "Nestlé SA", status: "Active", createdAt: new Date().toISOString() },
];

const MOCK_PREORDERS: SupplierPreorder[] = [
    {
        id: "po1",
        supplierId: "ps1",
        supplierName: "Unilever SA",
        storeId: "store1",
        submittedBy: "Owner",
        items: [{ name: "Sunlight Dishwashing Liquid 750ml", quantity: "50", unit: "units" }, { name: "Omo Washing Powder 2kg", quantity: "30", unit: "bags" }],
        notes: "Please deliver before end of week",
        status: "Quote Received",
        quoteAmount: 3240.00,
        quoteNotes: "Price valid for 7 days. Delivery included.",
        submittedAt: new Date(Date.now() - 86400000).toISOString(),
        quotedAt: new Date().toISOString(),
    },
    {
        id: "po2",
        supplierId: "ps2",
        supplierName: "Pioneer Foods",
        storeId: "store1",
        submittedBy: "Owner",
        items: [{ name: "Sasko Bread Flour 10kg", quantity: "20", unit: "bags" }],
        notes: "",
        status: "Pending Quote",
        submittedAt: new Date(Date.now() - 3600000).toISOString(),
    },
];

// ─── Status Badge ────────────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; className: string }> = {
    "Pending Quote":  { label: "Pending Quote",  className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
    "Quote Received": { label: "Quote Received", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    "Approved":       { label: "Approved",       className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    "Paid":           { label: "Paid",           className: "bg-green-500/10 text-green-400 border-green-500/20" },
    "Delivered":      { label: "Delivered",      className: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    "Cancelled":      { label: "Cancelled",      className: "bg-red-500/10 text-red-400 border-red-500/20" },
};

const StatusBadge = ({ status }: { status: string }) => {
    const cfg = statusConfig[status] || { label: status, className: "bg-muted text-muted-foreground" };
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.className}`}>{cfg.label}</span>;
};

// ─── Component ───────────────────────────────────────────────────────────────
const OwnerSuppliers = () => {
    const { suppliers, addSupplier, user } = useStore();
    const { pay, loading: payfastLoading } = usePayfast();

    // Add supplier
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newSupplier, setNewSupplier] = useState({ name: "", products: "" });

    // Platform suppliers
    const [platformSuppliers, setPlatformSuppliers] = useState<PlatformSupplier[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Place order (existing)
    const [isOrderOpen, setIsOrderOpen] = useState(false);
    const [selectedSupplierId, setSelectedSupplierId] = useState("");
    const [orderNotes, setOrderNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Preorders
    const [preorders, setPreorders] = useState<SupplierPreorder[]>([]);
    const [isPreorderOpen, setIsPreorderOpen] = useState(false);
    const [preorderSupplierId, setPreorderSupplierId] = useState("");
    const [preorderItems, setPreorderItems] = useState<PreorderItem[]>([{ name: "", quantity: "", unit: "units" }]);
    const [preorderNotes, setPreorderNotes] = useState("");
    const [isPreorderSubmitting, setIsPreorderSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Load platform suppliers
    useEffect(() => {
        if (USE_MOCK_DATA) { setPlatformSuppliers(MOCK_PLATFORM_SUPPLIERS); return; }
        const unsub = onSnapshot(collection(db, "platform_suppliers"), (snap) => {
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as PlatformSupplier[];
            setPlatformSuppliers(data.filter(s => s.status === "Active"));
        });
        return unsub;
    }, []);

    // Load preorders for this store
    useEffect(() => {
        if (USE_MOCK_DATA) { setPreorders(MOCK_PREORDERS); return; }
        if (!user?.storeId) return;
        const q = query(
            collection(db, "supplier_preorders"),
            where("storeId", "==", user.storeId),
            orderBy("submittedAt", "desc")
        );
        const unsub = onSnapshot(q, (snap) => {
            setPreorders(snap.docs.map(d => ({ id: d.id, ...d.data() })) as SupplierPreorder[]);
        });
        return unsub;
    }, [user?.storeId]);

    const scrollLeft = () => scrollRef.current?.scrollBy({ left: -240, behavior: "smooth" });
    const scrollRight = () => scrollRef.current?.scrollBy({ left: 240, behavior: "smooth" });

    // ── Add supplier ──────────────────────────────────────────────────────────
    const handleAddSupplier = () => {
        if (!newSupplier.name || !newSupplier.products) return;
        addSupplier({
            name: newSupplier.name,
            contact: "SMITETRADE: 010 880 3456 | orders@smitetrade.co.za",
            products: newSupplier.products,
        });
        setIsAddOpen(false);
        setNewSupplier({ name: "", products: "" });
    };

    // ── Place order (file upload) ─────────────────────────────────────────────
    const handlePlaceOrder = async () => {
        if (!selectedSupplierId) return;
        const ownSupplier = suppliers.find(s => s.id === selectedSupplierId);
        const platformSupplier = platformSuppliers.find(s => s.id === selectedSupplierId);
        const supplierName = ownSupplier?.name ?? platformSupplier?.name ?? "Unknown";
        setIsSubmitting(true);
        const fileName = fileInputRef.current?.files?.[0]?.name || null;
        try {
            if (!USE_MOCK_DATA) {
                await addDoc(collection(db, "supplier_orders"), {
                    supplierId: selectedSupplierId, supplierName,
                    storeId: user?.storeId || "unknown",
                    notes: orderNotes, fileName,
                    status: "Submitted",
                    submittedAt: new Date().toISOString(),
                    submittedBy: user?.name || "Owner",
                });
            }
            toast.success(`Order submitted to ${supplierName} via Smitetrade`, {
                description: fileName ? `File: ${fileName}` : "Manual order — check email for confirmation.",
            });
        } catch {
            toast.error("Failed to submit order. Please try again.");
        } finally {
            setIsSubmitting(false);
            setIsOrderOpen(false);
            setSelectedSupplierId("");
            setOrderNotes("");
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    // ── Preorder items management ─────────────────────────────────────────────
    const addPreorderItem = () =>
        setPreorderItems(prev => [...prev, { name: "", quantity: "", unit: "units" }]);

    const removePreorderItem = (index: number) =>
        setPreorderItems(prev => prev.filter((_, i) => i !== index));

    const updatePreorderItem = (index: number, field: keyof PreorderItem, value: string) =>
        setPreorderItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));

    // ── Submit preorder ───────────────────────────────────────────────────────
    const handleSubmitPreorder = async () => {
        if (!preorderSupplierId) { toast.error("Please select a supplier."); return; }
        const validItems = preorderItems.filter(i => i.name.trim() && i.quantity.trim());
        if (validItems.length === 0) { toast.error("Add at least one item with a name and quantity."); return; }

        const ownSupplier = suppliers.find(s => s.id === preorderSupplierId);
        const platformSupplier = platformSuppliers.find(s => s.id === preorderSupplierId);
        const supplierName = ownSupplier?.name ?? platformSupplier?.name ?? "Unknown";

        setIsPreorderSubmitting(true);
        try {
            const preorderData = {
                supplierId: preorderSupplierId,
                supplierName,
                storeId: user?.storeId || "unknown",
                submittedBy: user?.name || "Owner",
                items: validItems,
                notes: preorderNotes,
                status: "Pending Quote",
                submittedAt: new Date().toISOString(),
            };
            if (!USE_MOCK_DATA) {
                await addDoc(collection(db, "supplier_preorders"), preorderData);
            }
            toast.success(`Preorder sent to ${supplierName}`, {
                description: `${validItems.length} item(s) requested. You'll be notified when a quote is ready.`,
            });
            setIsPreorderOpen(false);
            setPreorderSupplierId("");
            setPreorderItems([{ name: "", quantity: "", unit: "units" }]);
            setPreorderNotes("");
        } catch {
            toast.error("Failed to submit preorder. Please try again.");
        } finally {
            setIsPreorderSubmitting(false);
        }
    };

    // ── Pay for preorder ──────────────────────────────────────────────────────
    const handlePayPreorder = (preorder: SupplierPreorder) => {
        if (!preorder.quoteAmount) return;
        pay({
            emailAddress: user?.email || "owner@smitetrade.co.za",
            amount: preorder.quoteAmount,
            itemName: `Preorder — ${preorder.supplierName}`,
            itemDescription: `${preorder.items.length} item(s) preordered`,
            customStr1: "owner_preorder",
            customStr2: user?.storeId || "",
            customStr3: preorder.id,
        });
    };

    const filteredSuppliers = suppliers.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.products?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const allSuppliers = [...platformSuppliers, ...suppliers];

    return (
        <DashboardLayout role="owner">
            <div className="space-y-6">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
                        <p className="text-muted-foreground">Manage your supplier relationships and stock sources.</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">

                        {/* Add Supplier */}
                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Supplier
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Supplier</DialogTitle>
                                    <DialogDescription>Register a new supplier. All orders will be routed via Smitetrade.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Supplier Name</Label>
                                        <Input id="name" value={newSupplier.name} onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="products">Main Products</Label>
                                        <Input id="products" placeholder="e.g. Beverages, Cleaning Supplies" value={newSupplier.products} onChange={(e) => setNewSupplier({ ...newSupplier, products: e.target.value })} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleAddSupplier}>Register Supplier</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Place Order */}
                        <Dialog open={isOrderOpen} onOpenChange={setIsOrderOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <Truck className="mr-2 h-4 w-4" />
                                    Place Order
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Place Supplier Order</DialogTitle>
                                    <DialogDescription>Upload your required stock list or enter an order manually. This will be routed via Smitetrade.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label>Select Supplier</Label>
                                        <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            value={selectedSupplierId}
                                            onChange={(e) => setSelectedSupplierId(e.target.value)}
                                        >
                                            <option value="" disabled>Select a supplier...</option>
                                            {platformSuppliers.length > 0 && (
                                                <optgroup label="Platform Suppliers">
                                                    {platformSuppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                                </optgroup>
                                            )}
                                            {suppliers.length > 0 && (
                                                <optgroup label="My Suppliers">
                                                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.products})</option>)}
                                                </optgroup>
                                            )}
                                        </select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="order_file">Upload Order List (CSV, PDF, Excel)</Label>
                                        <Input id="order_file" type="file" ref={fileInputRef} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="order_notes">Additional Notes</Label>
                                        <Input id="order_notes" placeholder="e.g. Please deliver before Friday" value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handlePlaceOrder} disabled={!selectedSupplierId || isSubmitting}>
                                        {isSubmitting ? "Submitting..." : "Submit Order via Smitetrade"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Request Preorder */}
                        <Dialog open={isPreorderOpen} onOpenChange={setIsPreorderOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <PackageSearch className="mr-2 h-4 w-4" />
                                    Request Preorder
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                                <DialogHeader>
                                    <DialogTitle>Request Preorder</DialogTitle>
                                    <DialogDescription>
                                        List the items you need and quantities. The supplier will send back a quote — no prices needed now.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-1">

                                    {/* Supplier select */}
                                    <div className="grid gap-2">
                                        <Label>Supplier</Label>
                                        <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            value={preorderSupplierId}
                                            onChange={(e) => setPreorderSupplierId(e.target.value)}
                                        >
                                            <option value="" disabled>Select a supplier...</option>
                                            {platformSuppliers.length > 0 && (
                                                <optgroup label="Platform Suppliers">
                                                    {platformSuppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                                </optgroup>
                                            )}
                                            {suppliers.length > 0 && (
                                                <optgroup label="My Suppliers">
                                                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                                </optgroup>
                                            )}
                                        </select>
                                    </div>

                                    {/* Item list */}
                                    <div className="grid gap-2">
                                        <div className="flex items-center justify-between">
                                            <Label>Items Needed</Label>
                                            <Button type="button" variant="ghost" size="sm" onClick={addPreorderItem} className="h-7 text-xs">
                                                <Plus className="h-3 w-3 mr-1" /> Add Item
                                            </Button>
                                        </div>
                                        <div className="space-y-2">
                                            {preorderItems.map((item, index) => (
                                                <div key={index} className="flex gap-2 items-start">
                                                    <div className="flex-1">
                                                        <Input
                                                            placeholder="Item name e.g. Sunlight 750ml"
                                                            value={item.name}
                                                            onChange={(e) => updatePreorderItem(index, "name", e.target.value)}
                                                            className="mb-1"
                                                        />
                                                        <div className="flex gap-1">
                                                            <Input
                                                                placeholder="Qty"
                                                                type="number"
                                                                min="1"
                                                                value={item.quantity}
                                                                onChange={(e) => updatePreorderItem(index, "quantity", e.target.value)}
                                                                className="w-20"
                                                            />
                                                            <select
                                                                className="flex h-9 rounded-md border border-input bg-background px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                                value={item.unit}
                                                                onChange={(e) => updatePreorderItem(index, "unit", e.target.value)}
                                                            >
                                                                <option value="units">units</option>
                                                                <option value="cases">cases</option>
                                                                <option value="kg">kg</option>
                                                                <option value="litres">litres</option>
                                                                <option value="bags">bags</option>
                                                                <option value="boxes">boxes</option>
                                                                <option value="pallets">pallets</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    {preorderItems.length > 1 && (
                                                        <Button type="button" variant="ghost" size="icon" onClick={() => removePreorderItem(index)} className="h-8 w-8 text-red-400 hover:text-red-300 mt-1">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="preorder_notes">Delivery Requirements / Notes</Label>
                                        <Textarea
                                            id="preorder_notes"
                                            placeholder="e.g. Deliver before Friday, split delivery in 2 batches..."
                                            value={preorderNotes}
                                            onChange={(e) => setPreorderNotes(e.target.value)}
                                            rows={3}
                                        />
                                    </div>

                                    <p className="text-xs text-muted-foreground">
                                        The supplier will review your request and send back a quote. You will be notified and can pay directly from this page.
                                    </p>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsPreorderOpen(false)}>Cancel</Button>
                                    <Button onClick={handleSubmitPreorder} disabled={!preorderSupplierId || isPreorderSubmitting}>
                                        {isPreorderSubmitting ? "Sending..." : "Send Preorder Request"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                    </div>
                </div>

                {/* ── Platform Suppliers Carousel ── */}
                {platformSuppliers.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">Platform Suppliers</h2>
                                <p className="text-sm text-muted-foreground">Suppliers available to all SmiteTrade stores</p>
                            </div>
                            <div className="flex gap-1">
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={scrollLeft}><ChevronLeft className="h-4 w-4" /></Button>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={scrollRight}><ChevronRight className="h-4 w-4" /></Button>
                            </div>
                        </div>
                        <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                            {platformSuppliers.map((supplier) => (
                                <div key={supplier.id} className="flex-shrink-0 w-48 rounded-xl border bg-card p-4 flex flex-col items-center gap-3 hover:border-primary/50 hover:shadow-sm transition-all">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Briefcase className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-medium text-sm leading-tight">{supplier.name}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Platform Supplier</p>
                                    </div>
                                    <div className="flex gap-1 w-full">
                                        <Button size="sm" variant="outline" className="flex-1 text-xs h-7" onClick={() => { setSelectedSupplierId(supplier.id); setIsOrderOpen(true); }}>
                                            Order
                                        </Button>
                                        <Button size="sm" className="flex-1 text-xs h-7" onClick={() => { setPreorderSupplierId(supplier.id); setIsPreorderOpen(true); }}>
                                            Preorder
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Preorder Requests ── */}
                {preorders.length > 0 && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <ClipboardList className="h-5 w-5 text-primary" />
                                <div>
                                    <CardTitle>Preorder Requests</CardTitle>
                                    <CardDescription>Track your preorders and pay when a quote is received.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {preorders.map((preorder) => (
                                    <div key={preorder.id} className="rounded-lg border bg-card/50 p-4 space-y-3">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">{preorder.supplierName}</p>
                                                    <StatusBadge status={preorder.status} />
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Submitted {new Date(preorder.submittedAt).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                                                    {preorder.quotedAt && ` · Quoted ${new Date(preorder.quotedAt).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}`}
                                                </p>
                                            </div>
                                            {preorder.status === "Quote Received" && preorder.quoteAmount && (
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-emerald-400">R {preorder.quoteAmount.toFixed(2)}</p>
                                                    <Button
                                                        size="sm"
                                                        className="mt-1 bg-emerald-600 hover:bg-emerald-500 text-white"
                                                        onClick={() => handlePayPreorder(preorder)}
                                                        disabled={payfastLoading}
                                                    >
                                                        {payfastLoading ? "Redirecting..." : "Pay Now via PayFast"}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Items */}
                                        <div className="flex flex-wrap gap-1">
                                            {preorder.items.map((item, i) => (
                                                <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground">
                                                    {item.quantity} {item.unit} × {item.name}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Quote notes */}
                                        {preorder.quoteNotes && (
                                            <p className="text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-md px-3 py-2">
                                                💬 Supplier note: {preorder.quoteNotes}
                                            </p>
                                        )}

                                        {/* Owner notes */}
                                        {preorder.notes && (
                                            <p className="text-xs text-muted-foreground">Your note: {preorder.notes}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* ── Search ── */}
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search suppliers..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                </div>

                {/* ── My Supplier List ── */}
                <Card>
                    <CardHeader>
                        <CardTitle>My Supplier List</CardTitle>
                        <CardDescription>Your registered supplier directory.</CardDescription>
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
                                {filteredSuppliers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                            {searchQuery ? "No suppliers match your search." : "No suppliers added yet."}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredSuppliers.map((supplier) => (
                                        <TableRow key={supplier.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                        <Truck className="h-4 w-4 text-slate-500" />
                                                    </div>
                                                    {supplier.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>{supplier.contact}</TableCell>
                                            <TableCell>{supplier.products}</TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${supplier.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-muted text-muted-foreground'}`}>
                                                    {supplier.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="sm" onClick={() => { setSelectedSupplierId(supplier.id); setIsOrderOpen(true); }}>
                                                        Order
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => { setPreorderSupplierId(supplier.id); setIsPreorderOpen(true); }}>
                                                        Preorder
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

            </div>
        </DashboardLayout>
    );
};

export default OwnerSuppliers;
