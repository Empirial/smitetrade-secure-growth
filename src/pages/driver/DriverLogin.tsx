import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Truck, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import FieldError from "@/components/ui/FieldError";
import { validateEmail, validatePassword, hasErrors } from "@/utils/validation";

const DriverLogin = () => {
    const navigate = useNavigate();
    const { login } = useStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({ email: null as string | null, password: null as string | null });
    const [authError, setAuthError] = useState<string | null>(null);

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
            await login(formData.email, formData.password, "driver");
            navigate("/driver/orders");
        } catch (error) {
            setAuthError("Incorrect email or password. Please try again.");
        } finally {
            setLoading(false);
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
                        <Truck className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                        Driver Portal
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Login to access delivery routes
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
                                        placeholder="driver@smitetrade.com"
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

                            <Button type="submit" className="w-full shadow-md" disabled={loading}>
                                {loading ? "Starting Shift..." : "Start Shift"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 pb-8">
                        <div className="text-center text-sm text-muted-foreground">
                            New Driver?{" "}
                            <Link to="/driver/register" className="font-medium text-primary hover:underline">
                                Register Here
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

export default DriverLogin;
