
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { Store, Eye, Ban, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const AdminStores = () => {
    const { stores, products, orders } = useStore();

    const storeData = stores.map(store => ({
        ...store,
        productCount: products.filter(p => p.storeId === store.id).length || "—",
        totalSales: orders.filter(o => (o as any).storeId === store.id).reduce((sum, o) => sum + o.total, 0),
    }));

    const [storeStatuses, setStoreStatuses] = useState<Record<string, string>>({});

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
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No stores registered yet.</TableCell>
                                    </TableRow>
                                ) : storeData.map(store => {
                                    const status = getStatus(store);
                                    return (
                                        <TableRow key={store.id}>
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
                                            <TableCell className="text-right">
                                                <div className="flex gap-1 justify-end">
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
        </DashboardLayout>
    );
};

export default AdminStores;
