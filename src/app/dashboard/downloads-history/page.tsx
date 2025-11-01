"use client";

import { useState, useMemo, useEffect } from "react";
import { useGetMyDownloadsQuery } from "@/services/api";
import {
  Calendar,
  Package,
  Sparkles,
  ShoppingBag,
  Loader2,
  AlertCircle,
  Filter,
  X,
  RefreshCw,
  TrendingUp,
  FileDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface DownloadHistoryItem {
  _id: string;
  design: {
    _id: string;
    title: string;
    previewImageUrl?: string;
    price: number;
    designerName?: string;
  };
  purchase: {
    _id: string;
    purchaseType: "individual" | "subscription";
    currencyDisplay: string;
    currencyCode: string;
    amount: number;
  };
  downloadType: "individual_purchase" | "subscription";
  downloadDate: string;
  createdAt: string;
}

interface DownloadHistoryResponse {
  success: boolean;
  message: string;
  data: DownloadHistoryItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export default function DownloadsHistoryPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [sortBy, setSortBy] = useState<"downloadDate" | "createdAt">(
    "downloadDate"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [downloadType, setDownloadType] = useState<
    "all" | "individual_purchase" | "subscription"
  >("all");
  const [showFilters, setShowFilters] = useState(false);

  // Memoize query params to prevent unnecessary refetches
  const queryParams = useMemo(
    () => ({
      page,
      limit,
      sortBy,
      sortOrder,
      ...(downloadType !== "all" && { downloadType }),
    }),
    [page, limit, sortBy, sortOrder, downloadType]
  );

  const {
    data: downloadsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetMyDownloadsQuery(queryParams);

  // Reset page when filters change
  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, sortOrder, downloadType]);

  const downloads = (downloadsData as DownloadHistoryResponse)?.data || [];
  const pagination = (downloadsData as DownloadHistoryResponse)?.pagination;

  const handleClearFilters = () => {
    setSortBy("downloadDate");
    setSortOrder("desc");
    setDownloadType("all");
    setPage(1);
  };

  const getDownloadTypeColor = (type: string) => {
    return type === "individual_purchase"
      ? "bg-blue-100 text-blue-700"
      : "bg-purple-100 text-purple-700";
  };

  const getDownloadTypeIcon = (type: string) => {
    return type === "individual_purchase" ? (
      <ShoppingBag className="w-4 h-4" />
    ) : (
      <Sparkles className="w-4 h-4" />
    );
  };

  // Calculate statistics
  const totalDownloads = pagination?.totalItems || 0;
  const individualDownloads = downloads.filter(
    (d) => d.downloadType === "individual_purchase"
  ).length;
  const subscriptionDownloads = downloads.filter(
    (d) => d.downloadType === "subscription"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Downloads History</h1>
        <p className="mt-1 text-sm text-gray-600">
          View and track all your design downloads
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-600 rounded-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Downloads</p>
              <p className="text-3xl font-bold mt-1">{totalDownloads}</p>
            </div>
            <FileDown className="w-10 h-10 opacity-80" />
          </div>
        </div>

        <div className="bg-purple-600 rounded-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Subscription Downloads</p>
              <p className="text-3xl font-bold mt-1">{subscriptionDownloads}</p>
            </div>
            <Sparkles className="w-10 h-10 opacity-80" />
          </div>
        </div>

        <div className="bg-green-600 rounded-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Individual Downloads</p>
              <p className="text-3xl font-bold mt-1">{individualDownloads}</p>
            </div>
            <ShoppingBag className="w-10 h-10 opacity-80" />
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        {/* Top Row - Filter Toggle and Refresh */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {showFilters ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {pagination?.totalItems || 0} total downloads
            </span>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh downloads"
            >
              <RefreshCw
                className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            {/* Download Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Download Type
              </label>
              <select
                value={downloadType}
                onChange={(e) =>
                  setDownloadType(
                    e.target.value as
                      | "all"
                      | "individual_purchase"
                      | "subscription"
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="individual_purchase">Individual Purchase</option>
                <option value="subscription">Subscription</option>
              </select>
            </div>

            {/* Sort By Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "downloadDate" | "createdAt")
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="downloadDate">Download Date</option>
                <option value="createdAt">Created Date</option>
              </select>
            </div>

            {/* Sort Order Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort Order
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end">
              <button
                onClick={handleClearFilters}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 text-sm font-medium"
              >
                <X className="w-4 h-4" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Downloads Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-sm">Loading your downloads...</p>
          </div>
        </div>
      ) : downloads.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {downloads.map((download: DownloadHistoryItem) => (
            <div
              key={download._id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all group"
            >
              
              {/* Design Image */}
              <Link
                href={`/designs/${download.design._id}`}
                className="block relative aspect-video overflow-hidden bg-gray-100"
              >
                {(download.design as any)?.previewImageUrls?.[0] ||
                download.design.previewImageUrl ? (
                  <Image
                    src={
                      (download.design as any)?.previewImageUrls?.[0] ||
                      download.design.previewImageUrl
                    }
                    alt={download.design.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-400" />
                  </div>
                )}

                {/* Download Type Badge */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2.5 py-1 ${getDownloadTypeColor(
                      download.downloadType
                    )} text-xs font-semibold rounded-lg flex items-center space-x-1`}
                  >
                    {getDownloadTypeIcon(download.downloadType)}
                    <span>
                      {download.downloadType === "individual_purchase"
                        ? "Purchased"
                        : "Subscription"}
                    </span>
                  </span>
                </div>
              </Link>

              {/* Download Info */}
              <div className="p-4">
                <Link href={`/designs/${download.design._id}`}>
                  <h3 className="text-base font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-1">
                    {download.design.title}
                  </h3>
                </Link>

                {((download.design as any)?.designer?.name ||
                  download.design.designerName) && (
                  <p className="text-sm text-gray-600 mb-3">
                    by{" "}
                    {(download.design as any)?.designer?.name ||
                      download.design.designerName}
                  </p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Downloaded
                    </span>
                    <span className="font-medium text-gray-900">
                      {new Date(download.downloadDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Amount
                    </span>
                    <span className="font-bold text-green-600">
                      {download.purchase.currencyDisplay || "৳"}{download.purchase.amount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/designs/${download.design._id}`}
                    className="flex-1 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-center text-sm"
                  >
                    View Design
                  </Link>
                  <Link
                    href={`/dashboard/purchases`}
                    className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    title="View Purchase"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No downloads yet
          </h3>
          <p className="text-gray-500 mb-6 text-sm">
            {downloadType !== "all"
              ? `No ${
                  downloadType === "individual_purchase"
                    ? "individual purchase"
                    : "subscription"
                } downloads found.`
              : "Start downloading designs to see your history here."}
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link
              href="/dashboard/available-downloads"
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Browse Available Downloads
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              View Pricing
            </Link>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={!pagination.hasPrevPage || isFetching}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Previous
          </button>
          <div className="flex items-center space-x-2">
            {Array.from({ length: Math.min(5, pagination.totalPages) }).map(
              (_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                      page === pageNum
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
            )}
            {pagination.totalPages > 5 && (
              <>
                <span className="text-gray-500 text-sm">...</span>
                <span className="px-4 py-2 text-gray-700 text-sm">
                  of {pagination.totalPages}
                </span>
              </>
            )}
          </div>
          <button
            onClick={() => setPage(page + 1)}
            disabled={!pagination.hasNextPage || isFetching}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
