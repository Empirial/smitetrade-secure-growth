import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import FieldError from "@/components/ui/FieldError";
import { validateRequired, validateEmail, validatePassword, validatePhone, validateLicensePlate, hasErrors } from "@/utils/validation";

const DriverRegister = () => {
    const navigate = useNavigate();
    const { register } = useStore();
    const [loading, setLoading] = useState(false);
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
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Registering..." : "Sign Up"}
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
