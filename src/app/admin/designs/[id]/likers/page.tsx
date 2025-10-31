"use client";

import React, { useState } from "react";
import { useGetDesignLikersQuery, useGetDesignQuery } from "@/services/api";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Heart,
  Loader2,
  User,
  Mail,
  Calendar,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DesignLiker {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
}

export default function DesignLikersPage() {
  const params = useParams();
  const designId = params.id as string;
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data: designData, isLoading: designLoading } =
    useGetDesignQuery(designId);
  const { data, isLoading, error } = useGetDesignLikersQuery({
    designId,
    page,
    limit,
  });

  const likers = data?.data || [];
  const pagination = data?.pagination;
  const design = designData?.data;

  if (designLoading || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading design likers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
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
            Error Loading Likers
          </h2>
          <p className="text-gray-600 mb-6">
            Failed to load design likers. You may not have permission to view
            this information.
          </p>
          <Button onClick={() => window.history.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb and Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/designs">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Designs
            </Button>
          </Link>
          <div className="h-6 w-px bg-gray-300"></div>
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/admin" className="hover:text-blue-600">
              Admin
            </Link>
            <span>/</span>
            <Link href="/admin/designs" className="hover:text-blue-600">
              Designs
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Likers</span>
          </nav>
        </div>
      </div>

      {/* Header with Design Info */}
      <div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-3 gap-6 p-6">
            {/* Design Preview */}
            <div className="md:col-span-1">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
                {design?.previewImageUrls &&
                design.previewImageUrls.length > 0 ? (
                  <Image
                    src={design.previewImageUrls[0]}
                    alt={design.title}
                    fill
                    className="object-cover"
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
              </div>
            </div>

            {/* Design Info */}
            <div className="md:col-span-2 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">
                      {design?.title}
                    </h1>
                    <p className="text-gray-600 line-clamp-2">
                      {design?.description}
                    </p>
                  </div>
                  <Link
                    href={`/designs/${designId}`}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                  >
                    View Design →
                  </Link>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                    {design?.mainCategory?.name || "Uncategorized"}
                    {design?.subCategory && ` > ${design.subCategory.name}`}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      <span className="text-xl font-bold"> {
                        design.currencyDisplay
                      }</span>
                      {design?.discountedPrice &&
                      design.discountedPrice < design.basePrice
                        ? design.discountedPrice
                        : design.basePrice}
                    </span>
                    {design?.discountedPrice &&
                      design.discountedPrice < design.basePrice && (
                        <span className="text-xs text-gray-500 line-through">
                          ${design.basePrice}
                        </span>
                      )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border border-red-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    <span className="text-xs font-medium text-red-700">
                      Total Likes
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {design?.likesCount || 0}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
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
                    <span className="text-xs font-medium text-blue-700">
                      Downloads
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {design?.downloadCount || 0}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-purple-500" />
                    <span className="text-xs font-medium text-purple-700">
                      Unique Likers
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {pagination?.totalItems || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Likers Section */}
      <div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg">
            <Heart className="w-7 h-7 text-white fill-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">
              Users Who Liked This Design
            </h2>
            <p className="text-gray-600 mt-1">
              {pagination?.totalItems || 0} total{" "}
              {pagination?.totalItems === 1 ? "user" : "users"}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {likers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-300">
            <Heart className="w-12 h-12 text-gray-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            No Likes Yet
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            This design hasn&apos;t received any likes yet. Be the first to like
            it!
          </p>
        </div>
      ) : (
        <>
          {/* Likers List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Liked On
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {likers.map((liker: DesignLiker, index: number) => (
                    <tr
                      key={liker.user._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                              index % 5 === 0
                                ? "bg-gradient-to-br from-blue-500 to-blue-600"
                                : index % 5 === 1
                                ? "bg-gradient-to-br from-purple-500 to-purple-600"
                                : index % 5 === 2
                                ? "bg-gradient-to-br from-green-500 to-green-600"
                                : index % 5 === 3
                                ? "bg-gradient-to-br from-orange-500 to-orange-600"
                                : "bg-gradient-to-br from-pink-500 to-pink-600"
                            }`}
                          >
                            {liker.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {liker.user.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              ID: {liker.user._id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {liker.user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            liker.user.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {liker.user.role === "admin" && (
                            <Shield className="w-3 h-3" />
                          )}
                          {liker.user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(liker.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
