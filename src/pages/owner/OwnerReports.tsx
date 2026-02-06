import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CalendarIcon, Download, TrendingUp, DollarSign, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";

const transactions = [
    { id: "TRX-001", date: "2024-03-01", time: "08:30", items: 5, total: 120.00, method: "Cash", status: "Completed" },
    { id: "TRX-002", date: "2024-03-01", time: "09:15", items: 2, total: 45.50, method: "Card", status: "Completed" },
    { id: "TRX-003", date: "2024-03-01", time: "09:45", items: 1, total: 18.00, method: "Cash", status: "Completed" },
    { id: "TRX-004", date: "2024-03-01", time: "10:20", items: 8, total: 350.00, method: "Card", status: "Completed" },
    { id: "TRX-005", date: "2024-03-01", time: "11:00", items: 3, total: 85.00, method: "Cash", status: "Completed" },
];

const OwnerReports = () => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
        <DashboardLayout role="owner">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
                        <p className="text-muted-foreground">View detailed sales history and export data.</p>
                    </div>
                    <div className="flex gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[240px] justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" /> Export
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">R 618.50</div>
                            <p className="text-xs text-muted-foreground">For selected date</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">5</div>
                            <p className="text-xs text-muted-foreground">For selected date</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">R 123.70</div>
                            <p className="text-xs text-muted-foreground">+2.5% vs yesterday</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Transaction Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Transactions</CardTitle>
                        <CardDescription>List of all sales for {date ? format(date, "MMMM do, yyyy") : "Selected Date"}.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Transaction ID</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead>Payment Method</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((trx) => (
                                    <TableRow key={trx.id}>
                                        <TableCell className="font-medium">{trx.id}</TableCell>
                                        <TableCell>{trx.time}</TableCell>
                                        <TableCell>{trx.items}</TableCell>
                                        <TableCell>{trx.method}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {trx.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-bold">R {trx.total.toFixed(2)}</TableCell>
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

export default OwnerReports;
