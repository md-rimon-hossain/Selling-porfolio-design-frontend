"use client";

import React, { useState } from "react";
import {
  useGetDesignQuery,
  useDownloadDesignMutation,
  useGetDesignReviewsQuery,
} from "@/services/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Design } from "@/lib/allTypes";
import PurchaseModal from "@/components/PurchaseModal";
import { useAppSelector } from "@/store/hooks";
import {
  ShoppingCart,
  Download,
  CheckCircle,
  Loader2,
  Star,
  Calendar,
  Package,
  Tag,
  Wrench,
  Sparkles,
} from "lucide-react";
import { useDesignDownloadAccess } from "@/hooks/useDesignDownloadAccess";
import { LikeButton } from "@/components/LikeButton";

export default function DesignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const designId = params.id as string;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);

  const { data: designData, isLoading, error } = useGetDesignQuery(designId);
  const design: Design = designData?.data;

  // Fetch reviews
  const { data: reviewsData } = useGetDesignReviewsQuery({
    designId,
    page: 1,
    limit: 100,
  });

  const statistics = reviewsData?.data?.statistics;
  const reviews = reviewsData?.data?.reviews || [];

  // Check download access
  const { access, isLoading: accessLoading } =
    useDesignDownloadAccess(designId);
  console.log(access);
  const [downloadDesign, { isLoading: downloadLoading }] =
    useDownloadDesignMutation();

  const handlePurchaseClick = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setPurchaseModalOpen(true);
  };

  const handleDownload = async () => {
    try {
      const result = await downloadDesign(designId).unwrap();
      if (result.data?.downloadUrl) {
        window.open(result.data.downloadUrl, "_blank");
      }
      alert("Download started successfully!");
    } catch (error) {
      const apiError = error as { data?: { message?: string } };
      alert(apiError?.data?.message || "Download failed. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-96 bg-gray-200 rounded-lg"></div>
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="space-y-4">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !design) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Design Not Found
          </h1>
          <p className="text-gray-600 mb-6 text-sm">
            The design you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/designs">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Back to Designs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm">
            <Link
              href="/"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href="/designs"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Designs
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href={`/designs?category=${design.category._id}`}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              {design.category.name}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate max-w-xs">
              {design.title}
            </span>
          </div>
        </nav>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Image & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden group">
              <div className="aspect-[16/10] relative overflow-hidden bg-gray-100">
                {design.previewImageUrl ? (
                  <>
                    <Image
                      src={design.previewImageUrl}
                      alt={design.title}
                      fill
                      className={`object-cover transition-all duration-500 ${
                        imageLoaded
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-105"
                      }`}
                      onLoad={() => setImageLoaded(true)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package className="w-24 h-24 text-gray-300" />
                  </div>
                )}

                {/* Floating Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      design.status === "Active"
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {design.status}
                  </span>
                </div>

                {/* Like Button */}
                <div className="absolute top-4 right-4">
                  <LikeButton
                    designId={design._id}
                    initialLikesCount={design.likesCount}
                    variant="icon"
                    size="lg"
                    showCount={false}
                    className="bg-white hover:bg-gray-50"
                  />
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-t border-gray-200">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <LikeButton
                      designId={design._id}
                      initialLikesCount={design.likesCount}
                      variant="compact"
                      size="sm"
                      showCount={true}
                    />
                  </div>
                  <span className="text-xs text-gray-600">Likes</span>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">
                    {design.downloadCount || 0}
                  </p>
                  <span className="text-xs text-gray-600">Downloads</span>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">
                    {statistics?.averageRating
                      ? statistics.averageRating.toFixed(1)
                      : "0.0"}
                  </p>
                  <span className="text-xs text-gray-600">Rating</span>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">
                    {statistics?.totalReviews || 0}
                  </p>
                  <span className="text-xs text-gray-600">Reviews</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                Description
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {design.description}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tools */}
              {design.usedTools && design.usedTools.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Wrench className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-gray-900">Tools Used</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {design.usedTools.map((tool, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Effects */}
              {design.effectsUsed && design.effectsUsed.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-gray-900">Effects</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {design.effectsUsed.map((effect, index) => (
                      <span
                        key={index}
                        className="bg-purple-50 text-purple-700 text-xs px-2.5 py-1 rounded font-medium"
                      >
                        {effect}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Process */}
              {design.processDescription && (
                <div className="bg-white rounded-lg border border-gray-200 p-5 md:col-span-2">
                  <h3 className="font-bold text-gray-900 mb-3">
                    Design Process
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {design.processDescription}
                  </p>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div
              id="reviews"
              className="bg-white rounded-lg border border-gray-200 p-5"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">
                  Customer Reviews
                </h2>
                {statistics && statistics.totalReviews > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.round(statistics.averageRating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-base font-bold text-gray-900">
                      {statistics.averageRating.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({statistics.totalReviews}{" "}
                      {statistics.totalReviews === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                )}
              </div>

              {/* Rating Distribution */}
              {statistics &&
                statistics.totalReviews > 0 &&
                statistics.ratingDistribution && (
                  <div className="mb-6">
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count =
                          Number(statistics.ratingDistribution?.[rating]) || 0;
                        const percentage =
                          statistics.totalReviews > 0
                            ? (count / statistics.totalReviews) * 100
                            : 0;

                        return (
                          <div key={rating} className="flex items-center gap-3">
                            <div className="flex items-center gap-1 w-12">
                              <span className="text-sm font-medium text-gray-700">
                                {rating}
                              </span>
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            </div>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-400"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 w-12 text-right">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* Reviews List */}
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.slice(0, 5).map((review: any) => (
                    <div
                      key={review._id}
                      className="border-t border-gray-200 pt-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">
                              {review.reviewer.name}
                            </span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {review.title && (
                            <h4 className="font-medium text-gray-900 text-sm mb-1">
                              {review.title}
                            </h4>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                  {reviews.length > 5 && (
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Show all {reviews.length} reviews
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">No reviews yet</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Be the first to review this design
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Purchase Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-5 sticky top-20 space-y-4">
              {/* Title & Category */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Link href={`/designs?category=${design.category._id}`}>
                    <span className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded">
                      {design.category.name}
                    </span>
                  </Link>
                  {design.complexityLevel && (
                    <span className="bg-green-600 text-white text-xs font-semibold px-2.5 py-1 rounded">
                      {design.complexityLevel}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
                  {design.title}
                </h1>
                {design.designerName && (
                  <p className="text-sm text-gray-600">
                    by{" "}
                    <span className="font-semibold text-blue-600">
                      {design.designerName}
                    </span>
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="py-4 border-y border-gray-200">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-blue-600">
                    ${design.price}
                  </span>
                  <span className="text-sm text-gray-500">USD</span>
                </div>
              </div>

              {/* Purchase Actions */}
              <div className="space-y-3">
                {accessLoading ? (
                  <div className="w-full h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  </div>
                ) : access.canDownload ? (
                  <>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-semibold text-green-900 text-sm">
                            {access.message}
                          </p>
                          <p className="text-xs text-green-700">
                            {access.reason === "subscription"
                              ? "Included with subscription"
                              : "You own this design"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={handleDownload}
                      disabled={downloadLoading}
                      className="w-full bg-green-600 hover:bg-green-700 text-sm font-semibold"
                    >
                      {downloadLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Download Now
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handlePurchaseClick}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-sm font-semibold"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Purchase for ${design.price}
                    </Button>
                    <p className="text-center text-xs text-gray-600">
                      or{" "}
                      <Link
                        href="/pricing"
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        subscribe
                      </Link>{" "}
                      for unlimited access
                    </p>
                  </>
                )}
              </div>

              {/* Tags */}
              {design.tags && design.tags.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-gray-600" />
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Tags
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {design.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Timeline
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Created</span>
                    <span className="font-medium text-gray-900">
                      {new Date(design.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Updated</span>
                    <span className="font-medium text-gray-900">
                      {new Date(design.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-center text-gray-500">
                  🔒 Secure checkout • Lifetime access
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {design && (
        <PurchaseModal
          isOpen={purchaseModalOpen}
          onClose={() => setPurchaseModalOpen(false)}
          design={{
            _id: design._id,
            title: design.title,
            description: design.description,
            price: design.price,
            previewImageUrl: design.previewImageUrl,
            category: design.category,
          }}
          purchaseType="individual"
        />
      )}
    </div>
  );
}
