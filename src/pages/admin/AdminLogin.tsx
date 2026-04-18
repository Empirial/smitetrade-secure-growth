import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { ShieldAlert, AlertCircle } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import FieldError from "@/components/ui/FieldError";
import { validateRequired, validatePassword, hasErrors } from "@/utils/validation";

const AdminLogin = () => {
    const navigate = useNavigate();
    const { login, user } = useStore();
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({ id: null as string | null, password: null as string | null });
    const [authError, setAuthError] = useState<string | null>(null);

    useEffect(() => {
        if (user?.role === "admin") navigate("/admin/dashboard", { replace: true });
    }, [user, navigate]);

    const validate = () => {
        const newErrors = {
            id: validateRequired(id, "Admin ID"),
            password: validatePassword(password),
        };
        setErrors(newErrors);
        return !hasErrors(newErrors);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError(null);
        if (!validate()) return;
        setIsLoading(true);
        try {
            await login(id.includes("@") ? id : `${id}@smitetrade.co.za`, password, "admin");
            navigate("/admin/dashboard");
        } catch {
            setAuthError("Access denied. Invalid credentials or insufficient permissions.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                        <ShieldAlert className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                        Admin Console
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Restricted Access
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
                                    <Label htmlFor="id">Admin ID</Label>
                                    <Input
                                        id="id"
                                        placeholder="sysadmin"
                                        value={id}
                                        onChange={(e) => { setId(e.target.value); setErrors({ ...errors, id: null }); setAuthError(null); }}
                                        className={`bg-background ${errors.id ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    />
                                    <FieldError message={errors.id} />
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
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: null }); setAuthError(null); }}
                                        className={`bg-background ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    />
                                    <FieldError message={errors.password} />
                                </div>
                            </div>

                            <Button type="submit" className="w-full shadow-md" disabled={isLoading}>
                                {isLoading ? "Authenticating..." : "Authenticate"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 pb-8">
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

export default AdminLogin;