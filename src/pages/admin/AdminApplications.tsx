import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, MapPin, Store } from "lucide-react";
import { toast } from "sonner";

const AdminApplications = () => {
    const applications = [
        { id: "1", name: "Thabo's Spaza", owner: "Thabo Molefe", location: "Soweto, Zone 6", date: "2024-02-05", status: "Pending" },
        { id: "2", name: "Mama Grace Provisions", owner: "Grace Nkosi", location: "Diepkloof", date: "2024-02-04", status: "Pending" },
        { id: "3", name: "Alex Corner Store", owner: "David Zulu", location: "Alexandra", date: "2024-02-03", status: "Rejected" },
    ];

    const handleAction = (id: string, action: string) => {
        toast.info(`Application #${id} ${action}`);
    };

    return (
        <DashboardLayout role="admin">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Experience Applications</h1>
            <p className="text-muted-foreground mb-4">Review new Spaza Shop registration requests.</p>

            <div className="grid gap-4">
                {applications.map((app) => (
                    <Card key={app.id}>
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <CardTitle className="flex items-center gap-2">
                                        <Store className="h-5 w-5 text-muted-foreground" />
                                        {app.name}
                                    </CardTitle>
                                    <CardDescription>Owner: {app.owner}</CardDescription>
                                </div>
                                <Badge variant={app.status === "Pending" ? "default" : "destructive"}>{app.status}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                    <MapPin className="h-4 w-4" /> {app.location} • Applied {app.date}
                                </div>
                                {app.status === "Pending" && (
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10 border-destructive/20" onClick={() => handleAction(app.id, "Rejected")}>
                                            <X className="h-4 w-4 mr-1" /> Reject
                                        </Button>
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAction(app.id, "Approved")}>
                                            <Check className="h-4 w-4 mr-1" /> Approve
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </DashboardLayout>
    );
};

export default AdminApplications;
