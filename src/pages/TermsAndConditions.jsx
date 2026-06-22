import React from "react";
import LegalLayout from "../components/LegalLayout";

const Section = ({ title, children }) => (
    <section className="rounded-2xl border bg-card p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-primary mb-3 border-l-4 border-primary pl-3">
            {title}
        </h2>
        <p className="text-muted-foreground leading-7 text-[15px]">
            {children}
        </p>
    </section>
);

const Terms = () => {
    return (
        <LegalLayout
            title="Terms & Conditions"
            subtitle="These terms define the rules for using CorpFinder platform."
        >

            <Section title="1. Acceptance of Terms">
                By using CorpFinder, you agree to follow all applicable laws and platform rules.
            </Section>

            <Section title="2. User Responsibilities">
                Users must provide accurate information and must not misuse the platform for scraping,
                fraud, or illegal activities.
            </Section>

            <Section title="3. Account Security">
                You are responsible for maintaining the security of your login credentials and account activity.
            </Section>

            <Section title="4. Service Availability">
                We aim to provide uninterrupted service but do not guarantee 100% uptime.
            </Section>

            <Section title="5. Limitation of Liability">
                CorpFinder is not responsible for losses caused by external data sources or third-party services.
            </Section>

        </LegalLayout>
    );
};

export default Terms;