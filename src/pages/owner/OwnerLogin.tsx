import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const OwnerLogin = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-sm shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center">Owner Portal</CardTitle>
                    <CardDescription className="text-center">
                        Login to manage your business
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="owner@smitetrade.com" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" required />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Sign in</Button>
                    <div className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
                        <div>
                            Don't have an account?{" "}
                            <Link to="/owner/register" className="text-primary underline underline-offset-4 hover:text-primary/80">
                                Sign up
                            </Link>
                        </div>
                        <Link to="/" className="text-xs hover:text-primary">
                            ← Back to Main Site
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default OwnerLogin;
