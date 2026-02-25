import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Receipt, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const initialExpenses = [
    { id: "EXP-101", date: "2023-10-25 09:30", category: "Supplier Payment", description: "Paid bread delivery cash", amount: 450.00, loggedBy: "Owner" },
    { id: "EXP-102", date: "2023-10-24 12:15", category: "Wages", description: "Paid cleaner for the week", amount: 350.00, loggedBy: "Owner" },
    { id: "EXP-103", date: "2023-10-22 15:45", category: "Utilities", description: "Bought pre-paid electricity", amount: 200.00, loggedBy: "Owner" },
    { id: "EXP-104", date: "2023-10-20 08:00", category: "Transport", description: "Taxi fare for emergency stock", amount: 50.00, loggedBy: "Owner" },
];

const OwnerExpenses = () => {
    const { toast } = useToast();
    const [expenses, setExpenses] = useState(initialExpenses);

    // Form State
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Operational");
    const [description, setDescription] = useState("");

    const handleAddExpense = () => {
        if (!amount || !description) {
            toast({
                title: "Error",
                description: "Please fill in all required fields.",
                variant: "destructive"
            });
            return;
        }

        const newExpense = {
            id: `EXP-${100 + expenses.length + 1}`,
            date: new Date().toLocaleString('en-ZA').replace(',', ''), // format quick
            category,
            description,
            amount: parseFloat(amount),
            loggedBy: "Owner"
        };

        setExpenses([newExpense, ...expenses]);
        setAmount("");
        setDescription("");
        setCategory("Operational");

        toast({
            title: "Expense Logged",
            description: "Petty cash expense successfully recorded."
        });
    };

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    return (
        <DashboardLayout role="owner">
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Expenses & Petty Cash</h1>
                    <p className="text-muted-foreground">Log money taken from the till for business expenses.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="col-span-1 border-dashed border-2 bg-slate-50">
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
                                        <TableRow key={expense.id}>
                                            <TableCell className="text-muted-foreground text-sm">{expense.date}</TableCell>
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
            </div>
        </DashboardLayout>
    );
};

export default OwnerExpenses;
