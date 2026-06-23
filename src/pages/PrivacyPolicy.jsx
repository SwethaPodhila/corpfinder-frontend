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

const PrivacyPolicy = () => {
    return (
        <LegalLayout
            title="Privacy Policy"
            subtitle="Last Updated: June 23, 2026 • We respect your privacy and are committed to protecting your personal data."
        >

            <Section title="1. Information We Collect">
                We collect information to provide and improve our database services:

                • Information You Provide: Name, email address, phone number, job title, company name, and any other details you submit via forms or communications.

                • Information from Third Parties: We may obtain business contact information from public sources and data partners to enrich our database.

                • Usage Information: We automatically collect data like IP address, browser type, device information, and website usage behavior through cookies and analytics tools.
            </Section>

            <Section title="2. How We Use Your Information">
                We use your information for the following purposes:

                • To provide, maintain, and improve our database and services
                • To verify identities and manage user accounts
                • To respond to inquiries and provide customer support
                • To send updates, alerts, or marketing communications (where permitted)
                • To generate analytics and business insights
                • For security, fraud prevention, and legal compliance
            </Section>

            <Section title="3. Sharing of Information">
                We do not sell your personal data. However, we may share information with:

                • Service Providers: Third parties that help us operate our platform (hosting, analytics, email services)

                • Business Partners: For improving or expanding data-related services

                • Legal Authorities: When required by law or to protect our rights

                • Business Transfers: In case of merger, acquisition, or asset sale
            </Section>

            <Section title="4. Your Rights & Choices">
                Depending on your location, you may have the following rights:

                • Access the personal data we hold about you
                • Request correction of inaccurate data
                • Request deletion of your data
                • Opt out of marketing communications
                • Restrict or object to data processing

                To exercise these rights, contact us at growmatrixbiz@gmail.com
            </Section>

            <Section title="5. Data Security">
                We implement appropriate technical and organizational measures to protect your data.

                However, no system is 100% secure. You are responsible for maintaining the confidentiality of your account credentials.
            </Section>

            <Section title="6. Data Retention">
                We retain personal data only as long as necessary for business purposes or legal compliance.

                You may request deletion of your data at any time.
            </Section>

            <Section title="7. Cookies & Tracking Technologies">
                We use cookies and similar technologies to improve user experience, analyze traffic, and enhance platform performance.

                You can control or disable cookies through your browser settings.
            </Section>

            <Section title="8. Third-Party Links">
                Our website may contain links to third-party websites.

                We are not responsible for their privacy practices, so we encourage you to review their policies.
            </Section>

            <Section title="9. Children's Privacy">
                Our services are not intended for individuals under the age of 16.

                We do not knowingly collect data from children.
            </Section>

            <Section title="10. International Data Transfers">
                Your data may be processed in countries outside your residence.

                We ensure appropriate safeguards are in place for such transfers.
            </Section>

            <Section title="11. Changes to This Policy">
                We may update this Privacy Policy from time to time.

                Updates will be posted on this page with a revised "Last Updated" date.
            </Section>

            <Section title="12. Contact Us">
                If you have any questions about this Privacy Policy or your data, contact us:

                Email: growmatrixbiz@gmail.com
                Phone: +91 91333 49811
            </Section>

        </LegalLayout>
    );
};

export default PrivacyPolicy;