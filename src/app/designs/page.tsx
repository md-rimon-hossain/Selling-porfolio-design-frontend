"use client";

import React, { useState, useEffect } from "react";
import { useGetDesignsQuery, useGetCategoriesQuery } from "@/services/api";
import { Button } from "@/components/ui/button";
import { LikeButton } from "@/components/LikeButton";
import Link from "next/link";
import Image from "next/image";
import { Design } from "@/lib/allTypes";
import { useSearchParams } from "next/navigation";
import { Star } from "lucide-react";

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
            <span className="text-gray-900 font-medium">Designs</span>
          </div>
        </nav>

        {/* Page Header with Search */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Discover Designs
              </h1>
              <p className="text-sm text-gray-600">
                {pagination.totalItems || 0} designs available
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-gray-200">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition-all ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
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
                      ? "bg-blue-600 text-white"
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

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
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
              placeholder="Search designs by name, tag, or designer..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-500"
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
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside
            className={`lg:w-64 flex-shrink-0 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-900"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Complexity Level
                  </label>
                  <select
                    value={selectedComplexity}
                    onChange={(e) => handleComplexityChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-900"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>${minPrice}</span>
                      <span>${maxPrice}</span>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) =>
                          handlePriceChange(Number(e.target.value), maxPrice)
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none text-sm"
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) =>
                          handlePriceChange(minPrice, Number(e.target.value))
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none text-sm"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>

                {/* Active Filters */}
                {activeFiltersCount > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      Active Filters:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {searchQuery && (
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                          Search
                          <button
                            onClick={() => setSearchQuery("")}
                            className="hover:text-blue-900"
                          >
                            <svg
                              className="w-3 h-3"
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
                      {selectedCategory && (
                        <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-medium">
                          Category
                          <button
                            onClick={() => setSelectedCategory("")}
                            className="hover:text-purple-900"
                          >
                            <svg
                              className="w-3 h-3"
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
                      {selectedComplexity && (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium">
                          {selectedComplexity}
                          <button
                            onClick={() => setSelectedComplexity("")}
                            className="hover:text-green-900"
                          >
                            <svg
                              className="w-3 h-3"
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
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4 px-1">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">
                  {pagination.totalItems || 0}
                </span>{" "}
                {(pagination.totalItems || 0) === 1 ? "design" : "designs"}{" "}
                found
              </p>
            </div>

            {/* Loading State */}
            {designsLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                  <div className="w-16 h-16 border-4 border-blue-600 rounded-full animate-spin border-t-transparent absolute top-0 left-0"></div>
                </div>
                <p className="mt-6 text-lg text-gray-600 font-semibold">
                  Loading designs...
                </p>
              </div>
            ) : designs.length > 0 ? (
              <>
                {/* Grid View */}
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {designs.map((design) => (
                      <Link
                        key={design._id}
                        href={`/designs/${design._id}`}
                        className="group"
                      >
                        <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md border border-gray-200 transition-all duration-200">
                          {/* Image */}
                          <div className="relative h-44 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
                            {design.previewImageUrl ? (
                              <Image
                                src={design.previewImageUrl}
                                alt={design.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-5xl font-bold text-gray-400">
                                  {design.title.charAt(0)}
                                </span>
                              </div>
                            )}

                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex gap-2">
                              {design.complexityLevel && (
                                <span className="bg-green-500 text-white text-xs px-2.5 py-1 rounded-md font-semibold shadow-sm">
                                  {design.complexityLevel}
                                </span>
                              )}
                            </div>

                            {/* Price Badge */}
                            <div className="absolute top-3 right-3">
                              <span className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md font-semibold shadow-sm">
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
                                className="bg-white hover:bg-gray-50 shadow-sm"
                              />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5">
                            {/* Category */}
                            <span className="inline-block bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-md font-semibold mb-2">
                              {design.category.name}
                            </span>

                            {/* Title */}
                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
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

                            {/* Rating */}
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < Math.round(design.avgRating && design.avgRating > 0 ? design.avgRating : 0)
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm font-medium text-gray-700">
                                    { design.avgRating && design.avgRating > 0 ? design.avgRating.toFixed(1) : "0.0"}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                  ({design.totalReviews && design.totalReviews > 0 ? (
                                      design.totalReviews
                                    ) : 0})
                                    </span>
                                </div>
                             

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
                                    className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-md font-medium"
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
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg">
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
                        <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md border border-gray-200 transition-all duration-300">
                          <div className="flex gap-6">
                            {/* Image */}
                            <div className="flex-shrink-0 w-48 h-32 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden relative">
                              {design.previewImageUrl ? (
                                <Image
                                  src={design.previewImageUrl}
                                  alt={design.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-4xl font-bold text-gray-400">
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
                                    <span className="inline-block bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-md font-semibold mb-2">
                                      {design.category.name}
                                    </span>
                                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                      {design.title}
                                    </h3>
                                  </div>
                                  <span className="text-2xl font-bold text-blue-600">
                                    ${design.price}
                                  </span>
                                </div>

                                <p className="text-gray-600 mb-3 line-clamp-2">
                                  {design.description}
                                </p>

                                {/* Rating */}
                          
                                    <div className="flex items-center gap-2 mb-3">
                                      <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                          <Star
                                            key={i}
                                            className={`w-4 h-4 ${
                                              i <
                                              Math.round(design.avgRating && design.avgRating > 0 ? design.avgRating : 0)
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-gray-300"
                                            }`}
                                          />
                                        ))}
                                      </div>
                                      <span className="text-sm font-medium text-gray-700">
                                        { design.avgRating && design.avgRating > 0 ?  design.avgRating.toFixed(1) : 0}
                                      </span>
                                      {design.totalReviews && design.totalReviews > 0 && (
                                        <span className="text-sm text-gray-500">
                                          ({design.totalReviews}{" "}
                                          {design.totalReviews === 1
                                            ? "review"
                                            : "reviews"}
                                          )
                                        </span>
                                      )}
                                    </div>
                              

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
                                    <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded-md text-xs font-semibold">
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
                                      className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-md font-medium"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg"
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

                {/* Compact View - Removed for better UX */}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                      <nav className="flex items-center space-x-2">
                        {/* Previous Page */}
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            currentPage === 1
                              ? "text-gray-400 cursor-not-allowed bg-gray-50"
                              : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 bg-white border border-gray-200"
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
                              } else if (
                                currentPage >=
                                pagination.totalPages - 2
                              ) {
                                pageNum = pagination.totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                  currentPage === pageNum
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 bg-white border border-gray-200"
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
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            currentPage === pagination.totalPages
                              ? "text-gray-400 cursor-not-allowed bg-gray-50"
                              : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 bg-white border border-gray-200"
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
                    No Designs Found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery || activeFiltersCount > 0
                      ? "Try adjusting your filters or search terms"
                      : "No designs are currently available"}
                  </p>
                  {activeFiltersCount > 0 && (
                    <Button
                      onClick={clearAllFilters}
                      className="bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
