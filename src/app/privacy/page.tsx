import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl"></div>
              <span className="text-xl font-black text-gray-900">
                Design Store
              </span>
            </Link>
            <Link href="/">
              <Button variant="outline" className="font-semibold">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-12 text-white">
            <h1 className="text-4xl sm:text-5xl font-black mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-white/90">
              Last updated: November 10, 2025
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-12 prose prose-purple max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to Design Store ("we," "our," or "us"). We respect your
                privacy and are committed to protecting your personal data. This
                Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you use our website and
                services.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Please read this Privacy Policy carefully. By using our Service,
                you agree to the collection and use of information in accordance
                with this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Information We Collect
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                2.1 Personal Information
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We collect information that you provide directly to us,
                including:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  <strong>Account Information:</strong> Name, email address,
                  password
                </li>
                <li>
                  <strong>Profile Information:</strong> Profile picture, bio,
                  portfolio links
                </li>
                <li>
                  <strong>Payment Information:</strong> Billing address, payment
                  card details (processed securely by Stripe)
                </li>
                <li>
                  <strong>Communication Data:</strong> Messages, reviews,
                  comments, support tickets
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                2.2 OAuth/Social Login Information
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                When you sign in using Google or GitHub, we collect:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Your name and email address from your social account</li>
                <li>Profile picture (if provided)</li>
                <li>Unique identifier from the OAuth provider</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                2.3 Automatically Collected Information
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                When you access our Service, we automatically collect:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  <strong>Device Information:</strong> IP address, browser type,
                  operating system
                </li>
                <li>
                  <strong>Usage Data:</strong> Pages viewed, time spent, clicks,
                  downloads
                </li>
                <li>
                  <strong>Cookies and Tracking:</strong> Session data,
                  preferences, analytics
                </li>
                <li>
                  <strong>Location Data:</strong> General geographic location
                  based on IP address
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the collected information for various purposes:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  <strong>Service Delivery:</strong> Process transactions,
                  deliver purchased products, manage accounts
                </li>
                <li>
                  <strong>Communication:</strong> Send order confirmations,
                  updates, newsletters, and promotional materials
                </li>
                <li>
                  <strong>Improvement:</strong> Analyze usage patterns to
                  improve our Service and user experience
                </li>
                <li>
                  <strong>Security:</strong> Detect fraud, prevent abuse, and
                  protect user accounts
                </li>
                <li>
                  <strong>Legal Compliance:</strong> Comply with legal
                  obligations and enforce our Terms of Service
                </li>
                <li>
                  <strong>Personalization:</strong> Customize content and
                  recommendations based on your preferences
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Information Sharing and Disclosure
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell your personal information. We may share your
                information in the following circumstances:
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                4.1 Service Providers
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We share information with third-party service providers who
                perform services on our behalf:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  <strong>Stripe:</strong> Payment processing
                </li>
                <li>
                  <strong>Google/GitHub:</strong> OAuth authentication
                </li>
                <li>
                  <strong>Cloud Hosting:</strong> Data storage and server
                  infrastructure
                </li>
                <li>
                  <strong>Email Services:</strong> Transactional and marketing
                  emails
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                4.2 Legal Requirements
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may disclose your information if required by law or in
                response to valid legal requests from government authorities.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                4.3 Business Transfers
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                If we are involved in a merger, acquisition, or sale of assets,
                your information may be transferred as part of that transaction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Data Security
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement appropriate technical and organizational measures
                to protect your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Encryption of data in transit using HTTPS/TLS</li>
                <li>
                  Secure password hashing using industry-standard algorithms
                </li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication mechanisms</li>
                <li>PCI DSS compliance for payment processing</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                However, no method of transmission over the Internet is 100%
                secure. While we strive to protect your data, we cannot
                guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  <strong>Essential Cookies:</strong> Enable core functionality
                  like authentication and security
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> Understand how users
                  interact with our Service
                </li>
                <li>
                  <strong>Preference Cookies:</strong> Remember your settings
                  and preferences
                </li>
                <li>
                  <strong>Marketing Cookies:</strong> Deliver relevant
                  advertisements
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                You can control cookies through your browser settings. Disabling
                certain cookies may limit functionality of our Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Your Rights and Choices
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You have the following rights regarding your personal
                information:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  <strong>Access:</strong> Request a copy of your personal data
                </li>
                <li>
                  <strong>Correction:</strong> Update or correct inaccurate
                  information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your account
                  and data
                </li>
                <li>
                  <strong>Opt-Out:</strong> Unsubscribe from marketing
                  communications
                </li>
                <li>
                  <strong>Data Portability:</strong> Request your data in a
                  machine-readable format
                </li>
                <li>
                  <strong>Restriction:</strong> Limit how we process your data
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                To exercise these rights, please contact us at
                privacy@designstore.com
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Data Retention
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We retain your personal information for as long as necessary to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Provide our services and fulfill transactions</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and enforce agreements</li>
                <li>Maintain business records</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                When we no longer need your information, we will securely delete
                or anonymize it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Children's Privacy
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our Service is not intended for children under 13 years of age.
                We do not knowingly collect personal information from children.
                If you believe we have collected information from a child,
                please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. International Data Transfers
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your information may be transferred to and processed in
                countries other than your country of residence. We ensure
                appropriate safeguards are in place to protect your data in
                accordance with this Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. Third-Party Links
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our Service may contain links to third-party websites. We are
                not responsible for the privacy practices of these external
                sites. We encourage you to review their privacy policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                12. Changes to This Privacy Policy
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time. We will
                notify you of any material changes by posting the new policy on
                this page and updating the "Last updated" date. Your continued
                use of our Service after changes constitutes acceptance of the
                updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                13. Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions or concerns about this Privacy Policy,
                please contact us:
              </p>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <p className="text-gray-900 font-semibold mb-2">
                  Design Store Privacy Team
                </p>
                <p className="text-gray-700">Email: privacy@designstore.com</p>
                <p className="text-gray-700">
                  Address: 123 Design Street, Creative City, CA 90210
                </p>
                <p className="text-gray-700">Phone: (555) 123-4567</p>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Your privacy is important to us. We are committed to protecting
                your personal information and being transparent about our data
                practices.
              </p>
            </div>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/terms">
            <Button variant="outline" className="font-semibold">
              Terms of Service
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" className="font-semibold">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
