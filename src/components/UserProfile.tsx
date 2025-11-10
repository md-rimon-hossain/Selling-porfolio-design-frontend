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
import { signOut } from "next-auth/react";
import {
  User,
  ShoppingBag,
  Download,
  Star,
  LogOut,
  ChevronDown,
} from "lucide-react";

interface User {
  _id: string;
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

  const { data: subscriptionData } = useGetSubscriptionStatusQuery();

  const handleLogout = async () => {
    try {
      // Logout from backend API
      await logoutMutation().unwrap();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Clear Redux state
      dispatch(logoutAction());

      // Clear NextAuth session (if OAuth login)
      await signOut({ redirect: false });

      // Clear ALL storage
      localStorage.clear();
      sessionStorage.clear();

      setIsDropdownOpen(false);

      // Force immediate redirect and reload
      window.location.replace("/login");
    }
  };

  const hasSubscription =
    subscriptionData?.data?.hasActiveSubscription || false;

  return (
    <div className="relative">
      {/* User Avatar/Button */}
      <Button
        variant="ghost"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 hover:bg-gray-100"
        disabled={isLoading}
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="hidden md:block text-sm font-medium text-gray-700">
          {user.name}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* User Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-medium">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-600 truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded capitalize">
                {user.role}
              </span>
              {hasSubscription && (
                <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded">
                  Premium
                </span>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href={user.role === "admin" ? "/admin" : "/dashboard"}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <User className="w-4 h-4" />
              {user.role === "admin" ? "Admin Panel" : "Dashboard"}
            </Link>
            <Link
              href="/dashboard/purchases"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <ShoppingBag className="w-4 h-4" />
              My Purchases
            </Link>
            <Link
              href="/dashboard/available-downloads"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <Download className="w-4 h-4" />
              My Downloads
            </Link>
            <Link
              href="/dashboard/reviews"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <Star className="w-4 h-4" />
              My Reviews
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200 p-2">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors font-medium disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              {isLoading ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};
