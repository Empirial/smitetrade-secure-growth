import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Package, Users, Megaphone, Store, CreditCard, BarChart3, Headphones, ShieldCheck } from "lucide-react";

const FEATURES = [
    { icon: Package, text: "Unlimited product additions" },
    { icon: Users, text: "Add & manage customers and staff" },
    { icon: CreditCard, text: "Customer tab & lending management" },
    { icon: Store, text: "Supplier & multiple store management" },
    { icon: Megaphone, text: "Create promotions & deals" },
    { icon: BarChart3, text: "Advanced analytics & reports" },
    { icon: ShieldCheck, text: "Expense tracking & stock adjustments" },
    { icon: Headphones, text: "SA support — local team Mon–Fri" },
];

const OwnerSubscription = () => {
    return (
        <DashboardLayout role="owner">
            <div className="max-w-2xl mx-auto space-y-8 pt-4">
                <div className="text-center space-y-3">
                    <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 px-4 py-1.5 text-sm">
                        Free Plan — Active
                    </Badge>
                    <h1 className="text-4xl font-bold tracking-tight">
                        All Features Included
                    </h1>
                    <p className="text-muted-foreground text-base max-w-md mx-auto">
                        SmiteTrade is currently free. Every feature is unlocked — no credit card required.
                    </p>
                </div>

                <Card className="border-emerald-500/30 bg-emerald-500/5">
                    <CardContent className="pt-6">
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {FEATURES.map(({ icon: Icon, text }) => (
                                <li key={text} className="flex items-center gap-3 text-sm">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 shrink-0">
                                        <Icon className="h-4 w-4 text-emerald-400" />
                                    </span>
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <div className="flex justify-center">
                    <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium">
                        <CheckCircle2 className="h-5 w-5" />
                        You have full access — enjoy!
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default OwnerSubscription;
