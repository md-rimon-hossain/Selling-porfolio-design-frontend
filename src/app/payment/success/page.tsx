"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PaymentStatusChecker from "@/components/PaymentStatusChecker";
import Link from "next/link";
import { Loader2 } from "lucide-react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentIntentId = searchParams.get("payment_intent");

  const handleSuccess = () => {
    // Additional success handling
    setTimeout(() => {
      router.push("/dashboard/purchases");
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {paymentIntentId ? (
          <>
            <PaymentStatusChecker
              paymentIntentId={paymentIntentId}
              onSuccess={handleSuccess}
            />
            <div className="mt-8 flex gap-4 justify-center flex-wrap">
              <Link
                href="/dashboard/purchases"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                View Purchases
              </Link>
              <Link
                href="/dashboard/available-downloads"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Download Files
              </Link>
              <Link
                href="/designs"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-red-600 text-xl font-bold mb-4">
              No payment information found
            </p>
            <p className="text-gray-600 mb-6">
              The payment intent ID is missing from the URL.
            </p>
            <Link
              href="/pricing"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Back to Pricing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
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
      <PaymentSuccessContent />
    </Suspense>
  );
}
