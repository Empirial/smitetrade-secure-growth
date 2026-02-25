import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Flag, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for shift records
const initialShifts = [
    { id: "SH-105", cashier: "Thabo M.", date: "2023-10-25 18:00", expectedCash: 4500, actualCash: 4450, variance: -50, status: "Pending" },
    { id: "SH-104", cashier: "Sipho D.", date: "2023-10-25 14:00", expectedCash: 3200, actualCash: 3200, variance: 0, status: "Pending" },
    { id: "SH-103", cashier: "Lerato N.", date: "2023-10-24 20:00", expectedCash: 5100, actualCash: 5120, variance: 20, status: "Resolved" },
    { id: "SH-102", cashier: "Thabo M.", date: "2023-10-24 18:00", expectedCash: 4200, actualCash: 4000, variance: -200, status: "Flagged" },
];

const OwnerShiftReviews = () => {
    const { toast } = useToast();
    const [shifts, setShifts] = useState(initialShifts);

    const handleAction = (id: string, action: 'Resolved' | 'Flagged') => {
        setShifts(shifts.map(shift => shift.id === id ? { ...shift, status: action } : shift));

        toast({
            title: `Shift ${action}`,
            description: `Shift ${id} has been marked as ${action.toLowerCase()}.`,
            variant: action === 'Flagged' ? "destructive" : "default",
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Resolved": return "bg-green-100 text-green-800 border-green-200";
            case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Flagged": return "bg-red-100 text-red-800 border-red-200";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getVarianceColor = (variance: number) => {
        if (variance < 0) return "text-red-500 font-medium";
        if (variance > 0) return "text-green-500 font-medium";
        return "text-muted-foreground";
    };

    return (
        <DashboardLayout role="owner">
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Shift Reviews</h1>
                    <p className="text-muted-foreground">Reconcile cashier tills and manage cash variances.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                            <Wallet className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{shifts.filter(s => s.status === 'Pending').length}</div>
                            <p className="text-xs text-muted-foreground">Shifts waiting for approval</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Flagged Shifts</CardTitle>
                            <Flag className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{shifts.filter(s => s.status === 'Flagged').length}</div>
                            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Shortage (Last 7 Days)</CardTitle>
                            <span className="text-red-500 text-sm font-bold">-R 250.00</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">3 Shifts</div>
                            <p className="text-xs text-muted-foreground">Impacted by shortages</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Shifts</CardTitle>
                        <CardDescription>Review and approve end-of-day till declarations.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Shift ID</TableHead>
                                    <TableHead>Cashier</TableHead>
                                    <TableHead>Date / Time</TableHead>
                                    <TableHead className="text-right">System Expected</TableHead>
                                    <TableHead className="text-right">Actual Count</TableHead>
                                    <TableHead className="text-right">Variance</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {shifts.map((shift) => (
                                    <TableRow key={shift.id}>
                                        <TableCell className="font-medium">{shift.id}</TableCell>
                                        <TableCell>{shift.cashier}</TableCell>
                                        <TableCell>{shift.date}</TableCell>
                                        <TableCell className="text-right">R {shift.expectedCash.toFixed(2)}</TableCell>
                                        <TableCell className="text-right font-medium">R {shift.actualCash.toFixed(2)}</TableCell>
                                        <TableCell className={`text-right ${getVarianceColor(shift.variance)}`}>
                                            {shift.variance > 0 ? '+' : ''}R {shift.variance.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getStatusColor(shift.status)}>
                                                {shift.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {shift.status === 'Pending' && (
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 border-green-200 hover:bg-green-50 hover:text-green-700"
                                                        onClick={() => handleAction(shift.id, 'Resolved')}
                                                    >
                                                        <Check className="h-4 w-4 mr-1" /> Accept
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700"
                                                        onClick={() => handleAction(shift.id, 'Flagged')}
                                                    >
                                                        <Flag className="h-4 w-4 mr-1" /> Flag
                                                    </Button>
                                                </div>
                                            )}
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

export default OwnerShiftReviews;
