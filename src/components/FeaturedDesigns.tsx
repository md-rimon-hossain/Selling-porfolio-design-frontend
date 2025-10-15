"use client";

import React, { useState } from "react";
import { useGetDesignsQuery } from "@/services/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Design } from "@/lib/allTypes";

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

  console.log(designs);

  if (isLoading) {
    return (
      <section className="mt-24 relative">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-2">
              Featured Designs
            </h2>
            <p className="text-gray-600">Handpicked stunning designs</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-3xl backdrop-blur-sm bg-white/80 border border-white/60 shadow-lg animate-pulse h-[480px]"
            >
              <div className="h-72 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200"></div>
              <div className="p-6 space-y-3">
                <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error || designs.length === 0) {
    return (
      <section className="mt-24">
        <div className="text-center backdrop-blur-sm bg-white/60 rounded-3xl p-12 border border-white/80 shadow-xl">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white"
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
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            No Designs Available
          </h3>
          <p className="text-gray-600 mb-6">
            Be the first to discover amazing designs!
          </p>
          <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            asChild
          >
            <Link href="/designs">Browse All Designs</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-24 relative">
      {/* Floating Background Accent */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      {/* Section Header */}
      <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
        <div>
          <h2 className="text-4xl font-black mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Featured Designs
          </h2>
          <p className="text-gray-600 text-lg">
            Handpicked stunning designs from our collection
          </p>
        </div>
        <Link href="/designs">
          <Button
            variant="outline"
            size="lg"
            className="border-2 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white hover:border-transparent transition-all rounded-2xl font-bold shadow-lg hover:shadow-xl"
          >
            View All Designs
            <svg
              className="w-4 h-4 ml-2"
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
          </Button>
        </Link>
      </div>

      {/* Designs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {designs.slice(0, 6).map((design) => (
          <Link
            key={design._id}
            href={`/designs/${design._id}`}
            className="group"
          >
            <div className="relative overflow-hidden rounded-3xl backdrop-blur-sm bg-white/80 border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-2">
              {/* Design Image */}
              <div className="relative h-72 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-600 overflow-hidden">
                {design.previewImageUrl ? (
                  <>
                    <Image
                      src={design.previewImageUrl}
                      alt={design.title}
                      fill
                      className={`object-cover transition-all duration-700 group-hover:scale-110 ${
                        loadedImages[design._id] ? "opacity-100" : "opacity-0"
                      }`}
                      onLoad={() =>
                        setLoadedImages((prev) => ({
                          ...prev,
                          [design._id]: true,
                        }))
                      }
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-20 h-20 text-white/90"
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

                {/* Floating Badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  {/* Category Badge */}
                  <span className="backdrop-blur-md bg-white/90 text-blue-600 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                    {design.category.name}
                  </span>

                  {/* Price Badge */}
                  <span className="backdrop-blur-md bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                    ${design.price}
                  </span>
                </div>

                {/* Bottom Badges */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {design.complexityLevel && (
                    <span className="backdrop-blur-md bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      {design.complexityLevel}
                    </span>
                  )}
                  {design.status === "Inactive" && (
                    <span className="backdrop-blur-md bg-red-500/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      Inactive
                    </span>
                  )}
                </div>

                {/* Quick Action Buttons (Visible on Hover) */}
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <button className="backdrop-blur-md bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg transition-all hover:scale-110">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                  <button className="backdrop-blur-md bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg transition-all hover:scale-110">
                    <svg
                      className="w-5 h-5 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Design Info */}
              <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {design.title}
                </h3>

                {/* Designer Name */}
                {design.designerName && (
                  <div className="flex items-center gap-2 mb-3">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    <span className="text-sm text-blue-600 font-semibold">
                      {design.designerName}
                    </span>
                  </div>
                )}

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {design.description}
                </p>

                {/* Tools & Tags */}
                <div className="space-y-3 mb-4">
                  {/* Tools */}
                  {design.usedTools && design.usedTools.length > 0 && (
                    <div>
                      <div className="flex flex-wrap gap-1.5">
                        {design.usedTools.slice(0, 3).map((tool, index) => (
                          <span
                            key={index}
                            className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs px-2.5 py-1 rounded-lg font-semibold"
                          >
                            {tool}
                          </span>
                        ))}
                        {design.usedTools.length > 3 && (
                          <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-lg font-semibold">
                            +{design.usedTools.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {design.tags && design.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {design.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-lg font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                      {design.tags.length > 3 && (
                        <span className="text-xs text-gray-400 px-2.5 py-1">
                          +{design.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer: Stats & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      <span className="font-semibold">
                        {design.likesCount || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4 text-blue-500"
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
                  </div>

                  {/* CTA Button */}
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                  >
                    View
                    <svg
                      className="w-4 h-4 ml-1"
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
                  </Button>
                </div>
              </div>

              {/* Decorative Corner Glow */}
              <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-tl from-purple-400/30 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Button (Bottom) */}
      {designs.length > 6 && (
        <div className="text-center mt-12">
          <Link href="/designs">
            <Button
              size="lg"
              className="px-12 h-14 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all rounded-2xl"
            >
              View All {designs.length} Designs
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Button>
          </Link>
        </div>
      )}

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
};

export default FeaturedDesigns;
