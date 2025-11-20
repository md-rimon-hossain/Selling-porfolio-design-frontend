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
  Shield,
  Zap,
  Users,
  TrendingUp,
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

  const {
    data: designData,
    isLoading,
    error,
    refetch: refetchDesign,
  } = useGetDesignQuery(designId);

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
  const {
    access,
    isLoading: accessLoading,
    refetch: refetchAccess,
  } = useDesignDownloadAccess(designId);

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

  const handlePaymentSuccess = useCallback(() => {
    // Refetch design data to update purchase status
    refetchDesign();
    // Refetch access status
    refetchAccess();
  }, [refetchDesign, refetchAccess]);

  const handleDownload = useCallback(async () => {
    // If user is not logged in for free design, redirect to login
    if (!user && design?.discountedPrice === 0) {
      router.push("/login");
      return;
    }

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
  }, [designId, downloadDesign, toast, user, design?.discountedPrice, router]);

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
            <Button className="bg-brand-primary hover:bg-brand-secondary">
              Back to Designs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Breadcrumb */}
        <nav className="mb-4">
          <div className="flex items-center space-x-2 text-xs">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Image & Details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Compact Professional Gallery */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              {/* Compact Header */}
              <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#82181A] to-[#82181A] border-b border-blue-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
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
                  <div>
                    <h2 className="text-base font-bold text-white">
                      Design Screens
                    </h2>
                    <p className="text-xs text-blue-100">
                      {previewImages.length}{" "}
                      {previewImages.length === 1 ? "image" : "images"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      design.status === "Active"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {design.status}
                  </span>
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

              {/* Compact Image Gallery */}
              <div className="p-4 space-y-4 bg-gray-50">
                {previewImages.length > 0 ? (
                  previewImages.map((src, idx) => (
                    <div
                      key={src + idx}
                      className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      {/* Compact Image Header */}
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                            {idx + 1}
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            Screen {idx + 1}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setCurrentImageIndex(idx);
                            setLightboxOpen(true);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-lg border border-gray-300 text-xs font-medium transition-all duration-200"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                            />
                          </svg>
                          Expand
                        </button>
                      </div>

                      {/* Compact Image Container */}
                      <div
                        className="relative bg-white p-3 cursor-pointer"
                        onClick={() => {
                          setCurrentImageIndex(idx);
                          setLightboxOpen(true);
                        }}
                      >
                        <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group-hover:border-blue-400 transition-colors">
                          <div className="aspect-[16/9] relative">
                            <Image
                              src={src}
                              alt={`${design.title} - Screen ${idx + 1}`}
                              fill
                              className="object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                              }}
                            />
                          </div>

                          {/* Clean Hover Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300">
                              <div className="bg-white text-gray-900 px-4 py-2 rounded-full text-xs font-semibold shadow-lg flex items-center gap-2">
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
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                  />
                                </svg>
                                View Fullscreen
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center py-16 bg-white rounded-xl border border-gray-200">
                    <div className="text-center">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm font-medium">
                        No preview images
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Image Lightbox */}
              <ImageLightbox
                images={previewImages}
                isOpen={lightboxOpen}
                currentIndex={currentImageIndex}
                onClose={() => setLightboxOpen(false)}
                onIndexChange={setCurrentImageIndex}
                alt={design.title}
              />

              {/* Enhanced Stats Bar */}
              <div className="grid grid-cols-4 gap-3 p-3 bg-gradient-to-br from-gray-50 to-blue-50 border-t border-gray-200">
                <div className="text-center group hover:transform hover:scale-105 transition-transform duration-200">
                  <div className="flex items-center justify-center mb-1">
                    <LikeButton
                      designId={design._id!}
                      initialLikesCount={design.likesCount}
                      variant="compact"
                      size="sm"
                      showCount={true}
                    />
                  </div>
                  <span className="text-xs text-gray-600 font-medium">
                    Likes
                  </span>
                </div>
                <div className="text-center group hover:transform hover:scale-105 transition-transform duration-200">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <p className="text-lg font-bold text-gray-900">
                      {design.downloadCount || 0}
                    </p>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">
                    Downloads
                  </span>
                </div>
                <div className="text-center group hover:transform hover:scale-105 transition-transform duration-200">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <p className="text-lg font-bold text-gray-900">
                      {statistics?.averageRating
                        ? statistics.averageRating.toFixed(1)
                        : "0.0"}
                    </p>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">
                    Rating
                  </span>
                </div>
                <div className="text-center group hover:transform hover:scale-105 transition-transform duration-200">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="w-4 h-4 text-blue-600" />
                    <p className="text-lg font-bold text-gray-900">
                      {statistics?.totalReviews || 0}
                    </p>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">
                    Reviews
                  </span>
                </div>
              </div>
            </div>

            {/* Description Section */}
            {design.description && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-blue-50 rounded-lg">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-base font-bold text-gray-900">
                    About This Design
                  </h2>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {design.description}
                </p>
              </div>
            )}

            {/* Design Process - Compact */}
            {design.processDescription && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-purple-600 rounded-lg">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      Design Process
                    </h2>
                    <p className="text-xs text-purple-700">Behind the scenes</p>
                  </div>
                </div>
                <div className="bg-white bg-opacity-60 rounded-lg p-3 border border-purple-100">
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {design.processDescription}
                  </p>
                </div>
              </div>
            )}

            {/* Tools & Effects Grid */}
            {((design.usedTools && design.usedTools.length > 0) ||
              (design.effectsUsed && design.effectsUsed.length > 0)) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Tools */}
                {design.usedTools && design.usedTools.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-red-50 rounded-lg">
                        <Wrench className="w-4 h-4 text-brand-primary" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm">
                        Tools Used
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {design.usedTools.map((tool, index) => (
                        <span
                          key={index}
                          className="bg-red-50 text-brand-primary text-xs px-2 py-1 rounded-md font-medium border border-red-100 hover:bg-red-100 transition-colors"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Effects */}
                {design.effectsUsed && design.effectsUsed.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-purple-50 rounded-lg">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm">
                        Effects Applied
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {design.effectsUsed.map((effect, index) => (
                        <span
                          key={index}
                          className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-md font-medium border border-purple-100 hover:bg-purple-100 transition-colors"
                        >
                          {effect}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Section */}
            <div
              id="reviews"
              className="bg-white rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900">
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
                              <span className="ml-2 inline-flex items-center text-xs font-medium bg-red-50 text-brand-primary px-2 py-0.5 rounded-full">
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
                    <button className="text-sm text-brand-primary hover:text-brand-secondary font-medium">
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
          {/* Right Column - Compact Purchase Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-4 sticky top-14 space-y-3">
              {/* Title & Category */}
              <div>
                <div className="flex items-center flex-wrap gap-1.5 mb-2">
                  <Link href={categoryQueryLink}>
                    <span className="bg-brand-primary text-white text-xs font-semibold px-2 py-0.5 rounded">
                      {mainCategory?.name || subCategory?.name || "Category"}
                    </span>
                  </Link>
                  {design.complexityLevel && (
                    <span className="bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded">
                      {design.complexityLevel}
                    </span>
                  )}
                  {design?.discountedPrice === 0 && (
                    <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                      FREE
                    </span>
                  )}
                </div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight mb-1">
                  {design.title}
                </h1>
                {designerName && (
                  <p className="text-xs text-gray-600">
                    by{" "}
                    <span className="font-semibold text-brand-primary">
                      {designerName}
                    </span>
                  </p>
                )}
              </div>

              {/* Compact Pricing Display */}
              {design?.discountedPrice === 0 ? (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-300">
                  <div className="flex items-center justify-center gap-2">
                    <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                      🎉 100% FREE
                    </span>
                  </div>
                  <p className="text-center text-green-700 font-medium text-xs mt-1">
                    Download for free!
                  </p>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Price
                    </span>
                    {design?.basePrice &&
                      design?.discountedPrice &&
                      design.basePrice > design.discountedPrice && (
                        <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {Math.round(
                            ((design.basePrice - design.discountedPrice) /
                              design.basePrice) *
                              100
                          )}
                          % OFF
                        </span>
                      )}
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-black text-blue-600">
                      {design?.currencyDisplay}
                      {design?.discountedPrice?.toFixed(2) || 0}
                    </span>
                    <span className="text-xs text-gray-600 font-medium pb-1">
                      {design.currencyCode}
                    </span>
                  </div>
                  {design?.basePrice &&
                    design?.discountedPrice &&
                    design.basePrice > design.discountedPrice && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-sm font-semibold text-gray-400 line-through">
                          {design?.currencyDisplay}
                          {design?.basePrice.toFixed(2) || 0}
                        </span>
                        <span className="text-xs text-green-700 font-medium">
                          Save {design?.currencyDisplay}
                          {(design.basePrice - design.discountedPrice).toFixed(
                            2
                          )}
                        </span>
                      </div>
                    )}
                </div>
              )}

              {/* Purchase Actions */}
              <div className="space-y-2">
                {design?.discountedPrice === 0 ? (
                  <Button
                    onClick={handleDownload}
                    disabled={isDownloading || !user}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Preparing Download...
                      </>
                    ) : !user ? (
                      <>
                        <Download className="w-5 h-5 mr-2" />
                        Login to Download Free
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5 mr-2" />
                        Download Free Design
                      </>
                    )}
                  </Button>
                ) : accessLoading ? (
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
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Buy Now for {design?.currencyDisplay}
                      {design?.discountedPrice?.toFixed(2) || 0}
                    </Button>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">or</p>
                      <Link
                        href="/pricing"
                        className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-700 text-sm underline-offset-4 hover:underline"
                      >
                        <Zap className="w-4 h-4" />
                        Get unlimited access with a subscription
                      </Link>
                    </div>
                  </>
                )}
              </div>

              {/* Compact Download Details */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-start gap-2">
                  <div className="p-1.5 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg shadow-sm">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-900 mb-1.5">
                      What You'll Get
                    </p>
                    {design?.downloadableFile ? (
                      <dl className="space-y-1 text-xs">
                        <div className="flex items-center justify-between py-1">
                          <dt className="text-gray-600 font-medium">
                            📄 File name
                          </dt>
                          <dd className="text-gray-900 font-semibold truncate ml-2 max-w-[140px]">
                            {(design.downloadableFile as any).file_name || "—"}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <dt className="text-gray-600 font-medium">
                            🎨 Format
                          </dt>
                          <dd className="text-gray-900 font-semibold uppercase">
                            {(design.downloadableFile as any).file_format ||
                              "—"}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <dt className="text-gray-600 font-medium">💾 Size</dt>
                          <dd className="text-gray-900 font-semibold">
                            {formatBytes(
                              (design.downloadableFile as any).file_size
                            )}
                          </dd>
                        </div>
                      </dl>
                    ) : (
                      <p className="text-sm text-gray-500">
                        File information will be available after purchase
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags */}
              {design.tags && design.tags.length > 0 && (
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Tag className="w-3.5 h-3.5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900 text-xs">
                      Tags
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
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
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center gap-1.5 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900 text-xs">
                    Timeline
                  </h3>
                </div>
                <div className="space-y-1.5 text-xs">
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

              {/* Trust Signals */}
              <div className="pt-3 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="flex flex-col items-center">
                    <Shield className="w-4 h-4 text-green-600 mb-0.5" />
                    <span className="text-xs font-medium text-gray-700">
                      Secure
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Zap className="w-4 h-4 text-blue-600 mb-0.5" />
                    <span className="text-xs font-medium text-gray-700">
                      Instant
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <CheckCircle className="w-4 h-4 text-purple-600 mb-0.5" />
                    <span className="text-xs font-medium text-gray-700">
                      Lifetime
                    </span>
                  </div>
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
            design={purchaseDesign}
            purchaseType="individual"
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </div>
  );
}
