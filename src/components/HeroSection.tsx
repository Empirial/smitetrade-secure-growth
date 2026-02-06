import { motion } from "framer-motion";
import logo from "@/assets/smitetrade-logo.jpeg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-electric/5 blur-[100px]" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-gold/5 blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto"
      >
        <img
          src={logo}
          alt="SMITETRADE Shield Logo"
          className="w-40 h-40 md:w-56 md:h-56 object-contain mb-8 drop-shadow-2xl rounded-2xl"
        />

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
        >
          The Sword and Shield for{" "}
          <span className="text-gradient-gold">Your Spaza's Future.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
        >
          Stop guessing your profits. Start securing your growth. SMITETRADE is the all-in-one digital partner that turns your mobile phone into a powerful business command center.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button className="px-8 py-4 rounded-xl bg-accent text-accent-foreground font-semibold text-lg glow-gold hover:scale-105 transition-transform duration-200">
            Register My Business — Join the SaaS Revolution
          </button>
          <button className="px-8 py-4 rounded-xl border-2 border-electric text-electric font-semibold text-lg glow-blue hover:bg-electric/10 hover:scale-105 transition-all duration-200">
            Customer Portal — Access Your SS-ID Wallet
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 z-10"
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 rounded-full bg-gold" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
