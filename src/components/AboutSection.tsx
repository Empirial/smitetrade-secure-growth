import { motion } from "framer-motion";
import { Store, ShoppingCart, Truck, Shield, Users, Zap } from "lucide-react";

const roles = [
  {
    icon: Store,
    title: "Shop Owners",
    description: "Manage inventory easily, receive customer orders, and grow your business with real-time insights.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: ShoppingCart,
    title: "Customers",
    description: "Order groceries from local shops, request quotes using your own list, and get fast delivery.",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Truck,
    title: "Drivers",
    description: "Register and earn per delivery. Work within your local area on your own schedule.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
  },
];

const fintechFeatures = [
  { icon: Shield, label: "Secure Payments" },
  { icon: Users, label: "Stokvel Support" },
  { icon: ShoppingCart, label: "Bulk & Funeral Grocery Orders" },
  { icon: Zap, label: "Future Credit & Lending Solutions" },
];

const extraBenefits = [
  "Supports local businesses",
  "Creates jobs in your community",
  "Convenient and fast ordering",
  "Ideal for bulk and event shopping",
];

const AboutSection = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full bg-emerald/5 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-20">

        {/* What is SmiteTrade */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="text-xs font-bold tracking-widest uppercase text-emerald-400 mb-3 font-[Orbitron]">About</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            What is <span className="text-gradient-gold">SmiteTrade?</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            SmiteTrade is a fintech platform that helps businesses manage stock and sales,
            customers order groceries easily, and drivers earn by delivering goods —
            all connected in one community-powered platform.
          </p>
        </motion.div>

        {/* Who Can Use */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h3 className="text-2xl md:text-3xl font-bold">
              Who Can Use <span className="text-gradient-blue">SmiteTrade?</span>
            </h3>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {roles.map((role, i) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`glass-card border rounded-2xl p-6 ${role.bg}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${role.bg} border`}>
                  <role.icon className={`w-5 h-5 ${role.color}`} />
                </div>
                <h4 className={`font-bold text-lg mb-2 ${role.color}`}>{role.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{role.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Fintech Features + Extra Benefits */}
        <div className="grid md:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card border border-border/50 rounded-2xl p-8"
          >
            <p className="text-xs font-bold tracking-widest uppercase text-emerald-400 mb-3 font-[Orbitron]">Fintech</p>
            <h3 className="text-xl font-bold mb-6">Fintech Features</h3>
            <div className="space-y-4">
              {fintechFeatures.map((f) => (
                <div key={f.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <f.icon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">{f.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card border border-border/50 rounded-2xl p-8"
          >
            <p className="text-xs font-bold tracking-widest uppercase text-blue-400 mb-3 font-[Orbitron]">Benefits</p>
            <h3 className="text-xl font-bold mb-6">Extra Benefits</h3>
            <div className="space-y-4">
              {extraBenefits.map((b) => (
                <div key={b} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                  <span className="text-sm text-muted-foreground">{b}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
