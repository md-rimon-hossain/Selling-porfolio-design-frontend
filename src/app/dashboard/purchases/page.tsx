"use client";

import { useState } from "react";
import { useGetMyPurchasesQuery } from "@/services/api";
import { ShoppingBag, Calendar, DollarSign, Package } from "lucide-react";
import Link from "next/link";

type PurchaseStatus =
  | "pending"
  | "completed"
  | "expired"
  | "cancelled"
  | "refunded";

export default function MyPurchasesPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");

  const { data, isLoading } = useGetMyPurchasesQuery({
    page,
    limit: 10,
    status: filter ? (filter as PurchaseStatus) : undefined,
  });

  const purchases = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Purchases</h1>
        <p className="mt-2 text-gray-600">
          View and manage all your purchases ({data?.pagination?.total || 0}{" "}
          total)
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Purchases List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : purchases.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {purchases.map(
            (purchase: {
              _id: string;
              purchaseType: string;
              pricingPlan?: { name: string };
              design?: { title: string };
              status: string;
              amount: number;
              createdAt: string;
              expiresAt?: string;
            }) => (
              <div
                key={purchase._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                      {purchase.purchaseType === "subscription" ? (
                        <Package className="w-6 h-6 text-white" />
                      ) : (
                        <ShoppingBag className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {purchase.purchaseType === "subscription"
                          ? purchase.pricingPlan?.name || "Subscription Plan"
                          : purchase.design?.title || "Design Purchase"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Order ID: {purchase._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      purchase.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : purchase.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : purchase.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {purchase.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <div>
                      <p className="text-xs">Amount</p>
                      <p className="font-bold text-gray-900">
                        ${purchase.amount?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <div>
                      <p className="text-xs">Purchase Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(purchase.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Package className="w-4 h-4" />
                    <div>
                      <p className="text-xs">Type</p>
                      <p className="font-medium text-gray-900 capitalize">
                        {purchase.purchaseType}
                      </p>
                    </div>
                  </div>
                </div>

                {purchase.purchaseType === "subscription" &&
                  purchase.expiresAt && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Expires:</span>{" "}
                        {new Date(purchase.expiresAt).toLocaleDateString()}
                      </p>
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
            No purchases yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start exploring our designs and pricing plans!
          </p>
          <Link
            href="/designs"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-shadow"
          >
            Browse Designs
          </Link>
        </div>
      )}

      {/* Pagination */}
      {data?.pagination && data.pagination.pages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {page} of {data.pagination.pages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= data.pagination.pages}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
