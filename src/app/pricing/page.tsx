"use client";

import React, { useState } from "react";
import {
  useGetActivePricingPlansQuery,
  useGetSubscriptionStatusQuery,
} from "@/services/api";
import {
  Check,
  X,
  Sparkles,
  Crown,
  Zap,
  Star,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Award,
} from "lucide-react";
import PurchaseModal from "@/components/PurchaseModal";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

  // Fetch subscription status
  const { data: subscriptionData, isLoading: subscriptionLoading } =
    useGetSubscriptionStatusQuery(undefined, {
      skip: !user, // Only fetch if user is logged in
    });

  const pricingPlans = pricingData?.data || [];
  const hasActiveSubscription =
    subscriptionData?.data?.hasActiveSubscription || false;
  const currentSubscription = subscriptionData?.data?.subscription;
  const downloadStats = subscriptionData?.data?.downloadStats;

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate days remaining
  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handlePurchaseClick = (plan: PricingPlan) => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push("/login");
      return;
    }

    // Check if user already has an active subscription
    if (hasActiveSubscription) {
      alert(
        "You already have an active subscription. Please cancel your current subscription before purchasing a new one."
      );
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-16 w-16 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-900 text-lg font-medium">
            Loading pricing plans...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <X className="w-16 h-16 mx-auto mb-4 text-red-600" />
          <h2 className="text-2xl font-bold mb-2 text-gray-900">
            Error Loading Plans
          </h2>
          <p className="text-gray-600">
            Unable to load pricing plans. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Unlock premium designs and boost your creative projects with our
            flexible pricing plans
          </p>
          <div className="inline-flex items-center bg-blue-50 rounded-lg px-4 py-2 border border-blue-200">
            <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
            <p className="text-sm text-blue-700 font-medium">
              All plans include 24/7 support
            </p>
          </div>
        </div>
      </div>

      {/* Current Subscription Section */}
      {user && hasActiveSubscription && currentSubscription && (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="bg-green-50 rounded-lg p-6 border border-green-200 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h2 className="text-xl font-bold text-gray-900">
                      Your Active Subscription
                    </h2>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-green-700 text-sm">
                    You&apos;re currently subscribed to a premium plan
                  </p>
                </div>
              </div>
              <Link href="/dashboard">
                <button className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-900 rounded-lg border border-gray-300 transition-all font-medium text-sm">
                  View Dashboard
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Plan Name */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Crown className="w-4 h-4 text-yellow-600" />
                  <p className="text-sm text-gray-600 font-medium">Plan</p>
                </div>
                <p className="text-lg font-bold text-gray-900 capitalize">
                  {currentSubscription.pricingPlan?.name}
                </p>
              </div>

              {/* Subscription Dates */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <p className="text-sm text-gray-600 font-medium">
                    Valid Until
                  </p>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {formatDate(currentSubscription.subscriptionEndDate)}
                </p>
                <p className="text-sm text-green-600 mt-1 font-medium">
                  {calculateDaysRemaining(
                    currentSubscription.subscriptionEndDate
                  )}{" "}
                  days left
                </p>
              </div>

              {/* Downloads */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <p className="text-sm text-gray-600 font-medium">Downloads</p>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {downloadStats?.remainingDownloads === -1
                    ? "Unlimited"
                    : `${downloadStats?.remainingDownloads || 0} left`}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {downloadStats?.totalDownloaded || 0} used
                </p>
              </div>

              {/* Amount Paid */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="w-4 h-4 text-green-600" />
                  <p className="text-sm text-gray-600 font-medium">
                    Amount Paid
                  </p>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  ${currentSubscription.amount?.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 mt-1 uppercase">
                  {currentSubscription.currency}
                </p>
              </div>
            </div>

            {/* Progress Bar for Limited Downloads */}
            {downloadStats?.remainingDownloads !== -1 &&
              currentSubscription.pricingPlan?.maxDownloads && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700 font-medium">
                      Download Usage
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {(
                        ((downloadStats?.totalDownloaded || 0) /
                          currentSubscription.pricingPlan.maxDownloads) *
                        100
                      ).toFixed(0)}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          ((downloadStats?.totalDownloaded || 0) /
                            currentSubscription.pricingPlan.maxDownloads) *
                            100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

            {/* Features */}
            {currentSubscription.pricingPlan?.features &&
              currentSubscription.pricingPlan.features.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-base font-bold text-gray-900 mb-3">
                    Your Plan Features:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {currentSubscription.pricingPlan.features.map(
                      (feature: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 bg-white rounded-lg p-3 border border-gray-200"
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            {feature}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Admin Notes */}
            {currentSubscription.adminNotes && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-blue-900 mb-1">
                      Message from Admin
                    </h4>
                    <p className="text-sm text-blue-700">
                      {currentSubscription.adminNotes}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {pricingPlans.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Pricing Plans Available
            </h3>
            <p className="text-gray-600">
              Check back soon for our pricing options!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricingPlans.map((plan: PricingPlan) => {
              const colors = getPlanColors(plan);
              const finalPrice = getFinalPrice(plan);
              const isPopular = plan.priority === 1;
              const isCurrentPlan =
                hasActiveSubscription &&
                currentSubscription?.pricingPlan?._id === plan._id;

              return (
                <div
                  key={plan._id}
                  className={`relative group cursor-pointer transition-all duration-300 ${
                    selectedPlan === plan._id ? "scale-105" : "hover:scale-105"
                  } ${isCurrentPlan ? "opacity-75" : ""}`}
                  onClick={() =>
                    setSelectedPlan(selectedPlan === plan._id ? null : plan._id)
                  }
                >
                  {/* Current Plan Badge */}
                  {isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Current Plan</span>
                      </div>
                    </div>
                  )}

                  {/* Popular Badge */}
                  {isPopular && !isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm">
                        ⭐ Most Popular
                      </div>
                    </div>
                  )}

                  {/* Discount Badge */}
                  {plan.discountPercentage && plan.discountPercentage > 0 && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="bg-red-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm">
                        -{plan.discountPercentage}%
                      </div>
                    </div>
                  )}

                  <div
                    className={`
                      relative h-full bg-white rounded-lg p-6 border transition-all duration-200
                      ${
                        isPopular
                          ? "border-yellow-500 shadow-md ring-2 ring-yellow-500/20"
                          : "border-gray-200 shadow-sm"
                      }
                      ${
                        selectedPlan === plan._id
                          ? "shadow-md ring-2 ring-blue-500/20"
                          : ""
                      }
                      hover:shadow-md
                    `}
                  >
                    {/* Plan Header */}
                    <div className="text-center mb-6">
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${colors.gradient} mb-3`}
                      >
                        <div className="text-white">{getPlanIcon(plan)}</div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 capitalize">
                        {plan.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {plan.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-6 pb-6 border-b border-gray-200">
                      <div className="flex items-baseline justify-center">
                        {plan.discountPercentage &&
                          plan.discountPercentage > 0 && (
                            <span className="text-xl text-gray-400 line-through mr-2">
                              ${formatPrice(plan.price)}
                            </span>
                          )}
                        <span className="text-4xl font-bold text-gray-900">
                          ${formatPrice(finalPrice)}
                        </span>
                        <span className="text-gray-600 ml-1">
                          /{plan.duration}
                        </span>
                      </div>
                      {plan.discountPercentage &&
                        plan.discountPercentage > 0 && (
                          <div className="mt-2">
                            <span className="text-green-600 text-sm font-medium">
                              Save ${formatPrice(plan.price - finalPrice)} (
                              {plan.discountPercentage}% off)
                            </span>
                          </div>
                        )}
                      {plan.validUntil && (
                        <p className="text-sm text-orange-600 mt-2 font-medium">
                          ⏰ Valid until{" "}
                          {new Date(plan.validUntil).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-6">
                      <h4 className="text-sm font-bold text-gray-900 mb-2">
                        What&apos;s Included:
                      </h4>
                      <div className="space-y-2">
                        {/* Max Designs */}
                        <div className="flex items-start text-gray-700">
                          <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">
                            {plan.maxDesigns === -1
                              ? "Unlimited"
                              : plan.maxDesigns.toLocaleString()}{" "}
                            Designs Access
                          </span>
                        </div>

                        {/* Max Downloads */}
                        <div className="flex items-start text-gray-700">
                          <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">
                            {plan.maxDownloads === -1
                              ? "Unlimited"
                              : plan.maxDownloads.toLocaleString()}{" "}
                            Downloads/month
                          </span>
                        </div>

                        {/* Features */}
                        {plan.features &&
                          plan.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-start text-gray-700"
                            >
                              <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}

                        {/* Plan Duration */}
                        <div className="flex items-start text-gray-700">
                          <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
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
                      disabled={isCurrentPlan}
                      className={`
                        w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 
                        ${
                          isCurrentPlan
                            ? "bg-gray-400 cursor-not-allowed"
                            : colors.button
                        } 
                        shadow-sm
                        flex items-center justify-center space-x-2
                      `}
                    >
                      {isCurrentPlan ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Active Plan</span>
                        </>
                      ) : (
                        <>
                          <span>Get {plan.name}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {/* Additional Info */}
                    <div className="text-center mt-4 space-y-1">
                      {plan.discountPercentage &&
                        plan.discountPercentage > 0 && (
                          <p className="text-xs text-green-600 font-medium">
                            🎉 Limited Time: {plan.discountPercentage}% Discount
                          </p>
                        )}
                      <p className="text-xs text-gray-500">
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
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm text-left">
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Can I change my plan later?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes, you can upgrade or downgrade your plan at any time from
                your account settings.
              </p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm text-left">
              <h3 className="text-base font-bold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 text-sm">
                We accept all major credit cards, PayPal, and Stripe for secure
                payments.
              </p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm text-left">
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Is there a money-back guarantee?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes, we offer a 30-day money-back guarantee for all our plans.
              </p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm text-left">
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Do you offer custom plans?
              </h3>
              <p className="text-gray-600 text-sm">
                For enterprise needs, we can create custom plans. Contact our
                sales team for more details.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-white mb-3">
              Need Help Choosing?
            </h2>
            <p className="text-white/90 mb-6">
              Our team is here to help you find the perfect plan for your needs.
            </p>
            <button className="bg-white text-blue-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-sm">
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
