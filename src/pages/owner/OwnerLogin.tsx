import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { Briefcase, AlertCircle } from "lucide-react";

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);
import FieldError from "@/components/ui/FieldError";
import { validateEmail, validatePassword, hasErrors } from "@/utils/validation";

const OwnerLogin = () => {
    const navigate = useNavigate();
    const { login, loginWithGoogle, user, currentStore } = useStore();
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({ email: null as string | null, password: null as string | null });
    const [authError, setAuthError] = useState<string | null>(null);

    useEffect(() => {
        if (!user || user.role !== "owner") return;
        // Wait for store to load before deciding where to send the owner
        if (currentStore === null) return;
        if (currentStore.status === "Pending") {
            navigate("/owner/pending", { replace: true });
        } else {
            navigate("/owner/dashboard", { replace: true });
        }
    }, [user, currentStore, navigate]);

    const validate = () => {
        const newErrors = {
            email: validateEmail(formData.email),
            password: validatePassword(formData.password),
        };
        setErrors(newErrors);
        return !hasErrors(newErrors);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError(null);
        if (!validate()) return;
        setLoading(true);
        try {
            await login(formData.email, formData.password, "owner");
        } catch (error) {
            setAuthError("Incorrect email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        try {
            await loginWithGoogle("owner");
        } catch {
            // error already toasted in context
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleChange = (field: "email" | "password", value: string) => {
        setFormData({ ...formData, [field]: value });
        setErrors({ ...errors, [field]: null });
        setAuthError(null);
    };

    return (
        <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                        <Briefcase className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                        Owner Portal
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Login to manage your business
                    </p>
                </div>

                <Card className="border-border shadow-xl">
                    <CardContent className="pt-8">
                        <form onSubmit={handleLogin} className="space-y-6" noValidate>
                            {authError && (
                                <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    {authError}
                                </div>
                            )}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="owner@smitetrade.com"
                                        className={`bg-background ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                        value={formData.email}
                                        onChange={(e) => handleChange("email", e.target.value)}
                                    />
                                    <FieldError message={errors.email} />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        className={`bg-background ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                        value={formData.password}
                                        onChange={(e) => handleChange("password", e.target.value)}
                                    />
                                    <FieldError message={errors.password} />
                                </div>
                            </div>

                            <Button type="submit" className="w-full shadow-md" disabled={loading || googleLoading}>
                                {loading ? "Signing in..." : "Sign in"}
                            </Button>
                        </form>
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">or continue with</span>
                            </div>
                        </div>
                        <Button type="button" variant="outline" className="w-full" disabled={loading || googleLoading} onClick={handleGoogleLogin}>
                            {googleLoading ? "Redirecting..." : <><GoogleIcon />Continue with Google</>}
                        </Button>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 pb-8">
                        <div className="text-center text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link to="/owner/register" className="font-medium text-primary hover:underline">
                                Sign up
                            </Link>
                        </div>
                    </CardFooter>
                </Card>

                <div className="text-center text-sm text-muted-foreground mt-8">
                    <Link to="/" className="font-medium hover:text-primary transition-colors">
                        &larr; Back to Main Site
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OwnerLogin;
