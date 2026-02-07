
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Clock, DollarSign, Lock } from "lucide-react";

const CashierShift = () => {
    const [shiftActive, setShiftActive] = useState(false);
    const [openingFloat, setOpeningFloat] = useState("");
    const [closingCash, setClosingCash] = useState("");
    const [loading, setLoading] = useState(false);

    const handleStartShift = () => {
        if (!openingFloat) {
            toast.error("Please enter opening float amount.");
            return;
        }
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setShiftActive(true);
            setLoading(false);
            toast.success("Shift started successfully.");
        }, 1000);
    };

    const handleEndShift = () => {
        if (!closingCash) {
            toast.error("Please enter total cash in drawer.");
            return;
        }
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setShiftActive(false);
            setOpeningFloat("");
            setClosingCash("");
            setLoading(false);
            toast.success("Shift ended. Report generated.");
        }, 1000);
    };

    return (
        <DashboardLayout role="cashier">
            <div className="space-y-6 max-w-2xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Shift Management</h1>
                    <p className="text-muted-foreground">Start and end your daily shifts securely.</p>
                </div>

                {!shiftActive ? (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-blue-500" />
                                Start New Shift
                            </CardTitle>
                            <CardDescription>Enter your opening float to begin trading.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="float">Opening Float (R)</Label>
                                <Input
                                    id="float"
                                    type="number"
                                    placeholder="0.00"
                                    value={openingFloat}
                                    onChange={(e) => setOpeningFloat(e.target.value)}
                                />
                            </div>
                            <Button className="w-full" size="lg" onClick={handleStartShift} disabled={loading}>
                                {loading ? "Starting..." : "Start Shift"}
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5 text-red-500" />
                                End Current Shift
                            </CardTitle>
                            <CardDescription>
                                Shift started at {new Date().toLocaleTimeString()}.
                                Please count cash in drawer.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-slate-100 rounded-lg flex justify-between items-center mb-4">
                                <span className="text-sm font-medium">Opening Float</span>
                                <span className="font-bold">R {parseFloat(openingFloat).toFixed(2)}</span>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="closing">Total Cash in Drawer (R)</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="closing"
                                        type="number"
                                        className="pl-8"
                                        placeholder="0.00"
                                        value={closingCash}
                                        onChange={(e) => setClosingCash(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Button variant="destructive" className="w-full" size="lg" onClick={handleEndShift} disabled={loading}>
                                {loading ? "Closing..." : "End Shift & Print Report"}
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
};

export default CashierShift;
