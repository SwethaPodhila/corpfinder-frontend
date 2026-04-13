import React from "react";
import { motion } from "framer-motion";
import { MapPin, Building2, Mail } from "lucide-react";

const demoCards = [
    { name: "Sarah Johnson", role: "CEO", company: "TechNova Solutions", location: "San Francisco, CA" },
    { name: "Michael Chen", role: "CTO", company: "TechNova Solutions", location: "San Francisco, CA" },
    { name: "Emily Rodriguez", role: "HR Director", company: "Meridian Health", location: "New York, NY" },
];

const DemoSection = () => (
    <section className="py-24">
        <div className="container mx-auto px-6">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <span className="mb-4 inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-semibold">
                    Preview
                </span>

                <h2 className="text-3xl font-bold md:text-4xl">
                    See it in action
                </h2>

                <p className="mt-4 text-muted-foreground">
                    Here's a preview of what your search results look like.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mx-auto max-w-4xl rounded-3xl border bg-card p-8 shadow-xl"
            >
                {/* Fake browser bar */}
                <div className="mb-6 flex items-center gap-3 rounded-xl border bg-muted/50 p-3">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                    <span className="ml-4 text-xs text-muted-foreground">
                        corpfinder.com/dashboard/search
                    </span>
                </div>

                {/* Cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                    {demoCards.map((c) => (
                        <div key={c.name} className="card-elevated p-5">

                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent font-bold text-sm">
                                {c.name.split(" ").map((n) => n[0]).join("")}
                            </div>

                            <h4 className="font-semibold">{c.name}</h4>
                            <p className="text-sm text-primary">{c.role}</p>

                            <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-3 w-3" />
                                    {c.company}
                                </div>

                                <div className="flex items-center gap-2">
                                    <MapPin className="h-3 w-3" />
                                    {c.location}
                                </div>

                                <div className="flex items-center gap-2">
                                    <Mail className="h-3 w-3" />
                                    View email
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

            </motion.div>
        </div>
    </section>
);

export default DemoSection;