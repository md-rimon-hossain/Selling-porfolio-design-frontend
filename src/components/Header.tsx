"use client";

import React, { useState } from "react";
import { useAppSelector } from "../store/hooks";
import { UserProfile } from "./UserProfile";
import { AuthButtons } from "./AuthButtons";
import { CategoryDropdown } from "./CategoryDropdown";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export const Header: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              DesignHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              href="/"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            >
              Home
            </Link>

            <CategoryDropdown />

            <Link
              href="/designs"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            >
              Designs
            </Link>

            <Link
              href="/pricing"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            >
              Pricing
            </Link>

            <Link
              href="/about"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Dashboard/Admin Link */}
            {user && (
              <Link
                href={user.role === "admin" ? "/admin" : "/dashboard"}
                className="hidden lg:block px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                {user.role === "admin" ? "Admin Panel" : "Dashboard"}
              </Link>
            )}

            {/* Auth Section */}
            <div className="hidden lg:block">
              {user ? <UserProfile user={user} /> : <AuthButtons />}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              href="/designs"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Designs
            </Link>

            <Link
              href="/pricing"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>

            {user && (
              <Link
                href={user.role === "admin" ? "/admin" : "/dashboard"}
                className="block px-3 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {user.role === "admin" ? "Admin Panel" : "Dashboard"}
              </Link>
            )}

            <Link
              href="/about"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>

            <Link
              href="/contact"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>

            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-gray-200">
              {user ? (
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-600">{user.email}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
