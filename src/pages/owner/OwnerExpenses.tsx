import { useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Plus, TrendingDown, Calendar, User, Tag } from "lucide-react";
import { useStore } from "@/context/StoreContext";

const OwnerExpenses = () => {
    const { expenses, addExpense } = useStore();

    // Form State
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Operational");
    const [description, setDescription] = useState("");

    const [selectedExpense, setSelectedExpense] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleRowClick = (expense: any) => {
        setSelectedExpense(expense);
        setIsDialogOpen(true);
    };

    const handleAddExpense = async () => {
        if (!amount || !description) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const parsed = parseFloat(amount);
        if (isNaN(parsed) || parsed <= 0) {
            toast.error("Amount must be a positive number.");
            return;
        }

        try {
            await addExpense({
                category,
                description,
                amount: parsed,
            });

            setAmount("");
            setDescription("");
            setCategory("Operational");

            toast.success("Petty cash expense successfully recorded.");
        } catch {
            // error toast is handled inside addExpense
        }
    };

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    return (
        <DashboardLayout role="owner">
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Expenses & Petty Cash</h1>
                    <p className="text-muted-foreground">Log money taken from the till for business expenses.</p>
                </div>

                <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                    <Card className="col-span-1 border-dashed border-2 bg-transparent">
                        <CardHeader>
                            <CardTitle>Log New Expense</CardTitle>
                            <CardDescription>Record cash removed from shop.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount (R)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Stock & Suppliers">Stock & Suppliers</SelectItem>
                                        <SelectItem value="Wages">Wages</SelectItem>
                                        <SelectItem value="Utilities">Utilities</SelectItem>
                                        <SelectItem value="Transport">Transport</SelectItem>
                                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                                        <SelectItem value="Operational">Operational Expenses</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reason">Description / Reason</Label>
                                <Input
                                    id="reason"
                                    placeholder="e.g. Bought pre-paid electricity"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={handleAddExpense}>
                                <Plus className="w-4 h-4 mr-2" /> Log Expense
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="space-y-1">
                                <CardTitle>Expense History</CardTitle>
                                <CardDescription>Total Logged: <span className="font-bold text-slate-800">R {totalExpenses.toFixed(2)}</span></CardDescription>
                            </div>
                            <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                                <TrendingDown className="h-5 w-5 text-red-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date / Time</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>By</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {expenses.map((expense) => (
                                        <TableRow
                                            key={expense.id}
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => handleRowClick(expense)}
                                        >
                                            <TableCell className="text-muted-foreground text-sm">{new Date(expense.date).toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short" })}</TableCell>
                                            <TableCell className="font-medium">{expense.category}</TableCell>
                                            <TableCell>{expense.description}</TableCell>
                                            <TableCell>{expense.loggedBy}</TableCell>
                                            <TableCell className="text-right font-medium text-red-600">
                                                -R {expense.amount.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {expenses.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                                                No expenses logged yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="w-full max-w-[95vw] sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Expense Details</DialogTitle>
                            <DialogDescription>
                                Reference: {selectedExpense?.id}
                            </DialogDescription>
                        </DialogHeader>
                        {selectedExpense && (
                            <div className="space-y-6 pt-4">
                                <div className="p-4 bg-muted/50 rounded-lg flex items-center justify-between border">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-muted-foreground">Total Amount</span>
                                        <span className="text-2xl font-bold text-red-500">-R {selectedExpense.amount.toFixed(2)}</span>
                                    </div>
                                    <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                                        <TrendingDown className="h-6 w-6 text-red-500" />
                                    </div>
                                </div>
                                <div className="grid gap-4">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-muted-foreground" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">Date & Time</span>
                                            <span className="text-sm text-muted-foreground">{new Date(selectedExpense.date).toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short" })}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Tag className="h-5 w-5 text-muted-foreground" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">Category</span>
                                            <span className="text-sm text-muted-foreground">{selectedExpense.category}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">Logged By</span>
                                            <span className="text-sm text-muted-foreground">{selectedExpense.loggedBy}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">Description / Reason</span>
                                            <span className="text-sm text-muted-foreground">{selectedExpense.description}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

            </div>
        </DashboardLayout>
    );
};

export default OwnerExpenses;
