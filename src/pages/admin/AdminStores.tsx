
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { Store, Eye, Ban, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const AdminStores = () => {
    const { stores, products, orders } = useStore();

    // Build store data from context + mock enrichment
    const storeData = (stores.length > 0 ? stores : [
        { id: "s1", name: "Soweto Central Spaza", ownerId: "u1", address: "12 Vilakazi St", suburb: "Soweto", city: "Johannesburg", province: "Gauteng", status: "Active" },
        { id: "s2", name: "Kasi Fresh Market", ownerId: "u2", address: "45 Main Rd", suburb: "Khayelitsha", city: "Cape Town", province: "Western Cape", status: "Active" },
        { id: "s3", name: "Township Goods", ownerId: "u3", address: "7 Mandela Ave", suburb: "Mamelodi", city: "Pretoria", province: "Gauteng", status: "Suspended" },
        { id: "s4", name: "Mzansi Market", ownerId: "u4", address: "22 Freedom St", suburb: "Umlazi", city: "Durban", province: "KZN", status: "Active" },
        { id: "s5", name: "Ubuntu Store", ownerId: "u5", address: "3 Hope Rd", suburb: "Alexandra", city: "Johannesburg", province: "Gauteng", status: "Active" },
    ]).map(store => ({
        ...store,
        productCount: products.filter(p => p.storeId === store.id).length || "—",
        totalSales: orders.filter(o => (o as any).storeId === store.id).reduce((sum, o) => sum + o.total, 0) || 0,
        owner: "Store Owner",
    }));

    const [storeStatuses, setStoreStatuses] = useState<Record<string, string>>({});

    const getStatus = (store: any) => storeStatuses[store.id] || store.status || "Active";

    const toggleStatus = async (storeId: string, currentStatus: string) => {
        const newStatus = currentStatus === "Active" ? "Suspended" : "Active";
        setStoreStatuses(prev => ({ ...prev, [storeId]: newStatus }));
        try {
            await updateDoc(doc(db, "stores", storeId), { status: newStatus });
            toast.success(`Store ${newStatus === "Active" ? "activated" : "suspended"}`);
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

                <div className="grid gap-4 md:grid-cols-3">
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
                                {storeData.map(store => {
                                    const status = getStatus(store);
                                    return (
                                        <TableRow key={store.id}>
                                            <TableCell className="font-medium">{store.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{(store as any).suburb || ""}, {(store as any).city || ""}</TableCell>
                                            <TableCell className="text-center">{store.productCount}</TableCell>
                                            <TableCell className="text-right">R {store.totalSales.toLocaleString()}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={status === "Active" ? "default" : "destructive"}>
                                                    {status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" variant="ghost" onClick={() => toggleStatus(store.id, status)}>
                                                    {status === "Active" ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default AdminStores;
