import { cloneElement, ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Crown, Lock, Zap, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/useSubscription";

interface PremiumGateProps {
    /** The feature name shown in the upgrade dialog */
    feature: string;
    /** The trigger element (e.g. a Button). Must accept onClick. */
    children: ReactElement<{ onClick?: (e: any) => void }>;
    /** Optional short description */
    description?: string;
}

const PLANS = [
    {
        key: "basic",
        name: "Basic",
        price: "R 99",
        period: "/mo",
        color: "border-emerald-500/50 bg-emerald-500/5",
        badge: "bg-emerald-500/20 text-emerald-400",
        features: [
            "Add unlimited products",
            "Add customers & manage tabs",
            "Add suppliers",
            "Log stock adjustments",
            "Log expenses",
        ],
    },
    {
        key: "pro",
        name: "Pro",
        price: "R 199",
        period: "/mo",
        color: "border-amber-500/60 bg-amber-500/5",
        badge: "bg-amber-500/20 text-amber-400",
        popular: true,
        features: [
            "Everything in Basic",
            "Add unlimited staff members",
            "Create promotions & deals",
            "Add multiple store locations",
            "Lending & borrower profiles",
            "Advanced analytics & reports",
            "Priority support",
        ],
    },
];

const PremiumGate = ({ feature, children, description }: PremiumGateProps) => {
    const { isPremium } = useSubscription();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    // If subscribed — render child normally
    if (isPremium) return children;

    const originalOnClick = children.props.onClick;
    const gatedTrigger = {
        ...children.props,
        onClick: (e: any) => {
            e?.preventDefault?.();
            e?.stopPropagation?.();
            setOpen(true);
            originalOnClick?.(e);
        },
    };

    return (
        <>
            {/* Locked trigger — keep original UI but intercept click */}
            <div className="relative inline-flex">
                {cloneElement(children, gatedTrigger)}

                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-md bg-gradient-to-r from-amber-500/20 to-orange-500/20" />
                </div>

                <Badge className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] px-1.5 py-0.5 border-0 shadow flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    PRO
                    <Lock className="h-3 w-3 opacity-80" />
                </Badge>
            </div>

            {/* Upgrade Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader className="text-center pb-2">
                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/15 border border-amber-500/30">
                            <Crown className="h-7 w-7 text-amber-500" />
                        </div>
                        <DialogTitle className="text-xl font-bold">
                            Upgrade to Unlock
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            <strong className="text-foreground">{feature}</strong> is a premium feature.{" "}
                            {description ?? "Choose a plan below to unlock it and all other premium tools."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-3 mt-2">
                        {PLANS.map((plan) => (
                            <div
                                key={plan.key}
                                className={`relative rounded-xl border-2 p-4 flex flex-col gap-2 transition-all ${plan.color}`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <Badge className="bg-amber-500 text-white border-0 text-xs px-2 py-0.5 flex items-center gap-1">
                                            <Star className="h-3 w-3" />
                                            Most Popular
                                        </Badge>
                                    </div>
                                )}
                                <div>
                                    <Badge className={`${plan.badge} border-0 text-xs mb-1`}>
                                        {plan.name}
                                    </Badge>
                                    <div className="flex items-end gap-0.5 mt-1">
                                        <span className="text-2xl font-bold">{plan.price}</span>
                                        <span className="text-xs text-muted-foreground mb-1">{plan.period}</span>
                                    </div>
                                </div>
                                <ul className="space-y-1 flex-1">
                                    {plan.features.map((f) => (
                                        <li key={f} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                            <Zap className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    size="sm"
                                    className={
                                        plan.popular
                                            ? "bg-amber-500 hover:bg-amber-600 text-white w-full mt-2 gap-1"
                                            : "w-full mt-2 gap-1"
                                    }
                                    onClick={() => {
                                        setOpen(false);
                                        navigate("/owner/subscription");
                                    }}
                                >
                                    Get {plan.name}
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-3 flex justify-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground text-xs"
                            onClick={() => setOpen(false)}
                        >
                            Maybe later
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default PremiumGate;
