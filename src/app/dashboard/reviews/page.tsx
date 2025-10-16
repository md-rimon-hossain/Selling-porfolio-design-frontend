/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import {
  useGetMyPurchasesQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetReviewsQuery,
} from "@/services/api";
import { Star, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function MyReviewsPage() {
  const { data: purchasesData } = useGetMyPurchasesQuery({
    limit: 100,
    status: "completed",
  });
  const { data: reviewsData } = useGetReviewsQuery({
    page: 1,
    limit: 100,
  });

  const [createReview] = useCreateReviewMutation();
  const [updateReview] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [formData, setFormData] = useState({
    designId: "",
    rating: 5,
    title: "",
    comment: "",
  });

  const purchases = useMemo(() => purchasesData?.data || [], [purchasesData]);
  const myReviews = useMemo(() => reviewsData?.data || [], [reviewsData]);

  // Get all purchased designs (individual and from active subscriptions)
  const purchasedDesigns = useMemo(() => {
    const designs: any[] = [];
    const designIds = new Set<string>();

    purchases.forEach((p: any) => {
      if (
        p.purchaseType === "individual" &&
        p.design &&
        !designIds.has(p.design._id)
      ) {
        designs.push(p.design);
        designIds.add(p.design._id);
      }
    });

    return designs;
  }, [purchases]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate comment length (min 10 chars as per backend)
    if (formData.comment.trim().length < 10) {
      alert("Comment must be at least 10 characters long");
      return;
    }

    // Validate title if provided (min 5 chars as per backend)
    if (formData.title && formData.title.trim().length < 5) {
      alert("Review title must be at least 5 characters long");
      return;
    }

    try {
      if (editingReview) {
        await updateReview({ id: editingReview._id, ...formData }).unwrap();
        alert("Review updated successfully!");
      } else {
        await createReview(formData).unwrap();
        alert("Review created successfully!");
      }
      handleCloseModal();
    } catch (error: any) {
      alert(error?.data?.message || "An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview(id).unwrap();
      alert("Review deleted successfully!");
    } catch (error: any) {
      alert(error?.data?.message || "An error occurred");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingReview(null);
    setFormData({
      designId: "",
      rating: 5,
      title: "",
      comment: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
          <p className="mt-2 text-gray-600">
            Share your thoughts on purchased designs
          </p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Write Review
        </Button>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 gap-6">
        {purchasedDesigns.map((design: any) => {
          const existingReview = myReviews.find(
            (r: any) => r.design?._id === design._id
          );

          return (
            <div
              key={design._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Design Header with Image */}
              <div className="flex items-start gap-4 p-6 border-b border-gray-100">
                {design.previewImageUrl && (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-600">
                    <Image
                      src={design.previewImageUrl}
                      alt={design.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <Link href={`/designs/${design._id}`}>
                    <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors">
                      {design.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-gray-500">
                      {design.category?.name}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      ${design.price}
                    </span>
                  </div>
                  {design.totalReviews > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < Math.round(design.averageRating || 0)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {design.averageRating?.toFixed(1)} (
                        {design.totalReviews} reviews)
                      </span>
                    </div>
                  )}
                </div>
                {existingReview && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        setEditingReview(existingReview);
                        setFormData({
                          designId: design._id,
                          rating: existingReview.rating,
                          title: existingReview.title || "",
                          comment: existingReview.comment,
                        });
                        setShowModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit review"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(existingReview._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Review Content */}
              {existingReview ? (
                <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < existingReview.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-base font-bold text-gray-900">
                        {existingReview.rating}/5
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(existingReview.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  {existingReview.title && (
                    <h4 className="font-bold text-gray-900 mb-2 text-base">
                      {existingReview.title}
                    </h4>
                  )}
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {existingReview.comment}
                  </p>
                  {existingReview.updatedAt !== existingReview.createdAt && (
                    <p className="text-xs text-gray-500 mt-3 italic">
                      Edited on{" "}
                      {new Date(existingReview.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center bg-gray-50">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm mb-4">
                    You haven&apos;t reviewed this design yet
                  </p>
                  <button
                    onClick={() => {
                      setFormData({
                        designId: design._id,
                        rating: 5,
                        title: "",
                        comment: "",
                      });
                      setShowModal(true);
                    }}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium text-sm rounded-lg hover:shadow-lg transition-shadow"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Write a review
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {purchasedDesigns.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No purchased designs
            </h3>
            <p className="text-gray-500 mb-6">
              Purchase designs to leave reviews!
            </p>
            <Link
              href="/designs"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-shadow"
            >
              Browse Designs
            </Link>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingReview ? "Edit Review" : "Write Review"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!formData.designId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Design *
                    </label>
                    <select
                      required
                      value={formData.designId}
                      onChange={(e) =>
                        setFormData({ ...formData, designId: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    >
                      <option value="">Choose a design</option>
                      {purchasedDesigns.map((design: any) => (
                        <option key={design._id} value={design._id}>
                          {design.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating *
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            rating <= formData.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    minLength={5}
                    maxLength={100}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Brief summary of your review (min 5 chars)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.title.length}/100 characters
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.comment}
                    onChange={(e) =>
                      setFormData({ ...formData, comment: e.target.value })
                    }
                    minLength={10}
                    maxLength={1000}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Share your experience with this design (min 10 chars)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.comment.length}/1000 characters
                  </p>
                </div>
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    onClick={handleCloseModal}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {editingReview ? "Update" : "Submit"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
