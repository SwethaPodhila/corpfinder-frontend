import React from "react";
import LegalLayout from "../components/LegalLayout";

const Section = ({ title, children }) => (
    <section className="rounded-2xl border bg-card p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-primary mb-3 border-l-4 border-primary pl-3">
            {title}
        </h2>
        <p className="text-muted-foreground leading-7 text-[15px] whitespace-pre-line">
            {children}
        </p>
    </section>
);

const Refund = () => {
    return (
        <LegalLayout
            title="Refund Policy"
            subtitle="Last Updated: June 23, 2026 • Transparent refund rules for Growmatrix.biz services."
        >

            <Section title="1. General Policy">
                All purchases of Growmatrix.biz services, subscriptions, and digital products are generally non-refundable unless required by law.

                By purchasing our services, you agree to this Refund Policy.
            </Section>

            <Section title="2. Subscription Services">
                • Monthly subscriptions can be canceled anytime, but no partial refunds are provided
                • Annual plans may be eligible for a refund within 7 days of purchase, if not heavily used
                • After the refund window, no refunds will be issued
            </Section>

            <Section title="3. One-Time Purchases">
                • Refunds are allowed within 48 hours only if data is corrupted or materially incorrect
                • No refunds once data is downloaded, exported, or accessed significantly
            </Section>

            <Section title="4. Free Trials & Demos">
                Free trials are non-refundable.

                If you upgrade after a trial, standard refund rules apply.
            </Section>

            <Section title="5. Service Interruptions">
                In case of prolonged service downtime due to our system issues, we may offer partial refunds or credits at our discretion.

                Issues caused by third-party providers or user-side problems are not eligible.
            </Section>

            <Section title="6. Refund Request Process">
                To request a refund, contact us at growmatrixbiz@gmail.com with:

                • Full name and registered email
                • Transaction or invoice ID
                • Reason for refund request

                We respond within 5–7 business days.
            </Section>

            <Section title="7. Approved Refunds">
                • Refunds will be credited to the original payment method only
                • Processing time: 7–14 business days depending on bank/payment provider
            </Section>

            <Section title="8. Chargebacks & Disputes">
                If a chargeback is initiated without contacting us first, we reserve the right to:

                • Suspend or terminate the account
                • Provide transaction evidence to payment providers
                • Dispute unauthorized claims
            </Section>

            <Section title="9. Data & Usage Policy">
                Refund eligibility may depend on usage level of the platform or downloaded data.

                Heavy usage may disqualify refund requests.
            </Section>

            <Section title="10. Changes to This Policy">
                We may update this Refund Policy at any time.

                Changes will be posted with an updated "Last Updated" date.
            </Section>

            <Section title="11. Contact Us">
                For refund-related queries:

                Email: growmatrixbiz@gmail.com
                Phone: +91 91333 49811
            </Section>

        </LegalLayout>
    );
};

export default Refund;