
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const SessionExpired = () => {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950">
            <Card className="w-full max-w-md text-center">
                <CardHeader className="space-y-1 flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                        <ShieldAlert className="h-6 w-6 text-yellow-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Session Expired</CardTitle>
                    <CardDescription>
                        Your session has expired due to inactivity or a security update.
                        Please sign in again to continue.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full" onClick={() => navigate("/login")}>
                        Sign In Again
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default SessionExpired;
