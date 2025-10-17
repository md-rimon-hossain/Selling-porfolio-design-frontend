/* eslint-disable react/jsx-key */
"use client";

import React, { useState } from "react";
import { useGetCategoriesQuery } from "@/services/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Category {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();
  const categories: Category[] = categoriesData?.data || [];
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter categories based on search
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Gradient colors for categories
  const gradients = [
    "from-blue-500 via-blue-600 to-purple-600",
    "from-purple-500 via-pink-500 to-red-500",
    "from-green-500 via-teal-500 to-cyan-500",
    "from-orange-500 via-red-500 to-pink-500",
    "from-indigo-500 via-purple-500 to-pink-500",
    "from-yellow-500 via-orange-500 to-red-500",
    "from-teal-500 via-green-500 to-emerald-500",
    "from-rose-500 via-pink-500 to-fuchsia-500",
    "from-cyan-500 via-blue-500 to-indigo-500",
    "from-lime-500 via-green-500 to-teal-500",
    "from-amber-500 via-orange-500 to-red-500",
    "from-violet-500 via-purple-500 to-pink-500",
  ];

  const icons = [
    // Design
    <svg
      className="w-10 h-10"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
      />
    </svg>,
    // Web
    <svg
      className="w-10 h-10"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
      />
    </svg>,
    // Mobile
    <svg
      className="w-10 h-10"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>,
    // Photo
    <svg
      className="w-10 h-10"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>,
    // UI/UX
    <svg
      className="w-10 h-10"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>,
    // Brand
    <svg
      className="w-10 h-10"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
      />
    </svg>,
    // Print
    <svg
      className="w-10 h-10"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
      />
    </svg>,
    // 3D
    <svg
      className="w-10 h-10"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>,
    // Illustration
    <svg
      className="w-10 h-10"
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
    </svg>,
    // Animation
    <svg
      className="w-10 h-10"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>,
    // Typography
    <svg
      className="w-10 h-10"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>,
    // Marketing
    <svg
      className="w-10 h-10"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
      />
    </svg>,
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link
              href="/"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Categories</span>
          </div>
        </nav>

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Design Categories
          </h1>
          <p className="text-sm text-gray-600">
            Explore {categories.length} design categories
          </p>
        </div>

        {/* Search & View Controls */}
        <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                title="Grid view"
              >
                <svg
                  className="w-4 h-4"
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
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-all ${
                  viewMode === "list"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                title="List view"
              >
                <svg
                  className="w-4 h-4"
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

            {/* Results Count */}
            <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold">
              {filteredCategories.length}{" "}
              {filteredCategories.length === 1 ? "category" : "categories"}
            </div>
          </div>
        </div>

        {/* Content */}
        {categoriesLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-blue-600 rounded-full animate-spin border-t-transparent absolute top-0 left-0"></div>
            </div>
            <p className="mt-6 text-lg text-gray-600 font-semibold">
              Loading categories...
            </p>
          </div>
        ) : filteredCategories.length > 0 ? (
          <>
            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredCategories.map((category, index) => (
                  <Link
                    key={category._id}
                    href={`/designs?category=${category._id}`}
                    className="group"
                  >
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                      {/* Icon Header with Gradient */}
                      <div
                        className={`relative h-32 bg-gradient-to-br ${
                          gradients[index % gradients.length]
                        } flex items-center justify-center`}
                      >
                        <div className="text-white">
                          {icons[index % icons.length]}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {category.name}
                          </h3>
                          {category.isActive && (
                            <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {category.description}
                        </p>
                        <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                          <span>Explore</span>
                          <svg
                            className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
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
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="space-y-3">
                {filteredCategories.map((category, index) => (
                  <Link
                    key={category._id}
                    href={`/designs?category=${category._id}`}
                    className="group block"
                  >
                    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md border border-gray-200 transition-all duration-200">
                      <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div
                          className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br ${
                            gradients[index % gradients.length]
                          } flex items-center justify-center text-white`}
                        >
                          {icons[index % icons.length]}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {category.name}
                            </h3>
                            {category.isActive && (
                              <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {category.description}
                          </p>
                        </div>

                        {/* Action */}
                        <div className="flex-shrink-0">
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                          >
                            Browse
                            <svg
                              className="w-4 h-4 ml-1"
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
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-lg p-12 max-w-lg mx-auto border border-gray-200 shadow-sm">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {searchQuery ? "No Results Found" : "No Categories Available"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? `No categories match "${searchQuery}". Try a different search term.`
                  : "No design categories are currently available."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {searchQuery && (
                  <Button
                    onClick={() => setSearchQuery("")}
                    className="bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg"
                  >
                    Clear Search
                  </Button>
                )}
                <Link href="/">
                  <Button
                    variant="outline"
                    className="font-semibold rounded-lg"
                  >
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        {!categoriesLoading && filteredCategories.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-white mb-2">
              Ready to Explore?
            </h3>
            <p className="text-white/90 mb-4">
              Browse through {categories.length} categories and discover amazing
              designs
            </p>
            <Link href="/designs">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-50 shadow-sm font-semibold rounded-lg"
              >
                View All Designs
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
