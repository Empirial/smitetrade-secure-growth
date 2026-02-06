import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";

const DriverRegister = () => {
    const navigate = useNavigate();

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        navigate("/driver/orders");
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
                <form onSubmit={handleRegister}>
                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">First Name</Label>
                                <Input id="name" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lastname">Last Name</Label>
                                <Input id="lastname" required />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Mobile Number</Label>
                            <Input id="phone" type="tel" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="license">License Plate</Label>
                            <Input id="license" placeholder="ABC 123 GP" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Create Password</Label>
                            <Input id="password" type="password" required />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full">Sign Up</Button>
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
