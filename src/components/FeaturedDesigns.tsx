"use client";

import React, { useState } from "react";
import { useGetDesignsQuery } from "@/services/api";
import { Button } from "@/components/ui/button";
import { LikeButton } from "@/components/LikeButton";
import Link from "next/link";
import Image from "next/image";
import { Design } from "@/lib/allTypes";
import { Download, Eye, ArrowRight, Star } from "lucide-react";

const FeaturedDesigns: React.FC = () => {
  const {
    data: designsData,
    isLoading,
    error,
  } = useGetDesignsQuery({ limit: 8, status: "Active" });
  const designs: Design[] = designsData?.data || [];
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>(
    {}
  );

  if (isLoading) {
    return (
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Featured Designs
            </h2>
            <p className="text-gray-600">Handpicked by our team</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 shadow-sm animate-pulse overflow-hidden"
            >
              <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-300"></div>
              <div className="p-5 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error || designs.length === 0) {
    return (
      <section className="mb-16">
        <div className="text-center bg-gray-50 rounded-xl p-12 border border-gray-200">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Designs Available
          </h3>
          <p className="text-gray-600 mb-6">
            Check back soon for amazing designs!
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/designs">Browse All Designs</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Featured Designs
          </h2>
          <p className="text-gray-600">
            Handpicked designs from our collection
          </p>
        </div>
        <Link href="/designs">
          <Button
            variant="outline"
            className="border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Designs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {designs.slice(0, 6).map((design) => (
          <div
            key={design._id}
            className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <Link href={`/designs/${design._id}`}>
              {/* Design Image */}
              <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {design.previewImageUrls && design.previewImageUrls[0] ? (
                  <Image
                    src={design.previewImageUrls[0]}
                    alt={design.title}
                    fill
                    className={`object-cover transition-all duration-300 group-hover:scale-105 ${
                      loadedImages[design._id!] ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() =>
                      setLoadedImages((prev) => ({
                        ...prev,
                        [design._id!]: true,
                      }))
                    }
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400"
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

                {/* Badges */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                  <span className="bg-white text-gray-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                    {design.mainCategory?.name ||
                      design.subCategory?.name ||
                      "Uncategorized"}
                  </span>
                  <div className="flex flex-col items-end gap-1">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                      {design.currencyDisplay}
                      {typeof design.discountedPrice === "number" &&
                      design.discountedPrice >= 0
                        ? design.discountedPrice
                        : design.basePrice ?? 0}

                    </span>
                    <span className="bg-white text-gray-500 px-2 py-0.5 rounded-full text-xs font-medium line-through shadow-sm">
                      {design.currencyDisplay}
                      {typeof design.basePrice === "number" &&
                      design.basePrice >= 0
                        ? design.basePrice
                        : design.basePrice ?? 0}
                    </span>
                  </div>
                </div>

                {design.complexityLevel && (
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-white text-gray-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                      {design.complexityLevel}
                    </span>
                  </div>
                )}
              </div>
            </Link>

            {/* Design Info */}
            <div className="p-5">
              <Link href={`/designs/${design._id}`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {design.title}
                </h3>
              </Link>

              {design.designer.name && (
                <p className="text-sm text-gray-600 mb-3">
                  by {design.designer.name}
                </p>
              )}

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
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
                        Math.round(
                          (design as any).avgRating &&
                            (design as any).avgRating > 0
                            ? (design as any).avgRating
                            : 0
                        )
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {(design as any).avgRating && (design as any).avgRating > 0
                    ? (design as any).avgRating.toFixed(1)
                    : "0.0"}
                </span>
                {(design as any).totalReviews &&
                (design as any).totalReviews > 0 ? (
                  <span className="text-xs text-gray-500">
                    ({(design as any).totalReviews}{" "}
                    {(design as any).totalReviews === 1 ? "review" : "reviews"})
                  </span>
                ) : (
                  <span className="text-xs text-gray-500">(0 review)</span>
                )}
              </div>

              {/* Tags */}
              {design.tags && design.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {design.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <LikeButton
                    designId={design._id!}
                    initialLikesCount={design.likesCount}
                    variant="compact"
                    size="md"
                    showCount={true}
                  />
                  <div className="flex items-center gap-1.5">
                    <Download className="w-4 h-4" />
                    <span>{design.downloadCount || 0}</span>
                  </div>
                </div>

                <Link href={`/designs/${design._id}`}>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      {designs.length > 6 && (
        <div className="text-center mt-8">
          <Link href="/designs">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              View All {designs.length} Designs
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
};

export default FeaturedDesigns;
