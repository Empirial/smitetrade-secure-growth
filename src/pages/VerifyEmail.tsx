
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { MailCheck } from "lucide-react";

const VerifyEmail = () => {
    const [resending, setResending] = useState(false);
    const [resent, setResent] = useState(false);

    const handleResend = async () => {
        const user = auth.currentUser;
        if (!user) {
            toast.error("No active session. Please log in and try again.");
            return;
        }
        setResending(true);
        try {
            await sendEmailVerification(user);
            setResent(true);
            toast.success("Verification email resent. Check your inbox.");
        } catch {
            toast.error("Too many requests. Please wait a few minutes before trying again.");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950">
            <Card className="w-full max-w-md text-center">
                <CardHeader className="space-y-3">
                    <div className="flex justify-center">
                        <div className="h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <MailCheck className="h-7 w-7 text-emerald-500" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Check your email</CardTitle>
                    <CardDescription>
                        We sent a verification link to your email address. Click the link to activate your account before logging in.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Don't see it? Check your <strong>spam or junk folder</strong>.
                    </p>
                    {!resent ? (
                        <Button variant="outline" className="w-full" onClick={handleResend} disabled={resending}>
                            {resending ? "Sending..." : "Resend verification email"}
                        </Button>
                    ) : (
                        <p className="text-sm text-emerald-600 font-medium">Email resent successfully.</p>
                    )}
                    <div className="text-sm text-muted-foreground">
                        Already verified?{" "}
                        <Link to="/login" className="underline underline-offset-4 hover:text-primary">
                            Back to Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default VerifyEmail;
