/* eslint-disable react/jsx-key */
"use client";

import React from "react";
import { useGetCategoriesQuery } from "@/services/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ParentCategory {
  name: string;
  description: string;
}

interface Subcategory {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
  parentCategory: ParentCategory;
}

interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
  parentCategory: null;
  subcategories: Subcategory[];
}

export const CategoriesSection: React.FC = () => {
  const { data: categoriesData, isLoading, error } = useGetCategoriesQuery();
  const rawCategories = categoriesData?.data || [];
  const categories: Category[] = (rawCategories as any[]).map((c: any) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    isActive: c.isActive,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    slug: c.slug,
    parentCategory: c.parentCategory,
    subcategories: (c.subcategories || []).map((sc: any) => ({
      id: sc.id,
      name: sc.name,
      description: sc.description,
      isActive: sc.isActive,
      createdAt: sc.createdAt,
      updatedAt: sc.updatedAt,
      slug: sc.slug,
      parentCategory: sc.parentCategory,
    })),
  }));

  if (isLoading) {
    return (
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Categories
              </h2>
              <p className="text-lg text-gray-600">
                Explore design collections by category
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-7 bg-gray-200 rounded-full w-16"></div>
                  <div className="h-7 bg-gray-200 rounded-full w-20"></div>
                </div>
                <div className="h-5 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || categories.length === 0) {
    return (
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <ArrowRight className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              No Categories Available
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Categories will be available soon. Check back later for amazing
              design collections.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/designs">Browse All Designs</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const getCategoryColor = (index: number) => {
    const colors = [
      {
        bg: "bg-slate-50",
        border: "border-slate-200",
        text: "text-slate-700",
        accent: "bg-slate-500",
      },
      {
        bg: "bg-gray-50",
        border: "border-gray-200",
        text: "text-gray-700",
        accent: "bg-gray-500",
      },
      {
        bg: "bg-zinc-50",
        border: "border-zinc-200",
        text: "text-zinc-700",
        accent: "bg-zinc-500",
      },
      {
        bg: "bg-neutral-50",
        border: "border-neutral-200",
        text: "text-neutral-700",
        accent: "bg-neutral-500",
      },
      {
        bg: "bg-stone-50",
        border: "border-stone-200",
        text: "text-stone-700",
        accent: "bg-stone-500",
      },
      {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-700",
        accent: "bg-blue-500",
      },
    ];
    return colors[index % colors.length];
  };

  return (
    <section className="">
      <div className="max-w-7xl mx-auto ">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Categories
            </h2>
            <p className="text-lg text-gray-600">
              Explore design collections by category
            </p>
          </div>
          <Link href="/categories">
            <Button
              variant="outline"
              className="border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            >
              View All Categories
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const colorScheme = getCategoryColor(index);

            return (
              <div
                key={category.id}
                className={`group bg-white rounded-xl border ${colorScheme.border} shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden`}
              >
                <div className="p-6">
                  {/* Category Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Subcategories */}
                  {category.subcategories.length > 0 && (
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {category.subcategories
                          .slice(0, 4)
                          .map((subcategory) => (
                            <Link
                              key={subcategory.id}
                              href={`/designs?subCategory=${subcategory.id}`}
                              className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${colorScheme.bg} ${colorScheme.text} hover:${colorScheme.accent} hover:text-blue-600 transition-colors`}
                            >
                              {subcategory.name}
                            </Link>
                          ))}
                        {category.subcategories.length > 4 && (
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${colorScheme.bg} ${colorScheme.text}`}
                          >
                            +{category.subcategories.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Link
                      href={`/designs?mainCategory=${category.id}`}
                      className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors group/link"
                    >
                      Browse designs
                      <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>

                    {category.subcategories.length > 0 && (
                      <span className="text-sm text-gray-500">
                        {category.subcategories.length} subcategories
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 px-8 py-6 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {categories.length}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {categories.reduce(
                  (total, cat) => total + cat.subcategories.length,
                  0
                )}
              </div>
              <div className="text-sm text-gray-600">Specialties</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
