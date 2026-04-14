import React from "react";
import { motion } from "framer-motion";
import { Building2, Users, Search as SearchIcon, TrendingUp } from "lucide-react";

const stats = [
    { icon: SearchIcon, label: "Total Searches", value: "1,247", change: "+12%" },
    { icon: Building2, label: "Companies Viewed", value: "89", change: "+5%" },
    { icon: Users, label: "People Found", value: "456", change: "+18%" },
    { icon: TrendingUp, label: "Downloads", value: "23", change: "+8%" },
];

const DashboardHome = () => {
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : { fullName: "user name" };
    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="mt-1 text-muted-foreground">
                    Welcome back, {user.fullName}. Here's your activity summary.
                </p>
            </motion.div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((s, i) => (
                    <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card-elevated"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                                <s.icon className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                {s.change}
                            </span>
                        </div>

                        <p className="mt-4 text-2xl font-bold font-heading text-foreground">
                            {s.value}
                        </p>
                        <p className="text-sm text-muted-foreground">{s.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 card-elevated">
                <h2 className="font-heading text-lg font-semibold text-foreground mb-4">
                    Recent Activity
                </h2>

                <div className="space-y-4">
                    {[
                        "Searched 'Technology companies in California'",
                        "Downloaded 23 records",
                        "Viewed TechNova Solutions profile",
                        "Searched 'HR Directors in Healthcare'",
                    ].map((a, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                            <span className="text-sm text-foreground">{a}</span>
                            <span className="ml-auto text-xs text-muted-foreground">
                                {i + 1}h ago
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
};

export default DashboardHome;