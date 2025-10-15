"use client";

import React, { useState } from "react";
import { useGetDesignQuery, useDownloadDesignMutation } from "@/services/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Design } from "@/lib/allTypes";
import PurchaseModal from "@/components/PurchaseModal";
import { useAppSelector } from "@/store/hooks";
import { ShoppingCart, Download, CheckCircle, Loader2 } from "lucide-react";
import { useDesignDownloadAccess } from "@/hooks/useDesignDownloadAccess";

export default function DesignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const designId = params.id as string;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);

  const { data: designData, isLoading, error } = useGetDesignQuery(designId);
  const design: Design = designData?.data;

  // Check download access
  const { access, isLoading: accessLoading } =
    useDesignDownloadAccess(designId);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-2/3"></div>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-7 h-[600px] bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl"></div>
              <div className="col-span-5 space-y-4">
                <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl w-3/4"></div>
                <div className="h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl"></div>
                <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !design) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Design Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The design you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link href="/designs">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Back to Designs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 py-8">
        {/* Compact Breadcrumb */}
        <nav className="mb-6 backdrop-blur-sm bg-white/50 rounded-full px-6 py-3 inline-flex items-center shadow-sm border border-white/60">
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
            <span className="text-gray-900 font-medium truncate max-w-[200px]">
              {design.title}
            </span>
          </div>
        </nav>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Image & Gallery */}
          <div className="col-span-12 lg:col-span-7 space-y-4">
            {/* Main Image Card */}
            <div className="group relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/60 backdrop-blur-sm">
              <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-blue-400 via-purple-500 to-pink-600">
                {design.previewImageUrl ? (
                  <>
                    <Image
                      src={design.previewImageUrl}
                      alt={design.title}
                      fill
                      className={`object-cover transition-all duration-700 ${
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-32 h-32 text-white/90"
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

                {/* Floating Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="backdrop-blur-md bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110">
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
                  <button className="backdrop-blur-md bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${
                      design.status === "Active"
                        ? "bg-green-500/90 text-white"
                        : "bg-red-500/90 text-white"
                    }`}
                  >
                    ● {design.status}
                  </span>
                </div>
              </div>

              {/* Image Footer Stats */}
              <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <svg
                        className="w-4 h-4 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      <span className="text-lg font-bold text-gray-900">
                        {design.likesCount || 0}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600">Likes</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 mb-1">
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
                      <span className="text-lg font-bold text-gray-900">
                        {design.downloadCount || 0}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600">Downloads</span>
                  </div>
                  <div>
                    <div className="mb-1">
                      <span className="text-lg font-bold text-gray-900">
                        {new Date(design.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600">Created</span>
                  </div>
                  <div>
                    <div className="mb-1">
                      <span className="text-lg font-bold text-gray-900">
                        {design.usedTools?.length || 0}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600">Tools</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Description Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Description */}
              <div className="backdrop-blur-sm bg-white/80 rounded-2xl p-5 shadow-lg border border-white/60">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900">Description</h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
                  {design.description}
                </p>
              </div>

              {/* Process */}
              {design.processDescription && (
                <div className="backdrop-blur-sm bg-white/80 rounded-2xl p-5 shadow-lg border border-white/60">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-900">Process</h3>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
                    {design.processDescription}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Details & Actions */}
          <div className="col-span-12 lg:col-span-5 space-y-4">
            {/* Title & Price Card */}
            <div className="backdrop-blur-sm bg-white/80 rounded-3xl p-6 shadow-2xl border border-white/60">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Link
                      href={`/designs?category=${design.category._id}`}
                      className="inline-block"
                    >
                      <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:shadow-lg transition-shadow">
                        {design.category.name}
                      </span>
                    </Link>
                    {design.complexityLevel && (
                      <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        {design.complexityLevel}
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-black text-gray-900 leading-tight mb-2">
                    {design.title}
                  </h1>
                  {design.designerName && (
                    <div className="flex items-center gap-2 text-sm">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                      <span className="text-blue-600 font-semibold">
                        {design.designerName}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ${design.price}
                </span>
                <span className="text-gray-500 text-sm">USD</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {accessLoading ? (
                  <div className="w-full h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  </div>
                ) : access.canDownload ? (
                  <>
                    {/* User has access - Show Download Button */}
                    <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl mb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-bold text-green-900">
                              {access.message}
                            </p>
                            <p className="text-sm text-green-700">
                              {access.reason === "subscription"
                                ? "Available with your subscription"
                                : "You own this design"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={handleDownload}
                      disabled={downloadLoading}
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all rounded-2xl"
                    >
                      {downloadLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5 mr-2" />
                          Download Now - Free for You!
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    {/* User doesn't have access - Show Purchase Button */}
                    <Button
                      onClick={handlePurchaseClick}
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all rounded-2xl"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Purchase Now - ${design.price.toFixed(2)}
                    </Button>
                    <p className="text-center text-sm text-gray-600">
                      Or{" "}
                      <Link
                        href="/pricing"
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        subscribe
                      </Link>{" "}
                      for unlimited downloads
                    </p>
                  </>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="h-12 font-semibold border-2 rounded-xl hover:bg-gray-50"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    Wishlist
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 font-semibold border-2 rounded-xl hover:bg-gray-50"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    Preview
                  </Button>
                </div>
                <p className="text-xs text-center text-gray-500 mt-2">
                  🔒 Secure checkout • Lifetime access • 30-day guarantee
                </p>
              </div>
            </div>

            {/* Tools & Effects Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Tools Used */}
              {design.usedTools && design.usedTools.length > 0 && (
                <div className="backdrop-blur-sm bg-white/80 rounded-2xl p-5 shadow-lg border border-white/60">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm">Tools</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {design.usedTools.slice(0, 4).map((tool, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-xs px-2.5 py-1 rounded-lg font-semibold"
                      >
                        {tool}
                      </span>
                    ))}
                    {design.usedTools.length > 4 && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-lg font-semibold">
                        +{design.usedTools.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Effects Used */}
              {design.effectsUsed && design.effectsUsed.length > 0 && (
                <div className="backdrop-blur-sm bg-white/80 rounded-2xl p-5 shadow-lg border border-white/60">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
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
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm">Effects</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {design.effectsUsed.slice(0, 4).map((effect, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 text-xs px-2.5 py-1 rounded-lg font-semibold"
                      >
                        {effect}
                      </span>
                    ))}
                    {design.effectsUsed.length > 4 && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-lg font-semibold">
                        +{design.effectsUsed.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            {design.tags && design.tags.length > 0 && (
              <div className="backdrop-blur-sm bg-white/80 rounded-2xl p-5 shadow-lg border border-white/60">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
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
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900">Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {design.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-full font-medium hover:shadow-md transition-shadow cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline Info */}
            <div className="backdrop-blur-sm bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-5 shadow-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="font-bold">Timeline</h3>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <span className="text-sm font-medium">Created</span>
                  <span className="text-sm font-bold">
                    {new Date(design.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <span className="text-sm font-medium">Last Updated</span>
                  <span className="text-sm font-bold">
                    {new Date(design.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

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
