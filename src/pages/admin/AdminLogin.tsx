import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const AdminLogin = () => {
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        navigate("/admin/applications");
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
            <Card className="w-full max-w-sm border-gray-800 bg-gray-900 text-gray-100 shadow-xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto bg-gray-800 p-3 rounded-full w-fit mb-2">
                        <ShieldAlert className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Admin Console</CardTitle>
                    <CardDescription className="text-gray-400">
                        Restricted Access
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="id">Admin ID</Label>
                            <Input id="id" placeholder="sysadmin" required className="bg-gray-950 border-gray-800" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required className="bg-gray-950 border-gray-800" />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" variant="secondary" className="w-full">Authenticate</Button>
                        <Link to="/" className="text-xs text-gray-400 hover:text-white text-center w-full">
                            ← Back to Home
                        </Link>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default AdminLogin;
