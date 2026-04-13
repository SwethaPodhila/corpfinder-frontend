import React from "react";
import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { pricingPlans } from "../data/dummyData";

const SubscriptionPage = () => {
    const currentPlan = "Free";

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="font-heading text-2xl font-bold text-foreground">
                    Subscription
                </h1>
                <p className="mt-1 text-muted-foreground">
                    Manage your plan and usage limits
                </p>
            </motion.div>

            {/* Current Plan */}
            <div className="mt-6 card-elevated">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                        <Zap className="h-5 w-5 text-primary" />
                    </div>

                    <div>
                        <p className="font-heading font-semibold text-foreground">
                            Current Plan: {currentPlan}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            42 / 100 results used this month
                        </p>
                    </div>
                </div>

                <div className="mt-4 h-3 rounded-full bg-muted overflow-hidden">
                    <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: "42%" }}
                    />
                </div>
            </div>

            {/* Plans */}
            <div className="mt-8 grid gap-6 md:grid-cols-3">
                {pricingPlans.map((plan, i) => (
                    <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`rounded-2xl border p-6 ${plan.highlighted ? "border-primary" : "border-border"
                            } ${currentPlan === plan.name ? "ring-2 ring-primary" : ""}`}
                    >
                        {plan.highlighted && (
                            <div className="mb-3 inline-block rounded-full bg-primary px-3 py-1 text-xs text-white">
                                Recommended
                            </div>
                        )}

                        <h3 className="text-lg font-bold">{plan.name}</h3>

                        <div className="mt-2 flex items-baseline gap-1">
                            <span className="text-3xl font-bold">{plan.price}</span>
                            <span className="text-sm">{plan.period}</span>
                        </div>

                        <p className="mt-1 text-sm">
                            {plan.records} results/month
                        </p>

                        <ul className="mt-6 space-y-2">
                            {plan.features.map((f) => (
                                <li key={f} className="flex items-center gap-2 text-sm">
                                    <Check className="h-4 w-4" />
                                    {f}
                                </li>
                            ))}
                        </ul>

                        <button
                            className={`mt-6 w-full py-2 ${currentPlan === plan.name
                                    ? "bg-muted cursor-default"
                                    : plan.highlighted
                                        ? "btn-primary"
                                        : "btn-outline-primary"
                                }`}
                        >
                            {currentPlan === plan.name ? "Current Plan" : "Upgrade"}
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default SubscriptionPage;