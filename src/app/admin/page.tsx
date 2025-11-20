/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useGetPurchaseAnalyticsQuery,
  useGetReviewAnalyticsQuery,
  useGetDownloadAnalyticsQuery,
  useGetAllPurchasesQuery,
  useGetDesignsQuery,
  useGetPricingPlansQuery,
} from "@/services/api";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package,
  Star,
  Download,
  Users,
  Activity,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: purchaseAnalytics, isLoading: purchaseLoading } =
    useGetPurchaseAnalyticsQuery({ period: "monthly" });
  const { data: reviewAnalytics, isLoading: reviewLoading } =
    useGetReviewAnalyticsQuery({ period: "monthly" });
  const { data: downloadAnalytics, isLoading: downloadLoading } =
    useGetDownloadAnalyticsQuery({ period: "monthly" });
  const { data: purchasesData } = useGetAllPurchasesQuery({ limit: 5 });

  const { data: designsData } = useGetDesignsQuery({ limit: 5 });
  const { data: plansData } = useGetPricingPlansQuery({ limit: 5 });

  // console.log(reviewAnalytics);
  // console.log(downloadAnalytics);
  // console.log(designsData);
  // console.log(plansData);
  console.log(reviewAnalytics);

  const stats = [
    {
      name: "Total Revenue",
      value: `$${
        purchaseAnalytics?.data?.overview.totalRevenue?.toFixed(2) || "0.00"
      }`,
      change: "+12.5%",
      icon: DollarSign,
      color: "from-green-600 to-emerald-600",
    },
    {
      name: "Total Purchases",
      value: purchaseAnalytics?.data?.overview.totalPurchases || "0",
      change: "+8.3%",
      icon: ShoppingCart,
      color: "from-blue-600 to-cyan-600",
    },
    {
      name: "Active Designs",
      value: designsData?.pagination?.totalItems || "0",
      change: "+3.2%",
      icon: Package,
      color: "from-purple-600 to-pink-600",
    },
    {
      name: "Total Downloads",
      value: downloadAnalytics?.data?.overview.totalDownloads || "0",
      change: "+15.8%",
      icon: Download,
      color: "from-orange-600 to-red-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here&apos;s what&apos;s happening with your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-green-600 font-medium">
                      {stat.change}
                    </span>
                    <span className="text-gray-500 ml-1">vs last month</span>
                  </div>
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Purchases */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Purchases
            </h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          {purchaseLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {purchasesData?.data?.slice(0, 5).map((purchase: any) => (
                <div
                  key={purchase._id}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {purchase.purchaseType === "subscription"
                        ? "Subscription"
                        : "Individual Design"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(purchase.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {purchase.currencyDisplay}
                      {purchase.amount?.toFixed(2)}
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
              )) || (
                <p className="text-center text-gray-500 py-8">
                  No purchases yet
                </p>
              )}
            </div>
          )}
        </div>

        {/* Review Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Review Statistics
            </h2>
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
          {reviewLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Average Rating
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {reviewAnalytics?.data?.overview.averageRating?.toFixed(
                      1
                    ) || "0.0"}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i <
                        Math.floor(
                          reviewAnalytics?.data?.overview.averageRating || 0
                        )
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-blue-50">
                  <p className="text-sm font-medium text-gray-600">
                    Total Reviews
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reviewAnalytics?.data?.overview.totalReviews || "0"}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-green-50">
                  <p className="text-sm font-medium text-gray-600">
                    Helpful Reviews
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reviewAnalytics?.data?.overview?.helpfulReviews || "0"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/designs"
            className="flex items-center justify-center p-6 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <Package className="w-6 h-6 mr-3" />
            <span className="font-bold">Add New Design</span>
          </Link>
          <Link
            href="/admin/courses/create"
            className="flex items-center justify-center p-6 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <BookOpen className="w-6 h-6 mr-3" />
            <span className="font-bold">Add New Course</span>
          </Link>
          <Link
            href="/admin/pricing-plans"
            className="flex items-center justify-center p-6 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <DollarSign className="w-6 h-6 mr-3" />
            <span className="font-bold">Create Pricing Plan</span>
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center justify-center p-6 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 text-white hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <Users className="w-6 h-6 mr-3" />
            <span className="font-bold">Add Category</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
