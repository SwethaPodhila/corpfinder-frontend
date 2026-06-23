import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const LegalLayout = ({ title, subtitle, children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 pt-12">

        {/* HEADER FULL WIDTH */}
        <div className="w-full bg-card border-b">
          <div className="max-w-5xl mx-auto px-6 py-14 text-center">

            {/* Badge */}
            <span className="inline-block mb-4 px-4 py-1 rounded-full bg-accent text-xs font-semibold text-primary tracking-wide">
              Legal Document
            </span>

            {/* Title */}
            <h1 className="text-4xl font-bold text-foreground">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-lg">
              {subtitle}
            </p>

          </div>
        </div>

        {/* BACK BUTTON */}
        <div className="max-w-5xl mx-auto w-full px-6 mt-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-card hover:bg-accent transition"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>

        {/* CONTENT */}
        <main className="max-w-5xl mx-auto w-full px-8 py-6 space-y-6">
          {children}
        </main>

      </div>

      {/* FOOTER */}
      <Footer />

    </div>
  );
};

export default LegalLayout;