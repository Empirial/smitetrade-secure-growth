import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import FieldError from "@/components/ui/FieldError";
import { validateRequired, validateEmail, validatePassword, hasErrors } from "@/utils/validation";

const CashierRegister = () => {
    const navigate = useNavigate();
    const { register } = useStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({
        firstName: null as string | null,
        lastName: null as string | null,
        email: null as string | null,
        password: null as string | null,
    });

    const validate = () => {
        const newErrors = {
            firstName: validateRequired(formData.firstName, "First name"),
            lastName: validateRequired(formData.lastName, "Last name"),
            email: validateEmail(formData.email),
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
                formData.email,
                formData.password,
                `${formData.firstName} ${formData.lastName}`,
                'cashier'
            );
            navigate("/cashier/dashboard");
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
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center">New Cashier Registration</CardTitle>
                    <CardDescription className="text-center">
                        Create a cashier account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister} noValidate>
                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first-name">First name</Label>
                                <Input
                                    id="first-name"
                                    value={formData.firstName}
                                    className={errors.firstName ? "border-destructive focus-visible:ring-destructive" : ""}
                                    onChange={(e) => setField("firstName", e.target.value)}
                                />
                                <FieldError message={errors.firstName} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last-name">Last name</Label>
                                <Input
                                    id="last-name"
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
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                            {loading ? "Registering..." : "Register Profile"}
                        </Button>
                        <div className="text-center text-sm">
                            <Link to="/cashier/login" className="text-primary underline">
                                Back to Login
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default CashierRegister;
