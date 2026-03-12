import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import FieldError from "@/components/ui/FieldError";
import { validateRequired, validateEmail, validatePassword, validatePhone, hasErrors } from "@/utils/validation";

const CustomerRegister = () => {
    const navigate = useNavigate();
    const { register } = useStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({
        firstName: null as string | null,
        lastName: null as string | null,
        phone: null as string | null,
        email: null as string | null,
        password: null as string | null,
    });

    const validate = () => {
        const newErrors = {
            firstName: validateRequired(formData.firstName, "First name"),
            lastName: validateRequired(formData.lastName, "Last name"),
            phone: validatePhone(formData.phone),
            email: validateEmail(formData.email),
            password: validatePassword(formData.password),
        };
        setErrors(newErrors);
        return !hasErrors(newErrors);
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await register(
                formData.email,
                formData.password,
                `${formData.firstName} ${formData.lastName}`,
                'customer'
            );
            navigate("/customer/products");
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
                    <CardTitle className="text-2xl font-bold tracking-tight">Create Account</CardTitle>
                    <CardDescription>
                        Join the community network
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignup} noValidate>
                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">First Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Lerato"
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
                                    placeholder="Nkosi"
                                    value={formData.lastName}
                                    className={errors.lastName ? "border-destructive focus-visible:ring-destructive" : ""}
                                    onChange={(e) => setField("lastName", e.target.value)}
                                />
                                <FieldError message={errors.lastName} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="082 123 4567"
                                value={formData.phone}
                                className={errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
                                onChange={(e) => setField("phone", e.target.value)}
                            />
                            <FieldError message={errors.phone} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                                onChange={(e) => setField("email", e.target.value)}
                            />
                            <FieldError message={errors.email} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
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
                            {loading ? "Creating Account..." : "Sign Up"}
                        </Button>
                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link to="/customer/login" className="text-primary hover:underline font-medium">
                                Sign in
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default CustomerRegister;
