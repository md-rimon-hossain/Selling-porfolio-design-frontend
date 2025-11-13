"use client";

import React, { useEffect, useState } from "react";
import { useGetPaymentStatusQuery } from "@/services/api";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";

interface PaymentStatusCheckerProps {
  paymentIntentId: string;
  onSuccess?: () => void;
  onFailure?: () => void;
}

// Backend Payment/Purchase object structure
interface PaymentData {
  _id: string;
  user: string;
  purchaseType: string;
  design?: string;
  amount: number;
  currencyDisplay: string;
  currency: string;
  paymentMethod: string;
  paymentDetails?: unknown;
  stripePaymentIntentId: string;
  status:
    | "pending"
    | "succeeded"
    | "failed"
    | "canceled"
    | "refunded"
    | "completed"
    | "active";
  purchaseDate?: string;
  activatedAt?: string;
  itemMaxDownloads?: number;
  itemDownloadsUsed?: number;
  errorMessage?: string;
  refundedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Payment Status Checker Component
 * Checks payment status from backend and displays result
 *
 * Backend Response Structure:
 * {
 *   success: boolean,
 *   message: string,
 *   data: {
 *     _id: string,
 *     user: string,
 *     purchaseType: string,
 *     design: string,
 *     amount: number,
 *     currencyDisplay: string,
 *     currency: string,
 *     paymentMethod: string,
 *     paymentDetails: object,
 *     stripePaymentIntentId: string,
 *     status: "pending" | "succeeded" | "failed" | "canceled" | "refunded" | "completed" | "active",
 *     purchaseDate: string,
 *     activatedAt: string,
 *     itemMaxDownloads: number,
 *     itemDownloadsUsed: number,
 *     createdAt: string,
 *     updatedAt: string
 *   }
 * }
 *
 * @param paymentIntentId - Stripe payment intent ID
 * @param onSuccess - Callback when payment is successful
 * @param onFailure - Callback when payment fails
 */
const PaymentStatusChecker: React.FC<PaymentStatusCheckerProps> = ({
  paymentIntentId,
  onSuccess,
  onFailure,
}) => {
  const [shouldFetch, setShouldFetch] = useState(true);

  const {
    data: paymentData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPaymentStatusQuery(paymentIntentId, {
    skip: !shouldFetch || !paymentIntentId,
    pollingInterval: 3000, // Poll every 3 seconds until status is final
    skipPollingIfUnfocused: true,
  });

  useEffect(() => {
    if (!paymentData?.data) return;

    const status = paymentData.data.status;

    // Stop polling when payment reaches a final state
    if (
      [
        "succeeded",
        "completed",
        "active",
        "failed",
        "canceled",
        "refunded",
      ].includes(status)
    ) {
      setShouldFetch(false);

      if (["succeeded", "completed", "active"].includes(status) && onSuccess) {
        onSuccess();
      } else if (["failed", "canceled"].includes(status) && onFailure) {
        onFailure();
      }
    }
  }, [paymentData, onSuccess, onFailure, refetch]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-brand-primary" />
        <p className="text-gray-700 font-medium">Checking payment status...</p>
        <p className="text-sm text-gray-500">Please wait</p>
      </div>
    );
  }

  if (isError || !paymentData?.data) {
    const errorMessage =
      typeof error === "object" && error && "data" in error
        ? (error as any)?.data?.message
        : "We couldn't verify your payment status. Please contact support.";

    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
        <p className="text-gray-900 font-bold text-xl">
          Unable to Verify Payment
        </p>
        <p className="text-gray-600 text-center max-w-md">{errorMessage}</p>
      </div>
    );
  }

  const payment = paymentData.data as PaymentData;

  // Ensure payment data is valid
  if (!payment || typeof payment !== "object") {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
        <p className="text-gray-900 font-bold text-xl">Invalid Payment Data</p>
        <p className="text-gray-600 text-center max-w-md">
          Unable to retrieve payment information. Please contact support.
        </p>
      </div>
    );
  }

  // Extract status from payment object
  // Backend returns full payment/purchase object with status field
  const status = payment.status;
  const amount = payment.amount;
  const currency = payment.currencyDisplay || payment.currency || "$";
  const purchaseId = payment._id;

  // Success State
  if (status === "succeeded" || status === "completed" || status === "active") {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <p className="text-gray-900 font-bold text-2xl">Payment Successful!</p>
        <p className="text-gray-600 text-center max-w-md">
          Your payment of {currency}{" "}
          {typeof amount === "number" ? amount.toFixed(2) : amount} has been
          processed successfully.
        </p>
        {purchaseId && (
          <p className="text-sm text-gray-500">
            Purchase ID: {String(purchaseId)}
          </p>
        )}
      </div>
    );
  }

  // Failed State
  if (status === "failed" || status === "canceled") {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
        <p className="text-gray-900 font-bold text-2xl">Payment Failed</p>
        <p className="text-gray-600 text-center max-w-md">
          {payment.errorMessage ||
            "Your payment could not be processed. Please try again."}
        </p>
      </div>
    );
  }

  // Pending State
  if (status === "pending") {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
          <Clock className="w-8 h-8 text-yellow-600" />
        </div>
        <p className="text-gray-900 font-bold text-2xl">Payment Pending</p>
        <p className="text-gray-600 text-center max-w-md">
          Your payment is being processed. This may take a few moments.
        </p>
      </div>
    );
  }

  // Refunded State
  if (status === "refunded") {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-gray-600" />
        </div>
        <p className="text-gray-900 font-bold text-2xl">Payment Refunded</p>
        <p className="text-gray-600 text-center max-w-md">
          This payment has been refunded to your original payment method.
        </p>
        {payment.refundedAt && (
          <p className="text-sm text-gray-500">
            Refunded on {new Date(payment.refundedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    );
  }

  // Default/Unknown State
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
        <Clock className="w-8 h-8 text-gray-600" />
      </div>
      <p className="text-gray-900 font-bold text-xl">Processing Payment</p>
      <p className="text-gray-600 text-center max-w-md">
        Payment status: {String(status || "unknown")}
      </p>
    </div>
  );
};

export default PaymentStatusChecker;
