import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useCredit } from "@/context/CreditContext";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Banknote, Store } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const CustomerCheckout = () => {
    const navigate = useNavigate();
    const { placeOrder, cartTotal, cart } = useStore();
    const { profile, purchaseOnCredit, simulatePayment } = useCredit();

    // Simple state for the form
    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [selectedStore, setSelectedStore] = useState("store_001");

    const [address, setAddress] = useState({
        street: "",
        city: "",
        province: "",
        zip: "",
        notes: ""
    });

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleCheckout = async () => {
        const total = cartTotal + 20; // + Fees

        if (paymentMethod === 'credit') {
            const success = await purchaseOnCredit(total);
            if (!success) return; // Toast handled in context
        } else {
            // Simulate Card Payment
            await simulatePayment(total, new Date());
        }

        // Use global action to placeOrder
        await placeOrder({
            name: "Current User",
            address: `${address.street}, ${address.city}`,
            paymentMethod,
            storeId: selectedStore
        });

        navigate("/customer/payment"); // Or success page
        toast.success("Order Placed Successfully!");
    };

    return (
        <DashboardLayout role="customer">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                        <span className={step === 1 ? "font-bold text-primary" : ""}>1. Address</span>
                        <span>→</span>
                        <span className={step === 2 ? "font-bold text-primary" : ""}>2. Review</span>
                        <span>→</span>
                        <span className={step === 3 ? "font-bold text-primary" : ""}>3. Payment</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {step === 1 ? (
                        <div className="md:col-span-2 space-y-6 animate-in slide-in-from-left-4 fade-in">
                            <Card className="glass-card">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" /> Delivery Address
                                    </CardTitle>
                                </CardHeader>
                                <form id="address-form" onSubmit={handleNext}>
                                    <CardContent className="grid gap-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="street">Street Address</Label>
                                                <Input
                                                    id="street"
                                                    placeholder="123 Main St"
                                                    required
                                                    value={address.street}
                                                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="city">City / Township</Label>
                                                <Input
                                                    id="city"
                                                    placeholder="Soweto"
                                                    required
                                                    value={address.city}
                                                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="province">Province</Label>
                                                <Input
                                                    id="province"
                                                    placeholder="Gauteng"
                                                    required
                                                    value={address.province}
                                                    onChange={(e) => setAddress({ ...address, province: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="zip">Postal Code</Label>
                                                <Input
                                                    id="zip"
                                                    placeholder="1818"
                                                    required
                                                    value={address.zip}
                                                    onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="notes">Delivery Instructions</Label>
                                            <Input
                                                id="notes"
                                                placeholder="Gate code, landmarks..."
                                                value={address.notes}
                                                onChange={(e) => setAddress({ ...address, notes: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Select Store</Label>
                                            <Select value={selectedStore} onValueChange={setSelectedStore}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a store" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="store_001">Soweto Central (Nearest - 2km)</SelectItem>
                                                    <SelectItem value="store_002">Diepkloof Branch (5km)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardContent>
                                </form>
                            </Card>
                        </div>
                    ) : step === 2 ? (
                        <div className="md:col-span-2 space-y-6 animate-in slide-in-from-right-4 fade-in">
                            <Card className="glass-card">
                                <CardHeader>
                                    <CardTitle>Review Order</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                                        <h4 className="font-semibold text-sm">Delivery To:</h4>
                                        <p className="text-sm">{address.street}, {address.city}</p>
                                        <p className="text-sm text-muted-foreground">{address.province}, {address.zip}</p>
                                        {address.notes && <p className="text-xs italic mt-1">"{address.notes}"</p>}
                                        <Button variant="link" size="sm" className="px-0 text-primary" onClick={() => setStep(1)}>Edit Address</Button>
                                    </div>

                                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                                        <h4 className="font-semibold text-sm">Fulfilling Store:</h4>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Store className="h-4 w-4" />
                                            <span>{selectedStore === 'store_001' ? 'Soweto Central (Nearest - 2km)' : 'Diepkloof Branch (5km)'}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-sm">Items:</h4>
                                        {cart.map((item: { id: string; name: string; quantity: number; price: number }) => (
                                            <div key={item.id} className="flex justify-between text-sm border-b pb-2 last:border-0">
                                                <span>{item.quantity}x {item.name}</span>
                                                <span>R {(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <div className="md:col-span-2 space-y-6 animate-in slide-in-from-right-4 fade-in">
                            <Card className="glass-card">
                                <CardHeader>
                                    <CardTitle>Payment Method</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 gap-4">
                                        <div>
                                            <RadioGroupItem value="card" id="card" className="peer sr-only" />
                                            <Label
                                                htmlFor="card"
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                            >
                                                <div className="flex w-full items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <CreditCard className="mb-3 h-6 w-6" />
                                                        <span className="font-semibold">Credit/Debit Card</span>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">Instant</span>
                                                </div>
                                                <div className="w-full text-xs text-muted-foreground mt-2">
                                                    Pay securely with your bank card.
                                                </div>
                                            </Label>
                                        </div>
                                        <div>
                                            <RadioGroupItem value="credit" id="credit" className="peer sr-only" />
                                            <Label
                                                htmlFor="credit"
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                            >
                                                <div className="flex w-full items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Banknote className="mb-3 h-6 w-6" />
                                                        <span className="font-semibold">Lender Credit</span>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">Pay Later</span>
                                                </div>
                                                <div className="w-full mt-2 space-y-1">
                                                    <div className="flex justify-between text-xs">
                                                        <span>Available Limit:</span>
                                                        <span className="font-mono">R {profile ? (profile.creditLimit - profile.balance).toFixed(2) : '0.00'}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs">
                                                        <span>Current Balance:</span>
                                                        <span className="font-mono text-red-500">R {profile?.balance.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    <div className="md:col-span-1">
                        <Card className="glass-card sticky top-24">
                            <CardHeader>
                                <CardTitle>Total to Pay</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>R {cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Fees</span>
                                    <span>R 20.00</span>
                                </div>
                                <div className="border-t pt-2 flex justify-between font-bold text-xl">
                                    <span>Total</span>
                                    <span>R {(cartTotal + 20).toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">Including taxes and delivery fees.</p>
                            </CardContent>
                            <CardFooter className="flex gap-2">
                                {step > 1 && (
                                    <Button variant="outline" onClick={handleBack} className="flex-1">
                                        Back
                                    </Button>
                                )}
                                {step === 1 ? (
                                    <Button form="address-form" type="submit" className="flex-1 btn-scale">
                                        Next <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : step === 2 ? (
                                    <Button onClick={() => setStep(3)} className="flex-1 btn-scale">
                                        Proceed to Payment <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button onClick={handleCheckout} className="flex-1 btn-scale bg-emerald-600 hover:bg-emerald-700">
                                        Pay R {(cartTotal + 20).toFixed(2)}
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CustomerCheckout;
