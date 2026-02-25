import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const stats = [
    { value: 500, label: "Targeting Registered Shops", suffix: "+" },
    { value: 2, label: "Targeting Transactions Processed", suffix: "M+", prefix: "R" },
    { value: 10000, label: "Targeting Active Users", suffix: "+" },
];

const Counter = ({ from, to, duration = 2, prefix = "", suffix = "" }: any) => {
    const nodeRef = useRef<HTMLSpanElement>(null);
    const inView = useInView(nodeRef, { once: true });

    useEffect(() => {
        if (!inView) return;

        const node = nodeRef.current;
        const controls = { value: from };

        let startTime: number;

        const animate = (time: number) => {
            if (!startTime) startTime = time;
            const progress = Math.min((time - startTime) / (duration * 1000), 1);

            // Ease out quart
            const ease = 1 - Math.pow(1 - progress, 4);

            const current = Math.floor(controls.value + (to - controls.value) * ease);

            if (node) {
                node.textContent = `${prefix}${current.toLocaleString()}${suffix}`;
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);

    }, [inView, from, to, duration, prefix, suffix]);

    return <span ref={nodeRef} className="font-bold text-4xl md:text-5xl tracking-tight text-foreground" />;
};

const StatsSection = () => {
    return (
        <section className="py-12 border-y border-border/50 bg-secondary/30 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border/50">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="py-4 md:py-0 px-4"
                        >
                            <Counter from={0} to={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                            <p className="text-muted-foreground mt-2 font-medium uppercase tracking-wider text-sm">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
