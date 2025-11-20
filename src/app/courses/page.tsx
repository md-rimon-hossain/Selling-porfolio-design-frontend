"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useGetCoursesQuery, useGetCategoriesQuery } from "@/services/api";
import type { ICourse } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Clock, Users, Star, BookOpen } from "lucide-react";

export default function CoursesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<string>("");
  const [mainCategory, setMainCategory] = useState<string>("");
  const [subCategory, setSubCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data, isLoading, error } = useGetCoursesQuery({
    page,
    limit: 12,
    search: search || undefined,
    level: level || undefined,
    mainCategory: mainCategory || undefined,
    subCategory: subCategory || undefined,
    status: "Active",
    sortBy,
    sortOrder,
  });

  const { data: categoriesData } = useGetCategoriesQuery({
    categoryType: "course",
  });
  const categories = categoriesData?.data || [];

  // Helper function to get category ID (handles both _id and id fields)
  const getCategoryId = (cat: any) => cat._id || cat.id;

  // Filter categories to only include those with valid IDs
  const validCategories = categories.filter((cat: any) => {
    const id = getCategoryId(cat);
    return id && typeof id === "string" && id.trim().length > 0;
  });
  const mainCategories = validCategories.filter(
    (cat: any) => !cat.parentCategory
  );
  const subCategories = validCategories.filter(
    (cat: any) => cat.parentCategory
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Browse Courses
          </h1>
          <p className="text-lg text-gray-600">
            Learn design from industry experts with comprehensive video courses
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Search */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search courses..."
                      value={search}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSearch(e.target.value)
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Main Category Filter */}
                <Select
                  value={mainCategory}
                  onValueChange={(value) =>
                    setMainCategory(value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {mainCategories
                      .map((cat: any) => {
                        const id = getCategoryId(cat);
                        if (
                          !id ||
                          typeof id !== "string" ||
                          id.trim().length === 0
                        ) {
                          return null;
                        }
                        return (
                          <SelectItem key={id} value={id}>
                            {cat.name}
                          </SelectItem>
                        );
                      })
                      .filter(Boolean)}
                  </SelectContent>
                </Select>

                {/* Sub Category Filter */}
                <Select
                  value={subCategory}
                  onValueChange={(value) =>
                    setSubCategory(value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Subcategories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subcategories</SelectItem>
                    {subCategories
                      .map((cat: any) => {
                        const id = getCategoryId(cat);
                        if (
                          !id ||
                          typeof id !== "string" ||
                          id.trim().length === 0
                        ) {
                          return null;
                        }
                        return (
                          <SelectItem key={id} value={id}>
                            {cat.name}
                          </SelectItem>
                        );
                      })
                      .filter(Boolean)}
                  </SelectContent>
                </Select>

                {/* Level Filter */}
                <Select
                  value={level}
                  onValueChange={(value) =>
                    setLevel(value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select
                  value={`${sortBy}-${sortOrder}`}
                  onValueChange={(value: string) => {
                    const [newSortBy, newSortOrder] = value.split("-");
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder as "asc" | "desc");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt-desc">Newest First</SelectItem>
                    <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                    <SelectItem value="enrollmentCount-desc">
                      Most Popular
                    </SelectItem>
                    <SelectItem value="averageRating-desc">
                      Highest Rated
                    </SelectItem>
                    <SelectItem value="discountedPrice-asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="discountedPrice-desc">
                      Price: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="w-full md:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setLevel("");
                    setMainCategory("");
                    setSubCategory("");
                    setSortBy("createdAt");
                    setSortOrder("desc");
                    setPage(1);
                  }}
                >
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load courses</p>
          </div>
        )}

        {/* Courses Grid */}
        {data?.data && data.data.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.data.map((course: ICourse) => (
                <Link
                  key={course._id}
                  href={`/courses/${course._id}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={course.thumbnailImageUrl}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-2 right-2 bg-white text-gray-900">
                        {course.level}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {course.description}
                      </p>

                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {course.enrollmentCount}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {Math.floor(course.totalDurationMinutes / 60)}h{" "}
                          {course.totalDurationMinutes % 60}m
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {course.modules.length}
                        </div>
                      </div>

                      {course.averageRating > 0 && (
                        <div className="flex items-center mb-3">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm font-medium">
                            {course.averageRating.toFixed(1)}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div>
                          {course.discountedPrice !== undefined &&
                          course.discountedPrice < course.basePrice ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-green-600">
                                ${course.discountedPrice}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                ${course.basePrice}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xl font-bold">
                              ${course.basePrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {data.pagination && data.pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2 px-4">
                  <span className="text-sm text-gray-600">
                    Page {page} of {data.pagination.totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  onClick={() =>
                    setPage((p) =>
                      Math.min(data.pagination.totalPages || p, p + 1)
                    )
                  }
                  disabled={page >= (data.pagination.totalPages || page)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {data?.data && data.data.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters
            </p>
            <Button
              onClick={() => {
                setSearch("");
                setLevel("");
                setMainCategory("");
                setSubCategory("");
                setPage(1);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
