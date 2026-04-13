import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
//import ctaImg from "../assets/cta-illustration.jpg";

const CTASection = () => (
  <section className="relative overflow-hidden py-24">
    <div className="absolute inset-0">
      {/*<img
        src={ctaImg}
        alt=""
        className="h-full w-full object-cover opacity-20"
        loading="lazy"
        width={1200}
        height={512}
      /> */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700"
        style={{ mixBlendMode: "multiply" }}
      />
    </div>

    <div className="container relative mx-auto px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="font-heading text-3xl font-bold text-white md:text-5xl">
          Start searching smarter today
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-indigo-100">
          Join thousands of professionals who use CorpFinder to discover
          companies and connect with the right people.
        </p>

        <Link
          to="/register"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-indigo-700 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
        >
          Get Started Free <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </div>
  </section>
);

export default CTASection;