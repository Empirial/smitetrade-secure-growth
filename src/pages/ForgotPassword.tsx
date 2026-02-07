
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            toast.success("Password reset link sent to your email.");
        }, 1500);
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
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Link"}
                        </Button>
                        <div className="text-center text-sm">
                            Remember your password?{" "}
                            <Link to="/login" className="underline underline-offset-4 hover:text-primary">
                                Login
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPassword;
