import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Truck } from "lucide-react";

const DriverLogin = () => {
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        navigate("/driver/orders");
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <Card className="w-full max-w-sm border-border shadow-sm">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto bg-muted p-3 rounded-full w-fit mb-2">
                        <Truck className="h-6 w-6 text-foreground" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Driver Portal</CardTitle>
                    <CardDescription>
                        Login to access delivery routes
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Driver Email / ID</Label>
                            <Input id="email" placeholder="D-5501" required />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input id="password" type="password" required />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full">Start Shift</Button>
                        <div className="text-center text-sm text-muted-foreground">
                            New Driver?{" "}
                            <Link to="/driver/register" className="text-primary hover:underline font-medium">
                                Register Here
                            </Link>
                        </div>
                        <Link to="/" className="text-xs hover:text-primary text-center w-full">
                            ← Back to Home
                        </Link>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default DriverLogin;
