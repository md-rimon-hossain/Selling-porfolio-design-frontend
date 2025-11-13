import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsOfServicePage() {
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
          <div className="bg-gradient-to-r from-brand-primary to-brand-secondary px-8 py-12 text-white">
            <h1 className="text-4xl sm:text-5xl font-black mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-white/90">
              Last updated: November 10, 2025
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-12 prose prose-blue max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                By accessing and using this website ("Service"), you accept and
                agree to be bound by the terms and provision of this agreement.
                If you do not agree to these Terms of Service, please do not use
                our Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Description of Service
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We provide an online marketplace for buying and selling digital
                design assets including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Website templates</li>
                <li>UI/UX design files</li>
                <li>Graphics and illustrations</li>
                <li>Design resources and tools</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. User Accounts
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To access certain features of our Service, you must register for
                an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  Provide accurate, current, and complete information during
                  registration
                </li>
                <li>Maintain the security of your password and account</li>
                <li>
                  Promptly update your account information to keep it accurate
                  and current
                </li>
                <li>
                  Accept responsibility for all activities that occur under your
                  account
                </li>
                <li>
                  Notify us immediately of any unauthorized use of your account
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Purchases and Payments
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>4.1 Pricing:</strong> All prices are listed in USD and
                are subject to change without notice. We reserve the right to
                modify pricing at any time.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>4.2 Payment:</strong> We accept payments through Stripe.
                By providing payment information, you represent and warrant that
                you are authorized to use the payment method.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>4.3 Refunds:</strong> Due to the digital nature of our
                products, all sales are final. Refunds may be granted at our
                sole discretion in cases of technical issues or defective
                products.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. License and Usage Rights
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Upon successful purchase, you receive a non-exclusive,
                non-transferable license to use the digital assets according to
                the specific license type purchased:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  <strong>Personal License:</strong> For personal,
                  non-commercial projects
                </li>
                <li>
                  <strong>Commercial License:</strong> For commercial projects
                  for a single client
                </li>
                <li>
                  <strong>Extended License:</strong> For unlimited commercial
                  projects
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                You may NOT redistribute, resell, lease, license, sub-license,
                or offer the digital assets for download without explicit
                written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Intellectual Property
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                All content on this Service, including but not limited to text,
                graphics, logos, images, and software, is the property of Design
                Store or its content suppliers and protected by international
                copyright laws.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Designers retain ownership of their original work. By uploading
                content to our platform, designers grant us a license to
                display, promote, and sell their work.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Prohibited Activities
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>
                  Infringe upon the intellectual property rights of others
                </li>
                <li>Upload malicious code, viruses, or harmful content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Harass, abuse, or harm other users</li>
                <li>
                  Use automated systems to access the Service without permission
                </li>
                <li>Share account credentials with others</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Content Moderation
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to review, monitor, and remove any content
                that violates these Terms or is otherwise objectionable at our
                sole discretion. We may suspend or terminate accounts that
                violate our policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Disclaimer of Warranties
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT
                WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR
                ERROR-FREE.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Limitation of Liability
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE
                FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER
                INCURRED DIRECTLY OR INDIRECTLY.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. Termination
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may terminate or suspend your account and access to the
                Service immediately, without prior notice or liability, for any
                reason, including breach of these Terms. Upon termination, your
                right to use the Service will immediately cease.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                12. Changes to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to modify these Terms at any time. We will
                notify users of any material changes via email or through the
                Service. Your continued use of the Service after such
                modifications constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                13. Governing Law
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms shall be governed by and construed in accordance
                with the laws of the United States, without regard to its
                conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                14. Contact Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please
                contact us at:
              </p>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <p className="text-gray-900 font-semibold mb-2">
                  Design Store Support
                </p>
                <p className="text-gray-700">Email: support@designstore.com</p>
                <p className="text-gray-700">
                  Address: 123 Design Street, Creative City, CA 90210
                </p>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                By using our Service, you acknowledge that you have read,
                understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/privacy">
            <Button variant="outline" className="font-semibold">
              Privacy Policy
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
