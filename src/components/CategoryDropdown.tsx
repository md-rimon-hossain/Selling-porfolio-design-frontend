"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGetCategoriesQuery, useGetDesignsQuery } from "@/services/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Category } from "@/lib/allTypes";

export const CategoryDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  // Fetch designs for each category to get counts
  const { data: allDesignsData } = useGetDesignsQuery({});

  const categories: Category[] = categoriesData?.data || [];
  const allDesigns = allDesignsData?.data || [];

  // Calculate design count per category
  const getCategoryDesignCount = (categoryId: string) => {
    return allDesigns.filter(
      (design: { category?: { _id: string } }) =>
        design.category?._id === categoryId
    ).length;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Categories Button */}
      <Button
        variant="ghost"
        onClick={toggleDropdown}
        onMouseEnter={() => setIsOpen(true)}
        className="group relative flex items-center space-x-2 text-gray-700 hover:text-gray-900 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:shadow-md"
      >
        <div className="flex items-center space-x-2">
          <div className="relative">
            <svg
              className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <span className="font-medium">Categories</span>
        </div>
        <svg
          className={`w-4 h-4 transition-all duration-300 ${
            isOpen ? "rotate-180 text-purple-600" : "text-gray-400"
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
      {isOpen && (
        <div
          className="absolute left-0 mt-3 w-[420px] bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl ring-1 ring-black/5 z-50 overflow-hidden transform transition-all duration-300 ease-out scale-100 animate-in fade-in slide-in-from-top-2"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(249,250,251,0.98) 100%)",
            backdropFilter: "blur(24px)",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)",
          }}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="py-2">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        />
                      </svg>
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      Browse Categories
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {categories.length} collections available
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {categoriesLoading ? (
              <div className="px-6 py-16 text-center">
                <div className="relative inline-flex">
                  <div className="animate-spin rounded-full h-10 w-10 border-3 border-transparent border-t-purple-600 border-r-violet-500"></div>
                  <div className="absolute inset-0 animate-ping rounded-full h-10 w-10 border-2 border-purple-300 opacity-20"></div>
                </div>
                <p className="mt-4 text-sm font-medium text-gray-600">
                  Loading categories...
                </p>
              </div>
            ) : categories.length > 0 ? (
              <div className="max-h-[420px] overflow-y-auto py-1">
                <div className="px-2 space-y-0.5">
                  {categories.map((category, index) => {
                    const designCount = getCategoryDesignCount(category._id);
                    return (
                      <Link
                        key={category._id}
                        href={`/designs?category=${category._id}`}
                        onClick={() => setIsOpen(false)}
                        className="group block p-3.5 rounded-xl hover:bg-gradient-to-r hover:from-violet-50 hover:via-purple-50 hover:to-fuchsia-50 transition-all duration-300 border border-transparent hover:border-purple-100/50 hover:shadow-md"
                        style={{
                          animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
                        }}
                      >
                        <div className="flex items-center justify-between gap-4">
                          {/* Left: Icon + Info */}
                          <div className="flex items-center gap-3.5 flex-1 min-w-0">
                            {/* Category Icon */}
                            <div className="relative flex-shrink-0">
                              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-xl group-hover:shadow-purple-500/30 group-hover:scale-110 transition-all duration-300">
                                <svg
                                  className="w-6 h-6 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                                  />
                                </svg>
                              </div>
                              {/* Pulse indicator */}
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity"></div>
                            </div>

                            {/* Category Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[15px] font-semibold text-gray-900 group-hover:text-purple-700 transition-colors duration-300 mb-1">
                                {category.name}
                              </h4>
                              <p className="text-xs text-gray-500 line-clamp-1 group-hover:text-gray-600 transition-colors duration-300">
                                {category.description}
                              </p>
                            </div>
                          </div>

                          {/* Right: Count + Arrow */}
                          <div className="flex items-center gap-3 flex-shrink-0">
                            {/* Design Count Badge */}
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-100 to-purple-100 group-hover:from-violet-200 group-hover:to-purple-200 rounded-full transition-all duration-300">
                              <svg
                                className="w-3.5 h-3.5 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="text-sm font-bold text-purple-700">
                                {designCount}
                              </span>
                            </div>

                            {/* Arrow Icon */}
                            <svg
                              className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transform group-hover:translate-x-1 transition-all duration-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="px-6 py-16 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-500">
                  No categories available
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Check back soon for updates
                </p>
              </div>
            )}

            {/* Footer */}
            {categories.length > 0 && (
              <div className="border-t border-gray-100/80 px-5 py-3.5 bg-gradient-to-r from-gray-50/80 to-violet-50/80">
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-all duration-300 group"
                  onClick={() => setIsOpen(false)}
                >
                  <span>View All Categories</span>
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Add keyframe animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
