/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import {
  useGetDesignsQuery,
  useGetCategoriesQuery,
  useCreateDesignMutation,
  useUpdateDesignMutation,
  useDeleteDesignMutation,
} from "@/services/api";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Image as ImageIcon,
  Heart,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function DesignsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [complexityFilter, setComplexityFilter] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();

  // Memoize query parameters to ensure proper refetching
  const queryParams = useMemo(
    () => ({
      page,
      limit: 10,
      search: searchTerm || undefined,
      status: statusFilter || undefined,
      category: categoryFilter || undefined,
      complexityLevel: complexityFilter || undefined,
      minPrice,
      maxPrice,
    }),
    [
      page,
      searchTerm,
      statusFilter,
      categoryFilter,
      complexityFilter,
      minPrice,
      maxPrice,
    ]
  );

  const { data, isLoading, refetch } = useGetDesignsQuery(queryParams);
  const { data: categoriesData } = useGetCategoriesQuery();
  const [createDesign, { isLoading: isCreating }] = useCreateDesignMutation();
  const [updateDesign, { isLoading: isUpdating }] = useUpdateDesignMutation();
  const [deleteDesign] = useDeleteDesignMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingDesign, setEditingDesign] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    previewImageUrl: "",
    designerName: "",
    usedTools: [] as string[],
    effectsUsed: [] as string[],
    price: 0,
    processDescription: "",
    complexityLevel: "Basic",
    tags: [] as string[],
    status: "Active",
  });

  const designs = data?.data || [];
  const categories = categoriesData?.data || [];

  // Reset page to 1 when filters change
  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchTerm,
    statusFilter,
    categoryFilter,
    complexityFilter,
    minPrice,
    maxPrice,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDesign) {
        await updateDesign({
          id: editingDesign._id,
          data: formData,
        }).unwrap();
        alert("Design updated successfully!");
      } else {
        await createDesign(formData).unwrap();
        alert("Design created successfully!");
      }
      handleCloseModal();
    } catch (error: any) {
      alert(error?.data?.message || "An error occurred");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setCategoryFilter("");
    setComplexityFilter("");
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setPage(1);
  };

  const handleEdit = (design: any) => {
    setEditingDesign(design);
    setFormData({
      title: design.title,
      category: design.category?._id || design.category,
      description: design.description,
      previewImageUrl: design.previewImageUrl,
      designerName: design.designerName,
      usedTools: design.usedTools || [],
      effectsUsed: design.effectsUsed || [],
      price: design.price,
      processDescription: design.processDescription,
      complexityLevel: design.complexityLevel,
      tags: design.tags || [],
      status: design.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this design?")) return;
    try {
      await deleteDesign(id).unwrap();
      alert("Design deleted successfully!");
    } catch (error: any) {
      alert(error?.data?.message || "An error occurred");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDesign(null);
    setFormData({
      title: "",
      category: "",
      description: "",
      previewImageUrl: "",
      designerName: "",
      usedTools: [],
      effectsUsed: [],
      price: 0,
      processDescription: "",
      complexityLevel: "Basic",
      tags: [],
      status: "Active",
    });
  };

  console.log(formData.price);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Designs</h1>
          <p className="mt-2 text-gray-600">
            Manage design portfolio ({data?.pagination?.totalItems || 0} total)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => refetch()}
            disabled={isLoading}
            variant="outline"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? "Hide" : "Show"} Filters
          </Button>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Design
          </Button>
        </div>
      </div>

      {/* Basic Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search designs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent appearance-none"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent appearance-none"
          >
            <option value="">All Categories</option>
            {categories.map((cat: any) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Advanced Filters
            </h3>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Complexity Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complexity Level
              </label>
              <select
                value={complexityFilter}
                onChange={(e) => setComplexityFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="">All Levels</option>
                <option value="Basic">Basic</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Price ($)
              </label>
              <input
                type="number"
                value={minPrice || ""}
                onChange={(e) =>
                  setMinPrice(
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                placeholder="0.00"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price ($)
              </label>
              <input
                type="number"
                value={maxPrice || ""}
                onChange={(e) =>
                  setMaxPrice(
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                placeholder="999.99"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Designs Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : designs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No designs found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ||
            statusFilter ||
            categoryFilter ||
            complexityFilter ||
            minPrice ||
            maxPrice
              ? "Try adjusting your filters to see more results."
              : "Get started by creating your first design."}
          </p>
          {!searchTerm && !statusFilter && !categoryFilter && (
            <Button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Design
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((design: any) => (
            <div
              key={design._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 bg-gray-100">
                {design.previewImageUrl ? (
                  <Image
                    src={design.previewImageUrl}
                    alt={design.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      design.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : design.status === "Draft"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {design.status}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1 truncate">
                  {design.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {design.category?.name || "No category"}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {design.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                      {design.likesCount || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
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
                      {design.downloadCount || 0}
                    </span>
                  </div>
                  {design.likesCount > 0 && (
                    <Link
                      href={`/admin/designs/${design._id}/likers`}
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      <Heart className="w-3 h-3" />
                      View Likers
                    </Link>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">
                    ${design.price}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(design)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(design._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            variant="outline"
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-gray-700">
            Page {page} of {data.pagination.totalPages}
          </span>
          <Button
            onClick={() => setPage(page + 1)}
            disabled={page >= data.pagination.totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full my-8">
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingDesign ? "Edit Design" : "Add New Design"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat: any) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Designer Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.designerName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          designerName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.previewImageUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        previewImageUrl: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Complexity Level *
                    </label>
                    <select
                      required
                      value={formData.complexityLevel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          complexityLevel: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    >
                      <option value="Basic">Basic</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    >
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags.join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tags: e.target.value.split(",").map((t) => t.trim()),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Used Tools (comma separated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.usedTools.join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        usedTools: e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter((t) => t),
                      })
                    }
                    placeholder="Photoshop, Illustrator, Figma"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Effects Used (comma separated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.effectsUsed.join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        effectsUsed: e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter((t) => t),
                      })
                    }
                    placeholder="Gradient, Shadow, Blur"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Process Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.processDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        processDescription: e.target.value,
                      })
                    }
                    placeholder="Describe the design process and techniques used..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    onClick={handleCloseModal}
                    variant="outline"
                    className="flex-1"
                    disabled={isCreating || isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isCreating || isUpdating}
                  >
                    {isCreating || isUpdating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {editingDesign ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>{editingDesign ? "Update" : "Create"}</>
                    )}
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
