import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, CreditCard } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useStore } from "@/context/StoreContext";
import { toast } from "sonner";

const OwnerCustomers = () => {
    const { customers, addCustomer, settleCustomerTab } = useStore();
    const [searchTerm, setSearchTerm] = useState("");

    // Add State
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });

    // Settle State
    const [isSettleOpen, setIsSettleOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [settleAmount, setSettleAmount] = useState("");

    // Profile State
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const filtered = customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleAddCustomer = async () => {
        if (!newCustomer.name || !newCustomer.phone) {
            toast.error("Name and phone are required");
            return;
        }
        await addCustomer({
            name: newCustomer.name,
            phone: newCustomer.phone,
        });
        setIsAddOpen(false);
        setNewCustomer({ name: "", phone: "" });
    };

    const handleSettle = async () => {
        const amount = parseFloat(settleAmount);
        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid amount.");
            return;
        }

        await settleCustomerTab(selectedCustomer.id, amount);
        setIsSettleOpen(false);
        setSettleAmount("");
    };

    const openSettleDialog = (customer: any) => {
        setSelectedCustomer(customer);
        setSettleAmount(customer.tabBalance.toString());
        setIsSettleOpen(true);
    };

    const openProfileDialog = (customer: any) => {
        setSelectedCustomer(customer);
        setIsProfileOpen(true);
    };

    return (
        <DashboardLayout role="owner">
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Customer Database</h1>
                        <p className="text-muted-foreground">Manage relationships, credit tabs, and top shoppers.</p>
                    </div>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <User className="mr-2 h-4 w-4" /> Add Customer
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Customer</DialogTitle>
                                <DialogDescription>Register a new store visitor.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input value={newCustomer.name} onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone Number</Label>
                                    <Input value={newCustomer.phone} onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddCustomer}>Save Customer</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search customers..."
                            className="pl-8 max-w-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Customer Directory</CardTitle>
                        <CardDescription>All registered customers and manual store credit.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Lifetime Spend</TableHead>
                                    <TableHead>Store Tab</TableHead>
                                    <TableHead>Last Visit</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell className="font-medium">{customer.name}</TableCell>
                                        <TableCell>{customer.phone}</TableCell>
                                        <TableCell>R {customer.totalSpend.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${customer.tabBalance > 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                                                R {customer.tabBalance.toFixed(2)}
                                            </span>
                                        </TableCell>
                                        <TableCell>{customer.lastVisit}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            {customer.tabBalance > 0 && (
                                                <Button variant="outline" size="sm" onClick={() => openSettleDialog(customer)}>
                                                    <CreditCard className="h-4 w-4 mr-1" /> Settle
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="sm" onClick={() => openProfileDialog(customer)}>Profile</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Settle Dialog */}
                <Dialog open={isSettleOpen} onOpenChange={setIsSettleOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Settle Credit Tab</DialogTitle>
                            <DialogDescription>
                                Current outstanding balance for {selectedCustomer?.name} is R {selectedCustomer?.tabBalance.toFixed(2)}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Amount to Settle (R)</Label>
                                <Input
                                    type="number"
                                    value={settleAmount}
                                    onChange={e => setSettleAmount(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleSettle}>Process Payment</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Profile Dialog */}
                <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Customer Profile</DialogTitle>
                        </DialogHeader>
                        {selectedCustomer && (
                            <div className="space-y-6 pt-4">
                                <div className="flex items-center gap-4 border-b pb-4">
                                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl font-bold">
                                        {selectedCustomer.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{selectedCustomer.name}</h3>
                                        <p className="text-muted-foreground">{selectedCustomer.phone}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Card>
                                        <CardContent className="p-4 flex flex-col items-center text-center">
                                            <span className="text-sm text-muted-foreground">Lifetime Spend</span>
                                            <span className="text-xl font-bold">R {selectedCustomer.totalSpend.toFixed(2)}</span>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-4 flex flex-col items-center text-center">
                                            <span className="text-sm text-muted-foreground">Current Tab</span>
                                            <span className={`text-xl font-bold ${selectedCustomer.tabBalance > 0 ? "text-red-500" : "text-green-500"}`}>
                                                R {selectedCustomer.tabBalance.toFixed(2)}
                                            </span>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm">Recent Activity</h4>
                                    <p className="text-sm text-muted-foreground">Last visit was on {selectedCustomer.lastVisit}.</p>
                                    {/* Can expand with true purchase history later */}
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsProfileOpen(false)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </DashboardLayout >
    );
};

export default OwnerCustomers;
