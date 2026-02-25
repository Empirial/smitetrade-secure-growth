
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Clock, DollarSign, Lock, Receipt } from "lucide-react";

import { useStore } from "@/context/StoreContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const CashierShift = () => {
    // Note: StoreContext may not officially support `recordCashDrop` yet, but we will call it if it exists
    // or simulate it here if it doesn't, to match the UI requirements. 
    // Since we're in Mock UI building phase, we'll mock the state locally if context doesn't have it.
    const { startShift, endShift, currentShift, recordCashDrop } = useStore() as any;

    const [openingFloat, setOpeningFloat] = useState("");
    const [closingCash, setClosingCash] = useState("");
    const [loading, setLoading] = useState(false);

    // Cash Drop State
    const [isDropOpen, setIsDropOpen] = useState(false);
    const [dropAmount, setDropAmount] = useState("");
    const [dropReason, setDropReason] = useState("");

    const handleStartShift = () => {
        if (!openingFloat) {
            toast.error("Please enter opening float amount.");
            return;
        }
        setLoading(true);
        startShift(parseFloat(openingFloat));
        setLoading(false);
        // Toast handled in context
    };

    const handleEndShift = () => {
        if (!closingCash) {
            toast.error("Please enter total cash in drawer.");
            return;
        }
        setLoading(true);
        endShift(parseFloat(closingCash));
        setOpeningFloat("");
        setClosingCash("");
        setLoading(false);
        // Toast handled in context
    };

    const handleRecordDrop = () => {
        if (!dropAmount || isNaN(parseFloat(dropAmount))) {
            toast.error("Please enter a valid amount.");
            return;
        }

        // If context has it, use it. Otherwise mock.
        if (recordCashDrop) {
            recordCashDrop(parseFloat(dropAmount), dropReason || "Owner Collection");
        } else {
            // Fallback mock toast if StoreContext isn't updated simultaneously
            toast.success(`Cash drop of R${parseFloat(dropAmount).toFixed(2)} recorded.`);
        }

        setIsDropOpen(false);
        setDropAmount("");
        setDropReason("");
    };

    return (
        <DashboardLayout role="cashier">
            <div className="space-y-6 max-w-2xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Shift Management</h1>
                    <p className="text-muted-foreground">Start and end your daily shifts securely.</p>
                </div>

                {!currentShift ? (
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
                                Shift started at {new Date(currentShift.startTime).toLocaleTimeString()}.
                                Please count cash in drawer.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-slate-100 rounded-lg flex justify-between items-center mb-4">
                                <span className="text-sm font-medium">Opening Float</span>
                                <span className="font-bold">R {currentShift.openingFloat.toFixed(2)}</span>
                            </div>

                            <div className="space-y-2 pb-4 border-b">
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">Mid-Shift Actions</h3>
                                <Button variant="outline" className="w-full flex items-center justify-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={() => setIsDropOpen(true)}>
                                    <Receipt className="h-4 w-4" />
                                    Record Cash Drop (To Owner)
                                </Button>
                            </div>

                            <div className="space-y-2 pt-2">
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

                {/* Cash Drop Dialog */}
                <Dialog open={isDropOpen} onOpenChange={setIsDropOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Record Cash Drop</DialogTitle>
                            <DialogDescription>Log cash removed from the till during the shift.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Amount (R)</Label>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={dropAmount}
                                    onChange={(e) => setDropAmount(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Reason / Note</Label>
                                <Input
                                    placeholder="e.g. Owner collection, change exchange..."
                                    value={dropReason}
                                    onChange={(e) => setDropReason(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDropOpen(false)}>Cancel</Button>
                            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleRecordDrop}>Save Record</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
};

export default CashierShift;
