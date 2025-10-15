"use client";

import { useState } from "react";
import {
  useGetMyPurchasesQuery,
  useGetSubscriptionStatusQuery,
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
} from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import {
  Purchase,
  SubscriptionStatus,
  DesignForDownload,
} from "@/types/dashboard";

export default function AvailableDownloadsPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "purchased" | "subscription">(
    "all"
  );

  // Fetch user's purchases
  const { data: purchasesData, isLoading: purchasesLoading } =
    useGetMyPurchasesQuery({
      page: 1,
      limit: 100,
    });

  // Fetch subscription status
  const { data: subscriptionData, isLoading: subscriptionLoading } =
    useGetSubscriptionStatusQuery();

  // Fetch all designs (for subscription users and to show purchased designs)
  const hasActiveSubscription = subscriptionData?.data?.hasActiveSubscription;
  const { data: allDesignsData, isLoading: designsLoading } =
    useGetDesignsQuery(
      { page, limit: 12, status: "Active" },
      { skip: false } // Always fetch designs
    );

  const [downloadDesign, { isLoading: downloadLoading }] =
    useDownloadDesignMutation();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const purchases = (purchasesData?.data || []) as Purchase[];
  const subStatus = subscriptionData?.data as SubscriptionStatus | undefined;
  const allDesigns = (allDesignsData?.data || []) as DesignForDownload[];

  // Get purchased designs - extract the design IDs from purchases
  const purchasedDesignIds = new Set(
    purchases
      .filter(
        (p: Purchase) =>
          p.purchaseType === "individual" &&
          p.design &&
          (p.status === "completed" || p.status === "pending")
      )
      .map((p: Purchase) => p.design?._id)
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

      if (result.data?.downloadUrl) {
        // Open download URL in new tab
        window.open(result.data.downloadUrl, "_blank");
        alert(`Download started for "${title}"!`);
      } else {
        alert("Download started successfully!");
      }
    } catch (error) {
      const apiError = error as { data?: { message?: string } };
      alert(apiError?.data?.message || "Download failed. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  const isLoading = purchasesLoading || subscriptionLoading || designsLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Available Downloads
        </h1>
        <p className="mt-2 text-gray-600">
          Access all designs you can download
        </p>
      </div>

      {/* Subscription Status Banner */}
      {subStatus && (
        <div
          className={`rounded-xl p-6 ${
            subStatus.hasActiveSubscription
              ? "bg-gradient-to-r from-green-500 to-emerald-600"
              : "bg-gradient-to-r from-blue-500 to-purple-600"
          } text-white shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {subStatus.hasActiveSubscription ? (
                <CheckCircle className="w-12 h-12" />
              ) : (
                <Sparkles className="w-12 h-12" />
              )}
              <div>
                <h3 className="text-xl font-bold">
                  {subStatus.hasActiveSubscription
                    ? "Active Subscription"
                    : "No Active Subscription"}
                </h3>
                <p className="mt-1 text-sm opacity-90">
                  {subStatus.hasActiveSubscription ? (
                    <>
                      {subStatus.remainingDownloads === -1
                        ? "Unlimited downloads"
                        : `${subStatus.remainingDownloads} downloads remaining`}{" "}
                      • {subStatus.currentPlan?.name || "Current Plan"}
                    </>
                  ) : (
                    "Subscribe to get unlimited access to all designs"
                  )}
                </p>
              </div>
            </div>
            {subStatus.hasActiveSubscription ? (
              <div className="text-right">
                <p className="text-4xl font-bold">
                  {subStatus.remainingDownloads === -1
                    ? "∞"
                    : subStatus.remainingDownloads}
                </p>
                <p className="text-sm opacity-90">Downloads</p>
              </div>
            ) : (
              <Link
                href="/pricing"
                className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                View Plans
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Designs
          </button>
          <button
            onClick={() => setFilter("purchased")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "purchased"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Purchased ({purchasedDesigns.length})
          </button>
          {hasActiveSubscription && (
            <button
              onClick={() => setFilter("subscription")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "subscription"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Sparkles className="w-4 h-4 inline-block mr-1" />
              Subscription Access
            </button>
          )}
        </div>
      </div>

      {/* Designs Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your designs...</p>
          </div>
        </div>
      ) : uniqueDesigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uniqueDesigns.map((design: DesignForDownload) => {
            const isPurchased = purchasedDesignIds.has(design._id);
            const isDownloading = downloadingId === design._id;

            return (
              <div
                key={design._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group"
              >
                {/* Design Image */}
                <Link
                  href={`/designs/${design._id}`}
                  className="block relative aspect-video overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100"
                >
                  {design.previewImageUrl ? (
                    <Image
                      src={design.previewImageUrl}
                      alt={design.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package className="w-16 h-16 text-gray-400" />
                    </div>
                  )}

                  {/* Access Badge */}
                  <div className="absolute top-3 right-3">
                    {isPurchased ? (
                      <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
                        Purchased
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                        <Sparkles className="w-3 h-3 inline-block mr-1" />
                        Subscription
                      </span>
                    )}
                  </div>
                </Link>

                {/* Design Info */}
                <div className="p-4">
                  <Link href={`/designs/${design._id}`}>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-1">
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
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                      {design.category?.name}
                    </span>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownload(design._id, design.title)}
                    disabled={isDownloading || downloadLoading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No designs available
          </h3>
          <p className="text-gray-500 mb-6">
            {filter === "purchased"
              ? "You haven't purchased any designs yet."
              : "Purchase designs or subscribe to start downloading!"}
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link
              href="/designs"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-shadow"
            >
              Browse Designs
            </Link>
            {!hasActiveSubscription && (
              <Link
                href="/pricing"
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
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
        allDesignsData.pagination.pages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {page} of {allDesignsData.pagination.pages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= allDesignsData.pagination.pages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
    </div>
  );
}
