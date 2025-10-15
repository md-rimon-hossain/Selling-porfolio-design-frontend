"use client";

import React, { useState } from "react";
import { useGetActivePricingPlansQuery } from "@/services/api";
import {
  Check,
  X,
  Sparkles,
  Crown,
  Zap,
  Star,
  ArrowRight,
  Loader2,
} from "lucide-react";
import PurchaseModal from "@/components/PurchaseModal";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";

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
  createdAt: string;
  updatedAt: string;
}

const PricingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [selectedPlanForPurchase, setSelectedPlanForPurchase] =
    useState<PricingPlan | null>(null);
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const {
    data: pricingData,
    isLoading,
    error,
  } = useGetActivePricingPlansQuery();

  const pricingPlans = pricingData?.data || [];

  const handlePurchaseClick = (plan: PricingPlan) => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push("/login");
      return;
    }
    setSelectedPlanForPurchase(plan);
    setPurchaseModalOpen(true);
  };

  // Get the final price (use finalPrice from API if available, fallback to calculated)
  const getFinalPrice = (plan: PricingPlan) => {
    return plan.finalPrice || plan.price;
  };

  // Format price display
  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  // Get plan icon based on name or priority
  const getPlanIcon = (plan: PricingPlan) => {
    const name = plan.name.toLowerCase();
    if (name.includes("premium") || name.includes("pro")) {
      return <Crown className="w-8 h-8" />;
    } else if (name.includes("basic") || name.includes("starter")) {
      return <Sparkles className="w-8 h-8" />;
    } else if (name.includes("enterprise") || name.includes("ultimate")) {
      return <Zap className="w-8 h-8" />;
    }
    return <Star className="w-8 h-8" />;
  };

  // Get plan color scheme based on priority
  const getPlanColors = (plan: PricingPlan) => {
    if (plan.priority <= 1) {
      return {
        gradient: "from-purple-600 via-pink-600 to-blue-600",
        button:
          "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
        border: "border-purple-500/50",
        text: "text-purple-400",
      };
    } else if (plan.priority === 2) {
      return {
        gradient: "from-blue-600 via-indigo-600 to-purple-600",
        button:
          "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
        border: "border-blue-500/50",
        text: "text-blue-400",
      };
    }
    return {
      gradient: "from-gray-600 via-slate-600 to-gray-600",
      button:
        "bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700",
      border: "border-gray-500/50",
      text: "text-gray-400",
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-32 w-32 text-purple-400 mx-auto mb-4" />
          <p className="text-white text-xl">Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <X className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-bold mb-2">Error Loading Plans</h2>
          <p className="text-gray-300">
            Unable to load pricing plans. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-pink-800/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
            Unlock premium designs and boost your creative projects with our
            flexible pricing plans
          </p>
          <div className="flex justify-center">
            <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-2 border border-white/20">
              <p className="text-sm text-white">
                ✨ All plans include 24/7 support
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        {pricingPlans.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-bold text-white mb-2">
              No Pricing Plans Available
            </h3>
            <p className="text-gray-400">
              Check back soon for our pricing options!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan: PricingPlan) => {
              const colors = getPlanColors(plan);
              const finalPrice = getFinalPrice(plan);
              const isPopular = plan.priority === 1;

              return (
                <div
                  key={plan._id}
                  className={`relative group cursor-pointer transition-all duration-300 ${
                    selectedPlan === plan._id ? "scale-105" : "hover:scale-105"
                  }`}
                  onClick={() =>
                    setSelectedPlan(selectedPlan === plan._id ? null : plan._id)
                  }
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                        🔥 Most Popular
                      </div>
                    </div>
                  )}

                  {/* Discount Badge */}
                  {plan.discountPercentage && plan.discountPercentage > 0 && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        -{plan.discountPercentage}%
                      </div>
                    </div>
                  )}

                  <div
                    className={`
                      relative h-full bg-white/5 backdrop-blur-md rounded-3xl p-8 border transition-all duration-300
                      ${
                        isPopular
                          ? "border-yellow-500/50 shadow-2xl shadow-yellow-500/20"
                          : `${colors.border} shadow-xl`
                      }
                      ${
                        selectedPlan === plan._id
                          ? "shadow-2xl shadow-purple-500/30"
                          : ""
                      }
                      hover:shadow-2xl hover:bg-white/10
                    `}
                  >
                    {/* Plan Header */}
                    <div className="text-center mb-8">
                      <div
                        className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${colors.gradient} mb-4`}
                      >
                        <div className="text-white">{getPlanIcon(plan)}</div>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2 capitalize">
                        {plan.name}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {plan.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-8">
                      <div className="flex items-baseline justify-center">
                        {plan.discountPercentage &&
                          plan.discountPercentage > 0 && (
                            <span className="text-2xl text-gray-500 line-through mr-3">
                              ${formatPrice(plan.price)}
                            </span>
                          )}
                        <span className="text-5xl font-bold text-white">
                          ${formatPrice(finalPrice)}
                        </span>
                        <span className="text-gray-400 ml-1">
                          /{plan.duration}
                        </span>
                      </div>
                      {plan.discountPercentage &&
                        plan.discountPercentage > 0 && (
                          <div className="mt-2">
                            <span className="text-green-400 text-sm font-medium">
                              Save ${formatPrice(plan.price - finalPrice)} (
                              {plan.discountPercentage}% off)
                            </span>
                          </div>
                        )}
                      {plan.validUntil && (
                        <p className="text-sm text-yellow-400 mt-2">
                          ⏰ Valid until{" "}
                          {new Date(plan.validUntil).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <div className="space-y-4 mb-8">
                      <h4 className="text-lg font-semibold text-white mb-3">
                        What&apos;s Included:
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {/* Max Designs */}
                        <div className="flex items-center text-gray-300 bg-white/5 rounded-lg p-3">
                          <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                          <span className="text-sm font-medium">
                            {plan.maxDesigns === -1
                              ? "Unlimited"
                              : plan.maxDesigns.toLocaleString()}{" "}
                            Designs Access
                          </span>
                        </div>

                        {/* Max Downloads */}
                        <div className="flex items-center text-gray-300 bg-white/5 rounded-lg p-3">
                          <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                          <span className="text-sm font-medium">
                            {plan.maxDownloads === -1
                              ? "Unlimited"
                              : plan.maxDownloads.toLocaleString()}{" "}
                            Downloads per month
                          </span>
                        </div>

                        {/* Features */}
                        {plan.features &&
                          plan.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center text-gray-300 bg-white/5 rounded-lg p-3"
                            >
                              <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}

                        {/* Plan Duration */}
                        <div className="flex items-center text-gray-300 bg-white/5 rounded-lg p-3">
                          <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                          <span className="text-sm">
                            <strong>Duration:</strong> {plan.duration}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePurchaseClick(plan);
                      }}
                      className={`
                        w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 
                        ${colors.button} 
                        transform hover:scale-105 active:scale-95 shadow-lg
                        flex items-center justify-center space-x-2
                      `}
                    >
                      <span>
                        Get {plan.name} - ${formatPrice(finalPrice)}
                      </span>
                      <ArrowRight className="w-5 h-5" />
                    </button>

                    {/* Additional Info */}
                    <div className="text-center mt-4 space-y-1">
                      <p className="text-xs text-gray-500">
                        Plan ID: {plan._id.slice(-8)}
                      </p>
                      {plan.discountPercentage &&
                        plan.discountPercentage > 0 && (
                          <p className="text-xs text-green-400 font-medium">
                            🎉 Limited Time: {plan.discountPercentage}% Discount
                            Applied
                          </p>
                        )}
                      <p className="text-xs text-gray-600">
                        Created: {new Date(plan.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I change my plan later?
              </h3>
              <p className="text-gray-400 text-sm">
                Yes, you can upgrade or downgrade your plan at any time from
                your account settings.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-400 text-sm">
                We accept all major credit cards, PayPal, and Stripe for secure
                payments.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">
                Is there a money-back guarantee?
              </h3>
              <p className="text-gray-400 text-sm">
                Yes, we offer a 30-day money-back guarantee for all our plans.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">
                Do you offer custom plans?
              </h3>
              <p className="text-gray-400 text-sm">
                For enterprise needs, we can create custom plans. Contact our
                sales team for more details.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-purple-800/30 to-pink-800/30 backdrop-blur-md rounded-3xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">
              Need Help Choosing?
            </h2>
            <p className="text-gray-300 mb-6">
              Our team is here to help you find the perfect plan for your needs.
            </p>
            <button className="bg-white text-purple-900 px-8 py-3 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {selectedPlanForPurchase && (
        <PurchaseModal
          isOpen={purchaseModalOpen}
          onClose={() => {
            setPurchaseModalOpen(false);
            setSelectedPlanForPurchase(null);
          }}
          plan={selectedPlanForPurchase}
          purchaseType="subscription"
        />
      )}
    </div>
  );
};

export default PricingPage;
