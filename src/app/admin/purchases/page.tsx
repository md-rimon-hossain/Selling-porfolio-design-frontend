"use client";

import { useState } from "react";
import {
  useGetAllPurchasesQuery,
  useUpdatePurchaseStatusMutation,
} from "@/services/api";
import { ShoppingCart, Filter, Eye } from "lucide-react";

export default function PurchasesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetAllPurchasesQuery({ page, limit: 20 });
  const [updateStatus] = useUpdatePurchaseStatusMutation();

  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);

  const purchases = data?.data || [];

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateStatus({ id, status: status as any }).unwrap();
      alert("Status updated successfully!");
    } catch (error: any) {
      alert(error?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Purchases</h1>
          <p className="mt-2 text-gray-600">
            Manage all customer purchases ({data?.pagination?.total || 0} total)
          </p>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {purchases.map((purchase: any) => (
                  <tr key={purchase._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-mono text-sm text-gray-900">
                        {purchase._id.slice(-8).toUpperCase()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          purchase.purchaseType === "subscription"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {purchase.purchaseType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {purchase.user?.name || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {purchase.user?.email}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">
                        ${purchase.amount?.toFixed(2) || "0.00"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={purchase.status}
                        onChange={(e) =>
                          handleStatusUpdate(purchase._id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-medium border-2 ${
                          purchase.status === "completed"
                            ? "border-green-200 bg-green-50 text-green-700"
                            : purchase.status === "pending"
                            ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                            : purchase.status === "cancelled"
                            ? "border-red-200 bg-red-50 text-red-700"
                            : "border-gray-200 bg-gray-50 text-gray-700"
                        }`}
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
                        {new Date(purchase.createdAt).toLocaleTimeString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedPurchase(purchase)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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

      {/* Detail Modal */}
      {selectedPurchase && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPurchase(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Purchase Details
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Order ID</p>
                  <p className="text-gray-900 font-mono">
                    {selectedPurchase._id}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Type</p>
                  <p className="text-gray-900 capitalize">
                    {selectedPurchase.purchaseType}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Amount</p>
                  <p className="text-gray-900 font-bold">
                    ${selectedPurchase.amount?.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <p className="text-gray-900 capitalize">
                    {selectedPurchase.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Payment Method
                  </p>
                  <p className="text-gray-900 capitalize">
                    {selectedPurchase.paymentMethod}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Date</p>
                  <p className="text-gray-900">
                    {new Date(selectedPurchase.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {selectedPurchase.billingAddress && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Billing Address
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900">
                      {selectedPurchase.billingAddress.street}
                    </p>
                    <p className="text-gray-900">
                      {selectedPurchase.billingAddress.city},{" "}
                      {selectedPurchase.billingAddress.state}{" "}
                      {selectedPurchase.billingAddress.zipCode}
                    </p>
                    <p className="text-gray-900">
                      {selectedPurchase.billingAddress.country}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedPurchase(null)}
              className="mt-6 w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
