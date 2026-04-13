import React from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Download } from "lucide-react";

const steps = [
    {
        icon: Search,
        num: "01",
        title: "Search",
        desc: "Enter a company name, industry, or person's role to start searching.",
    },
    {
        icon: SlidersHorizontal,
        num: "02",
        title: "Filter",
        desc: "Narrow results by location, industry, designation, and more.",
    },
    {
        icon: Download,
        num: "03",
        title: "Download",
        desc: "Export your filtered results to Excel with one click.",
    },
];

const HowItWorksSection = () => (
    <section className="bg-card py-24 border-y">
        <div className="container mx-auto px-6">

            {/* Heading */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <span className="mb-4 inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-semibold">
                    How It Works
                </span>

                <h2 className="text-3xl font-bold md:text-4xl">
                    Three simple steps
                </h2>
            </motion.div>

            {/* Steps */}
            <div className="grid gap-12 md:grid-cols-3">
                {steps.map((s, i) => (
                    <motion.div
                        key={s.num}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15 }}
                        className="text-center"
                    >
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent">
                            <s.icon className="h-8 w-8 text-primary" />
                        </div>

                        <span className="text-sm font-bold gradient-text">
                            {s.num}
                        </span>

                        <h3 className="mt-2 text-xl font-semibold">
                            {s.title}
                        </h3>

                        <p className="mt-3 text-muted-foreground">
                            {s.desc}
                        </p>
                    </motion.div>
                ))}
            </div>

        </div>
    </section>
);

export default HowItWorksSection;