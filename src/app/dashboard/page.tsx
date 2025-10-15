"use client";

import { useAppSelector } from "@/store/hooks";
import {
  useGetMyPurchasesQuery,
  useGetMyDownloadsQuery,
  useGetSubscriptionStatusQuery,
} from "@/services/api";
import {
  User,
  ShoppingBag,
  Download,
  TrendingUp,
  Sparkles,
  Package,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const { data: purchases } = useGetMyPurchasesQuery({ limit: 5 });
  const { data: downloads } = useGetMyDownloadsQuery({ page: 1, limit: 5 });
  const { data: subscriptionStatus } = useGetSubscriptionStatusQuery();

  const hasActiveSubscription =
    subscriptionStatus?.data?.hasActiveSubscription || false;
  const subscriptionPlanName =
    subscriptionStatus?.data?.currentPlan?.name || "None";
  const remainingDownloads = subscriptionStatus?.data?.remainingDownloads || 0;

  const stats = [
    {
      name: "Total Purchases",
      value: purchases?.pagination?.totalItems || "0",
      icon: ShoppingBag,
      color: "from-blue-600 to-cyan-600",
    },
    {
      name: "Total Downloads",
      value: downloads?.pagination?.total || "0",
      icon: Download,
      color: "from-purple-600 to-pink-600",
    },
    {
      name: "Subscription",
      value: hasActiveSubscription ? subscriptionPlanName : "No Plan",
      icon: TrendingUp,
      color: hasActiveSubscription
        ? "from-green-600 to-emerald-600"
        : "from-gray-500 to-gray-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="mt-2 text-blue-100">
              Manage your purchases, downloads, and reviews all in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subscription Info Card */}
      {hasActiveSubscription && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Active Subscription</h3>
              <p className="text-green-100">
                Plan:{" "}
                <span className="font-semibold">{subscriptionPlanName}</span>
              </p>
              <p className="text-green-100 mt-1">
                {remainingDownloads === -1
                  ? "Unlimited downloads available"
                  : `${remainingDownloads} downloads remaining`}
              </p>
            </div>
            <div className="text-right">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-10 h-10" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/available-downloads">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-2xl transform hover:scale-[1.02] transition-all">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Download className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Available Downloads</h3>
                <p className="text-sm text-blue-100 mt-1">
                  Access all designs you can download
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/designs">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-2xl transform hover:scale-[1.02] transition-all">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Package className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Browse Designs</h3>
                <p className="text-sm text-green-100 mt-1">
                  Explore our collection of amazing designs
                </p>
              </div>
            </div>
          </div>
        </Link>

        {!subscriptionStatus?.data?.hasActiveSubscription && (
          <Link href="/pricing">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-2xl transform hover:scale-[1.02] transition-all">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Get Subscription</h3>
                  <p className="text-sm text-orange-100 mt-1">
                    Unlimited downloads with premium plans
                  </p>
                </div>
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* Recent Purchases */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Recent Purchases
        </h2>
        {purchases?.data && purchases.data.length > 0 ? (
          <div className="space-y-4">
            {purchases.data
              .slice(0, 5)
              .map(
                (purchase: {
                  _id: string;
                  purchaseType: string;
                  pricingPlan?: { name: string };
                  design?: { title: string };
                  amount: number;
                  createdAt: string;
                  status: string;
                }) => (
                  <div
                    key={purchase._id}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {purchase.purchaseType === "subscription"
                          ? `${purchase.pricingPlan?.name || "Subscription"}`
                          : purchase.design?.title || "Individual Purchase"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(purchase.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ${purchase.amount?.toFixed(2)}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          purchase.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : purchase.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {purchase.status}
                      </span>
                    </div>
                  </div>
                )
              )}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No purchases yet. Start exploring our designs!
          </p>
        )}
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Account Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Name</p>
            <p className="mt-1 text-gray-900">{user?.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Email</p>
            <p className="mt-1 text-gray-900">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Role</p>
            <p className="mt-1 text-gray-900 capitalize">{user?.role}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Member Since</p>
            <p className="mt-1 text-gray-900">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
