import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useState } from "react";

const CustomerCheckout = () => {
    const navigate = useNavigate();
    const { placeOrder, cartTotal, cart } = useStore();

    // Simple state for the form
    const [step, setStep] = useState(1);
    const [address, setAddress] = useState({
        street: "",
        city: "",
        province: "",
        zip: "",
        notes: ""
    });

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handleCheckout = async () => {
        // Use global action to placeOrder
        await placeOrder({
            name: "Current User", // In a real app we'd get this from 'user' context
            address: `${address.street}, ${address.city}, ${address.province}`
        });

        // Navigate to payment/success
        navigate("/customer/payment");
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
                        <span>3. Payment</span>
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
                                    </CardContent>
                                </form>
                            </Card>
                        </div>
                    ) : (
                        <div className="md:col-span-2 space-y-6 animate-in slide-in-from-right-4 fade-in">
                            <Card className="glass-card">
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                                        <h4 className="font-semibold text-sm">Delivery To:</h4>
                                        <p className="text-sm">{address.street}, {address.city}</p>
                                        <p className="text-sm text-muted-foreground">{address.province}, {address.zip}</p>
                                        {address.notes && <p className="text-xs italic mt-1">"{address.notes}"</p>}
                                        <Button variant="link" size="sm" className="px-0 text-primary" onClick={() => setStep(1)}>Edit Address</Button>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-sm">Items:</h4>
                                        {cart.map((item: any) => (
                                            <div key={item.id} className="flex justify-between text-sm border-b pb-2 last:border-0">
                                                <span>{item.quantity}x {item.name}</span>
                                                <span>R {(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
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
                            <CardFooter>
                                {step === 1 ? (
                                    <Button form="address-form" type="submit" className="w-full btn-scale">
                                        Review Order <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button onClick={handleCheckout} className="w-full btn-scale bg-emerald-600 hover:bg-emerald-700">
                                        Confirm & Pay <ArrowRight className="ml-2 h-4 w-4" />
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
