import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";

const CashierLogin = () => {
    const navigate = useNavigate();
    const { login } = useStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(formData.email, formData.password);
            navigate("/cashier/dashboard");
        } catch (error) {
            // Error handled in context
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-sm shadow-xl border-t-4 border-t-emerald-600">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto bg-emerald-100 p-3 rounded-full w-fit mb-2">
                        <Store className="h-6 w-6 text-emerald-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Cashier Portal</CardTitle>
                    <CardDescription>
                        Login with your credentials
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="cashier@smitetrade.com"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link to="/forgot-password" className="text-xs text-primary underline underline-offset-4 hover:text-primary/80">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                            {loading ? "Verifying..." : "Login"}
                        </Button>
                        <div className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
                            <Link to="/cashier/register" className="text-primary underline underline-offset-4 hover:text-primary/80">
                                Register New Cashier
                            </Link>
                            <Link to="/" className="text-xs hover:text-primary">
                                ← Back to Main Site
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div >
    );
};

export default CashierLogin;
