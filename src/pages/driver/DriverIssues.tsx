
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useStore } from "@/context/StoreContext";

const DriverIssues = () => {
    const { reportIssue, user } = useStore();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Controlled state
    const [reason, setReason] = useState("customer_unavailable");
    const [notes, setNotes] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            reportIssue({
                driverId: user?.id || "unknown",
                reason,
                notes
            });
            setTimeout(() => navigate(-1), 1000);
        } catch (error) {
            // handle error
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="driver">
            <div className="max-w-md mx-auto space-y-6">
                <div>
                    <Button variant="ghost" className="pl-0 hover:pl-2 transition-all mb-4" onClick={() => navigate(-1)}>
                        Back
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Report Delivery Issue</h1>
                    <p className="text-muted-foreground">Select the reason for delivery failure or delay.</p>
                </div>

                <Card className="border-red-100 dark:border-red-900">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="h-5 w-5" />
                            Delivery Incident Report
                        </CardTitle>
                        <CardDescription>This will be logged in the admin panel.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="reason">Reason</Label>
                                <Select required value={reason} onValueChange={setReason}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a reason" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="customer_unavailable">Customer Unavailable</SelectItem>
                                        <SelectItem value="wrong_address">Wrong Address / Can't Locate</SelectItem>
                                        <SelectItem value="vehicle_issue">Vehicle Breakdown</SelectItem>
                                        <SelectItem value="weather">Weather Delay</SelectItem>
                                        <SelectItem value="safety">Safety Concern</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Additional Notes</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Provide more context..."
                                    className="min-h-[100px]"
                                    required
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>

                            <Button variant="destructive" className="w-full" type="submit" disabled={loading}>
                                {loading ? "Reporting..." : "Submit Report"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default DriverIssues;
