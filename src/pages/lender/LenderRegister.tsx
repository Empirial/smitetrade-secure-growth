import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Building2 } from "lucide-react";

const LenderRegister = () => {
    const navigate = useNavigate();
    const { register } = useStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        companyName: "",
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
                'lender',
                formData.companyName
            );
            navigate("/lender/dashboard");
        } catch (error) {
            // Error handled in context
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                        <Building2 className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                        Lender Portal
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Create an account to manage your lending portfolio
                    </p>
                </div>

                <Card className="border-border shadow-xl">
                    <CardContent className="pt-8">
                        <form onSubmit={handleRegister} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first-name">First name</Label>
                                    <Input
                                        id="first-name"
                                        required
                                        className="bg-background"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last-name">Last name</Label>
                                    <Input
                                        id="last-name"
                                        required
                                        className="bg-background"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company-name">Company Name</Label>
                                <Input
                                    id="company-name"
                                    placeholder="My Lending Co."
                                    required
                                    className="bg-background"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="lender@smitetrade.com"
                                    required
                                    className="bg-background"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    className="bg-background"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            <Button type="submit" className="w-full shadow-md" disabled={loading}>
                                {loading ? "Creating Account..." : "Create Account"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 pb-8">
                        <div className="text-center text-sm text-muted-foreground w-full">
                            Already have an account?{" "}
                            <Link to="/lender/login" className="font-medium text-primary hover:underline">
                                Sign in
                            </Link>
                        </div>
                    </CardFooter>
                </Card>

                <div className="text-center text-sm text-muted-foreground mt-8">
                    <Link to="/" className="font-medium hover:text-primary transition-colors">
                        &larr; Back to Main Site
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LenderRegister;
