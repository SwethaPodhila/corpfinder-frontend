import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { pricingPlans } from "../../data/dummyData"; // ✅ FIXED PATH

const PricingSection = () => (
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
                    Pricing
                </span>

                <h2 className="text-3xl font-bold md:text-4xl">
                    Simple, transparent pricing
                </h2>

                <p className="mt-4 text-muted-foreground">
                    Choose the plan that fits your needs.
                </p>
            </motion.div>

            {/* Pricing Cards */}
            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
                {pricingPlans.map((plan, i) => (
                    <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className={`relative rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-2 ${plan.highlighted
                                ? "border-primary bg-primary/[0.02] shadow-xl scale-105"
                                : "border-border bg-card hover:shadow-lg"
                            }`}
                    >
                        {/* Badge */}
                        {plan.highlighted && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white">
                                Most Popular
                            </div>
                        )}

                        {/* Plan Info */}
                        <h3 className="text-xl font-bold">{plan.name}</h3>

                        <div className="mt-4 flex items-baseline gap-1">
                            <span className="text-4xl font-extrabold">
                                {plan.price}
                            </span>
                            <span className="text-muted-foreground">
                                {plan.period}
                            </span>
                        </div>

                        <p className="mt-2 text-sm text-muted-foreground">
                            {plan.records} search results
                        </p>

                        {/* Features */}
                        <ul className="mt-8 space-y-3">
                            {plan.features.map((f) => (
                                <li key={f} className="flex items-center gap-3 text-sm">
                                    <Check className="h-4 w-4 text-primary" />
                                    {f}
                                </li>
                            ))}
                        </ul>

                        {/* Button */}
                        <Link
                            to="/register"
                            className={`mt-8 block text-center rounded-xl py-3 font-semibold ${plan.highlighted ? "btn-primary1" : "btn-outline-primary"
                                }`}
                        >
                            Get Started
                        </Link>
                    </motion.div>
                ))}
            </div>

        </div>
    </section>
);

export default PricingSection;