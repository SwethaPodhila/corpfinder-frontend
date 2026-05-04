import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { pricingPlans } from "../data/dummyData";
import { load } from "@cashfreepayments/cashfree-js";

const SubscriptionPage = () => {

    const [currentPlan, setCurrentPlan] = useState("free");
    const [credits, setCredits] = useState(0);
    const [totalCredits, setTotalCredits] = useState(50);
    const [message, setMessage] = useState("");

    // 🔥 FETCH USER STATUS
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("http://localhost:5000/user/status", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await res.json();

                console.log("USER STATUS API:", data);

                const plan = data.plan || "free";
                const credits = data.credits ?? 0;

                setCurrentPlan(plan);
                setCredits(credits);

                if (plan === "free") setTotalCredits(50);
                else if (plan === "pro") setTotalCredits(2500);
                else if (plan === "premium") setTotalCredits(5000);

                setMessage(data.message || "");

            } catch (err) {
                console.log(err);
            }
        };

        fetchStatus();
    }, []);

    // 🔥 PAYMENT HANDLER
    const handleUpgrade = async (plan) => {
        try {
            const token = localStorage.getItem("token");

            // 1️⃣ Create order
            const res = await fetch("https://corpfinder-backend.onrender.com/payment/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    planName: plan.name.toLowerCase()
                })
            });

            const data = await res.json();

            // 2️⃣ Load Cashfree
            const cashfree = await load({
                mode: "production"
            });

            // 3️⃣ Open checkout
            cashfree.checkout({
                paymentSessionId: data.paymentSessionId,
                redirectTarget: "_modal"
            });

            // 4️⃣ Poll for update (simple way)
            /* setTimeout(() => {
                 window.location.reload();
             }, 5000); */

        } catch (err) {
            console.log("Payment error:", err);
        }
    };

    // 🔥 CALCULATE PROGRESS
    const used = totalCredits - credits;
    const percent = (used / totalCredits) * 100;

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

            {/* 🔥 WARNING MESSAGE */}
            {message && (
                <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg">
                    {message}
                </div>
            )}

            {/* Current Plan */}
            <div className="mt-6 card-elevated">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                        <Zap className="h-5 w-5 text-primary" />
                    </div>

                    <div>
                        <p className="font-heading font-semibold text-foreground">
                            Current Plan: {currentPlan.toUpperCase()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {used} / {totalCredits} credits used
                        </p>
                    </div>
                </div>

                {/* 🔥 PROGRESS BAR */}
                <div className="mt-4 h-3 rounded-full bg-muted overflow-hidden">
                    <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${percent}%` }}
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
                            } ${currentPlan === plan.name.toLowerCase() ? "ring-2 ring-primary" : ""}`}
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
                            onClick={() => handleUpgrade(plan)}
                            disabled={currentPlan === plan.name.toLowerCase()}
                            className={`mt-6 w-full py-2 ${currentPlan === plan.name.toLowerCase()
                                ? "bg-muted cursor-not-allowed"
                                : plan.highlighted
                                    ? "btn-primary1"
                                    : "btn-outline-primary"
                                }`}
                        >
                            {currentPlan === plan.name.toLowerCase()
                                ? "Current Plan"
                                : "Upgrade"}
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default SubscriptionPage;