"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGetCategoriesQuery, useGetDesignsQuery } from "@/services/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Category, Design } from "@/lib/allTypes";

export const CategoryDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [showDesigns, setShowDesigns] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  const { data: designsData, isLoading: designsLoading } = useGetDesignsQuery(
    selectedCategory
      ? { category: selectedCategory._id, limit: 6, status: "Active" }
      : undefined
  );

  const categories: Category[] = categoriesData?.data || [];
  const designs: Design[] = designsData?.data || [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowDesigns(false);
        setSelectedCategory(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setShowDesigns(true);
  };

  const handleBackToCategories = () => {
    setShowDesigns(false);
    setSelectedCategory(null);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setShowDesigns(false);
      setSelectedCategory(null);
    }
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
          className="absolute left-0 mt-3 w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl ring-1 ring-purple-200 z-50 max-h-[32rem] overflow-hidden transform transition-all duration-300 ease-out scale-100 animate-in fade-in slide-in-from-top-2"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(147, 51, 234, 0.1)",
          }}
          onMouseLeave={() => {
            setIsOpen(false);
            setShowDesigns(false);
            setSelectedCategory(null);
          }}
        >
          {!showDesigns ? (
            /* Categories View */
            <div className="py-3">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gradient-to-r from-purple-100 to-blue-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      Browse Categories
                    </h3>
                    <p className="text-xs text-gray-500">
                      Explore our design collections
                    </p>
                  </div>
                </div>
              </div>

              {categoriesLoading ? (
                <div className="px-6 py-12 text-center">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-transparent border-t-purple-600 border-r-blue-600 mx-auto"></div>
                    <div className="absolute inset-0 animate-ping rounded-full h-8 w-8 border-2 border-purple-300 opacity-20"></div>
                  </div>
                  <p className="mt-4 text-sm font-medium text-gray-600">
                    Loading categories...
                  </p>
                </div>
              ) : categories.length > 0 ? (
                <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent">
                  <div className="p-2 space-y-1">
                    {categories.map((category, index) => (
                      <button
                        key={category._id}
                        onClick={() => handleCategoryClick(category)}
                        className="w-full p-4 text-left rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 flex items-center justify-between group transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg border border-transparent hover:border-purple-200"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center space-x-4">
                          {/* Category Icon */}
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
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
                                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                              />
                            </svg>
                          </div>

                          {/* Category Info */}
                          <div className="flex-1">
                            <div className="text-base font-semibold text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
                              {category.name}
                            </div>
                            <div className="text-sm text-gray-500 mt-1 line-clamp-2 group-hover:text-gray-600 transition-colors duration-300">
                              {category.description}
                            </div>
                            <div className="flex items-center mt-2 space-x-2">
                              <span className="text-xs bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                                Explore →
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Arrow */}
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
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="px-6 py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-500">
                    No categories available
                  </p>
                </div>
              )}

              {/* Footer */}
              <div className="border-t border-gray-100 px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50">
                <Link
                  href="/categories"
                  className="inline-flex items-center space-x-2 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors duration-300 group"
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
            </div>
          ) : (
            /* Designs View */
            <div className="py-3">
              {/* Header with back button */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center space-x-4">
                <button
                  onClick={handleBackToCategories}
                  className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 flex items-center justify-center text-purple-600 hover:text-purple-700 transition-all duration-300 transform hover:scale-105"
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
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedCategory?.name} Designs
                  </h3>
                  <p className="text-xs text-gray-500">
                    Explore {selectedCategory?.name.toLowerCase()} collection
                  </p>
                </div>
              </div>

              {designsLoading ? (
                <div className="px-6 py-12 text-center">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-transparent border-t-purple-600 border-r-blue-600 mx-auto"></div>
                    <div className="absolute inset-0 animate-ping rounded-full h-8 w-8 border-2 border-purple-300 opacity-20"></div>
                  </div>
                  <p className="mt-4 text-sm font-medium text-gray-600">
                    Loading designs...
                  </p>
                </div>
              ) : designs.length > 0 ? (
                <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent">
                  <div className="p-2 space-y-1">
                    {designs.slice(0, 6).map((design, index) => (
                      <Link
                        key={design._id}
                        href={`/designs/${design._id}`}
                        onClick={() => setIsOpen(false)}
                        className="block p-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 border border-transparent hover:border-purple-200 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-start space-x-4">
                          {/* Design Image */}
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 via-blue-500 to-purple-600 rounded-xl flex-shrink-0 flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-shadow duration-300">
                            {design.previewImageUrl ? (
                              <Image
                                src={design.previewImageUrl}
                                alt={design.title}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover rounded-xl"
                              />
                            ) : (
                              <svg
                                className="w-8 h-8"
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
                            )}
                          </div>

                          {/* Design Info */}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 truncate group-hover:text-purple-700 transition-colors duration-300">
                              {design.title}
                            </div>
                            <div className="text-sm text-gray-500 mt-1 line-clamp-2 group-hover:text-gray-600 transition-colors duration-300">
                              {design.description}
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center space-x-3">
                                <div className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                  ${design.price}
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                  <span className="flex items-center space-x-1">
                                    <svg
                                      className="w-3 h-3"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    <span>{design.likesCount}</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
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
                                        d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                                      />
                                    </svg>
                                    <span>{design.downloadCount}</span>
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-1">
                                {design.tags.slice(0, 2).map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-xs bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-2 py-1 rounded-full font-medium"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="px-6 py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-500">
                    No designs available in this category
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Try exploring other categories
                  </p>
                </div>
              )}

              {/* Footer */}
              {designs.length > 6 && (
                <div className="border-t border-gray-100 px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50">
                  <Link
                    href={`/designs?category=${selectedCategory?._id}`}
                    className="inline-flex items-center space-x-2 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors duration-300 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <span>View All {designs.length} Designs</span>
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
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsOpen(false);
            setShowDesigns(false);
            setSelectedCategory(null);
          }}
        />
      )}
    </div>
  );
};
