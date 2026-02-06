import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const CashierRegister = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center">New Cashier Registration</CardTitle>
                    <CardDescription className="text-center">
                        Link a new cashier profile to a store
                    </CardDescription>
                </CardHeader>
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
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Register Profile</Button>
                    <div className="text-center text-sm">
                        <Link to="/cashier/login" className="text-primary underline">
                            Back to Login
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default CashierRegister;
