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

const Refund = () => {
    return (
        <LegalLayout
            title="Refund Policy"
            subtitle="We maintain a fair and transparent refund system for all users."
        >

            <Section title="1. Refund Eligibility">
                Refunds are available within 7 days of purchase if the service has not been heavily used.
            </Section>

            <Section title="2. Non-Refundable Cases">
                Completed billing cycles, excessive usage, or policy violations are not eligible for refund.
            </Section>

            <Section title="3. Processing Time">
                Approved refunds are processed within 5–10 business days to the original payment method.
            </Section>

            <Section title="4. Subscription Policy">
                All subscriptions renew automatically unless cancelled before the billing cycle ends.
            </Section>

            <Section title="5. Support Contact">
                For refund issues, contact support@corpfinder.com with transaction details.
            </Section>

        </LegalLayout>
    );
};

export default Refund;