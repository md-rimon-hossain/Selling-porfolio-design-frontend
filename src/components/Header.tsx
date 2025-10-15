"use client";

import React from "react";
import { useAppSelector } from "../store/hooks";
import { UserProfile } from "./UserProfile";
import { AuthButtons } from "./AuthButtons";
import { CategoryDropdown } from "./CategoryDropdown";
import Link from "next/link";

export const Header: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <header className="w-full bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors">
                Design Portfolio
              </h1>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>

            {/* Categories Dropdown */}
            <CategoryDropdown />

            <Link
              href="/designs"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              All Designs
            </Link>

            <Link
              href="/pricing"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Pricing
            </Link>

            {/* Dashboard Links based on role */}
            {user && user.role === "admin" && (
              <Link
                href="/admin"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Admin Panel
              </Link>
            )}

            {user && user.role === "customer" && (
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                My Dashboard
              </Link>
            )}

            <Link
              href="/about"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-gray-900">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* User Profile or Auth Buttons */}
          <div className="flex items-center">
            {user ? <UserProfile user={user} /> : <AuthButtons />}
          </div>
        </div>
      </div>
    </header>
  );
};
