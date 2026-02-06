import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Phone, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const DriverOutToDeliver = () => {
    return (
        <DashboardLayout role="driver">
            <h1 className="text-3xl font-bold tracking-tight mb-6 text-green-600 flex items-center gap-2">
                Active Delivery
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
            </h1>

            <Card className="border-green-500/20 shadow-lg">
                <CardHeader>
                    <CardTitle>ORD-992</CardTitle>
                    <CardDescription>Customer: Lerato Nkosi</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                        <MapPin className="h-6 w-6 text-primary shrink-0 mt-1" />
                        <div>
                            <p className="font-bold">123 Main St</p>
                            <p className="text-sm text-muted-foreground">Soweto, Zone 6</p>
                            <p className="text-xs text-muted-foreground mt-1">Gate code: 5521</p>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full">
                        <Phone className="mr-2 h-4 w-4" /> Call Customer
                    </Button>

                    <div className="h-48 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                        [Map View Placeholder]
                    </div>
                </CardContent>
                <CardFooter>
                    <Link to="/driver/delivered" className="w-full">
                        <Button className="w-full h-12 text-lg bg-green-600 hover:bg-green-700">
                            Confirm Delivery <CheckCircle className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </DashboardLayout>
    );
};

export default DriverOutToDeliver;
