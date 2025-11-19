"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGetCategoriesQuery, useGetCoursesQuery } from "@/services/api";
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
import { BookOpen, ChevronDown, Grid3x3, ArrowRight } from "lucide-react";

export const CoursesDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery({ categoryType: "course" });

  const { data: allCoursesData } = useGetCoursesQuery({});

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
  const allCourses = allCoursesData?.data || [];

  const getCategoryCourseCount = (categoryId: string) => {
    return allCourses.filter((course: any) => {
      const cat = course.category || course.mainCategory || course.subCategory;
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
      {/* Courses Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold uppercase tracking-wide text-gray-200 hover:text-white transition-colors"
      >
        <span>Course Categories</span>
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
            <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-600/5 to-indigo-600/5">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Explore Course Categories
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                {categories.length} categories • Learn from experts
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
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                <div className="px-3 py-3 space-y-2">
                  {categories.map((category) => {
                    const courseCount = getCategoryCourseCount(category.id);
                    return (
                      <div key={category.id}>
                        <Link
                          href={`/courses?mainCategory=${category.id}`}
                          onClick={() => setIsOpen(false)}
                          className="group block px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border border-transparent hover:border-blue-600/20 transition-all duration-200 hover:shadow-md"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                                {category.name}
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 group-hover:bg-blue-600 group-hover:text-white text-xs font-bold text-gray-600 transition-all">
                                  {courseCount}
                                </span>
                              </h4>
                              <p className="text-xs text-gray-500 line-clamp-1 mt-1 group-hover:text-gray-700">
                                {category.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
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
                                    href={`/courses?subCategory=${subcat.id}`}
                                    onClick={() => setIsOpen(false)}
                                    className="hover:underline text-blue-600"
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
                <BookOpen className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-600">
                  No course categories available
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
                  href="/courses/categories"
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 group transition-all hover:translate-x-1 duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <span>View All Course Categories</span>
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
