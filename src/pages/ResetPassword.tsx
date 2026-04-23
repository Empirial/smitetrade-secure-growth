
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import FieldError from "@/components/ui/FieldError";
import { validatePassword, validatePasswordMatch, hasErrors } from "@/utils/validation";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getAuthErrorMessage } from "@/lib/authErrors";
import { useEffect } from "react";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const oobCode = searchParams.get("oobCode") ?? "";
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [codeValid, setCodeValid] = useState<boolean | null>(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ password: null as string | null, confirmPassword: null as string | null });

    useEffect(() => {
        if (!oobCode) { setCodeValid(false); return; }
        verifyPasswordResetCode(auth, oobCode)
            .then((email) => { setEmail(email); setCodeValid(true); })
            .catch(() => setCodeValid(false));
    }, [oobCode]);

    const validate = () => {
        const newErrors = {
            password: validatePassword(password),
            confirmPassword: validatePasswordMatch(password, confirmPassword),
        };
        setErrors(newErrors);
        return !hasErrors(newErrors);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await confirmPasswordReset(auth, oobCode, password);
            toast.success("Password reset successfully. Please log in.");
            navigate("/login");
        } catch (error) {
            toast.error(getAuthErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    if (codeValid === null) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
                <p className="text-muted-foreground">Verifying reset link...</p>
            </div>
        );
    }

    if (!codeValid) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold tracking-tight">Link expired</CardTitle>
                        <CardDescription>
                            This password reset link is invalid or has expired.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link to="/forgot-password" className="underline underline-offset-4 hover:text-primary text-sm">
                            Request a new reset link
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight">Reset password</CardTitle>
                    <CardDescription>
                        Setting a new password for <strong>{email}</strong>
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
