import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CustomerCart = () => {
    return (
        <DashboardLayout role="customer">
            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>

                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <Card key={i} className="flex flex-row items-center p-4 gap-4">
                                <div className="h-20 w-20 bg-muted rounded-md flex items-center justify-center text-2xl">
                                    {i === 1 ? "🌽" : "🌻"}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium">{i === 1 ? "Maize Meal 10kg" : "Cooking Oil 2L"}</h3>
                                    <p className="text-sm text-muted-foreground">R {i === 1 ? "120.00" : "85.00"} x 1</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">R {i === 1 ? "120.00" : "85.00"}</p>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>R 205.00</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Delivery Fee</span>
                                <span>R 15.00</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>R 220.00</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link to="/customer/checkout" className="w-full">
                                <Button className="w-full">
                                    Checkout <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CustomerCart;
