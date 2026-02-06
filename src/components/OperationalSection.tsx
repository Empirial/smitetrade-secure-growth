import { motion } from "framer-motion";
import { Package, ShoppingCart, FileText } from "lucide-react";

const cards = [
  {
    icon: Package,
    title: "Smart Inventory",
    copy: "Never lose a cent to 'missing' stock. Our system automatically tracks every item bought and sold, sending you alerts the second you need to restock.",
    glowClass: "glow-emerald",
  },
  {
    icon: ShoppingCart,
    title: "Wholesale E-Commerce",
    copy: "Skip the queue. Buy directly from wholesalers in-app and watch your delivery vehicle arrive in real-time on our GPS map.",
    glowClass: "glow-blue",
  },
  {
    icon: FileText,
    title: "Bank-Ready Reports",
    copy: "Turn your daily hustle into a professional profile. Generate monthly statements and risk assessments that prove to banks you are ready for the big leagues.",
    glowClass: "glow-gold",
  },
];

const OperationalSection = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-emerald/5 blur-[120px]" />
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
            Operational <span className="text-gradient-blue">Power</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Everything you need to run, grow, and professionalise your business — in one app.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`glass-card p-8 hover:scale-[1.03] transition-transform duration-300 ${card.glowClass}`}
            >
              <div className="p-3 rounded-xl bg-muted/50 w-fit mb-6">
                <card.icon size={28} className="text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-[Orbitron]">{card.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{card.copy}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OperationalSection;
