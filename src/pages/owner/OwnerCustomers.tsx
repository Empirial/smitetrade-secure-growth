import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, CreditCard } from "lucide-react";
import { useState } from "react";

const mockCustomers = [
    { id: 1, name: "Thabo Mbeki", phone: "082 123 4567", totalSpend: 4500, tabBalance: 0, lastVisit: "2026-02-25" },
    { id: 2, name: "Lerato Molefe", phone: "071 987 6543", totalSpend: 1200, tabBalance: 150, lastVisit: "2026-02-24" },
    { id: 3, name: "Sipho Khumalo", phone: "060 555 1234", totalSpend: 8900, tabBalance: 450, lastVisit: "2026-02-26" },
];

const OwnerCustomers = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = mockCustomers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <DashboardLayout role="owner">
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Customer Database</h1>
                        <p className="text-muted-foreground">Manage relationships, credit tabs, and top shoppers.</p>
                    </div>
                    <Button>
                        <User className="mr-2 h-4 w-4" /> Add Customer
                    </Button>
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
                                                <Button variant="outline" size="sm">
                                                    <CreditCard className="h-4 w-4 mr-1" /> Settle
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="sm">Profile</Button>
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

export default OwnerCustomers;
