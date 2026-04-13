import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const useCountUp = (target, duration = 2000) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;

                    const start = performance.now();

                    const step = (now) => {
                        const progress = Math.min((now - start) / duration, 1);
                        setCount(Math.floor(progress * target));

                        if (progress < 1) requestAnimationFrame(step);
                    };

                    requestAnimationFrame(step);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) observer.observe(ref.current);

        return () => observer.disconnect();
    }, [target, duration]);

    return { count, ref };
};

const stats = [
    { value: 10000, label: "Companies", suffix: "+" },
    { value: 50000, label: "Professionals", suffix: "+" },
    { value: 1000000, label: "Searches", suffix: "+" },
];

const formatNum = (n) => {
    if (n >= 1000000) return Math.floor(n / 1000000) + "M";
    if (n >= 1000) return Math.floor(n / 1000) + "K";
    return n.toString();
};

const StatItem = ({ value, label, suffix }) => {
    const { count, ref } = useCountUp(value);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
        >
            <div className="text-4xl font-extrabold gradient-text md:text-5xl">
                {formatNum(count)}
                {suffix}
            </div>

            <p className="mt-2 text-muted-foreground font-medium">
                {label}
            </p>
        </motion.div>
    );
};

const StatsSection = () => (
    <section className="border-y bg-card py-16">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-3 gap-8">
                {stats.map((s) => (
                    <StatItem key={s.label} {...s} />
                ))}
            </div>
        </div>
    </section>
);

export default StatsSection;