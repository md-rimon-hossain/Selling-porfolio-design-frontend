"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGetCategoriesQuery, useGetDesignsQuery } from "@/services/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Category } from "@/lib/allTypes";
import { Grid3x3, ChevronDown, ArrowRight } from "lucide-react";

export const CategoryDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  const { data: allDesignsData } = useGetDesignsQuery({});

  const categories: Category[] = categoriesData?.data || [];
  const allDesigns = allDesignsData?.data || [];

  const getCategoryDesignCount = (categoryId: string) => {
    return allDesigns.filter(
      (design: { category?: { _id: string } }) =>
        design.category?._id === categoryId
    ).length;
  };

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
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 text-sm font-medium rounded-md"
      >
        <Grid3x3 className="w-4 h-4" />
        <span>Categories</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="py-2">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">
                Browse by Category
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                {categories.length} categories available
              </p>
            </div>

            {categoriesLoading ? (
              <div className="px-4 py-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto"></div>
                <p className="mt-3 text-sm text-gray-600">
                  Loading categories...
                </p>
              </div>
            ) : categories.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                <div className="px-2 py-2 space-y-1">
                  {categories.map((category) => {
                    const designCount = getCategoryDesignCount(category._id);
                    return (
                      <Link
                        key={category._id}
                        href={`/designs?category=${category._id}`}
                        onClick={() => setIsOpen(false)}
                        className="group block px-3 py-2.5 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {category.name}
                            </h4>
                            <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">
                              {category.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="px-2 py-1 bg-gray-100 group-hover:bg-blue-50 text-gray-700 group-hover:text-blue-600 text-xs font-medium rounded transition-colors">
                              {designCount}
                            </span>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <Grid3x3 className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-600">
                  No categories available
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Check back soon for updates
                </p>
              </div>
            )}

            {/* Footer */}
            {categories.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-3">
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span>View All Categories</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};
