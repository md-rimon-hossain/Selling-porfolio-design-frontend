"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
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
  FileText,
  Wrench,
  Sparkles,
} from "lucide-react";
import { useDesignDownloadAccess } from "@/hooks/useDesignDownloadAccess";
import {
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from "@/services/api";
import { Edit, Trash2 } from "lucide-react";
import { LikeButton } from "@/components/LikeButton";
import { useToast } from "@/components/ToastProvider";
import { useConfirm } from "@/components/ConfirmProvider";
import ImageLightbox from "@/components/ImageLightbox";

export default function DesignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const designId = params.id as string;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);

  const { data: designData, isLoading, error } = useGetDesignQuery(designId);

  // Support both shapes: API sometimes returns { data: { ... } } or the design object directly
  const design: Design | undefined = ((designData as any)?.data ??
    designData) as any;

  // Helpers - backend sends new fields; align safely with current TS Design type
  const mainCategory = (design as any)?.mainCategory;
  const subCategory = (design as any)?.subCategory;

  // images from backend (support array or single URL)
  const previewImages: string[] = useMemo(() => {
    const urls = (design as any)?.previewImageUrls;
    if (Array.isArray(urls) && urls.length) return urls as string[];
    const single = (design as any)?.previewImageUrl;
    return single ? [single] : [];
  }, [design]);

  // ensure we reset gallery index when design changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [design?._id]);

  // current hero image for gallery
  const heroImage = previewImages[currentImageIndex] || "";

  // build a consistent category link for breadcrumb / badges (memoized)
  const categoryQueryLink = useMemo(() => {
    if (mainCategory?.id || mainCategory?._id)
      return `/designs?mainCategory=${mainCategory?.id ?? mainCategory?._id}`;
    if (subCategory?.id || subCategory?._id)
      return `/designs?subCategory=${subCategory?.id ?? subCategory?._id}`;
    return "/designs";
  }, [mainCategory, subCategory]);

  // Lightbox / fullscreen preview state
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const designerName =
    (design as any)?.designer?.name || (design as any)?.designerName || "";

  // Fetch reviews (with refetch so we can refresh after create/update/delete)
  const { data: reviewsData, refetch: refetchReviews } =
    useGetDesignReviewsQuery({
      designId,
      page: 1,
      limit: 100,
    });

  const statistics = reviewsData?.data?.statistics;
  const reviews = reviewsData?.data?.reviews || [];

  // Review mutations
  const [createReview] = useCreateReviewMutation();
  const [updateReview] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  // Download mutation
  const [downloadDesign, { isLoading: isDownloading }] =
    useDownloadDesignMutation();

  const currentUserId = (user && user?._id) || "";

  // Detect existing review by current user for this design (support both _id and id)
  const existingReview = reviews.find(
    (r: any) =>
      r.reviewer?._id === currentUserId || r.reviewer?.id === currentUserId
  );

  // Local modal state for writing/editing review on design page
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(
    existingReview || null
  );
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });

  // Keep editingReview in sync when reviews load or current user changes
  useEffect(() => {
    const found = reviews.find(
      (r: any) =>
        r.reviewer?._id === currentUserId || r.reviewer?.id === currentUserId
    );
    setEditingReview(found || null);
    if (found) {
      setReviewForm({
        rating: found.rating || 5,
        comment: found.comment || "",
      });
    }
  }, [reviews, currentUserId]);

  const openWriteModal = () => {
    setEditingReview(existingReview || null);
    if (existingReview) {
      setReviewForm({
        rating: existingReview.rating || 5,
        comment: existingReview.comment || "",
      });
    } else {
      setReviewForm({ rating: 5, comment: "" });
    }
    setReviewModalOpen(true);
  };

  const toast = useToast();
  const confirmDialog = useConfirm();

  // Helper: format bytes into a human readable string (B / KB / MB / GB)
  const formatBytes = (bytes?: number, decimals = 2) => {
    const b = Number(bytes ?? 0);
    if (!b) return `0.00 B`;
    const units = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(b) / Math.log(1024));
    const val = b / Math.pow(1024, i);
    // reduce decimals as unit grows (keeps display tidy)
    return `${val.toFixed(Math.max(0, decimals - i))} ${units[i]}`;
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewForm.comment.trim().length < 10) {
      toast.error("Comment must be at least 10 characters long");
      return;
    }
    try {
      if (editingReview) {
        const reviewId = editingReview._id || editingReview.id;
        await updateReview({
          id: reviewId,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        }).unwrap();
        toast.success("Review updated successfully");
      } else {
        await createReview({
          designId,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        }).unwrap();
        toast.success("Review submitted successfully");
      }
      setReviewModalOpen(false);
      await refetchReviews();
    } catch (err: any) {
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  const handleDeleteReview = async (id: string) => {
    const ok = await confirmDialog.confirm(
      "Are you sure you want to delete this review?",
      {
        title: "Delete review",
        confirmLabel: "Delete",
        cancelLabel: "Cancel",
      }
    );
    if (!ok) return;
    try {
      await deleteReview(id).unwrap();
      toast.success("Review deleted successfully");
      await refetchReviews();
    } catch (err: any) {
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  // Check download access
  const { access, isLoading: accessLoading } =
    useDesignDownloadAccess(designId);

  const canReview =
    Boolean(user) &&
    (access?.canDownload ||
      access?.status === "completed" ||
      access?.reason === "subscription");

  const handlePurchaseClick = useCallback(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    setPurchaseModalOpen(true);
  }, [user, router]);

  const handleDownload = useCallback(async () => {
    try {
      // Use RTK Query mutation for download - it returns blob directly
      const blob = await downloadDesign(designId).unwrap();

      // Extract filename from the blob response (we'll need to get headers differently)
      // For now, create a default filename
      const filename = `design-${designId}.zip`;

      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Download completed successfully!");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Download failed. Please try again.";
      toast.error(errorMessage);
    }
  }, [designId, downloadDesign, toast]);

  const purchaseDesign = useMemo(() => {
    return {
      _id: design?._id!,
      title: design?.title,
      description: design?.description,
      price: design?.discountedPrice as number,
      basePrice: design?.basePrice as number,
      discountedPrice: design?.discountedPrice,
      currencyDisplay: (design as any)?.currencyDisplay,
      currencyCode: (design as any)?.currencyCode,
      previewImageUrl: previewImages[0] || "",
      category: mainCategory || subCategory || null,
    };
  }, [
    design?._id,
    design?.title,
    design?.description,
    design?.discountedPrice,
    design?.basePrice,
    previewImages,
    mainCategory,
    subCategory,
  ]);

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
              href={categoryQueryLink}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              {mainCategory?.name || subCategory?.name || "Category"}
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
                {heroImage ? (
                  <>
                    <Image
                      src={heroImage}
                      alt={`${design.title} preview ${currentImageIndex + 1}`}
                      fill
                      priority={true}
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

                    {/* Prev / Next controls */}
                    {previewImages.length > 1 && (
                      <>
                        <button
                          aria-label="Previous image"
                          onClick={() =>
                            setCurrentImageIndex(
                              (i) =>
                                (i - 1 + previewImages.length) %
                                previewImages.length
                            )
                          }
                          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md"
                        >
                          ‹
                        </button>
                        <button
                          aria-label="Next image"
                          onClick={() =>
                            setCurrentImageIndex(
                              (i) => (i + 1) % previewImages.length
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md"
                        >
                          ›
                        </button>
                      </>
                    )}
                    {/* open lightbox on click */}
                    <button
                      aria-label="Open fullscreen"
                      onClick={() => setLightboxOpen(true)}
                      className="absolute inset-0 w-full h-full bg-transparent"
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
                    designId={design._id!}
                    initialLikesCount={design.likesCount}
                    variant="icon"
                    size="lg"
                    showCount={false}
                    className="bg-white hover:bg-gray-50"
                  />
                </div>
              </div>

              {/* Image Thumbnails */}
              {previewImages.length > 1 && (
                <div className="flex items-center gap-2 mt-3 overflow-x-auto p-2">
                  {previewImages.map((src, idx) => (
                    <button
                      key={src + idx}
                      onClick={() => {
                        setCurrentImageIndex(idx);
                        setImageLoaded(false);
                      }}
                      className={`flex-shrink-0 w-20 h-12 rounded overflow-hidden border ${
                        idx === currentImageIndex
                          ? "ring-2 ring-blue-500"
                          : "border-gray-200"
                      }`}
                    >
                      <Image
                        src={src}
                        alt={`${design.title} thumb ${idx + 1}`}
                        width={160}
                        height={96}
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Image Lightbox */}
              <ImageLightbox
                images={previewImages}
                isOpen={lightboxOpen}
                currentIndex={currentImageIndex}
                onClose={() => setLightboxOpen(false)}
                onIndexChange={setCurrentImageIndex}
                alt={design.title}
              />

              {/* Stats Bar */}
              <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-t border-gray-200">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <LikeButton
                      designId={design._id!}
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
                  <span className="text-xs text-gray-600">Avg Rating</span>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">
                    {statistics?.totalReviews || 0}
                  </p>
                  <span className="text-xs text-gray-600">Reviews</span>
                </div>
              </div>
            </div>
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
                <h3 className="font-bold text-gray-900 mb-3">Design Process</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {design.processDescription}
                </p>
              </div>
            )}

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
                {canReview && (
                  <div>
                    <button
                      onClick={openWriteModal}
                      className="ml-3 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md"
                    >
                      {editingReview ? "Edit your review" : "Write a review"}
                    </button>
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
                          Number(statistics.ratingDistribution[0]?.[rating]) ||
                          0;

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
              {reviewModalOpen && (
                <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded">
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium">Rating</label>
                      <select
                        value={reviewForm.rating}
                        onChange={(e) =>
                          setReviewForm({
                            ...reviewForm,
                            rating: Number(e.target.value),
                          })
                        }
                        className="border border-gray-200 rounded px-2 py-1 text-sm"
                      >
                        {[5, 4, 3, 2, 1].map((r) => (
                          <option key={r} value={r}>
                            {r} Star{r > 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) =>
                          setReviewForm({
                            ...reviewForm,
                            comment: e.target.value,
                          })
                        }
                        placeholder="Write your review"
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm h-28"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 py-2 rounded"
                      >
                        {editingReview ? "Update Review" : "Submit Review"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setReviewModalOpen(false)}
                        className="text-sm px-3 py-2 rounded border border-gray-200"
                      >
                        Cancel
                      </button>
                      {editingReview && (
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteReview(
                              editingReview._id || editingReview.id
                            )
                          }
                          className="text-sm px-3 py-2 rounded border border-red-200 text-red-600"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}

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
                            {(review.reviewer?._id === currentUserId ||
                              review.reviewer?.id === currentUserId) && (
                              <span className="ml-2 inline-flex items-center text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                                You reviewed
                              </span>
                            )}
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
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                          {review.reviewer?._id === currentUserId && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingReview(review);
                                  setReviewForm({
                                    rating: review.rating || 5,
                                    comment: review.comment || "",
                                  });
                                  setReviewModalOpen(true);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteReview(review._id || review.id)
                                }
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
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
                  <Link href={categoryQueryLink}>
                    <span className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded">
                      {mainCategory?.name || subCategory?.name || "Category"}
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
                {designerName && (
                  <p className="text-sm text-gray-600">
                    by{" "}
                    <span className="font-semibold text-blue-600">
                      {designerName}
                    </span>
                  </p>
                )}
              </div>

              {/* discounted price */}
              <div className="flex justify-start items-center gap-4 py-4 border-y border-gray-200">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-blue-600">
                    {design?.currencyDisplay}
                    {design?.discountedPrice?.toFixed(2) || 0}
                  </span>
                  <span className="text-sm text-gray-500">
                    {design.currencyCode}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-medium text-gray-500 line-through">
                    {design?.currencyDisplay}
                    {design?.basePrice.toFixed(2) || 0}
                  </span>
                  <span className="text-sm text-gray-500">
                    {design.currencyCode}
                  </span>
                </div>
              </div>

              {/* Purchase Actions */}
              <div className="space-y-3">
                {accessLoading ? (
                  <div className="w-full h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  </div>
                ) : access.canDownload ||
                  access.status === "pending" ||
                  access.status === "completed" ? (
                  <>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-semibold text-green-900 text-sm">
                            {access.message}
                          </p>
                          <p className="text-xs text-green-700">
                            {access.reason === "subscription" &&
                            access.status === "completed"
                              ? "Included with subscription access"
                              : access.reason === "subscription" &&
                                access.status === "pending"
                              ? "Your subscription is pending"
                              : access.reason === "purchased" &&
                                access.status === "pending"
                              ? "Your individual purchase is pending now when complete You can download the design"
                              : access.reason === "purchased" &&
                                access.status === "completed"
                              ? "You purchased this design. You own this design"
                              : " "}
                          </p>
                        </div>
                      </div>
                    </div>
                    {access.status === "completed" ? (
                      <Button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="w-full bg-green-600 hover:bg-green-700 text-sm font-semibold"
                      >
                        {isDownloading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Preparing Download...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Download Now
                          </>
                        )}
                      </Button>
                    ) : null}
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handlePurchaseClick}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-sm font-semibold"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Purchase for {design?.currencyDisplay}
                      {design?.discountedPrice?.toFixed(2) || 0}
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

              <div className="flex justify-start items-center gap-4 py-4 border-y border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-md">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Download details
                    </p>
                    {design?.downloadableFile ? (
                      <dl className="mt-2 text-sm text-gray-600 grid grid-cols-1 gap-1">
                        <div className="flex items-center gap-2">
                          <dt className="w-28 text-gray-500">File name</dt>
                          <dd className="truncate">
                            {(design.downloadableFile as any).file_name || "—"}
                          </dd>
                        </div>
                        <div className="flex items-center gap-2">
                          <dt className="w-28 text-gray-500">Format</dt>
                          <dd className="uppercase">
                            {(design.downloadableFile as any).file_format ||
                              "—"}
                          </dd>
                        </div>
                        <div className="flex items-center gap-2">
                          <dt className="w-28 text-gray-500">Size</dt>
                          <dd>
                            {formatBytes(
                              (design.downloadableFile as any).file_size
                            )}
                          </dd>
                        </div>
                      </dl>
                    ) : (
                      <p className="text-sm text-gray-500 mt-1">
                        No downloadable file information available
                      </p>
                    )}
                  </div>
                </div>
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
                      {design?.createdAt
                        ? new Date(design.createdAt).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Updated</span>
                    <span className="font-medium text-gray-900">
                      {design?.updatedAt
                        ? new Date(design.updatedAt).toLocaleDateString()
                        : "-"}
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
        {/* Purchase Modal */}
        {design && (
          <PurchaseModal
            isOpen={purchaseModalOpen}
            onClose={() => setPurchaseModalOpen(false)}
            design={purchaseDesign}
            purchaseType="individual"
          />
        )}
      </div>
    </div>
  );
}
