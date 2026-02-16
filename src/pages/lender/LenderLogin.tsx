import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";

const LenderLogin = () => {
    const navigate = useNavigate();
    const { login } = useStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(formData.email, formData.password, "lender");
            navigate("/lender/dashboard");
        } catch (error) {
            // Error handled in context
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Side - Branding */}
            <div className="hidden w-1/2 flex-col justify-between bg-zinc-900 p-10 text-white lg:flex">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <div className="h-8 w-8 rounded bg-white/20" /> {/* Placeholder Logo */}
                    SMITETRADE
                </div>
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">Secure Lending for Small Businesses</h1>
                    <p className="text-lg text-zinc-400">
                        Empower your community with smart, data-driven lending decisions.
                    </p>
                </div>
                <div className="text-sm text-zinc-500">
                    &copy; {new Date().getFullYear()} Smitetrade Inc.
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex w-full items-center justify-center bg-gray-50 px-8 lg:w-1/2">
                <Card className="w-full max-w-sm shadow-none border-0 bg-transparent">
                    <CardHeader className="space-y-1 px-0">
                        <CardTitle className="text-2xl font-bold tracking-tight">Lender Portal</CardTitle>
                        <CardDescription>
                            Login to manage your lending portfolio
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                        <CardContent className="grid gap-4 px-0">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="lender@smitetrade.com"
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
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4 px-0">
                            <Button type="submit" className="w-full bg-zinc-900 hover:bg-zinc-800" disabled={loading}>
                                {loading ? "Signing in..." : "Sign in"}
                            </Button>
                            <div className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
                                <Link to="/" className="text-xs hover:text-primary">
                                    ← Back to Main Site
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default LenderLogin;
