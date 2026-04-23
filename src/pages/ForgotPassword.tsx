
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import FieldError from "@/components/ui/FieldError";
import { validateEmail } from "@/utils/validation";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getAuthErrorMessage } from "@/lib/authErrors";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const err = validateEmail(email);
        setEmailError(err);
        if (err) return;

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email, {
                url: window.location.origin + "/reset-password",
                handleCodeInApp: false,
            });
            setSent(true);
            toast.success("Password reset email sent. Check your inbox.");
        } catch (error) {
            toast.error(getAuthErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight">Forgot password</CardTitle>
                    <CardDescription>
                        Enter your email address and we will send you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {sent ? (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                A password reset link has been sent to <strong>{email}</strong>. Please check your inbox.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Don't see it? Check your <strong>spam or junk folder</strong>.
                            </p>
                            <div className="text-center text-sm">
                                <Link to="/login" className="underline underline-offset-4 hover:text-primary">
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    className={emailError ? "border-destructive focus-visible:ring-destructive" : ""}
                                    onChange={(e) => { setEmail(e.target.value); setEmailError(null); }}
                                />
                                <FieldError message={emailError} />
                            </div>
                            <Button className="w-full" type="submit" disabled={loading}>
                                {loading ? "Sending..." : "Send Reset Link"}
                            </Button>
                            <p className="text-xs text-muted-foreground text-center">
                                If you don't receive the email within a few minutes, check your spam folder.
                            </p>
                            <div className="text-center text-sm">
                                Remember your password?{" "}
                                <Link to="/login" className="underline underline-offset-4 hover:text-primary">
                                    Login
                                </Link>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPassword;
