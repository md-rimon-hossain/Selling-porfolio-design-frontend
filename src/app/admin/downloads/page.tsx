"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  useGetAllDownloadsQuery,
  useGetDownloadAnalyticsQuery,
} from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Download,
  TrendingUp,
  Users,
  FileDown,
  Package,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  Eye,
  UserCircle,
  Image as ImageIcon,
  BarChart3,
} from "lucide-react";

interface DownloadTrend {
  _id: string;
  count: number;
}

interface TopDesign {
  _id: string;
  title: string;
  downloadCount: number;
  price: number;
  previewImageUrl?: string;
}

export default function AdminDownloadsPage() {
  // State
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [downloadType, setDownloadType] = useState<
    "individual_purchase" | "subscription" | ""
  >("");
  const [sortBy, setSortBy] = useState<"downloadDate" | "createdAt">(
    "downloadDate"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [analyticsPeriod, setAnalyticsPeriod] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("monthly");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const limit = 15;

  // Build query params
  const queryParams = useMemo(
    () => ({
      page,
      limit,
      sortBy,
      sortOrder,
      ...(search && { search }),
      ...(downloadType && { downloadType }),
      ...(dateRange.startDate && { startDate: dateRange.startDate }),
      ...(dateRange.endDate && { endDate: dateRange.endDate }),
    }),
    [page, limit, sortBy, sortOrder, search, downloadType, dateRange]
  );

  // API Queries
  const { data, isLoading, refetch } = useGetAllDownloadsQuery(queryParams);
  const { data: analyticsData } = useGetDownloadAnalyticsQuery({
    period: analyticsPeriod,
    ...(dateRange.startDate && { startDate: dateRange.startDate }),
    ...(dateRange.endDate && { endDate: dateRange.endDate }),
  });

  const downloads = data?.data || [];
  const pagination = data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  };

  console.log(downloads);

  // Analytics stats
  const analytics = analyticsData?.data || {};
  const overviewStats = analytics.overview || {
    totalDownloads: 0,
    uniqueUsers: 0,
    individualDownloads: 0,
    subscriptionDownloads: 0,
  };
  const topDesigns = analytics.topDownloadedDesigns || [];
  const downloadTrends = analytics.downloadTrends || [];

  // Handlers
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () => {
    setSearch("");
    setDownloadType("");
    setDateRange({ startDate: "", endDate: "" });
    setPage(1);
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Download Management
          </h1>
          <p className="mt-2 text-gray-600">
            Monitor and analyze design downloads across the platform
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={analyticsPeriod}
            onChange={(e) =>
              setAnalyticsPeriod(
                e.target.value as "daily" | "weekly" | "monthly" | "yearly"
              )
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Download className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 opacity-75" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {overviewStats.totalDownloads?.toLocaleString() || "0"}
          </h3>
          <p className="text-blue-100 text-sm">Total Downloads</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Users className="w-6 h-6" />
            </div>
            <UserCircle className="w-5 h-5 opacity-75" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {overviewStats.uniqueUsers?.toLocaleString() || "0"}
          </h3>
          <p className="text-green-100 text-sm">Unique Users</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <FileDown className="w-6 h-6" />
            </div>
            <Package className="w-5 h-5 opacity-75" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {overviewStats.individualDownloads?.toLocaleString() || "0"}
          </h3>
          <p className="text-purple-100 text-sm">Individual Purchases</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Package className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 opacity-75" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {overviewStats.subscriptionDownloads?.toLocaleString() || "0"}
          </h3>
          <p className="text-orange-100 text-sm">Subscription Downloads</p>
        </div>
      </div>

      {/* Download Trends Chart */}
      {downloadTrends.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Download Trends
            </h2>
          </div>
          <div className="space-y-4">
            {downloadTrends.map((trend: DownloadTrend, index: number) => {
              const maxCount = Math.max(
                ...downloadTrends.map((t: DownloadTrend) => t.count)
              );
              const percentage = (trend.count / maxCount) * 100;
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {trend._id}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {trend.count} downloads
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user, design, or download details..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            Filters
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Download Type
              </label>
              <select
                value={downloadType}
                onChange={(e) => {
                  setDownloadType(
                    e.target.value as
                      | "individual_purchase"
                      | "subscription"
                      | ""
                  );
                  setPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="individual_purchase">Individual Purchase</option>
                <option value="subscription">Subscription</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "downloadDate" | "createdAt")
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="downloadDate">Download Date</option>
                <option value="createdAt">Created Date</option>
              </select>
            </div>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actions
              </label>
              <Button
                onClick={handleClearFilters}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => {
                  setDateRange({ ...dateRange, startDate: e.target.value });
                  setPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => {
                  setDateRange({ ...dateRange, endDate: e.target.value });
                  setPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Downloads List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : downloads.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Download className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No downloads found
          </h3>
          <p className="text-gray-500">
            {search || downloadType || dateRange.startDate
              ? "Try adjusting your filters"
              : "Downloads will appear here once users start downloading designs"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Design
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Download Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    IP Address
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {downloads.map((download: Record<string, unknown>) => (
                  <tr key={download._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {download.user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {download.user?.name || "Anonymous"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {download.user?.email || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden relative">
                          {(download.design as Record<string, string>)
                            ?.previewImageUrl ? (
                            <Image
                              src={
                                (download.design as Record<string, string>)
                                  .previewImageUrl
                              }
                              alt={
                                (download.design as Record<string, string>)
                                  .title || "Design"
                              }
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {download.design?.title || "Unknown Design"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {download.design?.category?.name || "No category"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          download.downloadType === "subscription"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {download.downloadType === "subscription" ? (
                          <Package className="w-3 h-3" />
                        ) : (
                          <FileDown className="w-3 h-3" />
                        )}
                        {download.downloadType === "subscription"
                          ? "Subscription"
                          : "Individual"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(download.downloadDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(download.downloadDate).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 font-mono">
                        {download.ipAddress || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/designs/${download.design?._id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/users/${download.user?._id}`}>
                          <Button variant="outline" size="sm">
                            <UserCircle className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <strong>{(page - 1) * limit + 1}</strong> to{" "}
              <strong>
                {Math.min(page * limit, pagination.totalItems || 0)}
              </strong>{" "}
              of <strong>{pagination.totalItems || 0}</strong> downloads
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handlePageChange(page - 1)}
                disabled={!pagination.hasPrevPage}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        page === pageNum
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <Button
                onClick={() => handlePageChange(page + 1)}
                disabled={!pagination.hasNextPage}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Top Downloaded Designs */}
      {topDesigns.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Top Downloaded Designs
          </h2>
          <div className="space-y-3">
            {topDesigns.slice(0, 10).map((design: TopDesign, index: number) => (
              <div
                key={design._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm">
                    #{index + 1}
                  </div>
                  <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden relative">
                    {design.previewImageUrl ? (
                      <Image
                        src={design.previewImageUrl}
                        alt={design.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {design.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {design.downloadCount} downloads • $
                      {design.price?.toFixed(2)}
                    </p>
                  </div>
                </div>
                <Link href={`/designs/${design._id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
