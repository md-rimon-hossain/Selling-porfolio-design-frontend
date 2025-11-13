"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "../store/hooks";
import { UserProfile } from "./UserProfile";
import { AuthButtons } from "./AuthButtons";
import { CategoryDropdown } from "./CategoryDropdown";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export const Header: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log("Header - Current user:", user);
  }, [user]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-brand-primary transition-all duration-300 ${
        isScrolled ? "shadow-lg" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          {/* Left Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 flex-1">
            <Link
              href="/"
              className={`px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-colors ${
                isActiveLink("/")
                  ? "text-white"
                  : "text-gray-200 hover:text-white"
              }`}
            >
              Home
            </Link>

            <Link
              href="/designs"
              className={`px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-colors ${
                isActiveLink("/designs")
                  ? "text-white"
                  : "text-gray-200 hover:text-white"
              }`}
            >
              Designs
            </Link>

            <CategoryDropdown />
          </nav>

          {/* Center Logo */}
          <Link href="/" className="flex items-center justify-center w-full">
            <span className="text-3xl font-bold text-white hover:text-gray-100 transition-colors font-pacifico tracking-wider">
              Zayed Uddin
            </span>
          </Link>

          {/* Right Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 flex-1 justify-end">
            <Link
              href="/pricing"
              className={`px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-colors ${
                isActiveLink("/pricing")
                  ? "text-white"
                  : "text-gray-200 hover:text-white"
              }`}
            >
              Pricing
            </Link>

            <Link
              href="/about"
              className={`px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-colors ${
                isActiveLink("/about")
                  ? "text-white"
                  : "text-gray-200 hover:text-white"
              }`}
            >
              About
            </Link>

            <Link
              href="/contact"
              className={`px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-colors ${
                isActiveLink("/contact")
                  ? "text-white"
                  : "text-gray-200 hover:text-white"
              }`}
            >
              Contact
            </Link>

            <div className="pl-4 border-l border-white/20">
              {user ? (
                <>
                  <UserProfile user={user} />
                </>
              ) : (
                <AuthButtons />
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center gap-4 lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-100 hover:text-white hover:bg-white/10 rounded-md"
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
        <div className="lg:hidden border-t border-white/10 bg-brand-primary">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/"
              className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                isActiveLink("/")
                  ? "text-gray-900 bg-white"
                  : "text-gray-100 hover:text-gray-900 hover:bg-white/90"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              href="/designs"
              className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                isActiveLink("/designs")
                  ? "text-gray-900 bg-white"
                  : "text-gray-100 hover:text-gray-900 hover:bg-white/90"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Designs
            </Link>

            <Link
              href="/pricing"
              className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                isActiveLink("/pricing")
                  ? "text-gray-900 bg-white"
                  : "text-gray-100 hover:text-gray-900 hover:bg-white/90"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>

            {user && (
              <Link
                href={user.role === "admin" ? "/admin" : "/dashboard"}
                className="block px-3 py-2 text-base font-medium text-brand-primary bg-white hover:bg-gray-100 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {user.role === "admin" ? "Admin Panel" : "Dashboard"}
              </Link>
            )}

            <Link
              href="/about"
              className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                isActiveLink("/about")
                  ? "text-gray-900 bg-white"
                  : "text-gray-100 hover:text-gray-900 hover:bg-white/90"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>

            <Link
              href="/contact"
              className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                isActiveLink("/contact")
                  ? "text-gray-900 bg-white"
                  : "text-gray-100 hover:text-gray-900 hover:bg-white/90"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>

            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-white/10">
              {user ? (
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-100">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-300">{user.email}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-base font-medium text-gray-100 hover:text-gray-900 hover:bg-white/90 rounded-md text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 text-base font-medium text-brand-primary bg-white hover:bg-gray-100 rounded-md text-center"
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
