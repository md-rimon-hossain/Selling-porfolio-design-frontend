"use client";

import { useState, useMemo, useEffect } from "react";
import { useGetMyPurchasesQuery } from "@/services/api";
import {
  ShoppingBag,
  Calendar,
  DollarSign,
  Package,
  RefreshCw,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

type PurchaseStatus =
  | "pending"
  | "completed"
  | "expired"
  | "cancelled"
  | "refunded";

export default function MyPurchasesPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<PurchaseStatus | "">("");
  const [purchaseTypeFilter, setPurchaseTypeFilter] = useState<
    "individual" | "subscription" | ""
  >("");
  const [sortBy, setSortBy] = useState<
    "purchaseDate" | "createdAt" | "updatedAt"
  >("purchaseDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Memoize query parameters to ensure proper refetching
  const queryParams = useMemo(
    () => ({
      page,
      limit: 10,
      status: statusFilter || undefined,
      purchaseType: purchaseTypeFilter || undefined,
      sortBy,
      sortOrder,
    }),
    [page, statusFilter, purchaseTypeFilter, sortBy, sortOrder]
  );

  const { data, isLoading, refetch } = useGetMyPurchasesQuery(queryParams);

  const purchases = data?.data || [];

  // Reset page to 1 when filters change
  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, purchaseTypeFilter, sortBy, sortOrder]);

  const clearFilters = () => {
    setStatusFilter("");
    setPurchaseTypeFilter("");
    setSortBy("purchaseDate");
    setSortOrder("desc");
    setPage(1);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "cancelled":
      case "refunded":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "expired":
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled":
      case "refunded":
        return "bg-red-100 text-red-700 border-red-200";
      case "expired":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Purchases</h1>
          <p className="mt-2 text-gray-600">
            View and manage all your purchases (
            {data?.pagination?.totalItems || 0} total)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span className="text-sm font-medium">Refresh</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
          </div>
          {(statusFilter ||
            purchaseTypeFilter ||
            sortBy !== "purchaseDate" ||
            sortOrder !== "desc") && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as PurchaseStatus | "")
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="expired">Expired</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Purchase Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purchase Type
            </label>
            <select
              value={purchaseTypeFilter}
              onChange={(e) =>
                setPurchaseTypeFilter(
                  e.target.value as "individual" | "subscription" | ""
                )
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="individual">Individual</option>
              <option value="subscription">Subscription</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as "purchaseDate" | "createdAt" | "updatedAt"
                )
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="purchaseDate">Purchase Date</option>
              <option value="createdAt">Created Date</option>
              <option value="updatedAt">Updated Date</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Purchases List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading your purchases...</p>
        </div>
      ) : purchases.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {purchases.map(
            (purchase: {
              _id: string;
              purchaseType: string;
              pricingPlan?: { name: string; duration?: string };
              design?: { title: string; _id: string };
              status: string;
              amount: number;
              currency?: string;
              createdAt: string;
              purchaseDate?: string;
              subscriptionEndDate?: string;
              remainingDownloads?: number;
              paymentMethod?: string;
              updatedAt?: string;
            }) => (
              <div
                key={purchase._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                      {purchase.purchaseType === "subscription" ? (
                        <Package className="w-6 h-6 text-white" />
                      ) : (
                        <ShoppingBag className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {purchase.purchaseType === "subscription"
                            ? purchase.pricingPlan?.name || "Subscription Plan"
                            : purchase.design?.title || "Design Purchase"}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500">
                        Order ID: {purchase._id.slice(-8).toUpperCase()}
                      </p>
                      {purchase.purchaseType === "subscription" &&
                        purchase.pricingPlan?.duration && (
                          <p className="text-xs text-gray-500 mt-1">
                            Duration: {purchase.pricingPlan.duration}
                          </p>
                        )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        purchase.status
                      )}`}
                    >
                      {getStatusIcon(purchase.status)}
                      <span className="capitalize">{purchase.status}</span>
                    </div>
                    <span className="text-xs text-gray-500 capitalize">
                      {purchase.purchaseType}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="font-bold text-gray-900">
                        {purchase.currency || "USD"} $
                        {purchase.amount?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Purchase Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(
                          purchase.purchaseDate || purchase.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Type</p>
                      <p className="font-medium text-gray-900 capitalize">
                        {purchase.purchaseType}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Subscription Details */}
                {purchase.purchaseType === "subscription" &&
                  purchase.status === "completed" && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {purchase.subscriptionEndDate && (
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs text-blue-600 font-medium mb-1">
                            Subscription Expires
                          </p>
                          <p className="text-sm text-blue-800 font-semibold">
                            {new Date(
                              purchase.subscriptionEndDate
                            ).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            {Math.ceil(
                              (new Date(
                                purchase.subscriptionEndDate
                              ).getTime() -
                                new Date().getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            days remaining
                          </p>
                        </div>
                      )}
                      {purchase.remainingDownloads !== undefined && (
                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <p className="text-xs text-purple-600 font-medium mb-1">
                            Downloads Remaining
                          </p>
                          <p className="text-sm text-purple-800 font-semibold">
                            {purchase.remainingDownloads === 999999
                              ? "Unlimited"
                              : purchase.remainingDownloads}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                {/* Payment Method */}
                {purchase.paymentMethod && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Payment Method:{" "}
                      <span className="font-medium text-gray-700 capitalize">
                        {purchase.paymentMethod.replace(/_/g, " ")}
                      </span>
                    </p>
                  </div>
                )}

                {/* View Design Button for Individual Purchases */}
                {purchase.purchaseType === "individual" &&
                  purchase.design?._id &&
                  purchase.status === "completed" && (
                    <div className="mt-4">
                      <Link
                        href={`/designs/${purchase.design._id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-shadow"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        View Design
                      </Link>
                    </div>
                  )}
              </div>
            )
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {statusFilter || purchaseTypeFilter
              ? "No purchases found"
              : "No purchases yet"}
          </h3>
          <p className="text-gray-500 mb-6">
            {statusFilter || purchaseTypeFilter
              ? "Try adjusting your filters to see more results."
              : "Start exploring our designs and pricing plans!"}
          </p>
          {!statusFilter && !purchaseTypeFilter && (
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/designs"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-shadow"
              >
                Browse Designs
              </Link>
              <Link
                href="/pricing"
                className="inline-block px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Plans
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1 || isLoading}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {page} of {data.pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= data.pagination.totalPages || isLoading}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
