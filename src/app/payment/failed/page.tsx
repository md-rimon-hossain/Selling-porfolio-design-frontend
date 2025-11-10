"use client";

/**
 * Payment Failed Page
 *
 * NOTE: Currently not actively used in the payment flow.
 * The app uses modal-based error handling via PurchaseModal.
 *
 * This page can be used for:
 * - External Stripe redirect failures
 * - Webhook failure notifications
 * - Direct error links in emails
 *
 * To activate: Update PaymentForm return_url to redirect here on errors,
 * or use as webhook failure landing page.
 */

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, AlertTriangle, Loader2 } from "lucide-react";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const paymentIntentId = searchParams.get("payment_intent");

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Payment Failed
          </h1>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-red-900 font-medium mb-1">Error Details:</p>
                <p className="text-red-700 text-sm">
                  {error ||
                    "Your payment could not be processed. Please try again."}
                </p>
                {paymentIntentId && (
                  <p className="text-red-600 text-xs mt-2">
                    Payment Intent: {paymentIntentId}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Common Reasons for Payment Failure:
            </h3>
            <ul className="text-sm text-gray-700 text-left space-y-1">
              <li>• Insufficient funds in your account</li>
              <li>• Card expired or incorrect details</li>
              <li>• Payment declined by your bank</li>
              <li>• Network or connection issues</li>
              <li>• 3D Secure authentication failed</li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/pricing"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-sm"
            >
              Try Again
            </Link>
            <Link
              href="/contact"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/dashboard"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Need help? Our support team is available 24/7
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Email:{" "}
              <a
                href="mailto:support@example.com"
                className="text-blue-600 hover:underline"
              >
                support@example.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-700 font-medium">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <PaymentFailedContent />
    </Suspense>
  );
}
