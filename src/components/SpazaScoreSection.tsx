import { motion } from "framer-motion";
import { Shield, Eye } from "lucide-react";

const RepaymentBehaviourGauge = () => {
  return (
    <div className="relative w-48 h-32 md:w-80 md:h-48 flex items-center justify-center">
      <div className="text-center space-y-2">
        <div className="text-2xl md:text-3xl font-bold text-gradient-gold font-[Orbitron]">Pays On Time</div>
        <div className="text-emerald-500 font-semibold tracking-wide uppercase text-sm">Gold Tier</div>
      </div>
    </div>
  );
};

const SpazaScoreSection = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-gold/5 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Revolutionizing{" "}
              <span className="text-gradient-gold">Community Credit.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Meet Repayment behaviour. We use real data: sales consistency, profit stability, and debt discipline, to give your customers an explicit tier they can finally use. No more paper ledgers; just smart lending.
            </p>

            <div className="space-y-6">
              <div className="glass-card p-5 flex gap-4 items-start">
                <div className="p-2.5 rounded-lg bg-electric/10 text-electric shrink-0">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1 font-[Orbitron] text-sm">SS-ID</h3>
                  <p className="text-muted-foreground text-sm">
                    Give every customer a digital identity that travels with them to any shop in the network.
                  </p>
                </div>
              </div>

              <div className="glass-card p-5 flex gap-4 items-start">
                <div className="p-2.5 rounded-lg bg-emerald/20 text-emerald shrink-0">
                  <Eye size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1 font-[Orbitron] text-sm">Privacy First</h3>
                  <p className="text-muted-foreground text-sm">
                    We mask sensitive ID data, showing only what's necessary to protect your clients while you build trust.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Gauge */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="glass-card p-10 glow-gold">
              <p className="text-center text-sm text-muted-foreground mb-4 font-[Orbitron] tracking-wider uppercase">Repayment behaviour</p>
              <RepaymentBehaviourGauge />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SpazaScoreSection;
