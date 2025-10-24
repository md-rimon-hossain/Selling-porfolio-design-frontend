"use client";

import { useState } from "react";
import {
  useGetMyDownloadsQuery,
  useGetSubscriptionStatusQuery,
  useDownloadDesignMutation,
} from "@/services/api";
import { Download, Calendar, FileDown } from "lucide-react";
import Link from "next/link";
import { DownloadRecord, SubscriptionStatus } from "@/types/dashboard";
import { useToast } from "@/components/ToastProvider";

export default function MyDownloadsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetMyDownloadsQuery({ page, limit: 10 });
  const { data: subscriptionStatus } = useGetSubscriptionStatusQuery();
  const [downloadDesign] = useDownloadDesignMutation();

  const downloads = (data?.data || []) as DownloadRecord[];
  const subStatus = subscriptionStatus?.data as SubscriptionStatus | undefined;
  const toast = useToast();

  const handleDownload = async (designId: string) => {
    try {
      const result = await downloadDesign(designId).unwrap();
      if (result.data?.downloadUrl) {
        window.open(result.data.downloadUrl, "_blank");
      }
      toast.success("Download started!");
    } catch (error) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError?.data?.message || "Download failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Download History</h1>
        <p className="mt-2 text-gray-600">
          View your past downloads ({data?.pagination?.total || 0} total)
        </p>
      </div>

      {/* Quick Access Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold mb-2">
              Need to download more designs?
            </h3>
            <p className="text-sm opacity-90">
              Check out all designs available for download based on your
              purchases and subscription
            </p>
          </div>
          <a
            href="/dashboard/available-downloads"
            className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:shadow-xl transition-all transform hover:scale-105 whitespace-nowrap"
          >
            Browse Downloads
          </a>
        </div>
      </div>

      {/* Subscription Status */}
      {subStatus && (
        <div
          className={`rounded-xl p-6 ${
            subStatus.hasActiveSubscription
              ? "bg-gradient-to-r from-green-500 to-emerald-600"
              : "bg-gradient-to-r from-gray-500 to-gray-600"
          } text-white`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Subscription Status</h3>
              <p className="mt-1 text-sm opacity-90">
                {subStatus.hasActiveSubscription
                  ? `${subStatus.remainingDownloads} downloads remaining this ${
                      subStatus.currentPlan?.duration || "period"
                    }`
                  : "No active subscription"}
              </p>
            </div>
            {subStatus.hasActiveSubscription ? (
              <div className="text-right">
                <p className="text-3xl font-bold">
                  {subStatus.remainingDownloads}
                </p>
                <p className="text-sm opacity-90">Downloads Left</p>
              </div>
            ) : (
              <a
                href="/pricing"
                className="px-6 py-3 bg-white text-gray-900 font-medium rounded-lg hover:shadow-lg transition-shadow"
              >
                View Plans
              </a>
            )}
          </div>
        </div>
      )}

      {/* Downloads List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : downloads.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {downloads.map((download: DownloadRecord) => (
            <div
              key={download._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <FileDown className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {download.design?.title || "Design"}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {download.design?.category?.name || "Uncategorized"}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(download.createdAt).toLocaleDateString()}
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          download.downloadType === "subscription"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {download.downloadType === "subscription"
                          ? "Subscription"
                          : "Individual"}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(download.design?._id)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Again</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Download className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No downloads yet
          </h3>
          <p className="text-gray-500 mb-6">
            Purchase designs or subscribe to start downloading!
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
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {page} of {data.pagination.pages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= data.pagination.pages}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
