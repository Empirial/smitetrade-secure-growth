import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";

const OwnerRegister = () => {
    const navigate = useNavigate();
    const { register } = useStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        storeName: "",
        email: "",
        password: ""
    });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(
                formData.email,
                formData.password,
                `${formData.firstName} ${formData.lastName}`,
                'owner',
                formData.storeName
            );
            navigate("/owner/dashboard");
        } catch (error) {
            // Error handled in context
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center">Register Shop</CardTitle>
                    <CardDescription className="text-center">
                        Create an owner account to start trading
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first-name">First name</Label>
                                <Input 
                                    id="first-name" 
                                    required 
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last-name">Last name</Label>
                                <Input 
                                    id="last-name" 
                                    required 
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="store-name">Store Name</Label>
                            <Input 
                                id="store-name" 
                                placeholder="My Spaza Shop" 
                                required 
                                value={formData.storeName}
                                onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                placeholder="owner@example.com" 
                                required 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input 
                                id="password" 
                                type="password" 
                                required 
                                minLength={6}
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                            {loading ? "Creating Account..." : "Create Account"}
                        </Button>
                        <div className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
                            <div>
                                Already have an account?{" "}
                                <Link to="/owner/login" className="text-primary underline underline-offset-4 hover:text-primary/80">
                                    Sign in
                                </Link>
                            </div>
                            <Link to="/" className="text-xs hover:text-primary">
                                ← Back to Main Site
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default OwnerRegister;
