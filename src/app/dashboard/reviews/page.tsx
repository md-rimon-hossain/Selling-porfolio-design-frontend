"use client";

import { useState } from "react";
import {
  useGetMyPurchasesQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from "@/services/api";
import { Star, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MyReviewsPage() {
  const { data: purchasesData } = useGetMyPurchasesQuery({ limit: 100 });
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

  const purchases = purchasesData?.data || [];
  const purchasedDesigns = purchases
    .filter((p: any) => p.purchaseType === "individual" && p.design)
    .map((p: any) => p.design);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          const existingReview = design.reviews?.find(
            (r: any) => r.user === purchasesData?.user?._id
          );

          return (
            <div
              key={design._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {design.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {design.category?.name}
                  </p>
                </div>
                {existingReview && (
                  <div className="flex space-x-2">
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
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(existingReview._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {existingReview ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < existingReview.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {existingReview.rating}/5
                    </span>
                  </div>
                  {existingReview.title && (
                    <h4 className="font-medium text-gray-900 mb-1">
                      {existingReview.title}
                    </h4>
                  )}
                  <p className="text-gray-600 text-sm">
                    {existingReview.comment}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(existingReview.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm mb-3">
                    You haven&apos;t reviewed this design yet
                  </p>
                  <button
                    onClick={() => {
                      setFormData({ ...formData, designId: design._id });
                      setShowModal(true);
                    }}
                    className="text-blue-600 font-medium text-sm hover:underline"
                  >
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
            <a
              href="/designs"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-shadow"
            >
              Browse Designs
            </a>
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
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Brief summary of your review"
                  />
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Share your experience with this design"
                  />
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
