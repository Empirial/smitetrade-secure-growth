
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/context/StoreContext";
import { Store, Eye, Ban, CheckCircle, Clock, Mail, Phone, User } from "lucide-react";
import { toast } from "sonner";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface OwnerInfo {
    name: string;
    email: string;
    phone?: string;
    ownerId: string;
}

const AdminStores = () => {
    const { stores, products, orders } = useStore();

    const storeData = stores.map(store => ({
        ...store,
        productCount: products.filter(p => p.storeId === store.id).length || "—",
        totalSales: orders.filter(o => (o as any).storeId === store.id).reduce((sum, o) => sum + o.total, 0),
    }));

    const [storeStatuses, setStoreStatuses] = useState<Record<string, string>>({});
    const [selectedStore, setSelectedStore] = useState<(typeof storeData)[0] | null>(null);
    const [ownerInfo, setOwnerInfo] = useState<OwnerInfo | null>(null);
    const [ownerLoading, setOwnerLoading] = useState(false);

    const getStatus = (store: any) => storeStatuses[store.id] || store.status || "Active";

    const setStatus = async (storeId: string, currentStatus: string, newStatus: string) => {
        setStoreStatuses(prev => ({ ...prev, [storeId]: newStatus }));
        try {
            await updateDoc(doc(db, "stores", storeId), { status: newStatus });
            const label = newStatus === "Active" ? "approved" : newStatus === "Suspended" ? "suspended" : newStatus.toLowerCase();
            toast.success(`Store ${label}`);
        } catch (error) {
            setStoreStatuses(prev => ({ ...prev, [storeId]: currentStatus }));
            toast.error("Failed to update store status.");
        }
    };

    const openStoreDialog = async (store: (typeof storeData)[0]) => {
        setSelectedStore(store);
        setOwnerInfo(null);
        setOwnerLoading(true);
        try {
            const snap = await getDoc(doc(db, "users", (store as any).ownerId));
            if (snap.exists()) {
                const d = snap.data();
                setOwnerInfo({ name: d.name, email: d.email, phone: d.phone, ownerId: (store as any).ownerId });
            }
        } catch {
            // owner doc fetch failed — dialog still shows store data
        } finally {
            setOwnerLoading(false);
        }
    };

    const ownerStores = selectedStore
        ? storeData.filter(s => (s as any).ownerId === (selectedStore as any).ownerId)
        : [];

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Store Management</h1>
                    <p className="text-muted-foreground">View and manage all registered stores on the platform.</p>
                </div>

                <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
                            <Store className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{storeData.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{storeData.filter(s => getStatus(s) === "Pending").length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active</CardTitle>
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{storeData.filter(s => getStatus(s) === "Active").length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
                            <Ban className="h-4 w-4 text-destructive" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{storeData.filter(s => getStatus(s) === "Suspended").length}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">All Stores</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Store Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead className="text-center">Products</TableHead>
                                    <TableHead className="text-right">Total Sales</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {storeData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No stores registered yet.</TableCell>
                                    </TableRow>
                                ) : storeData.map(store => {
                                    const status = getStatus(store);
                                    return (
                                        <TableRow key={store.id} className="cursor-pointer hover:bg-muted/40" onClick={() => openStoreDialog(store)}>
                                            <TableCell className="font-medium">{store.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{(store as any).suburb || ""}, {(store as any).city || ""}</TableCell>
                                            <TableCell className="text-center">{store.productCount}</TableCell>
                                            <TableCell className="text-right">R {store.totalSales.toLocaleString()}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={
                                                    status === "Active" ? "default"
                                                    : status === "Pending" ? "outline"
                                                    : "destructive"
                                                } className={status === "Pending" ? "border-yellow-500 text-yellow-500" : undefined}>
                                                    {status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                                                <div className="flex gap-1 justify-end">
                                                    <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => openStoreDialog(store)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    {status === "Pending" && (
                                                        <Button size="sm" variant="ghost" className="text-emerald-500 hover:text-emerald-600" onClick={() => setStatus(store.id, status, "Active")}>
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {status === "Active" && (
                                                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive/80" onClick={() => setStatus(store.id, status, "Suspended")}>
                                                            <Ban className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {status === "Suspended" && (
                                                        <Button size="sm" variant="ghost" className="text-emerald-500 hover:text-emerald-600" onClick={() => setStatus(store.id, status, "Active")}>
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Store detail dialog */}
            <Dialog open={!!selectedStore} onOpenChange={open => { if (!open) setSelectedStore(null); }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Store className="h-5 w-5" />
                            {selectedStore?.name}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Store details */}
                        <div className="space-y-1 text-sm">
                            <p className="text-muted-foreground">
                                {[(selectedStore as any)?.address, (selectedStore as any)?.suburb, (selectedStore as any)?.city, (selectedStore as any)?.province]
                                    .filter(Boolean).join(", ") || "No address on file"}
                            </p>
                            <div className="flex items-center gap-2 pt-1">
                                <Badge variant={
                                    getStatus(selectedStore) === "Active" ? "default"
                                    : getStatus(selectedStore) === "Pending" ? "outline"
                                    : "destructive"
                                } className={getStatus(selectedStore) === "Pending" ? "border-yellow-500 text-yellow-500" : undefined}>
                                    {getStatus(selectedStore)}
                                </Badge>
                                <span className="text-muted-foreground text-xs">
                                    Since {selectedStore?.createdAt ? new Date(selectedStore.createdAt).toLocaleDateString() : "—"}
                                </span>
                            </div>
                        </div>

                        <Separator />

                        {/* Owner info */}
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Owner</p>
                            {ownerLoading ? (
                                <p className="text-sm text-muted-foreground">Loading...</p>
                            ) : ownerInfo ? (
                                <div className="space-y-1.5 text-sm">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground shrink-0" />
                                        <span className="font-medium">{ownerInfo.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                                        <span className="text-muted-foreground">{ownerInfo.email}</span>
                                    </div>
                                    {ownerInfo.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                                            <span className="text-muted-foreground">{ownerInfo.phone}</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Owner details unavailable</p>
                            )}
                        </div>

                        {/* Other stores by same owner */}
                        {ownerStores.length > 1 && (
                            <>
                                <Separator />
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                                        Other stores by this owner ({ownerStores.length - 1})
                                    </p>
                                    <div className="space-y-2">
                                        {ownerStores
                                            .filter(s => s.id !== selectedStore?.id)
                                            .map(s => {
                                                const st = getStatus(s);
                                                return (
                                                    <div key={s.id} className="flex items-center justify-between text-sm">
                                                        <span className="font-medium">{s.name}</span>
                                                        <Badge variant={
                                                            st === "Active" ? "default"
                                                            : st === "Pending" ? "outline"
                                                            : "destructive"
                                                        } className={st === "Pending" ? "border-yellow-500 text-yellow-500 text-xs" : "text-xs"}>
                                                            {st}
                                                        </Badge>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default AdminStores;
