"use client";

import React, { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { logout as logoutAction } from "../store/features/authSlice";
import {
  useLogoutMutation,
  useGetMyPurchasesQuery,
  useGetMyDownloadsQuery,
  useGetSubscriptionStatusQuery,
} from "../services/api";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserProfileProps {
  user: User;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [logoutMutation, { isLoading }] = useLogoutMutation();

  // Fetch user stats
  const { data: purchasesData } = useGetMyPurchasesQuery({ limit: 1 });
  const { data: downloadsData } = useGetMyDownloadsQuery({ page: 1, limit: 1 });
  const { data: subscriptionData } = useGetSubscriptionStatusQuery();

  const handleLogout = async () => {
    try {
      // Call logout API
      await logoutMutation().unwrap();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Always clear local state and redirect
      dispatch(logoutAction());
      setIsDropdownOpen(false);
      router.push("/login");
      // Force reload to clear any cached data
      window.location.href = "/login";
    }
  };

  // Get stats
  const totalPurchases = purchasesData?.pagination?.total || 0;
  const totalDownloads = downloadsData?.pagination?.total || 0;
  const hasSubscription =
    subscriptionData?.data?.hasActiveSubscription || false;

  return (
    <div className="relative">
      {/* User Avatar/Button */}
      <Button
        variant="ghost"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 p-2"
        disabled={isLoading}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium shadow-md">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="hidden md:block text-sm font-medium text-gray-700">
          {user.name}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 border border-gray-100">
          <div className="py-1">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <p className="text-sm font-semibold text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-600 mt-1">{user.email}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="inline-block px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full capitalize">
                  {user.role}
                </span>
                {hasSubscription && (
                  <span className="inline-block px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                    ✓ Subscribed
                  </span>
                )}
              </div>
            </div>

            {/* Stats Section */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {totalPurchases}
                  </p>
                  <p className="text-xs text-gray-600">Purchases</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {totalDownloads}
                  </p>
                  <p className="text-xs text-gray-600">Downloads</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {user.role === "admin" ? (
                <Link
                  href="/admin"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  🎛️ Admin Panel
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  📊 My Dashboard
                </Link>
              )}
              <Link
                href="/dashboard/purchases"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                🛍️ My Purchases
              </Link>
              <Link
                href="/dashboard/downloads"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                📥 My Downloads
              </Link>
              <Link
                href="/dashboard/reviews"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                ⭐ My Reviews
              </Link>
            </div>

            <hr className="my-1" />

            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium disabled:opacity-50"
            >
              {isLoading ? "Signing out..." : "🚪 Sign Out"}
            </button>
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};
