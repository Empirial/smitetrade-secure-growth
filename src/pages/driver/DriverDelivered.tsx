import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { CheckCheck } from "lucide-react";
import { Link } from "react-router-dom";

const DriverDelivered = () => {
    return (
        <DashboardLayout role="driver">
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in zoom-in duration-500">
                <div className="h-32 w-32 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <CheckCheck className="h-16 w-16" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold">Delivery Complete!</h1>
                    <p className="text-muted-foreground mt-2">ORD-992 has been closed.</p>
                </div>

                <div className="p-4 bg-muted rounded-lg w-full max-w-sm">
                    <div className="flex justify-between text-sm mb-2">
                        <span>Earnings</span>
                        <span className="font-bold">R 45.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Distance</span>
                        <span className="font-bold">3.2 km</span>
                    </div>
                </div>

                <Link to="/driver/orders">
                    <Button size="lg" className="px-8">
                        Back to Orders
                    </Button>
                </Link>
            </div>
        </DashboardLayout>
    );
};

export default DriverDelivered;
