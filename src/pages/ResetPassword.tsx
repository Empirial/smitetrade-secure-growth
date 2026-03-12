
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import FieldError from "@/components/ui/FieldError";
import { validatePassword, validatePasswordMatch, hasErrors } from "@/utils/validation";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ password: null as string | null, confirmPassword: null as string | null });
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {
            password: validatePassword(password),
            confirmPassword: validatePasswordMatch(password, confirmPassword),
        };
        setErrors(newErrors);
        return !hasErrors(newErrors);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success("Password has been reset successfully.");
            navigate("/login");
        }, 1500);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight">Reset password</CardTitle>
                    <CardDescription>
                        Enter your new password below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
                                onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: null }); }}
                            />
                            <FieldError message={errors.password} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                className={errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}
                                onChange={(e) => { setConfirmPassword(e.target.value); setErrors({ ...errors, confirmPassword: null }); }}
                            />
                            <FieldError message={errors.confirmPassword} />
                        </div>
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResetPassword;
