import React from "react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/home/HeroSection";
import StatsSection from "../components/home/StatsSection";
import FeaturesSection from "../components/home/FeaturesSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import DemoSection from "../components/home/DemoSection";
import PricingSection from "../components/home/PricingSection";
import CTASection from "../components/home/CTASection";

const Index = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <HeroSection />
            <StatsSection />
            <FeaturesSection />
            <HowItWorksSection />
            <DemoSection />
            <PricingSection />
            <CTASection />
            <Footer />
        </div>
    );
};

export default Index;
