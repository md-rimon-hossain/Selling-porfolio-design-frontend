"use client";

import React, { useState, useEffect } from "react";
import { useGetDesignsQuery, useGetCategoriesQuery } from "@/services/api";
import { Button } from "@/components/ui/button";
import { LikeButton } from "@/components/LikeButton";
import Link from "next/link";
import Image from "next/image";
import { Design } from "@/lib/allTypes";
import { useSearchParams } from "next/navigation";

type ViewMode = "grid" | "list" | "compact";

export default function DesignsPage() {
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || ""
  );
  const [minPrice, setMinPrice] = useState<number>(
    Number(searchParams.get("minPrice")) || 0
  );
  const [maxPrice, setMaxPrice] = useState<number>(
    Number(searchParams.get("maxPrice")) || 1000
  );
  const [selectedComplexity, setSelectedComplexity] = useState<string>(
    searchParams.get("complexityLevel") || ""
  );
  const [currentPage, setCurrentPage] = useState<number>(
    Number(searchParams.get("page")) || 1
  );
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 12;

  // Build query params for API
  const queryParams = {
    page: currentPage,
    limit: itemsPerPage,
    ...(searchQuery && { search: searchQuery }),
    ...(selectedCategory && { category: selectedCategory }),
    ...(selectedComplexity && { complexityLevel: selectedComplexity }),
    ...(minPrice > 0 && { minPrice }),
    ...(maxPrice < 1000 && { maxPrice }),
    status: "Active", // Only show active designs
  };

  const { data: designsResponse, isLoading: designsLoading } =
    useGetDesignsQuery(queryParams);
  const { data: categoriesData } = useGetCategoriesQuery();

  const designs: Design[] = designsResponse?.data || [];
  const pagination = designsResponse?.pagination || {};
  const categories = categoriesData?.data || [];

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedComplexity) params.set("complexityLevel", selectedComplexity);
    if (minPrice > 0) params.set("minPrice", minPrice.toString());
    if (maxPrice < 1000) params.set("maxPrice", maxPrice.toString());
    if (currentPage > 1) params.set("page", currentPage.toString());

    const newUrl = `${window.location.pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    window.history.replaceState({}, "", newUrl);
  }, [
    searchQuery,
    selectedCategory,
    selectedComplexity,
    minPrice,
    maxPrice,
    currentPage,
  ]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedComplexity("");
    setMinPrice(0);
    setMaxPrice(1000);
    setCurrentPage(1);
  };

  const activeFiltersCount = [
    searchQuery !== "",
    selectedCategory !== "",
    selectedComplexity !== "",
    minPrice > 0,
    maxPrice < 1000,
  ].filter(Boolean).length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleComplexityChange = (complexity: string) => {
    setSelectedComplexity(complexity);
    setCurrentPage(1);
  };

  const handlePriceChange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 inline-flex backdrop-blur-sm bg-white/50 rounded-full px-6 py-3 shadow-sm border border-white/60">
          <div className="flex items-center space-x-2 text-sm">
            <Link
              href="/"
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold">All Designs</span>
          </div>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Discover Designs
            </span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Explore {pagination.totalItems || 0} amazing design templates
            created by talented designers worldwide
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 backdrop-blur-sm bg-white/80 rounded-3xl p-6 shadow-xl border border-white/60">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
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
                  placeholder="Search designs, tags, designers..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-400 font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
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
            </div>

            {/* Filter Toggle Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
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
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 backdrop-blur-sm bg-gray-100 rounded-2xl p-1.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === "grid"
                    ? "bg-white shadow-lg text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                title="Grid view"
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
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === "list"
                    ? "bg-white shadow-lg text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                title="List view"
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("compact")}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === "compact"
                    ? "bg-white shadow-lg text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                title="Compact view"
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
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Advanced Filters (Desktop Always Visible, Mobile Toggle) */}
          <div
            className={`mt-6 pt-6 border-t border-gray-200 ${
              showFilters || "hidden lg:block"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-gray-900 font-medium bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat: { _id: string; name: string }) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Complexity Filter */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Complexity
                </label>
                <select
                  value={selectedComplexity}
                  onChange={(e) => handleComplexityChange(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-gray-900 font-medium bg-white"
                >
                  <option value="">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Price Range: ${minPrice} - ${maxPrice}
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) =>
                      handlePriceChange(Number(e.target.value), maxPrice)
                    }
                    className="w-1/2 px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-gray-900 font-medium"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) =>
                      handlePriceChange(minPrice, Number(e.target.value))
                    }
                    className="w-1/2 px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-gray-900 font-medium"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>

            {/* Active Filters and Clear Button */}
            {activeFiltersCount > 0 && (
              <div className="mt-4 flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                      Search: {searchQuery}
                      <button onClick={() => setSearchQuery("")}>
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </span>
                  )}
                  {selectedCategory !== "all" && (
                    <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                      Category
                      <button onClick={() => setSelectedCategory("all")}>
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </span>
                  )}
                  {selectedComplexity !== "all" && (
                    <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {selectedComplexity}
                      <button onClick={() => setSelectedComplexity("all")}>
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </span>
                  )}
                </div>
                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                  size="sm"
                  className="font-bold rounded-xl"
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <div className="backdrop-blur-sm bg-white/60 rounded-2xl px-6 py-3 border border-white/60">
            <p className="text-sm font-bold text-gray-900">
              {pagination.totalItems || 0}{" "}
              {(pagination.totalItems || 0) === 1 ? "Design" : "Designs"} Found
              {designs.length > 0 && (
                <span className="text-gray-500 ml-2">
                  (Showing {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(
                    currentPage * itemsPerPage,
                    pagination.totalItems || 0
                  )}{" "}
                  of {pagination.totalItems || 0})
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {designsLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-blue-600 rounded-full animate-spin border-t-transparent absolute top-0 left-0"></div>
            </div>
            <p className="mt-6 text-lg text-gray-600 font-semibold">
              Loading amazing designs...
            </p>
            <p className="text-sm text-gray-500">Please wait a moment</p>
          </div>
        ) : designs.length > 0 ? (
          <>
            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {designs.map((design) => (
                  <Link
                    key={design._id}
                    href={`/designs/${design._id}`}
                    className="group"
                  >
                    <div className="backdrop-blur-sm bg-white/80 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-white/60 transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-2">
                      {/* Image */}
                      <div className="relative h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-600 overflow-hidden">
                        {design.previewImageUrl ? (
                          <Image
                            src={design.previewImageUrl}
                            alt={design.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-6xl font-black text-white/90">
                              {design.title.charAt(0)}
                            </span>
                          </div>
                        )}

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex gap-2">
                          {design.complexityLevel && (
                            <span className="backdrop-blur-md bg-green-500/90 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-lg">
                              {design.complexityLevel}
                            </span>
                          )}
                        </div>

                        {/* Price Badge */}
                        <div className="absolute top-3 right-3">
                          <span className="backdrop-blur-md bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm px-3 py-1.5 rounded-full font-bold shadow-lg">
                            ${design.price}
                          </span>
                        </div>

                        {/* Quick Actions (Hover) */}
                        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <LikeButton
                            designId={design._id}
                            initialLikesCount={design.likesCount}
                            variant="icon"
                            size="md"
                            showCount={false}
                            className="backdrop-blur-md bg-white/90 hover:bg-white shadow-lg"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        {/* Category */}
                        <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2.5 py-1 rounded-full font-bold mb-2">
                          {design.category.name}
                        </span>

                        {/* Title */}
                        <h3 className="text-lg font-black text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {design.title}
                        </h3>

                        {/* Designer */}
                        {design.designerName && (
                          <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                            <svg
                              className="w-4 h-4 text-blue-600"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                            {design.designerName}
                          </p>
                        )}

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <LikeButton
                            designId={design._id}
                            initialLikesCount={design.likesCount}
                            variant="compact"
                            size="md"
                            showCount={true}
                          />
                          <div className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4 text-blue-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                              />
                            </svg>
                            <span className="font-semibold">
                              {design.downloadCount || 0}
                            </span>
                          </div>
                        </div>

                        {/* Tags */}
                        {design.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {design.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-medium"
                              >
                                #{tag}
                              </span>
                            ))}
                            {design.tags.length > 2 && (
                              <span className="text-xs text-gray-400 px-2 py-1">
                                +{design.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}

                        {/* CTA */}
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-bold rounded-xl">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="space-y-4">
                {designs.map((design) => (
                  <Link
                    key={design._id}
                    href={`/designs/${design._id}`}
                    className="group block"
                  >
                    <div className="backdrop-blur-sm bg-white/80 rounded-3xl p-6 shadow-lg hover:shadow-2xl border border-white/60 transition-all duration-500 group-hover:scale-[1.01]">
                      <div className="flex gap-6">
                        {/* Image */}
                        <div className="flex-shrink-0 w-48 h-32 rounded-2xl bg-gradient-to-br from-blue-400 via-purple-500 to-pink-600 overflow-hidden relative">
                          {design.previewImageUrl ? (
                            <Image
                              src={design.previewImageUrl}
                              alt={design.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-4xl font-black text-white/90">
                                {design.title.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2.5 py-1 rounded-full font-bold mb-2">
                                  {design.category.name}
                                </span>
                                <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {design.title}
                                </h3>
                              </div>
                              <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                ${design.price}
                              </span>
                            </div>

                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {design.description}
                            </p>

                            <div className="flex items-center gap-6 text-sm">
                              {design.designerName && (
                                <div className="flex items-center gap-1 text-blue-600 font-semibold">
                                  <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                  </svg>
                                  {design.designerName}
                                </div>
                              )}
                              {design.complexityLevel && (
                                <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold">
                                  {design.complexityLevel}
                                </span>
                              )}
                              <div className="flex items-center gap-1 text-gray-500">
                                <LikeButton
                                  designId={design._id}
                                  initialLikesCount={design.likesCount}
                                  variant="compact"
                                  size="md"
                                  showCount={true}
                                />
                              </div>
                              <div className="flex items-center gap-1 text-gray-500">
                                <svg
                                  className="w-4 h-4 text-blue-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                                  />
                                </svg>
                                <span className="font-semibold">
                                  {design.downloadCount || 0}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex flex-wrap gap-1">
                              {design.tags.slice(0, 4).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-medium"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-bold rounded-xl"
                            >
                              View Details →
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Compact View */}
            {viewMode === "compact" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {designs.map((design) => (
                  <Link
                    key={design._id}
                    href={`/designs/${design._id}`}
                    className="group"
                  >
                    <div className="backdrop-blur-sm bg-white/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl border border-white/60 transition-all duration-300 group-hover:scale-105">
                      <div className="relative h-40 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-600">
                        {design.previewImageUrl ? (
                          <Image
                            src={design.previewImageUrl}
                            alt={design.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-4xl font-black text-white/90">
                              {design.title.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <span className="backdrop-blur-md bg-white/90 text-gray-900 text-xs px-2 py-1 rounded-full font-bold">
                            ${design.price}
                          </span>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-black text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {design.title}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">
                          {design.category.name}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <LikeButton
                            designId={design._id}
                            initialLikesCount={design.likesCount}
                            variant="compact"
                            size="sm"
                            showCount={true}
                          />
                          <div className="flex items-center gap-1">
                            <svg
                              className="w-3 h-3 text-blue-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                              />
                            </svg>
                            {design.downloadCount || 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="backdrop-blur-sm bg-white/80 rounded-2xl p-4 shadow-xl border border-white/60">
                  <nav className="flex items-center space-x-2">
                    {/* Previous Page */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        currentPage === 1
                          ? "text-gray-400 cursor-not-allowed bg-gray-100"
                          : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 bg-white shadow-sm"
                      }`}
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
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>

                    {/* Page Numbers */}
                    {Array.from(
                      { length: Math.min(pagination.totalPages, 5) },
                      (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else {
                          if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= pagination.totalPages - 2) {
                            pageNum = pagination.totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-4 py-2 rounded-xl font-medium transition-all ${
                              currentPage === pageNum
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                                : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 bg-white shadow-sm"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}

                    {/* Next Page */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.totalPages}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        currentPage === pagination.totalPages
                          ? "text-gray-400 cursor-not-allowed bg-gray-100"
                          : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 bg-white shadow-sm"
                      }`}
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </nav>

                  {/* Page Info */}
                  <div className="text-center mt-3 text-sm text-gray-600">
                    Page {currentPage} of {pagination.totalPages}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="backdrop-blur-sm bg-white/60 rounded-3xl p-12 max-w-lg mx-auto border border-white/80 shadow-xl">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white"
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
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                No Designs Found
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                {searchQuery || activeFiltersCount > 0
                  ? "Try adjusting your filters or search terms"
                  : "No designs are currently available"}
              </p>
              {activeFiltersCount > 0 && (
                <Button
                  onClick={clearAllFilters}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-bold rounded-xl"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
