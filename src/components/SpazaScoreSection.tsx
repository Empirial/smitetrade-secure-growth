import { motion } from "framer-motion";
import { Shield, Eye } from "lucide-react";

const RepaymentBehaviourGauge = () => {
  // SVG semicircular gauge — viewBox 0 0 200 120
  // Semicircle arc from left (180°) to right (0°), cx=100 cy=100 r=80
  const cx = 100;
  const cy = 100;
  const r = 80;
  const strokeW = 18;

  const polar = (angleDeg: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy - r * Math.sin(rad),
    };
  };

  const arcPath = (startDeg: number, endDeg: number) => {
    const start = polar(startDeg);
    const end = polar(endDeg);
    const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  };

  // Tiers left to right: Bronze 180-135, Silver 135-90, Gold 90-45, Platinum 45-0
  const tiers = [
    { start: 180, end: 135, color: "#ef4444", label: "Bronze" },
    { start: 135, end: 90,  color: "#94a3b8", label: "Silver" },
    { start: 90,  end: 45,  color: "#eab308", label: "Gold"   },
    { start: 45,  end: 0,   color: "#10b981", label: "Platinum" },
  ];

  // Needle points to midpoint of Gold tier: 67.5°
  const needleAngleDeg = 67.5;
  const needleRad = (needleAngleDeg * Math.PI) / 180;
  const needleLen = r - 8;
  const needleTip = {
    x: cx + needleLen * Math.cos(needleRad),
    y: cy - needleLen * Math.sin(needleRad),
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        viewBox="0 0 200 120"
        className="w-64 md:w-80"
        aria-label="BRI Score gauge showing Gold tier"
      >
        {/* Background track */}
        <path
          d={arcPath(180, 0)}
          fill="none"
          stroke="#1f2937"
          strokeWidth={strokeW}
          strokeLinecap="butt"
        />

        {/* Tier segments */}
        {tiers.map((tier) => (
          <path
            key={tier.label}
            d={arcPath(tier.start, tier.end)}
            fill="none"
            stroke={tier.color}
            strokeWidth={strokeW}
            strokeLinecap="butt"
            opacity={tier.label === "Gold" ? 1 : 0.45}
          />
        ))}

        {/* Divider lines between tiers */}
        {[135, 90, 45].map((deg) => {
          const inner = {
            x: cx + (r - strokeW / 2 - 1) * Math.cos((deg * Math.PI) / 180),
            y: cy - (r - strokeW / 2 - 1) * Math.sin((deg * Math.PI) / 180),
          };
          const outer = {
            x: cx + (r + strokeW / 2 + 1) * Math.cos((deg * Math.PI) / 180),
            y: cy - (r + strokeW / 2 + 1) * Math.sin((deg * Math.PI) / 180),
          };
          return (
            <line
              key={deg}
              x1={inner.x} y1={inner.y}
              x2={outer.x} y2={outer.y}
              stroke="#0f172a"
              strokeWidth={2.5}
            />
          );
        })}

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needleTip.x}
          y2={needleTip.y}
          stroke="#f9fafb"
          strokeWidth={2.5}
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="-180 100 100"
            to="0 100 100"
            dur="1.4s"
            begin="0.3s"
            fill="freeze"
            calcMode="spline"
            keySplines="0.4 0 0.2 1"
            keyTimes="0;1"
          />
        </line>

        {/* Needle pivot */}
        <circle cx={cx} cy={cy} r={5} fill="#f9fafb" />
        <circle cx={cx} cy={cy} r={2.5} fill="#0f172a" />

        {/* Tier labels */}
        <text x="14"  y="112" fontSize="7" fill="#ef4444" opacity="0.75" textAnchor="middle" fontFamily="Inter,sans-serif">Bronze</text>
        <text x="52"  y="84"  fontSize="7" fill="#94a3b8" opacity="0.75" textAnchor="middle" fontFamily="Inter,sans-serif">Silver</text>
        <text x="100" y="70"  fontSize="7" fill="#eab308" opacity="1"    textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="700">Gold</text>
        <text x="148" y="84"  fontSize="7" fill="#10b981" opacity="0.75" textAnchor="middle" fontFamily="Inter,sans-serif">Platinum</text>

        {/* Score text */}
        <text x={cx} y={cx - 4} fontSize="22" fontWeight="700" fill="#eab308" textAnchor="middle" fontFamily="Inter,sans-serif">742</text>
        <text x={cx} y={cx + 12} fontSize="8" fill="#eab308" textAnchor="middle" fontFamily="Inter,sans-serif" letterSpacing="2">GOLD TIER</text>
      </svg>
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
              Meet BRI Score. We use real data: sales consistency, profit stability, and debt discipline, to give your customers an explicit tier they can finally use. No more paper ledgers; just smart lending.
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
              <p className="text-center text-sm text-muted-foreground mb-4 font-[Orbitron] tracking-wider uppercase">BRI Score</p>
              <RepaymentBehaviourGauge />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SpazaScoreSection;
