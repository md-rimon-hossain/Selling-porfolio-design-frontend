"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  ShoppingBag,
  CircleGauge,
  Sparkles,
  Shield,
  Lock,
  Download,
} from "lucide-react";
import { useCreatePaymentIntentMutation, api } from "@/services/api";
import StripeProvider from "./StripeProvider";
import PaymentForm from "./PaymentForm";
import PaymentStatusChecker from "./PaymentStatusChecker";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";

interface PricingPlan {
  _id: string;
  name: string;
  description: string;
  price: number;
  finalPrice: number;
  currencyDisplay: string;
  currencyCode: string;
  features: string[];
  duration: string;
  maxDesigns: number;
  maxDownloads: number;
  priority: number;
  isActive: boolean;
  discountPercentage?: number;
  validUntil?: string;
}

interface Design {
  _id: string;
  title: string | undefined;
  description: string | undefined;
  currencyDisplay: string;
  currencyCode: string;
  price: number | undefined;
  basePrice?: number | undefined;
  previewImageUrl?: string;
  category: {
    _id: string | null;
    name: string | undefined;
  };
}

interface Course {
  _id: string;
  title: string;
  description?: string;
  currencyDisplay: string;
  currencyCode: string;
  price: number;
  basePrice?: number;
  previewImageUrl?: string;
}

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: PricingPlan;
  design?: Design;
  course?: Course;
  purchaseType: "subscription" | "individual";
  onPaymentSuccess?: () => void; // Callback to refetch data after payment
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  plan,
  design,
  course,
  purchaseType,
  onPaymentSuccess,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [createPaymentIntent, { isLoading: isCreatingIntent }] =
    useCreatePaymentIntentMutation();

  const [step, setStep] = useState<
    "details" | "payment" | "processing" | "success" | "error"
  >("details");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Get item details
  const currencyDisplay =
    purchaseType === "subscription"
      ? plan?.currencyDisplay || "$"
      : purchaseType === "individual" && design
      ? design.currencyDisplay
      : course?.currencyDisplay || "$";

  const currencyCode =
    purchaseType === "subscription"
      ? plan?.currencyCode || "USD"
      : purchaseType === "individual" && design
      ? design.currencyCode
      : course?.currencyCode || "USD";

  const itemPrice =
    purchaseType === "subscription"
      ? plan?.finalPrice || plan?.price || 0
      : purchaseType === "individual" && design
      ? design.price || 0
      : course?.price || 0;

  const itemName =
    purchaseType === "subscription"
      ? plan?.name || ""
      : purchaseType === "individual" && design
      ? design.title || ""
      : course?.title || "";

  const itemDescription =
    purchaseType === "subscription"
      ? plan?.description || ""
      : purchaseType === "individual" && design
      ? design.description || ""
      : course?.description || "";

  const originalPrice =
    purchaseType === "subscription"
      ? plan?.price || 0
      : purchaseType === "individual" && design
      ? design.basePrice || design.price || 0
      : course?.basePrice || course?.price || 0;

  const hasDiscount =
    purchaseType === "subscription"
      ? plan?.discountPercentage && plan.discountPercentage > 0
      : originalPrice > itemPrice;

  const discountPercentage =
    purchaseType === "subscription" && plan?.discountPercentage
      ? plan.discountPercentage
      : hasDiscount
      ? Math.round(((originalPrice - itemPrice) / originalPrice) * 100)
      : 0;

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep("details");
      setClientSecret(null);
      setPaymentIntentId(null);
      setErrorMessage("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInitiatePayment = async () => {
    try {
      setStep("processing");
      setErrorMessage("");

      const productType =
        purchaseType === "subscription"
          ? "subscription"
          : design
          ? "design"
          : "course";
      const productId =
        purchaseType === "subscription"
          ? plan?._id
          : design?._id || course?._id;

      if (!productId) {
        throw new Error("Product ID is missing");
      }

      const result = await createPaymentIntent({
        productType,
        productId,
        currency: currencyCode,
      }).unwrap();

      if (result.success && result.data) {
        setClientSecret(result.data.clientSecret);
        setPaymentIntentId(result.data.paymentIntentId);
        setStep("payment");
      } else {
        throw new Error(result.message || "Failed to create payment intent");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      const message =
        err?.data?.message ||
        err?.message ||
        "Failed to initiate payment. Please try again.";
      setErrorMessage(message);
      setStep("error");
    }
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    setPaymentIntentId(paymentId);
    // Wait 2 seconds to give webhook time to process
    // This prevents showing "pending" status immediately
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setStep("success");
    // Don't refetch here - let PaymentStatusChecker handle it when status is confirmed
  };

  // New handler: called when PaymentStatusChecker confirms payment is completed
  const handlePaymentConfirmed = () => {
    // Invalidate cache tags to force refetch of purchases and downloads
    dispatch(api.util.invalidateTags(["Purchases", "Downloads", "Designs"]));

    // Call the refetch callback to update design data
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }

    // Close modal after 3 seconds to show updated design page
    setTimeout(() => {
      setIsRedirecting(true);
      onClose();
    }, 3000);
  };

  const handlePaymentError = (error: string) => {
    setErrorMessage(error);
    setStep("error");
  };

  const formatPrice = (price: number) => price.toFixed(2);

  const resetAndClose = () => {
    setStep("details");
    setClientSecret(null);
    setPaymentIntentId(null);
    setErrorMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-300">
        {/* Stripe Trust Badge Header */}
        {step === "payment" && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">
                  Secured by Stripe
                </p>
                <p className="text-blue-100 text-xs">
                  End-to-end encrypted payment
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-white" />
              <span className="text-white font-semibold text-sm">
                256-bit SSL
              </span>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 transition-all duration-500 ease-out"
            style={{
              width:
                step === "details"
                  ? "33%"
                  : step === "processing"
                  ? "50%"
                  : step === "payment"
                  ? "75%"
                  : "100%",
            }}
          />
        </div>

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {step === "details" && "Review Order"}
                {step === "processing" && "Preparing Payment..."}
                {step === "payment" && "Complete Payment"}
                {step === "success" && "Payment Successful!"}
                {step === "error" && "Payment Failed"}
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                {itemName} • {currencyDisplay}
                {formatPrice(itemPrice)}
              </p>
            </div>
            <button
              onClick={resetAndClose}
              className="text-gray-400 hover:text-gray-600 transition-all p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Step: Details */}
          {step === "details" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Order Summary - Compact */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingBag className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-gray-900">
                    Order Summary
                  </h3>
                </div>

                {/* Item Details - Compact */}
                {purchaseType === "individual" && (design || course) && (
                  <div className="flex items-start gap-3 mb-3 p-3 bg-white rounded-lg border border-blue-100 relative">
                    {hasDiscount && discountPercentage > 0 && (
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {discountPercentage}% OFF
                      </div>
                    )}
                    {(design?.previewImageUrl || course?.previewImageUrl) && (
                      <img
                        src={design?.previewImageUrl || course?.previewImageUrl}
                        alt={itemName}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 font-semibold text-sm line-clamp-1">
                        {itemName}
                      </h4>
                      {design?.category?.name && (
                        <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium mt-1">
                          {design.category.name}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Pricing - Compact */}
                <div className="space-y-2 bg-white rounded-lg p-3 border border-blue-100">
                  <div className="flex justify-between items-center text-gray-700 text-sm">
                    <span className="font-medium">Price</span>
                    {hasDiscount ? (
                      <div className="text-right">
                        <span className="line-through text-gray-400 text-xs mr-1">
                          {currencyDisplay}
                          {formatPrice(originalPrice)}
                        </span>
                        <span className="text-gray-900 font-bold">
                          {currencyDisplay}
                          {formatPrice(itemPrice)}
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold">
                        {currencyDisplay}
                        {formatPrice(originalPrice)}
                      </span>
                    )}
                  </div>
                  {hasDiscount && discountPercentage > 0 && (
                    <div className="flex justify-between text-green-600 text-xs bg-green-50 px-2 py-1 rounded">
                      <span className="font-medium">
                        Discount ({discountPercentage}%)
                      </span>
                      <span className="font-semibold">
                        -{currencyDisplay}
                        {formatPrice(originalPrice - itemPrice)}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                    <span className="text-gray-900 font-bold">Total</span>
                    <span className="text-xl font-bold text-blue-600">
                      {currencyDisplay}
                      {formatPrice(itemPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* What's Included - Compact */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  What's Included
                </h4>
                {purchaseType === "subscription" && plan?.features && (
                  <ul className="space-y-1">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start text-xs text-gray-700"
                      >
                        <CheckCircle className="w-3 h-3 text-green-600 mr-1.5 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {purchaseType === "individual" && (
                  <ul className="space-y-1">
                    <li className="flex items-start text-xs text-gray-700">
                      <CheckCircle className="w-3 h-3 text-green-600 mr-1.5 flex-shrink-0 mt-0.5" />
                      <span>Instant download access</span>
                    </li>
                    <li className="flex items-start text-xs text-gray-700">
                      <CheckCircle className="w-3 h-3 text-green-600 mr-1.5 flex-shrink-0 mt-0.5" />
                      <span>Lifetime access to files</span>
                    </li>
                    <li className="flex items-start text-xs text-gray-700">
                      <CheckCircle className="w-3 h-3 text-green-600 mr-1.5 flex-shrink-0 mt-0.5" />
                      <span>Commercial use license</span>
                    </li>
                  </ul>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-200">
                <div className="text-center">
                  <Shield className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-[10px] font-semibold text-gray-700">
                    Secured by
                  </p>
                  <p className="text-xs font-bold text-blue-600">Stripe</p>
                </div>
                <div className="text-center border-x border-gray-200">
                  <Lock className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <p className="text-[10px] font-semibold text-gray-700">
                    256-bit
                  </p>
                  <p className="text-xs font-bold text-green-600">SSL</p>
                </div>
                <div className="text-center">
                  <CheckCircle className="w-6 h-6 text-indigo-600 mx-auto mb-1" />
                  <p className="text-[10px] font-semibold text-gray-700">PCI</p>
                  <p className="text-xs font-bold text-indigo-600">Compliant</p>
                </div>
              </div>

              <button
                onClick={handleInitiatePayment}
                disabled={isCreatingIntent}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white py-3.5 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCreatingIntent ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Preparing...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Continue to Secure Payment</span>
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-500">
                Your payment information is encrypted and secure
              </p>
            </div>
          )}

          {/* Step: Processing */}
          {step === "processing" && (
            <div className="flex flex-col items-center justify-center py-16 animate-in fade-in zoom-in duration-500">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-pulse">
                  <Loader2 className="w-12 h-12 animate-spin text-white" />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 animate-ping opacity-20" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Preparing Your Payment
              </h3>
              <p className="text-gray-600 text-center max-w-sm">
                Setting up a secure connection with our payment provider...
              </p>
            </div>
          )}

          {/* Step: Payment Form */}
          {step === "payment" && clientSecret && (
            <div className="animate-in fade-in slide-in-from-right duration-500">
              <StripeProvider clientSecret={clientSecret}>
                <PaymentForm
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  amount={itemPrice}
                  currency={currencyDisplay}
                  itemName={itemName}
                  returnUrl={`${window.location.origin}/payment/success?payment_intent=${paymentIntentId}`}
                />
              </StripeProvider>
            </div>
          )}

          {/* Step: Success */}
          {step === "success" && paymentIntentId && (
            <div className="animate-in fade-in zoom-in duration-500">
              <PaymentStatusChecker
                paymentIntentId={paymentIntentId}
                onSuccess={handlePaymentConfirmed}
              />

              {/* Auto-redirect notice */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200 mb-4">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {isRedirecting
                      ? "Closing modal... You can now download!"
                      : "You can now download this design!"}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isRedirecting}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Now
                </button>
                <button
                  onClick={() => router.push("/dashboard/purchases")}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                >
                  View Purchases
                </button>
              </div>
            </div>
          )}

          {/* Step: Error */}
          {step === "error" && (
            <div className="space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="text-center py-8">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-red-600" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Payment Failed
                </h3>
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4 max-w-md mx-auto">
                  <p className="text-red-700 font-medium">{errorMessage}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setStep("details")}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                >
                  Try Again
                </button>
                <button
                  onClick={resetAndClose}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-[1.02]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
