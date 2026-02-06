import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CheckCircle2, CreditCard, Banknote } from "lucide-react";

const CustomerPayment = () => {
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    const handlePayment = () => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setSuccess(true);
        }, 2000);
    };

    if (success) {
        return (
            <DashboardLayout role="customer">
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in zoom-in duration-500">
                    <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <CheckCircle2 className="h-12 w-12" />
                    </div>
                    <h1 className="text-3xl font-bold">Payment Successful!</h1>
                    <p className="text-muted-foreground max-w-md">
                        Your order has been confirmed and sent to the shop. You can track your delivery status below.
                    </p>
                    <div className="flex gap-4">
                        <Button onClick={() => navigate("/customer/tracking")} className="w-40">
                            Track Order
                        </Button>
                        <Button variant="outline" onClick={() => navigate("/customer/products")} className="w-40">
                            Continue Shopping
                        </Button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="customer">
            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold tracking-tight">Payment Method</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>Select Payment Option</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <RadioGroup defaultValue="card">
                            <div className="flex items-center justify-between space-x-2 border p-4 rounded-md peer-data-[state=checked]:border-primary">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="card" id="card" />
                                    <Label htmlFor="card" className="flex items-center gap-2 font-medium">
                                        <CreditCard className="h-4 w-4" /> Credit / Debit Card
                                    </Label>
                                </div>
                            </div>
                            <div className="flex items-center justify-between space-x-2 border p-4 rounded-md">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="cod" id="cod" />
                                    <Label htmlFor="cod" className="flex items-center gap-2 font-medium">
                                        <Banknote className="h-4 w-4" /> Cash on Delivery
                                    </Label>
                                </div>
                            </div>
                        </RadioGroup>

                        <div className="grid gap-4 pt-4 border-t">
                            <div className="grid gap-2">
                                <Label>Card Number</Label>
                                <Input placeholder="0000 0000 0000 0000" />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2 col-span-2">
                                    <Label>Expiry Date</Label>
                                    <Input placeholder="MM/YY" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>CVC</Label>
                                    <Input placeholder="123" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full h-12 text-lg" onClick={handlePayment} disabled={processing}>
                            {processing ? "Processing..." : "Pay R 220.00"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default CustomerPayment;
