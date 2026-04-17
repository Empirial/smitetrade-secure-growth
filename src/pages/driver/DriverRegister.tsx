import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);
import FieldError from "@/components/ui/FieldError";
import { validateRequired, validateEmail, validatePassword, validatePhone, validateLicensePlate, hasErrors } from "@/utils/validation";

const DriverRegister = () => {
    const navigate = useNavigate();
    const { register, loginWithGoogle } = useStore();
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleGoogleSignUp = async () => {
        setGoogleLoading(true);
        try {
            await loginWithGoogle('driver');
            navigate("/driver/orders");
        } catch (_err) {
            // loginWithGoogle handles its own error toasts
        } finally {
            setGoogleLoading(false);
        }
    };
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        license: "",
        password: ""
    });
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({
        firstName: null as string | null,
        lastName: null as string | null,
        email: null as string | null,
        phone: null as string | null,
        license: null as string | null,
        password: null as string | null,
    });

    const validate = () => {
        const newErrors = {
            firstName: validateRequired(formData.firstName, "First name"),
            lastName: validateRequired(formData.lastName, "Last name"),
            email: validateEmail(email),
            phone: validatePhone(formData.phone),
            license: validateLicensePlate(formData.license),
            password: validatePassword(formData.password),
        };
        setErrors(newErrors);
        return !hasErrors(newErrors);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await register(
                email,
                formData.password,
                `${formData.firstName} ${formData.lastName}`,
                'driver'
            );
            navigate("/driver/orders");
        } catch (error) {
            // Error handled in context
        } finally {
            setLoading(false);
        }
    };

    const setField = (field: keyof typeof formData, value: string) => {
        setFormData({ ...formData, [field]: value });
        setErrors({ ...errors, [field]: null });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <Card className="w-full max-w-sm border-border shadow-sm">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">Driver Registration</CardTitle>
                    <CardDescription>
                        Join the logistics network
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister} noValidate>
                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">First Name</Label>
                                <Input
                                    id="name"
                                    value={formData.firstName}
                                    className={errors.firstName ? "border-destructive focus-visible:ring-destructive" : ""}
                                    onChange={(e) => setField("firstName", e.target.value)}
                                />
                                <FieldError message={errors.firstName} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lastname">Last Name</Label>
                                <Input
                                    id="lastname"
                                    value={formData.lastName}
                                    className={errors.lastName ? "border-destructive focus-visible:ring-destructive" : ""}
                                    onChange={(e) => setField("lastName", e.target.value)}
                                />
                                <FieldError message={errors.lastName} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                                onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: null }); }}
                            />
                            <FieldError message={errors.email} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Mobile Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                className={errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
                                onChange={(e) => setField("phone", e.target.value)}
                            />
                            <FieldError message={errors.phone} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="license">License Plate</Label>
                            <Input
                                id="license"
                                placeholder="ABC 123 GP"
                                value={formData.license}
                                className={errors.license ? "border-destructive focus-visible:ring-destructive" : ""}
                                onChange={(e) => setField("license", e.target.value)}
                            />
                            <FieldError message={errors.license} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Create Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
                                onChange={(e) => setField("password", e.target.value)}
                            />
                            <FieldError message={errors.password} />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full" disabled={loading || googleLoading}>
                            {loading ? "Registering..." : "Sign Up"}
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">or</span>
                            </div>
                        </div>
                        <Button type="button" variant="outline" className="w-full" disabled={loading || googleLoading} onClick={handleGoogleSignUp}>
                            {googleLoading ? "Redirecting..." : <><GoogleIcon />Sign up with Google</>}
                        </Button>
                        <div className="text-center text-sm text-muted-foreground">
                            Already registered?{" "}
                            <Link to="/driver/login" className="text-primary hover:underline font-medium">
                                Login
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default DriverRegister;
