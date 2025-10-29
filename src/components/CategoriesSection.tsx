/* eslint-disable react/jsx-key */
"use client";

import React from "react";
import { useGetCategoriesQuery } from "@/services/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";

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
  createdAt: string;
  updatedAt: string;
  subcategories: Subcategory[];
}

export const CategoriesSection: React.FC = () => {
  const { data: categoriesData, isLoading, error } = useGetCategoriesQuery();
  const rawCategories = categoriesData?.data || [];
  const categories: Category[] = (rawCategories as any[]).map((c: any) => ({
    id: c.id ?? c._id,
    name: c.name,
    description: c.description ?? "",
    isActive: !!c.isActive,
    createdAt: c.createdAt ?? "",
    updatedAt: c.updatedAt ?? "",
    subcategories: (c.subcategories || []).map((sc: any) => ({
      id: sc.id ?? sc._id,
      name: sc.name,
      description: sc.description ?? "",
      isActive: !!sc.isActive,
      parentCategory: sc.parentCategory ?? null,
    })),
  }));

  if (isLoading) {
    return (
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Browse Categories
            </h2>
            <p className="text-gray-600">Explore designs by category</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-6 h-40 animate-pulse"
            >
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error || categories.length === 0) {
    return (
      <section className="mb-16">
        <div className="text-center bg-gray-50 rounded-xl p-12 border border-gray-200">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
            <Layers className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Categories Available
          </h3>
          <p className="text-gray-600">
            Check back soon for exciting categories!
          </p>
        </div>
      </section>
    );
  }

  const colors = [
    "bg-blue-50 text-blue-600 hover:bg-blue-100",
    "bg-purple-50 text-purple-600 hover:bg-purple-100",
    "bg-green-50 text-green-600 hover:bg-green-100",
    "bg-orange-50 text-orange-600 hover:bg-orange-100",
    "bg-pink-50 text-pink-600 hover:bg-pink-100",
    "bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
    "bg-teal-50 text-teal-600 hover:bg-teal-100",
    "bg-red-50 text-red-600 hover:bg-red-100",
  ];

  return (
    <section className="mb-16">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Categories
          </h2>
          <p className="text-gray-600">Find designs by category</p>
        </div>
        <Link href="/categories">
          <Button
            variant="outline"
            className="border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.slice(0, 8).map((category, index) => (
          <div key={category.id} className="group">
            <div
              className={`relative overflow-hidden rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-6 h-40 ${
                colors[index % colors.length]
              }`}
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:underline">
                    {category.name}
                  </h3>
                  <p className="text-sm opacity-80 line-clamp-2">
                    {category.description}
                  </p>
                  {category.subcategories.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs font-semibold text-gray-500">
                        Subcategories:
                      </span>
                      <ul className="list-disc ml-4 mt-1">
                        {category.subcategories.map((subcat) => (
                          <li key={subcat.id} className="text-xs text-gray-600">
                            <Link
                              href={`/designs?subCategory=${subcat.id}`}
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
                <div className="flex items-center text-sm font-medium mt-2">
                  <Link
                    href={`/designs?mainCategory=${category.id}`}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      {categories.length > 8 && (
        <div className="text-center mt-8">
          <Link href="/categories">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              View All {categories.length} Categories
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
};

export default CategoriesSection;
