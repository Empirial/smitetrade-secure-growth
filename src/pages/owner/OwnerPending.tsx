import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, LogOut, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";

const OwnerPending = () => {
    const { currentStore, logout } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentStore?.status === "Active") {
            navigate("/owner/dashboard", { replace: true });
        }
    }, [currentStore?.status, navigate]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="flex justify-center">
                    <div className="relative">
                        <Store className="h-16 w-16 text-muted-foreground" />
                        <Clock className="h-6 w-6 text-yellow-400 absolute -bottom-1 -right-1" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Store Pending Approval</h1>
                    {currentStore && (
                        <p className="text-muted-foreground text-sm">
                            <span className="font-medium text-foreground">{currentStore.name}</span> is under review.
                        </p>
                    )}
                    <p className="text-muted-foreground text-sm">
                        An admin will approve your store shortly. You'll be able to access your dashboard once approved.
                    </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-sm text-yellow-600 dark:text-yellow-400">
                    This usually takes less than 24 hours. Check back soon.
                </div>

                <Button variant="outline" onClick={logout} className="gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign out
                </Button>
            </div>
        </div>
    );
};

export default OwnerPending;
