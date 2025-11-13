"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGetCategoriesQuery, useGetDesignsQuery } from "@/services/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// Local Category type to match backend response
interface Subcategory {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  parentCategory: string | null;
}

interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  subcategories: Subcategory[];
}
import { Grid3x3, ChevronDown, ArrowRight } from "lucide-react";

export const CategoryDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  const { data: allDesignsData } = useGetDesignsQuery({});

  const rawCategories = categoriesData?.data || [];
  const categories: Category[] = (rawCategories as any[]).map((c: any) => ({
    id: c.id ?? c._id,
    name: c.name,
    description: c.description ?? "",
    isActive: !!c.isActive,
    subcategories: (c.subcategories || []).map((sc: any) => ({
      id: sc.id ?? sc._id,
      name: sc.name,
      description: sc.description ?? "",
      isActive: !!sc.isActive,
      parentCategory: sc.parentCategory ?? null,
    })),
  }));
  const allDesigns = allDesignsData?.data || [];

  const getCategoryDesignCount = (categoryId: string) => {
    return allDesigns.filter((design: any) => {
      const cat = design.category || design.mainCategory || design.subCategory;
      return cat?._id === categoryId || cat?.id === categoryId || false;
    }).length;
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
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold uppercase tracking-wide text-gray-200 hover:text-white transition-colors"
      >
        <span>Categories</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-3">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-brand-primary/5 to-brand-accent/5">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Grid3x3 className="w-5 h-5 text-brand-primary" />
                Explore Designs Categories
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                {categories.length} categories • Latest work & projects
              </p>
            </div>

            {categoriesLoading ? (
              <div className="px-4 py-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-primary border-t-transparent mx-auto"></div>
                <p className="mt-3 text-sm text-gray-600">
                  Loading categories...
                </p>
              </div>
            ) : categories.length > 0 ? (
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                <div className="px-3 py-3 space-y-2">
                  {categories.map((category) => {
                    const designCount = getCategoryDesignCount(category.id);
                    return (
                      <div key={category.id}>
                        <Link
                          href={`/designs?mainCategory=${category.id}`}
                          onClick={() => setIsOpen(false)}
                          className="group block px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 border border-transparent hover:border-brand-primary/20 transition-all duration-200 hover:shadow-md"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 group-hover:text-brand-primary transition-colors flex items-center gap-2">
                                {category.name}
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 group-hover:bg-brand-primary group-hover:text-white text-xs font-bold text-gray-600 transition-all">
                                  {designCount}
                                </span>
                              </h4>
                              <p className="text-xs text-gray-500 line-clamp-1 mt-1 group-hover:text-gray-700">
                                {category.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                            </div>
                          </div>
                        </Link>
                        {category.subcategories.length > 0 && (
                          <div className="ml-4 mt-1">
                            <span className="text-xs font-semibold text-gray-500">
                              Subcategories:
                            </span>
                            <ul className="list-disc ml-4">
                              {category.subcategories.map((subcat) => (
                                <li
                                  key={subcat.id}
                                  className="text-xs text-gray-600"
                                >
                                  <Link
                                    href={`/designs?subCategory=${subcat.id}`}
                                    onClick={() => setIsOpen(false)}
                                    className="hover:underline text-brand-primary"
                                  >
                                    {subcat.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
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
              <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white p-4 rounded-b-lg">
                <Link
                  href="/categories"
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-secondary group transition-all hover:translate-x-1 duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <span>View All Portfolio</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
