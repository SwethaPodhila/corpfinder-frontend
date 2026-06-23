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

const Terms = () => {
    return (
        <LegalLayout
            title="Terms of Service"
            subtitle="Last Updated: June 23, 2026 • By using Growmatrix.biz, you agree to these Terms."
        >

            <Section title="1. Acceptance of Terms">
                By accessing or using Growmatrix.biz ("Growmatrix", "we", "us"), you agree to be bound by these Terms of Service.

                If you do not agree, please do not use our services.

                We may update these terms at any time, and continued use of the platform means acceptance of changes.
            </Section>

            <Section title="2. Our Services">
                Growmatrix.biz provides business intelligence and database solutions.

                We collect, organize, and provide business contact information to help users connect with potential prospects.

                While we aim for accuracy, we do not guarantee that all data is complete, current, or error-free.
            </Section>

            <Section title="3. User Accounts">
                • You may need an account to access certain features
                • You are responsible for maintaining your login credentials
                • You must provide accurate and complete information
                • You are responsible for all activities under your account
            </Section>

            <Section title="4. Acceptable Use Policy">
                You agree not to:

                • Use our data for spam, harassment, or illegal activities
                • Scrape, copy, or redistribute our database without permission
                • Attempt to hack, disrupt, or misuse our systems
                • Impersonate any person or provide false information
            </Section>

            <Section title="5. Intellectual Property">
                All content, software, and databases on Growmatrix.biz are owned by Growmatrix.

                You may not copy, modify, distribute, or resell any part of our services without written permission.
            </Section>

            <Section title="6. Data Submission & License">
                If you submit data, you grant us a license to use it for improving and enriching our database.

                You confirm that you have the legal right to share such data.
            </Section>

            <Section title="7. Payments & Subscriptions">
                • Paid plans may include auto-renewal
                • You agree to pay applicable fees
                • Payments are non-refundable unless required by law
            </Section>

            <Section title="8. Privacy Policy">
                By using our services, you also agree to our Privacy Policy which explains how we collect and use your data.
            </Section>

            <Section title="9. Third-Party Links">
                Our platform may contain third-party links.

                We are not responsible for their content, policies, or practices.
            </Section>

            <Section title="10. Disclaimer">
                Services are provided "as is" without warranties of any kind.

                We do not guarantee uninterrupted service or complete accuracy of data.
            </Section>

            <Section title="11. Limitation of Liability">
                Growmatrix.biz shall not be liable for indirect or consequential damages.

                Total liability shall not exceed the amount paid by the user in the last 12 months.
            </Section>

            <Section title="12. Termination">
                We may suspend or terminate accounts for violation of these terms.

                You may also stop using the service at any time.
            </Section>

            <Section title="13. Governing Law">
                These Terms are governed by the laws of India.

                Any disputes will be handled under the jurisdiction of Mumbai, Maharashtra.
            </Section>

            <Section title="14. Changes to Terms">
                We may update these Terms periodically.

                Updates will be posted on this page with a revised "Last Updated" date.
            </Section>

            <Section title="15. Contact Us">
                For any questions:

                Email: growmatrixbiz@gmail.com
                Phone: +91 91333 49811
            </Section>

        </LegalLayout>
    );
};

export default Terms;