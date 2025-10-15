"use client";

import React, { useState } from "react";
import { useGetMyLikesQuery } from "@/services/api";
import { LikeButton } from "@/components/LikeButton";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, Loader2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LikedDesign {
  design: {
    _id: string;
    title: string;
    description: string;
    previewImageUrl?: string;
    price: number;
    likesCount: number;
    downloadCount: number;
    category?: { name: string };
  };
  createdAt: string;
}

export default function LikedDesignsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, error } = useGetMyLikesQuery({ page, limit });

  const likedDesigns = data?.data || [];
  const pagination = data?.pagination;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg">
            <Heart className="w-7 h-7 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">
              My Liked Designs
            </h1>
            <p className="text-gray-600 mt-1">
              Your collection of favorite designs
            </p>
          </div>
        </div>
        <div className="text-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading your liked designs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg">
            <Heart className="w-7 h-7 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">
              My Liked Designs
            </h1>
            <p className="text-gray-600 mt-1">
              Your collection of favorite designs
            </p>
          </div>
        </div>
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-400 to-pink-600 text-white">
            <svg
              className="w-12 h-12"
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
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Error Loading Likes
          </h2>
          <p className="text-gray-600 mb-6">
            Failed to load your liked designs. Please try again later.
          </p>
          <Button
            onClick={() => router.push("/designs")}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            Browse Designs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg">
            <Heart className="w-7 h-7 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">
              My Liked Designs
            </h1>
            <p className="text-gray-600 mt-1">
              Your collection of favorite designs
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="inline-flex items-center gap-6 bg-white rounded-2xl px-6 py-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <div>
              <span className="text-2xl font-bold text-gray-900">
                {pagination?.totalItems || 0}
              </span>
              <span className="text-gray-600 text-sm ml-2">
                {pagination?.totalItems === 1 ? "Design" : "Designs"} Liked
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {likedDesigns.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-300">
            <Heart className="w-12 h-12 text-gray-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            No Liked Designs Yet
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Start exploring and like your favorite designs to build your
            collection!
          </p>
          <Button
            onClick={() => router.push("/designs")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Browse Designs
          </Button>
        </div>
      ) : (
        <>
          {/* Designs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {likedDesigns.map((like: LikedDesign) => {
              const design = like.design;
              return (
                <Link
                  href={`/designs/${design._id}`}
                  key={design._id}
                  className="group"
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-[1.02]">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
                      {design.previewImageUrl ? (
                        <Image
                          src={design.previewImageUrl}
                          alt={design.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg
                            className="w-16 h-16 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}

                      {/* Quick Actions Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 right-4 flex gap-2">
                          <LikeButton
                            designId={design._id}
                            initialLikesCount={design.likesCount}
                            variant="icon"
                            size="md"
                            showCount={false}
                            className="backdrop-blur-md bg-white/90 hover:bg-white shadow-lg"
                          />
                          <button className="backdrop-blur-md bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110">
                            <ShoppingCart className="w-4 h-4 text-gray-700" />
                          </button>
                        </div>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="backdrop-blur-md bg-blue-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          {design.category?.name || "Uncategorized"}
                        </span>
                      </div>

                      {/* Liked Date Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="backdrop-blur-md bg-red-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                          <Heart className="w-3 h-3 fill-white" />
                          {new Date(like.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {design.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {design.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm">
                        <LikeButton
                          designId={design._id}
                          initialLikesCount={design.likesCount}
                          variant="compact"
                          size="sm"
                          showCount={true}
                        />
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-gray-600">
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
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                              />
                            </svg>
                            <span className="font-semibold">
                              {design.downloadCount || 0}
                            </span>
                          </div>
                          <div className="text-blue-600 font-bold">
                            ${design.price}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                variant="outline"
                className="px-4 py-2 rounded-xl"
              >
                Previous
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-semibold transition-all ${
                      page === i + 1
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <Button
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPages, p + 1))
                }
                disabled={page === pagination.totalPages}
                variant="outline"
                className="px-4 py-2 rounded-xl"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
