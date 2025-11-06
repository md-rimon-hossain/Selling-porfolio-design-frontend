"use client";

import React, { useState, useEffect } from "react";
import {
  useGetAllPaymentsAdminQuery,
  useGetPaymentStatisticsAdminQuery,
  useRefundPaymentMutation,
} from "@/services/api";
import {
  Loader2,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCcw,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Eye,
  X,
  Calendar,
  Download,
  BarChart3,
  Package,
} from "lucide-react";

type PaymentStatus =
  | "pending"
  | "succeeded"
  | "failed"
  | "canceled"
  | "refunded";
type ProductType = "design" | "course" | "subscription";

export default function AdminPaymentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "">("");
  const [productTypeFilter, setProductTypeFilter] = useState<ProductType | "">(
    ""
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "amount" | "status">(
    "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const limit = 20;

  // Fetch all payments with filters
  const {
    data: paymentsData,
    isLoading: isLoadingPayments,
    isError: isErrorPayments,
    refetch: refetchPayments,
  } = useGetAllPaymentsAdminQuery({
    page,
    limit,
    status: statusFilter || undefined,
    productType: productTypeFilter || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    sortBy,
    sortOrder,
  });

  // Fetch statistics
  const {
    data: statsData,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useGetPaymentStatisticsAdminQuery({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const [refundPayment, { isLoading: isRefunding }] =
    useRefundPaymentMutation();

  const handleRefund = async () => {
    if (!selectedPayment) return;

    try {
      await refundPayment({
        paymentIntentId: selectedPayment.paymentIntentId,
        amount: refundAmount ? parseFloat(refundAmount) : undefined, // Already in dollars
        reason: refundReason,
      }).unwrap();

      alert("Refund processed successfully!");
      setIsRefundModalOpen(false);
      setSelectedPayment(null);
      setRefundAmount("");
      setRefundReason("");
      refetchPayments();
      refetchStats();
    } catch (error: any) {
      alert(error?.data?.message || "Failed to process refund");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "succeeded":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "failed":
      case "canceled":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "refunded":
        return <RefreshCcw className="w-5 h-5 text-purple-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      succeeded: "bg-green-100 text-green-800 border-green-200",
      failed: "bg-red-100 text-red-800 border-red-200",
      canceled: "bg-gray-100 text-gray-800 border-gray-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      refunded: "bg-purple-100 text-purple-800 border-purple-200",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
          styles[status as keyof typeof styles] || styles.pending
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const resetFilters = () => {
    setStatusFilter("");
    setProductTypeFilter("");
    setStartDate("");
    setEndDate("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setSearch("");
    setPage(1);
  };

  const applyFilters = () => {
    setPage(1);
    setIsFilterOpen(false);
  };

  if (isLoadingPayments && page === 1) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Loading payment data...</p>
        </div>
      </div>
    );
  }

  if (isErrorPayments) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-800 font-semibold mb-2">
            Failed to load payments
          </p>
          <button
            onClick={() => refetchPayments()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const payments = paymentsData?.data || [];
  const stats = statsData?.data?.overview || {};
  const statusBreakdown = statsData?.data?.statusBreakdown || {};
  const productTypeBreakdown = statsData?.data?.productTypeBreakdown || {};

  // Client-side search filtering
  const filteredPayments = payments.filter(
    (payment: any) =>
      payment.designId?.title?.toLowerCase().includes(search.toLowerCase()) ||
      payment.courseId?.title?.toLowerCase().includes(search.toLowerCase()) ||
      payment.pricingPlanId?.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      payment.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      payment.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
      payment.paymentIntentId?.toLowerCase().includes(search.toLowerCase())
  );

  // Check for stuck pending payments (>30 minutes)
  const stuckPendingPayments = payments.filter((p: any) => {
    if (p.status !== "pending") return false;
    const createdAt = new Date(p.createdAt).getTime();
    const now = Date.now();
    const diffMinutes = (now - createdAt) / 1000 / 60;
    return diffMinutes > 30;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          💳 Payment Management
        </h1>
        <p className="text-gray-600">
          Monitor, analyze, and manage all customer payments and transactions
        </p>
      </div>

      {/* Alert for stuck payments */}
      {stuckPendingPayments.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-yellow-900 mb-1">
                ⚠️ {stuckPendingPayments.length} Pending Payment(s) Stuck
              </h3>
              <p className="text-sm text-yellow-700">
                Some payments have been pending for over 30 minutes. Please
                check webhook status or Stripe dashboard.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-green-600" />
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-sm text-green-700 font-medium">Total Revenue</p>
          <p className="text-3xl font-bold text-green-900">
            ${(stats.totalRevenue || 0).toFixed(2)}
          </p>
          <p className="text-xs text-green-600 mt-1">
            {stats.successfulPayments || 0} successful payments
          </p>
        </div>

        {/* Success Rate */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-sm text-blue-700 font-medium">Success Rate</p>
          <p className="text-3xl font-bold text-blue-900">
            {stats.successRate || 0}%
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {stats.totalPayments || 0} total payments
          </p>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 relative">
          {stuckPendingPayments.length > 0 && (
            <div className="absolute top-2 right-2">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
              </span>
            </div>
          )}
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-3xl font-bold text-gray-900">
            {stats.pendingPayments || 0}
          </p>
          {stuckPendingPayments.length > 0 && (
            <p className="text-xs text-yellow-600 mt-1">
              {stuckPendingPayments.length} stuck ({">"}30 min)
            </p>
          )}
        </div>

        {/* Refunded */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <RefreshCcw className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-sm text-gray-600">Refunded</p>
          <p className="text-3xl font-bold text-gray-900">
            {stats.refundedPayments || 0}
          </p>
          <p className="text-xs text-purple-600 mt-1">
            ${(statusBreakdown.refunded?.amount || 0).toFixed(2)} refunded
          </p>
        </div>
      </div>

      {/* Product Type Breakdown */}
      {productTypeBreakdown && Object.keys(productTypeBreakdown).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Object.entries(productTypeBreakdown).map(
            ([type, data]: [string, any]) => (
              <div
                key={type}
                className="bg-white rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <Package className="w-6 h-6 text-gray-600" />
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    {type}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  ${(data.amount || 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  {data.count || 0} payments
                </p>
              </div>
            )
          )}
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product, user, email, or payment ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`px-6 py-2 ${
              statusFilter || productTypeFilter || startDate || endDate
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            } hover:bg-blue-700 hover:text-white rounded-lg font-medium flex items-center transition-colors`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {(statusFilter || productTypeFilter || startDate || endDate) && (
              <span className="ml-2 bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {
                  [statusFilter, productTypeFilter, startDate, endDate].filter(
                    Boolean
                  ).length
                }
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as PaymentStatus | "")
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">All Statuses</option>
                  <option value="succeeded">Succeeded</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="canceled">Canceled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              {/* Product Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Type
                </label>
                <select
                  value={productTypeFilter}
                  onChange={(e) =>
                    setProductTypeFilter(e.target.value as ProductType | "")
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">All Types</option>
                  <option value="design">Design</option>
                  <option value="course">Course</option>
                  <option value="subscription">Subscription</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
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
                      e.target.value as "createdAt" | "amount" | "status"
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="createdAt">Date</option>
                  <option value="amount">Amount</option>
                  <option value="status">Status</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort Order
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(e.target.value as "asc" | "desc")
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={applyFilters}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Apply Filters
              </button>
              <button
                onClick={resetFilters}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
              >
                Reset All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payments Table */}
      {filteredPayments.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No payments found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map((payment: any) => (
                  <tr key={payment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(payment.status)}
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(payment.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {payment.userId?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {payment.userId?.email || "No email"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {payment.designId?.title ||
                            payment.courseId?.title ||
                            payment.pricingPlanId?.name ||
                            "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {payment.productType}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-900">
                        {payment.currency} ${payment.amount.toFixed(2)}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedPayment(payment);
                            setIsDetailsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {payment.status === "succeeded" && (
                          <button
                            onClick={() => {
                              setSelectedPayment(payment);
                              setRefundAmount("");
                              setRefundReason("");
                              setIsRefundModalOpen(true);
                            }}
                            className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center"
                            title="Refund"
                          >
                            <RefreshCcw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {paymentsData?.pagination &&
            paymentsData.pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {paymentsData.pagination.currentPage} of{" "}
                  {paymentsData.pagination.totalPages} (
                  {paymentsData.pagination.totalItems} total)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1 || isLoadingPayments}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={
                      page >= paymentsData.pagination.totalPages ||
                      isLoadingPayments
                    }
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-50 disabled:text-gray-400 text-white rounded-lg font-medium transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
        </div>
      )}

      {/* Payment Details Modal */}
      {isDetailsModalOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                Payment Details
              </h3>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Status
                </label>
                <div className="mt-1">
                  {getStatusBadge(selectedPayment.status)}
                </div>
              </div>

              {/* Payment Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Payment ID
                  </label>
                  <p className="text-sm text-gray-900 font-mono mt-1 break-all">
                    {selectedPayment.paymentIntentId}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Amount
                  </label>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {selectedPayment.currency} $
                    {selectedPayment.amount.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Customer Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Name
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedPayment.userId?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedPayment.userId?.email || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Product Information
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Product
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedPayment.designId?.title ||
                        selectedPayment.courseId?.title ||
                        selectedPayment.pricingPlanId?.name ||
                        "Unknown"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Type
                    </label>
                    <p className="text-sm text-gray-900 mt-1 capitalize">
                      {selectedPayment.productType}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Timestamps</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Created
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(selectedPayment.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {selectedPayment.succeededAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Succeeded
                      </label>
                      <p className="text-sm text-gray-900 mt-1">
                        {new Date(selectedPayment.succeededAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Purchase ID */}
              {selectedPayment.purchaseId && (
                <div className="border-t border-gray-200 pt-4">
                  <label className="text-sm font-medium text-gray-600">
                    Purchase ID
                  </label>
                  <p className="text-sm text-gray-900 font-mono mt-1">
                    {selectedPayment.purchaseId._id ||
                      selectedPayment.purchaseId}
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {isRefundModalOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Process Refund
            </h3>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-1">Payment Amount:</p>
              <p className="text-2xl font-bold text-gray-900">
                {selectedPayment.currency} $
                {selectedPayment.amount.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Payment ID: {selectedPayment.paymentIntentId}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Refund Amount in Dollars (Optional - full refund if empty)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  placeholder={`Max: ${selectedPayment.amount.toFixed(2)}`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty for full refund
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Refund Reason (Optional)
                </label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Enter reason for refund..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsRefundModalOpen(false)}
                disabled={isRefunding}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRefund}
                disabled={isRefunding}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                {isRefunding ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Process Refund
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
