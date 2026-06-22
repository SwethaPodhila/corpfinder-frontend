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

const PrivacyPolicy = () => {
    return (
        <LegalLayout
            title="Privacy Policy"
            subtitle="We respect your privacy and are committed to protecting your personal data."
        >

            <Section title="1. Information We Collect">
                We collect information such as name, email address, login details, search queries,
                and platform usage behavior. This helps us improve search accuracy and user experience.
            </Section>

            <Section title="2. How We Use Your Information">
                Your data is used to provide company search results, personalize recommendations,
                improve platform performance, and maintain account security.
            </Section>

            <Section title="3. Data Security">
                We use encryption, secure servers, and strict access controls to ensure your data
                is protected against unauthorized access or misuse.
            </Section>

            <Section title="4. Data Sharing">
                We do not sell your personal data. Limited information may be shared with trusted
                third-party services like analytics or payment providers.
            </Section>

            <Section title="5. Your Rights">
                You can request access, modification, or deletion of your data at any time by contacting support.
            </Section>

        </LegalLayout>
    );
};

export default PrivacyPolicy;