"use client";

import React, { useState } from "react";
import {
  X,
  CreditCard,
  Building2,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useCreatePurchaseMutation } from "@/services/api";

interface PricingPlan {
  _id: string;
  name: string;
  description: string;
  price: number;
  finalPrice: number;
  currencyDisplay: string;
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
  price: number | undefined; // discountedPrice
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
  price: number;
  previewImageUrl?: string;
}

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: PricingPlan;
  design?: Design;
  course?: Course;
  purchaseType: "subscription" | "individual";
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  plan,
  design,
  course,
  purchaseType,
}) => {
  const [createPurchase, { isLoading }] = useCreatePurchaseMutation();

  const [step, setStep] = useState<"payment" | "billing" | "success" | "error">(
    "payment"
  );
  const [errorMessage, setErrorMessage] = useState("");

  // Get item details based on purchase type
  const currencyCode = purchaseType === "subscription" ? plan?.currencyDisplay || "৳" : design?.currencyDisplay || "৳";
  const itemPrice =
    purchaseType === "subscription"
      ? plan?.finalPrice || plan?.price || 0
      : design?.price || 0;
  const itemName =
    purchaseType === "subscription" ? plan?.name || "" : design?.title || "";
  const itemDescription =
    purchaseType === "subscription"
      ? plan?.description || ""
      : design?.description || "";
  const originalPrice =
    purchaseType === "subscription"
      ? plan?.price || 0
      : design?.basePrice || design?.price || 0;
  const hasDiscount =
    purchaseType === "subscription"
      ? plan?.discountPercentage && plan.discountPercentage > 0
      : (design?.basePrice && design.basePrice > (design.price || 0)) || false;
  const discountPercentage =
    purchaseType === "subscription" && plan?.discountPercentage
      ? plan.discountPercentage
      : hasDiscount && design?.basePrice && design.price
      ? Math.round(((design.basePrice - design.price) / design.basePrice) * 100)
      : 0;

  // Payment form state
  const [paymentMethod, setPaymentMethod] =
    useState<"credit_card">("credit_card");
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  // Billing form state
  const [billingAddress, setBillingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [currency, setCurrency] = useState("BDT");
  const [notes, setNotes] = useState("");
  const [userTransactionId, setUserTransactionId] = useState("");

  if (!isOpen) return null;

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate credit card details
    if (
      !paymentDetails.cardNumber ||
      !paymentDetails.expiryDate ||
      !paymentDetails.cvv ||
      !paymentDetails.cardholderName
    ) {
      setErrorMessage("Please fill in all credit card details");
      return;
    }

    setStep("billing");
  };

  const handleBillingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate billing address
    if (
      !billingAddress.street ||
      !billingAddress.city ||
      !billingAddress.state ||
      !billingAddress.zipCode ||
      !billingAddress.country
    ) {
      setErrorMessage("Please fill in all billing address fields");
      return;
    }

    try {
      const purchaseData = {
        purchaseType,
        ...(purchaseType === "subscription" && plan
          ? { pricingPlan: plan._id }
          : {}),
        ...(purchaseType === "individual" && design
          ? { design: design._id }
          : {}),
        ...(purchaseType === "individual" &&
        !design &&
        typeof course !== "undefined" &&
        course
          ? { course: (course as any)._id }
          : {}),
        paymentMethod,
        paymentDetails,
        currency,
        billingAddress,
        notes,
      };

      const result = await createPurchase(purchaseData).unwrap();

      if (result.success) {
        setStep("success");
      } else {
        setErrorMessage(result.message || "Purchase failed. Please try again.");
        setStep("error");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      setErrorMessage(
        err?.data?.message ||
          "An error occurred during purchase. Please try again."
      );
      setStep("error");
    }
  };

  const formatPrice = (price: number) => price.toFixed(2);

  const resetAndClose = () => {
    setStep("payment");
    setErrorMessage("");
    setCurrency("BDT");
    setUserTransactionId("");
    setPaymentDetails({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
    });
    setBillingAddress({
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    });
    setNotes("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {purchaseType === "subscription"
                ? "Subscribe to Plan"
                : "Purchase Design"}
            </h2>
            <p className="text-sm text-gray-600 capitalize">
              {itemName} - {currencyCode}{formatPrice(itemPrice)}
            </p>
          </div>
          <button
            onClick={resetAndClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {/* Progress Indicator */}
          {step !== "success" && step !== "error" && (
            <div className="mb-4">
              <div className="flex items-center justify-center space-x-2">
                <div
                  className={`flex items-center ${
                    step === "payment" ? "text-blue-600" : "text-green-600"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      step === "payment" ? "bg-blue-600" : "bg-green-600"
                    } text-white font-semibold text-xs`}
                  >
                    {step === "payment" ? "1" : "✓"}
                  </div>
                  <span className="ml-1 text-xs font-medium text-gray-700">
                    Payment
                  </span>
                </div>
                <div className="w-8 h-0.5 bg-gray-200">
                  <div
                    className={`h-full transition-all duration-300 ${
                      step === "billing"
                        ? "bg-blue-600 w-full"
                        : "bg-gray-300 w-0"
                    }`}
                  ></div>
                </div>
                <div
                  className={`flex items-center ${
                    step === "billing" ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      step === "billing" ? "bg-blue-600" : "bg-gray-200"
                    } text-white font-semibold text-xs`}
                  >
                    2
                  </div>
                  <span className="ml-1 text-xs font-medium text-gray-700">
                    Billing
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Order Summary
            </h3>

            {/* Item Details */}
            {purchaseType === "individual" && design && (
              <div className="flex items-start gap-3 mb-3 p-3 bg-white rounded-lg border border-gray-100 relative">
                {hasDiscount && discountPercentage > 0 && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {discountPercentage}% OFF
                  </div>
                )}
                {design.previewImageUrl && (
                  <div className="flex-shrink-0">
                    <img
                      src={design.previewImageUrl}
                      alt={design.title}
                      className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-gray-900 font-semibold text-base truncate">
                    {design.title}
                  </h4>
                  {design.category?.name && (
                    <p className="text-blue-600 text-sm font-medium">
                      {design.category.name}
                    </p>
                  )}
                  {design.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {design.description}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-gray-700">
                <span className="capitalize font-medium">{itemName}</span>
                {hasDiscount ? (
                  <div className="text-right">
                    <span className="line-through text-gray-500 text-sm">
                      {currencyCode}
                      {formatPrice(originalPrice)}
                    </span>
                    <span className="text-gray-900 font-semibold ml-2">
                      {currencyCode}
                      {formatPrice(itemPrice)}
                    </span>
                  </div>
                ) : (
                  <span className="font-semibold">
                    {currencyCode}
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>
              {hasDiscount && discountPercentage > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="font-medium">
                    Discount ({discountPercentage}%)
                  </span>
                  <span className="font-semibold">
                    -{currencyCode}
                    {formatPrice(originalPrice - itemPrice)}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 flex justify-between text-gray-900 font-bold text-lg">
                <span>Total</span>
                <span>{currencyCode}
                  {formatPrice(itemPrice)}</span>
              </div>
              {purchaseType === "subscription" && plan && (
                <p className="text-xs text-gray-500 mt-2">
                  Billed {plan.duration} •{" "}
                  {plan.maxDownloads === -1 ? "Unlimited" : plan.maxDownloads}{" "}
                  downloads
                </p>
              )}
              {purchaseType === "individual" && design && (
                <p className="text-xs text-gray-500 mt-2">
                  One-time purchase • Lifetime access
                </p>
              )}
            </div>
          </div>

          {/* Success State */}
          {step === "success" && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Purchase Successful! 🎉
              </h3>
              <p className="text-gray-600 mb-1">
                {purchaseType === "subscription"
                  ? "Your subscription is now active. You can start downloading designs!"
                  : "Your design purchase is complete. You can now download your design!"}
              </p>
              {purchaseType === "individual" && design && hasDiscount && (
                <p className="text-green-600 text-sm font-medium mb-4">
                  You saved {currencyCode}{formatPrice(originalPrice - itemPrice)}!
                </p>
              )}
              <button
                onClick={resetAndClose}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors shadow-sm"
              >
                {purchaseType === "subscription"
                  ? "Start Exploring"
                  : "Download Now"}
              </button>
            </div>
          )}

          {/* Error State */}
          {step === "error" && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Purchase Failed
              </h3>
              <p className="text-gray-600 mb-4">{errorMessage}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setStep("payment")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={resetAndClose}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Payment Form */}
          {step === "payment" && (
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-900 font-semibold mb-3">
                  Credit Card Information
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={paymentDetails.cardholderName}
                      onChange={(e) =>
                        setPaymentDetails({
                          ...paymentDetails,
                          cardholderName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={paymentDetails.cardNumber}
                      onChange={(e) =>
                        setPaymentDetails({
                          ...paymentDetails,
                          cardNumber: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={paymentDetails.expiryDate}
                        onChange={(e) =>
                          setPaymentDetails({
                            ...paymentDetails,
                            expiryDate: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={paymentDetails.cvv}
                        onChange={(e) =>
                          setPaymentDetails({
                            ...paymentDetails,
                            cvv: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                        placeholder="123"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="text-sm">{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 shadow-sm"
              >
                <span>Continue to Billing</span>
              </button>
            </form>
          )}

          {/* Billing Form */}
          {step === "billing" && (
            <form onSubmit={handleBillingSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-900 font-semibold mb-3">
                  Billing Address
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={billingAddress.street}
                      onChange={(e) =>
                        setBillingAddress({
                          ...billingAddress,
                          street: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                      placeholder="123 Main Street"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={billingAddress.city}
                        onChange={(e) =>
                          setBillingAddress({
                            ...billingAddress,
                            city: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                        placeholder="New York"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={billingAddress.state}
                        onChange={(e) =>
                          setBillingAddress({
                            ...billingAddress,
                            state: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                        placeholder="NY"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        value={billingAddress.zipCode}
                        onChange={(e) =>
                          setBillingAddress({
                            ...billingAddress,
                            zipCode: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                        placeholder="10001"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={billingAddress.country}
                        onChange={(e) =>
                          setBillingAddress({
                            ...billingAddress,
                            country: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                        placeholder="United States"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                      placeholder="Any special requests or notes..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="text-sm">{errorMessage}</span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("payment")}
                  disabled={isLoading}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 shadow-sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Complete Purchase</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Security Badge */}
          {step !== "success" && step !== "error" && (
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>
                🔒 Secure payment • Your information is encrypted and protected
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
