"use client";

import { useState, useMemo, useEffect } from "react";
import {
  useGetMyPurchasesQuery,
  useGetDesignsQuery,
  useDownloadDesignMutation,
} from "@/services/api";
import {
  Download,
  Calendar,
  Package,
  Sparkles,
  CheckCircle,
  Loader2,
  AlertCircle,
  X,
  RefreshCw,
  Clock,
  Infinity,
} from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import { Purchase, DesignForDownload } from "@/types/dashboard";
import { useToast } from "@/components/ToastProvider";

export default function AvailableDownloadsPage() {
  const [page, setPage] = useState(1);

  const [filter, setFilter] = useState<"all" | "purchased" | "subscription">(
    "all"
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch user's purchases with proper query params
  const purchasesQueryParams = useMemo(
    () => ({
      page: 1,
      limit: 100,
    }),
    []
  );

  const { data: purchasesData, isLoading: purchasesLoading } =
    useGetMyPurchasesQuery(purchasesQueryParams);

  // Memoize designs query params
  const designsQueryParams = useMemo(
    () => ({
      page,
      limit: 12,
      status: "Active" as const,
      ...(categoryFilter && { category: categoryFilter }),
      ...(searchQuery && { search: searchQuery }),
    }),
    [page, categoryFilter, searchQuery]
  );

  // Fetch all designs (for subscription users and to show purchased designs)
  const {
    data: allDesignsData,
    isLoading: designsLoading,
    refetch,
  } = useGetDesignsQuery(designsQueryParams);

  const [downloadDesign, { isLoading: downloadLoading }] =
    useDownloadDesignMutation();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const toast = useToast();

  // Reset page when filters change
  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, searchQuery, filter]);

  const purchases = (purchasesData?.data || []) as Purchase[];
  const allDesigns = (allDesignsData?.data || []) as DesignForDownload[];

  // Check if user has active subscription (status: completed and not expired)
  const activeSubscription = purchases.find(
    (p: Purchase) =>
      p.purchaseType === "subscription" &&
      p.status === "completed" &&
      p.subscriptionEndDate &&
      new Date(p.subscriptionEndDate) > new Date()
  );

  const hasActiveSubscription = !!activeSubscription;

  // Get purchased designs - extract the design IDs from COMPLETED individual purchases
  const purchasedDesignIds = new Set(
    purchases
      .filter(
        (purchase: Purchase) =>
          purchase.purchaseType === "individual" &&
          purchase.design &&
          purchase.status === "completed" // Only completed purchases
      )
      .map((p: any) => p.design?._id)
      .filter(Boolean)
  );

  // Filter designs based on purchased IDs
  const purchasedDesigns = allDesigns.filter((design) =>
    purchasedDesignIds.has(design._id)
  );
  // Combine purchased designs with all designs if subscription
  const availableDesigns =
    filter === "purchased"
      ? purchasedDesigns
      : filter === "subscription" && hasActiveSubscription
      ? allDesigns
      : hasActiveSubscription
      ? allDesigns // Show all designs for subscription users
      : purchasedDesigns; // Show only purchased designs for non-subscription users

  // Remove duplicates
  const uniqueDesigns = Array.from(
    new Map(availableDesigns.map((d: DesignForDownload) => [d._id, d])).values()
  );

  const handleDownload = async (designId: string, title: string) => {
    try {
      setDownloadingId(designId);
      const result = await downloadDesign(designId).unwrap();

      if (result.success && result.data?.downloadUrl) {
        // Open download URL in new tab
        window.open(result.data.downloadUrl, "_blank");

        // Show success message with remaining downloads info
        const remainingInfo =
          result.data.remainingDownloads === "Unlimited"
            ? "Unlimited downloads available"
            : result.data.remainingDownloads === -1
            ? "Unlimited downloads available"
            : `${result.data.remainingDownloads} downloads remaining`;
        toast.success(`Download started for "${title}"! ${remainingInfo}`);
      } else {
        toast.info(result.message || "Download started successfully!");
      }
    } catch (error) {
      const apiError = error as { data?: { message?: string } };
      toast.error(
        apiError?.data?.message || "Download failed. Please try again."
      );
    } finally {
      setDownloadingId(null);
    }
  };

  const handleClearFilters = () => {
    setCategoryFilter("");
    setSearchQuery("");
    setFilter("all");
    setPage(1);
  };

  const isLoading = purchasesLoading || designsLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Available Downloads
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Access all designs you can download
        </p>
      </div>

      {/* Subscription Status Banner */}
      <div
        className={`rounded-lg p-5 ${
          hasActiveSubscription ? "bg-green-600" : "bg-blue-600"
        } text-white`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {hasActiveSubscription ? (
              <CheckCircle className="w-10 h-10" />
            ) : (
              <Sparkles className="w-10 h-10" />
            )}
            <div>
              <h3 className="text-lg font-bold">
                {hasActiveSubscription
                  ? "Active Subscription"
                  : "No Active Subscription"}
              </h3>
              <p className="mt-1 text-sm opacity-90">
                {hasActiveSubscription && activeSubscription ? (
                  <>
                    {activeSubscription.remainingDownloads === -1 ||
                    activeSubscription.remainingDownloads === 999999
                      ? "Unlimited downloads"
                      : `${activeSubscription.remainingDownloads} downloads remaining`}{" "}
                    • {activeSubscription.pricingPlan?.name || "Current Plan"}
                  </>
                ) : (
                  "Subscribe to get unlimited access to all designs"
                )}
              </p>
              {hasActiveSubscription &&
                activeSubscription?.subscriptionEndDate && (
                  <p className="mt-1 text-xs opacity-80 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Expires:{" "}
                    {new Date(
                      activeSubscription.subscriptionEndDate
                    ).toLocaleDateString()}
                  </p>
                )}
            </div>
          </div>
          {hasActiveSubscription && activeSubscription ? (
            <div className="text-right">
              <p className="text-4xl font-bold">
                {activeSubscription.remainingDownloads === -1 ||
                activeSubscription.remainingDownloads === 999999 ? (
                  <Infinity className="w-10 h-10 mx-auto" />
                ) : (
                  activeSubscription.remainingDownloads
                )}
              </p>
              <p className="text-sm opacity-90">Downloads</p>
            </div>
          ) : (
            <Link
              href="/pricing"
              className="px-6 py-2.5 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              View Plans
            </Link>
          )}
        </div>
      </div>

      {/* Filter Tabs and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        {/* Filter Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Designs
            </button>
            <button
              onClick={() => setFilter("purchased")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                filter === "purchased"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Purchased ({purchasedDesigns.length})
            </button>
            {hasActiveSubscription && (
              <button
                onClick={() => setFilter("subscription")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                  filter === "subscription"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Sparkles className="w-4 h-4 inline-block mr-1" />
                Subscription Access
              </button>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => refetch()}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Refresh designs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Search and Category Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search designs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <input
            type="text"
            placeholder="Filter by category..."
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 text-sm font-medium"
          >
            <X className="w-4 h-4" />
            <span>Clear Filters</span>
          </button>
        </div>
      </div>

      {/* Designs Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-sm">Loading your designs...</p>
          </div>
        </div>
      ) : uniqueDesigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {uniqueDesigns.map((design: DesignForDownload) => {
            const isPurchased = purchasedDesignIds.has(design._id);
            const isDownloading = downloadingId === design._id;

            // Safe helpers to support new backend shape while keeping compatibility
            const preview =
              (design as any)?.previewImageUrls?.[0] ||
              (design as any)?.previewImageUrl ||
              "";

            const categoryName =
              (design as any)?.mainCategory?.name ||
              (design as any)?.subCategory?.name ||
              design.category?.name ||
              "Uncategorized";

            const displayPrice =
              (design as any)?.discountedPrice ??
              (design as any)?.basePrice ??
              (design as any)?.price ??
              0;

            const designerName =
              (design as any)?.designer?.name ||
              (design as any)?.designerName ||
              "";

            return (
              <div
                key={design._id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all group"
              >
                {/* Design Image */}
                <Link
                  href={`/designs/${design._id}`}
                  className="block relative aspect-video overflow-hidden bg-gray-100"
                >
                  {preview ? (
                    <Image
                      src={preview}
                      alt={design.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package className="w-16 h-16 text-gray-400" />
                    </div>
                  )}

                  {/* Access Badge */}
                  <div className="absolute top-2 right-2">
                    {isPurchased ? (
                      <span className="px-2.5 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg">
                        Purchased
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-green-600 text-white text-xs font-semibold rounded-lg flex items-center">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Subscription
                      </span>
                    )}
                  </div>
                </Link>

                {/* Design Info */}
                <div className="p-4">
                  <Link href={`/designs/${design._id}`}>
                    <h3 className="text-base font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-1">
                      {design.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {design.description}
                  </p>

                  <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(design.createdAt).toLocaleDateString()}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                      {categoryName}
                    </span>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownload(design._id, design.title)}
                    disabled={isDownloading || downloadLoading}
                    className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Download Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No designs available
          </h3>
          <p className="text-gray-500 mb-6 text-sm">
            {filter === "purchased"
              ? "You haven't purchased any designs yet."
              : "Purchase designs or subscribe to start downloading!"}
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link
              href="/designs"
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Browse Designs
            </Link>
            {!hasActiveSubscription && (
              <Link
                href="/pricing"
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                View Pricing
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Pagination for subscription view */}
      {hasActiveSubscription &&
        allDesignsData?.pagination &&
        allDesignsData.pagination.totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700 text-sm">
              Page {page} of {allDesignsData.pagination.totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= allDesignsData.pagination.totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              Next
            </button>
          </div>
        )}
    </div>
  );
}
