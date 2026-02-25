import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const pins = [
  { x: "20%", y: "35%", delay: 0 },
  { x: "45%", y: "25%", delay: 0.2 },
  { x: "70%", y: "40%", delay: 0.4 },
  { x: "30%", y: "60%", delay: 0.6 },
  { x: "60%", y: "55%", delay: 0.3 },
  { x: "80%", y: "65%", delay: 0.5 },
  { x: "15%", y: "70%", delay: 0.7 },
  { x: "50%", y: "45%", delay: 0.1 },
];

const DiscoveryMapSection = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Found by{" "}
            <span className="text-gradient-gold">Your Community.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Listing your shop on SMITETRADE means you aren't just a shop on a corner, you're a destination on the map. Let nearby customers find you, browse your shelf, and buy with confidence.
          </p>
        </motion.div>

        {/* Simulated dark map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-2xl overflow-hidden border border-border/50 h-[400px] md:h-[500px]"
          style={{
            background: `
              radial-gradient(ellipse at 50% 50%, hsl(160, 40%, 10%) 0%, hsl(160, 50%, 4%) 100%)
            `,
          }}
        >
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={`h-${i}`}
                className="absolute w-full h-px bg-emerald"
                style={{ top: `${(i + 1) * 8}%` }}
              />
            ))}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={`v-${i}`}
                className="absolute h-full w-px bg-emerald"
                style={{ left: `${(i + 1) * 8}%` }}
              />
            ))}
          </div>

          {/* Roads */}
          <svg className="absolute inset-0 w-full h-full opacity-15">
            <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="hsl(160, 55%, 30%)" strokeWidth="2" />
            <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="hsl(160, 55%, 30%)" strokeWidth="2" />
            <line x1="20%" y1="20%" x2="80%" y2="80%" stroke="hsl(160, 55%, 25%)" strokeWidth="1" />
            <line x1="80%" y1="20%" x2="20%" y2="80%" stroke="hsl(160, 55%, 25%)" strokeWidth="1" />
          </svg>

          {/* Pins */}
          {pins.map((pin, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + pin.delay, duration: 0.4, type: "spring" }}
              className="absolute"
              style={{ left: pin.x, top: pin.y }}
            >
              <div className="relative">
                <MapPin size={28} className="text-emerald fill-emerald/30 drop-shadow-lg" />
                <div className="absolute -inset-2 rounded-full bg-emerald/20 animate-ping" style={{ animationDuration: "3s" }} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default DiscoveryMapSection;
