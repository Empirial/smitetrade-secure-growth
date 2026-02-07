
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { LifeBuoy } from "lucide-react";

const CustomerSupport = () => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API
        setTimeout(() => {
            setLoading(false);
            toast.success("Support ticket created. We will contact you shortly.");
        }, 1500);
    };

    return (
        <DashboardLayout role="customer">
            <div className="max-w-xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4">
                        <LifeBuoy className="h-6 w-6" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">How can we help?</h1>
                    <p className="text-muted-foreground">Report an issue with an order or ask a question.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Contact Support</CardTitle>
                        <CardDescription>Fill out the form below and we'll get back to you.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Issue Type</Label>
                                <Select required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a topic" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="missing">Missing Items</SelectItem>
                                        <SelectItem value="late">Late Delivery</SelectItem>
                                        <SelectItem value="payment">Payment Issue</SelectItem>
                                        <SelectItem value="quality">Product Quality</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="order">Order Number (Optional)</Label>
                                <Input id="order" placeholder="#12345" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Description</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Please describe your issue in detail..."
                                    className="min-h-[120px]"
                                    required
                                />
                            </div>

                            <Button className="w-full" type="submit" disabled={loading}>
                                {loading ? "Submiting Ticket..." : "Submit Request"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default CustomerSupport;
