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
            <Button
              className="bg-brand-primary hover:bg-brand-secondary"
              asChild
            >
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
        gradient: "from-red-500 via-red-600 to-rose-600",
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-700",
        accent: "bg-brand-primary",
        hover: "hover:bg-brand-primary hover:!text-white",
      },
      {
        gradient: "from-orange-500 via-orange-600 to-red-500",
        bg: "bg-orange-50",
        border: "border-orange-200",
        text: "text-orange-700",
        accent: "bg-brand-secondary",
        hover: "hover:bg-brand-secondary hover:!text-white",
      },
      {
        gradient: "from-amber-500 via-yellow-500 to-orange-500",
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-700",
        accent: "bg-brand-accent",
        hover: "hover:bg-brand-accent hover:!text-white",
      },
      {
        gradient: "from-rose-500 via-pink-500 to-red-500",
        bg: "bg-rose-50",
        border: "border-rose-200",
        text: "text-rose-700",
        accent: "bg-brand-primary",
        hover: "hover:bg-brand-primary hover:!text-white",
      },
      {
        gradient: "from-pink-500 via-rose-500 to-red-500",
        bg: "bg-pink-50",
        border: "border-pink-200",
        text: "text-pink-700",
        accent: "bg-brand-secondary",
        hover: "hover:bg-brand-secondary hover:!text-white",
      },
      {
        gradient: "from-yellow-500 via-orange-500 to-red-500",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        text: "text-yellow-700",
        accent: "bg-brand-accent",
        hover: "hover:bg-brand-accent hover:!text-white",
      },
    ];
    return colors[index % colors.length];
  };

  const getCategoryIcon = (index: number) => {
    const icons = [
      // Design/Palette
      <svg
        key={index}
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
      // Globe/Web
      <svg
        key={index}
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
      // Mobile/Device
      <svg
        key={index}
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
      // Photo/Camera
      <svg
        key={index}
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
      // Monitor/UI
      <svg
        key={index}
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
      // Tag/Brand
      <svg
        key={index}
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
        key={index}
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
      // Cube/3D
      <svg
        key={index}
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
      // Image/Illustration
      <svg
        key={index}
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
      // Play/Animation
      <svg
        key={index}
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
      // Edit/Typography
      <svg
        key={index}
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
      // Megaphone/Marketing
      <svg
        key={index}
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
    return icons[index % icons.length];
  };

  return (
    <section className="">
      <div className="max-w-7xl mx-auto ">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
          <div className="animate-fadeInUp">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Categories
            </h2>
            <p className="text-lg text-gray-600">
              Explore design collections by category
            </p>
          </div>
          <Link href="/categories" className="animate-fadeInUp">
            <Button
              variant="outline"
              className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:!text-white transition-all duration-300"
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
                className={`group bg-white rounded-xl border ${colorScheme.border} shadow-sm hover:shadow-2xl hover:border-brand-secondary transition-all duration-300 overflow-hidden animate-fadeInUp`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient Icon Header */}
                <div
                  className={`relative h-32 bg-gradient-to-br ${colorScheme.gradient} flex items-center justify-center`}
                >
                  <div className="text-white transform group-hover:scale-110 transition-transform duration-300">
                    {getCategoryIcon(index)}
                  </div>
                  {/* Decorative Circles */}
                  <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
                  <div className="absolute bottom-4 left-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                </div>

                <div className="p-6">
                  {/* Category Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-secondary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
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
                              className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold ${colorScheme.bg} ${colorScheme.text} ${colorScheme.hover} transition-all duration-300 border border-transparent hover:border-current`}
                            >
                              {subcategory.name}
                            </Link>
                          ))}
                        {category.subcategories.length > 4 && (
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold ${colorScheme.bg} ${colorScheme.text}`}
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
                      className="inline-flex items-center text-sm font-bold text-brand-primary hover:text-brand-secondary transition-colors group/link"
                    >
                      Explore Designs
                      <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                    </Link>

                    {category.subcategories.length > 0 && (
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                        {category.subcategories.length} types
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-16 text-center animate-fadeInUp">
          <div className="inline-flex items-center gap-8 px-10 py-8 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent rounded-2xl shadow-2xl border border-white/20 transform hover:scale-105 transition-transform duration-300">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#FF9900] mb-2 drop-shadow-lg">
                {categories.length}
              </div>
              <div className="text-sm font-semibold text-[#FF9900] uppercase tracking-wider">
                Categories
              </div>
            </div>
            <div className="w-px h-12 bg-white/30"></div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#FF9900] mb-2 drop-shadow-lg">
                {categories.reduce(
                  (total, cat) => total + cat.subcategories.length,
                  0
                )}
              </div>
              <div className="text-sm font-semibold text-[#FF9900] uppercase tracking-wider">
                Specialties
              </div>
            </div>
            <div className="w-px h-12 bg-white/30"></div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#FF9900] mb-2 drop-shadow-lg">
                100+
              </div>
              <div className="text-sm font-semibold text-[#FF9900] uppercase tracking-wider">
                Designs
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
