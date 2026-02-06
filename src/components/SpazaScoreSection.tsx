import { motion } from "framer-motion";
import { Shield, Eye } from "lucide-react";

const SpazaScoreGauge = () => {
  const score = 78;
  const rotation = (score / 100) * 180 - 90;

  return (
    <div className="relative w-64 h-40 md:w-80 md:h-48">
      {/* Gauge background arc */}
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(0, 70%, 50%)" />
            <stop offset="50%" stopColor="hsl(46, 100%, 55%)" />
            <stop offset="100%" stopColor="hsl(120, 60%, 45%)" />
          </linearGradient>
        </defs>
        {/* Background track */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="hsl(160, 30%, 14%)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Colored arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${(score / 100) * 251.2} 251.2`}
        />
        {/* Needle */}
        <motion.line
          x1="100"
          y1="100"
          x2="100"
          y2="30"
          stroke="hsl(46, 100%, 70%)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ rotate: -90, originX: "100px", originY: "100px" }}
          animate={{ rotate: rotation }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          style={{ transformOrigin: "100px 100px" }}
        />
        {/* Center dot */}
        <circle cx="100" cy="100" r="6" fill="hsl(46, 100%, 55%)" />
      </svg>
      {/* Score number */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
        <span className="text-4xl md:text-5xl font-bold text-gradient-gold font-[Orbitron]">{score}</span>
        <span className="text-muted-foreground text-sm block">/100</span>
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
              Meet the SpazaScore. We use real data—sales consistency, profit stability, and debt discipline—to give your customers a score they can finally use. No more paper ledgers; just smart lending.
            </p>

            <div className="space-y-6">
              <div className="glass-card p-5 flex gap-4 items-start">
                <div className="p-2.5 rounded-lg bg-electric/10 text-electric shrink-0">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1 font-[Orbitron] text-sm">SS-ID Passport</h3>
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
              <p className="text-center text-sm text-muted-foreground mb-4 font-[Orbitron] tracking-wider uppercase">SpazaScore</p>
              <SpazaScoreGauge />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SpazaScoreSection;
