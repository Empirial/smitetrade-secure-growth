import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const CashierRegister = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success("Cashier profile created! Your ID is C-9988.");
            navigate("/cashier/login");
        }, 1500);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center">New Cashier Registration</CardTitle>
                    <CardDescription className="text-center">
                        Link a new cashier profile to a store
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="store-code">Store Code</Label>
                            <Input id="store-code" placeholder="S-XXXXXX" required />
                            <p className="text-xs text-muted-foreground">Ask the shop owner for the store code.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first-name">First name</Label>
                                <Input id="first-name" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last-name">Last name</Label>
                                <Input id="last-name" required />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="pin">Create PIN</Label>
                            <Input id="pin" type="password" placeholder="4-digit PIN" maxLength={4} required />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                            {loading ? "Registering..." : "Register Profile"}
                        </Button>
                        <div className="text-center text-sm">
                            <Link to="/cashier/login" className="text-primary underline">
                                Back to Login
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default CashierRegister;
