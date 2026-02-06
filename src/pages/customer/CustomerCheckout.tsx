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
    const { placeOrder, cartTotal } = useStore();

    // Simple state for the form
    const [address, setAddress] = useState({
        street: "",
        city: "",
        province: "",
        zip: "",
        notes: ""
    });

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();

        // Use global action to place order
        placeOrder({
            name: "Current User", // In a real app we'd get this from 'user' context
            address: `${address.street}, ${address.city}, ${address.province}`
        });

        // Navigate to payment/success
        navigate("/customer/payment");
    };

    return (
        <DashboardLayout role="customer">
            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" /> Delivery Address
                            </CardTitle>
                        </CardHeader>
                        <form id="checkout-form" onSubmit={handleCheckout}>
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

                <div className="md:col-span-1">
                    <Card>
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
                            <Button form="checkout-form" type="submit" className="w-full">
                                Proceed to Payment <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CustomerCheckout;
