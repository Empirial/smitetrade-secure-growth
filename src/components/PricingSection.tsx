import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  {
    name: "Free",
    price: "R0",
    period: "/month",
    popular: false,
    glowClass: "glow-blue",
    accentClass: "text-blue-400",
    borderClass: "border-border/50",
    features: [
      "Basic POS",
      "Up to 50 products",
      "1 cashier",
      "Basic reports",
    ],
  },
  {
    name: "Growth",
    price: "R99",
    period: "/month",
    popular: true,
    glowClass: "glow-emerald",
    accentClass: "text-emerald-400",
    borderClass: "border-emerald-500/50",
    features: [
      "Unlimited products",
      "3 cashiers",
      "BRI scoring",
      "Supplier access",
      "Delivery tracking",
    ],
  },
  {
    name: "Pro",
    price: "R199",
    period: "/month",
    popular: false,
    glowClass: "glow-gold",
    accentClass: "text-yellow-400",
    borderClass: "border-border/50",
    features: [
      "Everything in Growth",
      "Multiple stores",
      "Advanced analytics",
      "Priority support",
      "API access",
    ],
  },
];

const PricingSection = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-emerald/5 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple,{" "}
            <span className="text-gradient-gold">Transparent Pricing.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Start free. Upgrade when you're ready to grow. No hidden fees, no lock-in.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative flex"
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wider uppercase font-[Orbitron]">
                    Most Popular
                  </span>
                </div>
              )}

              <Card
                className={`
                  glass-card flex flex-col w-full
                  ${plan.glowClass}
                  border ${plan.borderClass}
                  hover:scale-[1.02] transition-transform duration-300
                  ${plan.popular ? "ring-1 ring-emerald-500/40" : ""}
                `}
              >
                <CardHeader className="pb-4">
                  <p className={`text-xs font-bold tracking-widest uppercase mb-2 font-[Orbitron] ${plan.accentClass}`}>
                    {plan.name}
                  </p>
                  <CardTitle className="flex items-end gap-1">
                    <span className="text-4xl font-bold text-foreground font-[Orbitron]">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground text-base mb-1">{plan.period}</span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col flex-1">
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <Check size={16} className={`shrink-0 ${plan.accentClass}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="/owner/register"
                    className={`
                      block w-full text-center py-2.5 px-4 rounded-lg text-sm font-semibold
                      transition-all duration-200
                      ${
                        plan.popular
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                          : "bg-muted/60 hover:bg-muted text-foreground border border-border/60"
                      }
                    `}
                  >
                    Get Started
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
