import React from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroImg from "../../assets/hero-illustration2.jpg";

const HeroSection = () => (
    <section className="relative overflow-hidden pt-32 pb-20">

        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-background to-purple-50/40" />

        <div className="container relative mx-auto px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">

                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <span className="mb-4 inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-semibold">
                        🚀 Trusted by 10,000+ professionals
                    </span>

                    <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
                        Find Companies & Professionals{" "}
                        <span className="gradient-text">Instantly</span>
                    </h1>

                    <p className="mb-8 max-w-lg text-lg text-muted-foreground">
                        Access a comprehensive directory of companies and professionals.
                        Search, filter, and connect with the right people — all in one platform.
                    </p>

                    {/* Search Box */}
                    <div className="mb-8 flex max-w-lg items-center gap-2 rounded-2xl border bg-card p-2 shadow-lg">
                        <Search className="ml-3 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search companies, people, roles..."
                            className="flex-1 bg-transparent outline-none px-2"
                        />
                        <button className="btn-primary px-5 py-2">Search</button>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-4">
                        <Link to="/register" className="btn-primary px-8 py-3">
                            Get Started Free <ArrowRight className="h-4 w-4" />
                        </Link>

                        <a href="#pricing" className="btn-outline-primary px-8 py-3">
                            View Plans
                        </a>
                    </div>
                </motion.div>

                {/* Right Image */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="hidden lg:block"
                >
                  <img
                        src={heroImg}
                        alt="Business collaboration"
                        className="w-full rounded-3xl shadow-2xl"
                    /> 
                </motion.div>

            </div>
        </div>
    </section>
);

export default HeroSection;