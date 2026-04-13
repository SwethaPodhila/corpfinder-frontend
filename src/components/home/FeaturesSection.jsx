import React from "react";
import { motion } from "framer-motion";
import { Search, Building2, Users, Download } from "lucide-react";
//import featuresImg from "../assets/features-illustration.jpg";

const features = [
    {
        icon: Search,
        title: "Smart Search",
        desc: "Powerful search engine with auto-suggestions and instant results across companies and people.",
    },
    {
        icon: Building2,
        title: "Company Insights",
        desc: "Detailed company profiles with employee count, industry, location, and key personnel.",
    },
    {
        icon: Users,
        title: "Employee Discovery",
        desc: "Find professionals by role, designation, and company with comprehensive contact details.",
    },
    {
        icon: Download,
        title: "Export to Excel",
        desc: "Download your search results instantly in Excel format for offline analysis.",
    },
];

const FeaturesSection = () => (
    <section id="features" className="py-24">
        <div className="container mx-auto px-6">

            {/* Heading */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <span className="mb-4 inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-semibold">
                    Features
                </span>

                <h2 className="text-3xl font-bold md:text-4xl">
                    Everything you need to <span className="gradient-text">find anyone</span>
                </h2>

                <p className="mt-4 mx-auto max-w-2xl text-muted-foreground">
                    Powerful tools designed to help you discover companies and professionals efficiently.
                </p>
            </motion.div>

            {/* Feature Cards */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
                {features.map((f, i) => (
                    <motion.div
                        key={f.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="card-elevated group cursor-pointer"
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent group-hover:bg-primary transition">
                            <f.icon className="h-6 w-6 group-hover:text-white" />
                        </div>

                        <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                        <p className="text-sm text-muted-foreground">{f.desc}</p>
                    </motion.div>
                ))}
            </div>

            {/* Image */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex justify-center"
            >
                {/* <img
                    src={featuresImg}
                    alt="Platform features"
                    loading="lazy"
                    className="w-full max-w-3xl rounded-2xl shadow-xl"
                />*/}
            </motion.div>

        </div>
    </section>
);

export default FeaturesSection;