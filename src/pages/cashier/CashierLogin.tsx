import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Store } from "lucide-react";

const CashierLogin = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-sm shadow-xl border-t-4 border-t-emerald-600">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto bg-emerald-100 p-3 rounded-full w-fit mb-2">
                        <Store className="h-6 w-6 text-emerald-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Cashier Portal</CardTitle>
                    <CardDescription>
                        Enter your cashier ID and PIN
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="id">Cashier ID</Label>
                        <Input id="id" placeholder="C-12345" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="pin">PIN Code</Label>
                        <Input id="pin" type="password" placeholder="••••" required maxLength={4} className="tracking-widest" />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Login to Register</Button>
                    <div className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
                        <Link to="/cashier/register" className="text-primary underline underline-offset-4 hover:text-primary/80">
                            Register New Cashier
                        </Link>
                        <Link to="/" className="text-xs hover:text-primary">
                            ← Back to Main Site
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default CashierLogin;
