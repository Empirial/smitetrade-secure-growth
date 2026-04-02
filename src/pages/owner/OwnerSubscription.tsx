import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Crown, Zap, Check, Star, ShieldCheck, Headphones, BarChart3, Users, Package, Store, Megaphone, CreditCard, Loader2 } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { usePayfast } from "@/hooks/usePayfast";
import { useStore } from "@/context/StoreContext";

const PLANS = [
    {
        key: "basic",
        name: "Basic",
        price: 99,
        period: "month",
        tagline: "Perfect for getting started",
        gradient: "from-emerald-600 to-teal-600",
        borderColor: "border-emerald-500/40",
        badgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        features: [
            { icon: Package, text: "Unlimited product additions" },
            { icon: Users, text: "Add & manage customers" },
            { icon: CreditCard, text: "Customer tab management" },
            { icon: Store, text: "Supplier management" },
            { icon: BarChart3, text: "Stock adjustments & logs" },
            { icon: ShieldCheck, text: "Expense tracking" },
        ],
    },
    {
        key: "pro",
        name: "Pro",
        price: 199,
        period: "month",
        tagline: "Everything you need to scale",
        gradient: "from-amber-500 to-orange-500",
        borderColor: "border-amber-500/50",
        badgeClass: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        popular: true,
        features: [
            { icon: Package, text: "Everything in Basic" },
            { icon: Users, text: "Unlimited staff accounts" },
            { icon: Megaphone, text: "Create promotions & deals" },
            { icon: Store, text: "Multiple store locations" },
            { icon: CreditCard, text: "Lending & borrower tracking" },
            { icon: BarChart3, text: "Advanced analytics & reports" },
            { icon: Headphones, text: "Priority support" },
        ],
    },
];

const OwnerSubscription = () => {
    const { isPremium, plan } = useSubscription();
    const { subscribe, loading } = usePayfast();
    const { user, currentStore } = useStore();

    const handleActivate = (planKey: string) => {
        const planDef = PLANS.find(p => p.key === planKey);
        if (!planDef) return;
        const planAmount = planDef.price;
        subscribe({
            emailAddress: user?.email || '',
            amount: planAmount,
            itemName: `SmiteTrade ${planDef.name} Plan`,
            customStr1: 'subscription',
            customStr2: currentStore?.id || '',
            frequency: 3,
            cycles: 0,
            recurringAmount: planAmount,
        });
    };

    return (
        <DashboardLayout role="owner">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Hero */}
                <div className="text-center space-y-3 pt-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-400 mb-2">
                        <Crown className="h-4 w-4" />
                        SmiteTrade Premium
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        Unlock Your Store's{" "}
                        <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                            Full Potential
                        </span>
                    </h1>
                    <p className="text-muted-foreground max-w-md mx-auto text-base">
                        Add products, manage staff, create promotions, and grow your spaza shop — all with a SmiteTrade subscription.
                    </p>

                    {isPremium && (
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-4 py-2 text-emerald-400 text-sm font-medium">
                            <Check className="h-4 w-4" />
                            You're on the <strong className="capitalize">{plan}</strong> plan — all features unlocked!
                        </div>
                    )}
                </div>

                {/* Plans */}
                <div className="grid md:grid-cols-2 gap-6">
                    {PLANS.map((p) => (
                        <Card
                            key={p.key}
                            className={`relative overflow-hidden border-2 ${p.borderColor} ${
                                p.popular ? "shadow-xl shadow-amber-500/10" : ""
                            }`}
                        >
                            {p.popular && (
                                <div className="absolute top-0 right-0">
                                    <div className="bg-gradient-to-l from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl flex items-center gap-1">
                                        <Star className="h-3 w-3" />
                                        Most Popular
                                    </div>
                                </div>
                            )}

                            {/* Gradient top bar */}
                            <div className={`h-1.5 bg-gradient-to-r ${p.gradient} w-full`} />

                            <CardHeader className="pt-6 pb-3">
                                <Badge variant="outline" className={`w-fit text-xs mb-2 ${p.badgeClass}`}>
                                    {p.name}
                                </Badge>
                                <div className="flex items-end gap-1">
                                    <span className="text-4xl font-extrabold">R {p.price}</span>
                                    <span className="text-muted-foreground text-sm mb-1.5">/ {p.period}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{p.tagline}</p>
                            </CardHeader>

                            <CardContent className="pb-4">
                                <ul className="space-y-3">
                                    {p.features.map(({ icon: Icon, text }) => (
                                        <li key={text} className="flex items-center gap-3 text-sm">
                                            <span className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${p.gradient} shrink-0`}>
                                                <Icon className="h-3.5 w-3.5 text-white" />
                                            </span>
                                            {text}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            <CardFooter className="pt-2 pb-6">
                                {isPremium && plan === p.key ? (
                                    <Button className="w-full" variant="outline" disabled>
                                        <Check className="h-4 w-4 mr-2 text-emerald-500" />
                                        Current Plan
                                    </Button>
                                ) : (
                                    <Button
                                        className={`w-full font-semibold gap-2 ${
                                            p.popular
                                                ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
                                                : ""
                                        }`}
                                        onClick={() => handleActivate(p.key)}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Zap className="h-4 w-4" />
                                        )}
                                        {loading ? "Redirecting..." : `Activate ${p.name} Plan`}
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Trust signals */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6">
                    {[
                        { icon: ShieldCheck, label: "Secure Payments", sub: "256-bit SSL encryption" },
                        { icon: Star, label: "Cancel Anytime", sub: "No locked-in contracts" },
                        { icon: Headphones, label: "SA Support", sub: "Local team Mon–Fri" },
                    ].map(({ icon: Icon, label, sub }) => (
                        <div key={label} className="flex flex-col items-center text-center gap-1 p-4 rounded-xl border border-border bg-card">
                            <Icon className="h-5 w-5 text-muted-foreground mb-1" />
                            <p className="text-sm font-medium">{label}</p>
                            <p className="text-xs text-muted-foreground">{sub}</p>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default OwnerSubscription;
