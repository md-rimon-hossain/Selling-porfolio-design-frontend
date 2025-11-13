"use client";

import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Loader2, CreditCard, ShieldCheck, AlertCircle } from "lucide-react";

interface PaymentFormProps {
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  amount: number;
  currency: string;
  itemName: string;
  returnUrl?: string;
}

/**
 * Stripe Payment Form Component
 * Handles payment processing using Stripe Elements
 * @param onSuccess - Callback when payment succeeds
 * @param onError - Callback when payment fails
 * @param amount - Amount to charge
 * @param currency - Currency code
 * @param itemName - Name of the item being purchased
 * @param returnUrl - URL to return to after payment completion
 */
const PaymentForm: React.FC<PaymentFormProps> = ({
  onSuccess,
  onError,
  amount,
  currency,
  itemName,
  returnUrl,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      onError("Stripe has not loaded yet. Please try again.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl || `${window.location.origin}/payment/success`,
        },
        redirect: "if_required", // Only redirect if necessary (e.g., 3D Secure)
      });

      if (error) {
        // Payment failed
        const message =
          error.message || "An unexpected error occurred. Please try again.";
        setErrorMessage(message);
        onError(message);
      } else if (paymentIntent) {
        // Payment succeeded
        if (paymentIntent.status === "succeeded") {
          onSuccess(paymentIntent.id);
        } else if (paymentIntent.status === "requires_action") {
          // Additional action required (e.g., 3D Secure)
          setErrorMessage("Additional authentication required. Redirecting...");
        } else {
          onError(`Payment status: ${paymentIntent.status}`);
        }
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Payment processing failed";
      setErrorMessage(message);
      onError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Payment Amount Summary */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-brand-primary" />
            <span className="font-semibold text-gray-900">Payment Amount</span>
          </div>
          <span className="text-xl font-bold text-brand-primary">
            {currency} {amount.toFixed(2)}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{itemName}</p>
      </div>

      {/* Stripe Payment Element */}
      <div className="border border-gray-200 rounded-lg p-4">
        <PaymentElement
          options={{
            layout: "tabs",
            paymentMethodOrder: ["card", "ideal", "sepa_debit"],
          }}
        />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Payment Error</p>
            <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Security Badge */}
      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
        <ShieldCheck className="w-4 h-4 text-green-600" />
        <span>Secured by Stripe • Your payment information is encrypted</span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="w-full bg-brand-primary hover:bg-brand-secondary disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 shadow-sm"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            <span>
              Pay {currency} {amount.toFixed(2)}
            </span>
          </>
        )}
      </button>

      {/* Terms and Conditions */}
      <p className="text-xs text-gray-500 text-center">
        By confirming your payment, you agree to our{" "}
        <a href="/terms" className="text-brand-primary hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="text-brand-primary hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
};

export default PaymentForm;
