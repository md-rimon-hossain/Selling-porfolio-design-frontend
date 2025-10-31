"use client";

import { useState, useMemo, useEffect } from "react";
import {
  useGetAllPurchasesQuery,
  useUpdatePurchaseStatusMutation,
  useGetPurchaseAnalyticsQuery,
} from "@/services/api";
import {
  ShoppingCart,
  Filter,
  Eye,
  Search,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  CreditCard,
  Package,
  ArrowUpRight,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useToast } from "@/components/ToastProvider";

type PurchaseStatus =
  | "pending"
  | "completed"
  | "expired"
  | "cancelled"
  | "refunded";
type PaymentMethod =
  | "credit_card"
  | "paypal"
  | "stripe"
  | "bank_transfer"
  | "free";
type SortField = "purchaseDate" | "createdAt" | "updatedAt";
type PurchaseType = "individual" | "subscription";

interface Purchase {
  _id: string;
  purchaseType: PurchaseType;
  user?: {
    name?: string;
    email?: string;
  };
  design?: {
    title?: string;
  };
  pricingPlan?: {
    name?: string;
    duration?: string;
  };
  currencyDisplay?: string;
  currencyCode?: string;  
  amount: number;
  currency?: string;
  status: PurchaseStatus;
  paymentMethod?: PaymentMethod;
  purchaseDate?: string;
  createdAt: string;
  updatedAt?: string;
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  remainingDownloads?: number;
  activatedAt?: string;
  notes?: string;
  adminNotes?: string;
}

export default function PurchasesPage() {
  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PurchaseStatus | "">("");
  const [typeFilter, setTypeFilter] = useState<PurchaseType | "">("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<
    PaymentMethod | ""
  >("");
  const [sortBy, setSortBy] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [minAmount, setMinAmount] = useState<number | undefined>();
  const [maxAmount, setMaxAmount] = useState<number | undefined>();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // UI States
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(false);
  const [showAdminNotesModal, setShowAdminNotesModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [selectedPurchaseForNotes, setSelectedPurchaseForNotes] =
    useState<Purchase | null>(null);
  const [pendingStatusChange, setPendingStatusChange] =
    useState<PurchaseStatus | null>(null);

  // API Queries - Memoize query parameters to ensure proper refetching
  const queryParams = useMemo(
    () => ({
      page,
      limit,
      search: search || undefined,
      status: statusFilter || undefined,
      purchaseType: typeFilter || undefined,
      paymentMethod: paymentMethodFilter || undefined,
      sortBy,
      sortOrder,
      minAmount,
      maxAmount,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    }),
    [
      page,
      limit,
      search,
      statusFilter,
      typeFilter,
      paymentMethodFilter,
      sortBy,
      sortOrder,
      minAmount,
      maxAmount,
      startDate,
      endDate,
    ]
  );

  const { data, isLoading, refetch } = useGetAllPurchasesQuery(queryParams);

  console.log(data);

  const { data: analyticsData } = useGetPurchaseAnalyticsQuery({
    period: "monthly",
  });

  console.log(analyticsData);

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdatePurchaseStatusMutation();

  const toast = useToast();

  const purchases: Purchase[] = useMemo(() => data?.data || [], [data?.data]);
  const analytics = analyticsData?.data?.overview;

  // Reset page to 1 when filters change
  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    search,
    statusFilter,
    typeFilter,
    paymentMethodFilter,
    sortBy,
    sortOrder,
    minAmount,
    maxAmount,
    startDate,
    endDate,
  ]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!purchases.length) return null;

    const totalRevenue = purchases.reduce(
      (sum: number, p: Purchase) => sum + (p.amount || 0),
      0
    );
    const completed = purchases.filter(
      (p: Purchase) => p.status === "completed"
    ).length;
    const pending = purchases.filter(
      (p: Purchase) => p.status === "pending"
    ).length;
    const cancelled = purchases.filter(
      (p: Purchase) => p.status === "cancelled" || p.status === "refunded"
    ).length;

    return {
      totalRevenue,
      completed,
      pending,
      cancelled,
      conversionRate:
        purchases.length > 0
          ? ((completed / purchases.length) * 100).toFixed(1)
          : "0",
    };
  }, [purchases]);

  const handleStatusUpdate = async (
    id: string,
    status: PurchaseStatus,
    notes?: string
  ) => {
    try {
      await updateStatus({
        id,
        status,
        adminNotes: notes,
      }).unwrap();
      refetch();
      setShowAdminNotesModal(false);
      setSelectedPurchaseForNotes(null);
      setPendingStatusChange(null);
      setAdminNotes("");
      toast.success(`Status updated to ${status} successfully!`);
    } catch (error) {
      const message =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : "Failed to update status";
      toast.error(message || "Failed to update status");
    }
  };

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setTypeFilter("");
    setPaymentMethodFilter("");
    setMinAmount(undefined);
    setMaxAmount(undefined);
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const getStatusIcon = (status: PurchaseStatus | string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "cancelled":
      case "refunded":
        return <XCircle className="w-4 h-4" />;
      case "expired":
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <ShoppingCart className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: PurchaseStatus | string) => {
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Purchase Management
          </h1>
          <p className="mt-2 text-gray-600">
            Manage all customer purchases and subscriptions
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
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">
              {showFilters ? "Hide" : "Show"} Filters
            </span>
          </button>
        </div>
      </div>

      {/* Analytics Dashboard */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              {/* < className="w-8 h-8 opacity-80" /> */}
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium opacity-90">Total Revenue</h3>
            <p className="text-2xl font-bold mt-1">
              {purchases[0]?.currencyDisplay ?? "৳"}{analytics.totalRevenue?.toFixed(2) || "0.00"}
            </p>
            <p className="text-xs opacity-80 mt-1">All time earnings</p>
          </div>

          {/* Total Purchases */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <ShoppingCart className="w-8 h-8 opacity-80" />
              <span className="text-xl font-bold">
                 {analytics.totalPurchases || 0}
              </span>
            </div>
            <h3 className="text-sm font-medium opacity-90">Total Purchases</h3>
            <p className="text-2xl font-bold mt-1">
              {analytics.totalPurchases || 0}
            </p>
            <p className="text-xs opacity-80 mt-1">Lifetime orders</p>
          </div>

          {/* Completed */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 opacity-80" />
              <span className="text-xl font-bold">
                {analytics.activePurchases || 0}
              </span>
            </div>
            <h3 className="text-sm font-medium opacity-90">Completed</h3>
            <p className="text-2xl font-bold mt-1">
              {analytics.activePurchases || 0}
            </p>
            <p className="text-xs opacity-80 mt-1">Active purchases</p>
          </div>

          {/* Pending */}
          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 opacity-80" />
              <span className="text-xl font-bold">
                {analytics.pendingPurchases || 0}
              </span>
            </div>
            <h3 className="text-sm font-medium opacity-90">Pending</h3>
            <p className="text-2xl font-bold mt-1">
              {analytics.pendingPurchases || 0}
            </p>
            <p className="text-xs opacity-80 mt-1">Awaiting payment</p>
          </div>

          {/* Average Order Value */}
          <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 opacity-80" />
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium opacity-90">Avg Order Value</h3>
            <p className="text-2xl font-bold mt-1">
              {purchases[0]?.currencyDisplay ?? "৳"}{analytics.averageOrderValue?.toFixed(2) || "0.00"}
            </p>
            <p className="text-xs opacity-80 mt-1">Per transaction</p>
          </div>
        </div>
      )}

      {/* Page Stats (from current filter) */}
      {stats && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {purchases[0]?.currencyDisplay ?? "৳"}{stats.totalRevenue.toFixed(2)}
              </p>
              <p className="text-xs text-gray-600">Page Revenue</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {stats.completed}
              </p>
              <p className="text-xs text-gray-600">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </p>
              <p className="text-xs text-gray-600">Pending</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {stats.cancelled}
              </p>
              <p className="text-xs text-gray-600">Cancelled</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {stats.conversionRate}%
              </p>
              <p className="text-xs text-gray-600">Conversion</p>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Advanced Filters
            </h3>
            <button
              onClick={clearFilters}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Customer
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Name or email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purchase Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value as PurchaseType | "")
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="individual">Individual</option>
                <option value="subscription">Subscription</option>
              </select>
            </div>

            {/* Payment Method Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={paymentMethodFilter}
                onChange={(e) =>
                  setPaymentMethodFilter(e.target.value as PaymentMethod | "")
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Methods</option>
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="stripe">Stripe</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="free">Free</option>
              </select>
            </div>

            {/* Min Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Amount 
              </label>
              <input
                type="number"
                value={minAmount || ""}
                onChange={(e) =>
                  setMinAmount(
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                placeholder="0.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Max Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Amount 
              </label>
              <input
                type="number"
                value={maxAmount || ""}
                onChange={(e) =>
                  setMaxAmount(
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                placeholder="999.99"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Purchases Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-600">Loading purchases...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Item
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:text-purple-600"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      {sortBy === "createdAt" &&
                        (sortOrder === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        ))}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {purchases.map((purchase: Purchase) => (
                  <tr
                    key={purchase._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-mono text-sm text-gray-900 font-semibold">
                        #{purchase._id.slice(-8).toUpperCase()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          purchase.purchaseType === "subscription"
                            ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
                            : "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700"
                        }`}
                      >
                        {purchase.purchaseType === "subscription" ? (
                          <RefreshCw className="w-3 h-3" />
                        ) : (
                          <Package className="w-3 h-3" />
                        )}
                        {purchase.purchaseType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                          {purchase.user?.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {purchase.user?.name || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {purchase.user?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">
                          {purchase.design?.title ||
                            purchase.pricingPlan?.name ||
                            "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {purchase.purchaseType === "subscription"
                            ? `${purchase.pricingPlan?.duration || "N/A"}`
                            : "One-time purchase"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-lg font-bold text-gray-900">
                        {purchase.currencyDisplay ?? "৳"}{purchase.amount?.toFixed(2) || "0.00"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {purchase.currency?.toUpperCase() || "BDT"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900 capitalize">
                          {purchase.paymentMethod?.replace("_", " ") || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={purchase.status}
                        onChange={(e) => {
                          const newStatus = e.target.value as PurchaseStatus;
                          if (
                            newStatus === "completed" ||
                            newStatus === "refunded"
                          ) {
                            setSelectedPurchaseForNotes(purchase);
                            setPendingStatusChange(newStatus);
                            setShowAdminNotesModal(true);
                          } else {
                            handleStatusUpdate(purchase._id, newStatus);
                          }
                        }}
                        disabled={isUpdating}
                        className={`px-3 py-1 rounded-lg text-xs font-medium border-2 cursor-pointer transition-all ${getStatusColor(
                          purchase.status
                        )} hover:shadow-md disabled:opacity-50`}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="expired">Expired</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {new Date(purchase.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(purchase.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedPurchase(purchase)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {purchases.length === 0 && (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No purchases found</p>
              </div>
            )}
          </div>
        )}
      </div>

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

      {/* Enhanced Detail Modal */}
      {selectedPurchase && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPurchase(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Purchase Details</h2>
                  <p className="text-purple-100 text-sm mt-1">
                    Order #{selectedPurchase._id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${getStatusColor(
                    selectedPurchase.status
                  )}`}
                >
                  {getStatusIcon(selectedPurchase.status)}
                  <span className="font-semibold capitalize">
                    {selectedPurchase.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Customer Information
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Name</p>
                    <p className="text-gray-900 font-semibold mt-1">
                      {selectedPurchase.user?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p className="text-gray-900 mt-1">
                      {selectedPurchase.user?.email || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Purchase Information */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <ShoppingCart className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Purchase Information
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Purchase Type
                    </p>
                    <p className="text-gray-900 font-semibold mt-1 capitalize">
                      {selectedPurchase.purchaseType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Item</p>
                    <p className="text-gray-900 font-semibold mt-1">
                      {selectedPurchase.design?.title ||
                        selectedPurchase.pricingPlan?.name ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Amount</p>
                    <p className="text-2xl font-bold text-purple-600 mt-1">
                      {selectedPurchase.currencyDisplay}{selectedPurchase.amount?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Currency
                    </p>
                    <p className="text-gray-900 font-semibold mt-1">
                      {selectedPurchase.currency?.toUpperCase() || "USD"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Payment Method
                    </p>
                    <p className="text-gray-900 font-semibold mt-1 capitalize">
                      {selectedPurchase.paymentMethod?.replace("_", " ") ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Purchase Date
                    </p>
                    <p className="text-gray-900 mt-1">
                      {new Date(
                        selectedPurchase.purchaseDate ||
                          selectedPurchase.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Subscription Details (if applicable) */}
              {selectedPurchase.purchaseType === "subscription" && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <RefreshCw className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Subscription Details
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Plan Name
                      </p>
                      <p className="text-gray-900 font-semibold mt-1">
                        {selectedPurchase.pricingPlan?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Duration
                      </p>
                      <p className="text-gray-900 font-semibold mt-1">
                        {selectedPurchase.pricingPlan?.duration || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Start Date
                      </p>
                      <p className="text-gray-900 mt-1">
                        {selectedPurchase.subscriptionStartDate
                          ? new Date(
                              selectedPurchase.subscriptionStartDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        End Date
                      </p>
                      <p className="text-gray-900 mt-1">
                        {selectedPurchase.subscriptionEndDate
                          ? new Date(
                              selectedPurchase.subscriptionEndDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Downloads Remaining
                      </p>
                      <p className="text-2xl font-bold text-green-600 mt-1">
                        {selectedPurchase.remainingDownloads ?? "Unlimited"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Activated At
                      </p>
                      <p className="text-gray-900 mt-1">
                        {selectedPurchase.activatedAt
                          ? new Date(
                              selectedPurchase.activatedAt
                            ).toLocaleString()
                          : "Not activated"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Address */}
              {selectedPurchase.billingAddress && (
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-6 h-6 text-orange-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Billing Address
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-900">
                      {selectedPurchase.billingAddress.street}
                    </p>
                    <p className="text-gray-900">
                      {selectedPurchase.billingAddress.city},{" "}
                      {selectedPurchase.billingAddress.state}{" "}
                      {selectedPurchase.billingAddress.zipCode}
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {selectedPurchase.billingAddress.country}
                    </p>
                  </div>
                </div>
              )}

              {/* Notes Section */}
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
                </div>
                <div className="space-y-4">
                  {selectedPurchase.notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Customer Notes
                      </p>
                      <p className="text-gray-900 bg-white p-3 rounded-lg border border-gray-200">
                        {selectedPurchase.notes}
                      </p>
                    </div>
                  )}
                  {selectedPurchase.adminNotes && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Admin Notes
                      </p>
                      <p className="text-gray-900 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        {selectedPurchase.adminNotes}
                      </p>
                    </div>
                  )}
                  {!selectedPurchase.notes && !selectedPurchase.adminNotes && (
                    <p className="text-gray-500 italic">No notes available</p>
                  )}
                  <button
                    onClick={() => {
                      setSelectedPurchaseForNotes(selectedPurchase);
                      setPendingStatusChange(selectedPurchase.status);
                      setShowAdminNotesModal(true);
                      setSelectedPurchase(null);
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Add Admin Notes
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-2xl border-t border-gray-200">
              <button
                onClick={() => setSelectedPurchase(null)}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Notes Modal */}
      {showAdminNotesModal &&
        selectedPurchaseForNotes &&
        pendingStatusChange && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowAdminNotesModal(false);
              setSelectedPurchaseForNotes(null);
              setPendingStatusChange(null);
              setAdminNotes("");
            }}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold">Update Purchase Status</h2>
                <p className="text-purple-100 text-sm mt-1">
                  Order #{selectedPurchaseForNotes._id.slice(-8).toUpperCase()}{" "}
                  →{" "}
                  <span className="font-semibold capitalize">
                    {pendingStatusChange}
                  </span>
                </p>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    You are changing the status to{" "}
                    <strong className="capitalize">
                      {pendingStatusChange}
                    </strong>
                    . Please add any relevant notes below.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Notes (Optional)
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add any internal notes about this status change..."
                    rows={5}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {adminNotes.length}/500 characters
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setShowAdminNotesModal(false);
                      setSelectedPurchaseForNotes(null);
                      setPendingStatusChange(null);
                      setAdminNotes("");
                    }}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (pendingStatusChange) {
                        handleStatusUpdate(
                          selectedPurchaseForNotes._id,
                          pendingStatusChange,
                          adminNotes || undefined
                        );
                        setPendingStatusChange(null);
                      }
                    }}
                    disabled={isUpdating}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
                  >
                    {isUpdating ? "Updating..." : "Update Status"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
