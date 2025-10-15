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
  title: string;
  description: string;
  price: number;
  previewImageUrl?: string;
  category: {
    _id: string;
    name: string;
  };
}

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: PricingPlan;
  design?: Design;
  purchaseType: "subscription" | "individual";
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  plan,
  design,
  purchaseType,
}) => {
  const [createPurchase, { isLoading }] = useCreatePurchaseMutation();

  const [step, setStep] = useState<"payment" | "billing" | "success" | "error">(
    "payment"
  );
  const [errorMessage, setErrorMessage] = useState("");

  // Get item details based on purchase type
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
    purchaseType === "subscription" ? plan?.price || 0 : design?.price || 0;
  const hasDiscount =
    purchaseType === "subscription" &&
    plan?.discountPercentage &&
    plan.discountPercentage > 0;

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState<
    "credit_card" | "paypal" | "stripe" | "bank_transfer" | "free"
  >("credit_card");
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

  const [currency, setCurrency] = useState("USD");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate payment details
    if (paymentMethod === "credit_card") {
      if (
        !paymentDetails.cardNumber ||
        !paymentDetails.expiryDate ||
        !paymentDetails.cvv ||
        !paymentDetails.cardholderName
      ) {
        setErrorMessage("Please fill in all payment details");
        return;
      }
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
        paymentMethod,
        paymentDetails:
          paymentMethod === "credit_card" ? paymentDetails : undefined,
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
    setPaymentMethod("credit_card");
    setCurrency("USD");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-800/90 to-pink-800/90 backdrop-blur-md px-6 py-4 border-b border-white/10 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {purchaseType === "subscription"
                ? "Subscribe to Plan"
                : "Purchase Design"}
            </h2>
            <p className="text-sm text-gray-300 capitalize">
              {itemName} - ${formatPrice(itemPrice)}
            </p>
          </div>
          <button
            onClick={resetAndClose}
            className="text-white hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Progress Indicator */}
          {step !== "success" && step !== "error" && (
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-4">
                <div
                  className={`flex items-center ${
                    step === "payment" ? "text-purple-400" : "text-green-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step === "payment" ? "bg-purple-500" : "bg-green-500"
                    } text-white font-bold`}
                  >
                    {step === "payment" ? "1" : "✓"}
                  </div>
                  <span className="ml-2 text-sm font-medium">Payment</span>
                </div>
                <div className="w-20 h-1 bg-white/20 rounded-full">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      step === "billing"
                        ? "bg-purple-500 w-full"
                        : "bg-gray-500 w-0"
                    }`}
                  ></div>
                </div>
                <div
                  className={`flex items-center ${
                    step === "billing" ? "text-purple-400" : "text-gray-500"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step === "billing" ? "bg-purple-500" : "bg-white/20"
                    } text-white font-bold`}
                  >
                    2
                  </div>
                  <span className="ml-2 text-sm font-medium">Billing</span>
                </div>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-300">
                <span className="capitalize">{itemName}</span>
                <span className="font-medium">
                  ${formatPrice(originalPrice)}
                </span>
              </div>
              {hasDiscount && (
                <div className="flex justify-between text-green-400">
                  <span>Discount ({plan!.discountPercentage}%)</span>
                  <span>-${formatPrice(originalPrice - itemPrice)}</span>
                </div>
              )}
              <div className="border-t border-white/20 pt-3 flex justify-between text-white font-bold text-xl">
                <span>Total</span>
                <span>${formatPrice(itemPrice)}</span>
              </div>
              {purchaseType === "subscription" && plan && (
                <p className="text-xs text-gray-400 mt-2">
                  Billed {plan.duration} •{" "}
                  {plan.maxDownloads === -1 ? "Unlimited" : plan.maxDownloads}{" "}
                  downloads
                </p>
              )}
              {purchaseType === "individual" && design && (
                <p className="text-xs text-gray-400 mt-2">
                  One-time purchase • Lifetime access
                </p>
              )}
            </div>
          </div>

          {/* Success State */}
          {step === "success" && (
            <div className="text-center py-12">
              <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-white mb-4">
                Purchase Successful! 🎉
              </h3>
              <p className="text-gray-300 mb-6">
                {purchaseType === "subscription"
                  ? "Your subscription is now active. You can start downloading designs!"
                  : "Your design purchase is complete. You can now download your design!"}
              </p>
              <button
                onClick={resetAndClose}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                {purchaseType === "subscription"
                  ? "Start Exploring"
                  : "Download Now"}
              </button>
            </div>
          )}

          {/* Error State */}
          {step === "error" && (
            <div className="text-center py-12">
              <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-white mb-4">
                Purchase Failed
              </h3>
              <p className="text-gray-300 mb-6">{errorMessage}</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setStep("payment")}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                >
                  Try Again
                </button>
                <button
                  onClick={resetAndClose}
                  className="bg-white/10 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Payment Form */}
          {step === "payment" && (
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-3">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("credit_card")}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      paymentMethod === "credit_card"
                        ? "border-purple-500 bg-purple-500/20"
                        : "border-white/20 bg-white/5 hover:border-white/40"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mx-auto mb-1 text-white" />
                    <span className="text-xs text-white font-medium">
                      Credit Card
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("paypal")}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      paymentMethod === "paypal"
                        ? "border-purple-500 bg-purple-500/20"
                        : "border-white/20 bg-white/5 hover:border-white/40"
                    }`}
                  >
                    <Building2 className="w-5 h-5 mx-auto mb-1 text-white" />
                    <span className="text-xs text-white font-medium">
                      PayPal
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("stripe")}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      paymentMethod === "stripe"
                        ? "border-purple-500 bg-purple-500/20"
                        : "border-white/20 bg-white/5 hover:border-white/40"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mx-auto mb-1 text-white" />
                    <span className="text-xs text-white font-medium">
                      Stripe
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bank_transfer")}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      paymentMethod === "bank_transfer"
                        ? "border-purple-500 bg-purple-500/20"
                        : "border-white/20 bg-white/5 hover:border-white/40"
                    }`}
                  >
                    <Building2 className="w-5 h-5 mx-auto mb-1 text-white" />
                    <span className="text-xs text-white font-medium">
                      Bank Transfer
                    </span>
                  </button>
                </div>
              </div>

              {paymentMethod === "credit_card" && (
                <>
                  <div>
                    <label className="block text-white font-semibold mb-2">
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
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">
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
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">
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
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">
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
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                        placeholder="123"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {errorMessage && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-center text-red-300">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="text-sm">{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Continue to Billing</span>
              </button>
            </form>
          )}

          {/* Billing Form */}
          {step === "billing" && (
            <form onSubmit={handleBillingSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2">
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
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                  placeholder="123 Main Street"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">
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
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                    placeholder="New York"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">
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
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                    placeholder="NY"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">
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
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                    placeholder="10001"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">
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
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                    placeholder="United States"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                  placeholder="Any special requests or notes..."
                  rows={3}
                />
              </div>

              {errorMessage && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-center text-red-300">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="text-sm">{errorMessage}</span>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep("payment")}
                  disabled={isLoading}
                  className="flex-1 bg-white/10 text-white py-4 rounded-2xl font-bold hover:bg-white/20 transition-all duration-300"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
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
            <div className="mt-6 text-center text-sm text-gray-400">
              <p>
                🔒 Secure payment • Your information is encrypted and secure
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
