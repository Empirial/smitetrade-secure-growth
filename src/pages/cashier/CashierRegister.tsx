import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

const CashierRegister = () => (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md shadow-lg text-center">
            <CardHeader className="space-y-3">
                <div className="flex justify-center">
                    <div className="h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <ShieldCheck className="h-7 w-7 text-emerald-500" />
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">Cashier Accounts</CardTitle>
                <CardDescription>
                    Cashier accounts are created by your store owner — you cannot self-register.
                    Ask your store owner to add you via the Staff section in their portal.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Once your owner creates your account, you can log in directly.
                </p>
                <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Link to="/cashier/login">Go to Login</Link>
                </Button>
            </CardContent>
        </Card>
    </div>
);

export default CashierRegister;
