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
import { useToast } from "@/components/ToastProvider";
import { useConfirm } from "@/components/ConfirmProvider";

export default function DesignsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [mainCategoryFilter, setMainCategoryFilter] = useState<string>("");
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>("");
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
      mainCategory: mainCategoryFilter || undefined,
      subCategory: subCategoryFilter || undefined,
      complexityLevel: complexityFilter || undefined,
      minPrice,
      maxPrice,
    }),
    [
      page,
      searchTerm,
      statusFilter,
      mainCategoryFilter,
      subCategoryFilter,
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
  const toast = useToast();
  const { confirm } = useConfirm();

  const [showModal, setShowModal] = useState(false);
  const [editingDesign, setEditingDesign] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [previewImages, setPreviewImages] = useState<File[]>([]);
  const [downloadableFile, setDownloadableFile] = useState<File | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isGeneratingPreviews, setIsGeneratingPreviews] = useState(false);
  // Track existing preview image URLs the user marked for deletion
  const [deletePreviewImages, setDeletePreviewImages] = useState<string[]>([]);
  // Track whether user requested to delete the existing downloadable file
  const [deleteDownloadableFile, setDeleteDownloadableFile] = useState(false);

  // Tag input states
  const [tagInput, setTagInput] = useState("");
  const [usedToolsInput, setUsedToolsInput] = useState("");
  const [effectsInput, setEffectsInput] = useState("");
  const [formatsInput, setFormatsInput] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    mainCategory: "",
    subCategory: "",
    designType: "Logo",
    includedFormats: [] as string[],
    description: "",
    previewImageUrls: [] as string[],
    usedTools: [] as string[],
    effectsUsed: [] as string[],
    basePrice: 0,
    discountedPrice: 0,
    processDescription: "",
    complexityLevel: "Basic",
    tags: [] as string[],
    status: "Active", // Match backend default
  });

  const designs = data?.data || [];
  const categories = categoriesData?.data || [];

  // Tag handling functions
  const addTag = (
    field: "tags" | "usedTools" | "effectsUsed" | "includedFormats",
    tag: string
  ) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !formData[field].includes(trimmedTag)) {
      setFormData({
        ...formData,
        [field]: [...formData[field], trimmedTag],
      });
    }
  };

  const removeTag = (
    field: "tags" | "usedTools" | "effectsUsed" | "includedFormats",
    tagToRemove: string
  ) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((tag) => tag !== tagToRemove),
    });
  };

  const handleTagKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: "tags" | "usedTools" | "effectsUsed" | "includedFormats",
    inputValue: string,
    setInputValue: (value: string) => void
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(field, inputValue);
        setInputValue("");
      }
    } else if (
      e.key === "Backspace" &&
      !inputValue &&
      formData[field].length > 0
    ) {
      // Remove last tag when backspace is pressed on empty input
      removeTag(field, formData[field][formData[field].length - 1]);
    }
  };

  // Reset page to 1 when filters change
  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchTerm,
    statusFilter,
    mainCategoryFilter,
    subCategoryFilter,
    complexityFilter,
    minPrice,
    maxPrice,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.includedFormats || formData.includedFormats.length === 0) {
      toast.error("Please add at least one included format");
      return;
    }

    if (!formData.usedTools || formData.usedTools.length === 0) {
      toast.error("Please add at least one used tool");
      return;
    }

    if (!formData.effectsUsed || formData.effectsUsed.length === 0) {
      toast.error("Please add at least one effect used");
      return;
    }

    if (!formData.tags || formData.tags.length === 0) {
      toast.error("Please add at least one tag");
      return;
    }

    if (!previewImages  && designs.previewImageUrls.length === 0) {
      console.log(previewImages);
      toast.error("Please add at least one preview image");
      return;
    }

    if (!formData.mainCategory) {
      toast.error("Please select a main category");
      return;
    }

    if (!formData.subCategory) {
      toast.error("Please select a sub category");
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append all form fields except previewImageUrls (server generates this)
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "previewImageUrls") return; // Don't send this, server generates it

        if (Array.isArray(value)) {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, String(value));
        }
      });

      // Append files
      previewImages.forEach((file) => {
        formDataToSend.append("previewImages", file);
      });
      if (downloadableFile) {
        formDataToSend.append("files", downloadableFile);
      }

      // Append deletion flags so backend can delete existing assets when requested
      // send deletePreviewImages as JSON string (server preprocesses arrays)
      if (deletePreviewImages && deletePreviewImages.length > 0) {
        formDataToSend.append(
          "deletePreviewImages",
          JSON.stringify(deletePreviewImages)
        );
      }

      // Always include deleteDownloadableFile flag (backend will ignore if not relevant)
      formDataToSend.append(
        "deleteDownloadableFile",
        String(deleteDownloadableFile)
      );

      if (editingDesign) {
        await updateDesign({
          id: editingDesign._id,
          data: formDataToSend,
        }).unwrap();
        toast.success("Design updated successfully!");
      } else {
        await createDesign(formDataToSend).unwrap();
        toast.success("Design created successfully!");
      }
      handleCloseModal();
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "An error occurred");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setMainCategoryFilter("");
    setSubCategoryFilter("");
    setComplexityFilter("");
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setPage(1);
  };

  const handleEdit = (design: any) => {
    setEditingDesign(design);
    setFormData({
      title: design.title,
      mainCategory: design.mainCategory?._id || design.mainCategory,
      subCategory: design.subCategory?._id || design.subCategory,
      designType: design.designType,
      includedFormats: design.includedFormats || [],
      description: design.description,
      previewImageUrls: design.previewImageUrls || [],
      usedTools: design.usedTools || [],
      effectsUsed: design.effectsUsed || [],
      basePrice: design.basePrice,
      discountedPrice: design.discountedPrice || 0,
      processDescription: design.processDescription,
      complexityLevel: design.complexityLevel,
      tags: design.tags || [],
      status: design.status,
    });
    // Set existing image previews for editing
    setImagePreviews(design.previewImageUrls || []);
    setIsGeneratingPreviews(false);
    setTagInput("");
    setUsedToolsInput("");
    setEffectsInput("");
    setFormatsInput("");
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm(
      "Are you sure you want to delete this design?",
      { title: "Delete design" }
    );
    if (!confirmed) return;

    try {
      await deleteDesign(id).unwrap();
      toast.success("Design deleted successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "An error occurred");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDesign(null);
    setPreviewImages([]);
    setDownloadableFile(null);
    setImagePreviews([]);
    setIsGeneratingPreviews(false);
    setTagInput("");
    setUsedToolsInput("");
    setEffectsInput("");
    setFormatsInput("");
    setFormData({
      title: "",
      mainCategory: "",
      subCategory: "",
      designType: "Logo",
      includedFormats: [],
      description: "",
      previewImageUrls: [],
      usedTools: [],
      effectsUsed: [],
      basePrice: 0,
      discountedPrice: 0,
      processDescription: "",
      complexityLevel: "Basic",
      tags: [],
      status: "Pending", // Match backend default
    });
  };



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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            value={mainCategoryFilter}
            onChange={(e) => {
              setMainCategoryFilter(e.target.value);
              setSubCategoryFilter(""); // Reset sub when main changes
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent appearance-none"
          >
            <option value="">All Main Categories</option>
            {categories
              .filter((cat: any) => !cat.parentCategory)
              .map((cat: any) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
          </select>
          <select
            value={subCategoryFilter}
            onChange={(e) => setSubCategoryFilter(e.target.value)}
            disabled={!mainCategoryFilter}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">All Sub Categories</option>
            {categories
              .filter(
                (cat: any) =>
                  cat.parentCategory &&
                  cat.parentCategory._id === mainCategoryFilter
              )
              .map((cat: any) => (
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
            mainCategoryFilter ||
            subCategoryFilter ||
            complexityFilter ||
            minPrice ||
            maxPrice
              ? "Try adjusting your filters to see more results."
              : "Get started by creating your first design."}
          </p>
          {!searchTerm &&
            !statusFilter &&
            !mainCategoryFilter &&
            !subCategoryFilter && (
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
                {design.previewImageUrls &&
                design.previewImageUrls.length > 0 ? (
                  <Image
                    src={design.previewImageUrls[0]}
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
                  {design.mainCategory?.name || "No category"}
                  {design.subCategory && ` > ${design.subCategory.name}`}
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
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-blue-600">
                      $
                      {design.discountedPrice &&
                      design.discountedPrice < design.basePrice
                        ? design.discountedPrice
                        : design.basePrice}
                    </span>
                    {design.discountedPrice &&
                      design.discountedPrice < design.basePrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${design.basePrice}
                        </span>
                      )}
                  </div>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {editingDesign ? "✏️ Edit Design" : "🎨 Create New Design"}
                  </h2>
                  <p className="text-blue-100 mt-1">
                    {editingDesign
                      ? "Update your design details"
                      : "Share your creative work with the world"}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter design title..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Design Type *
                    </label>
                    <select
                      required
                      value={formData.designType}
                      onChange={(e) =>
                        setFormData({ ...formData, designType: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    >
                      <option value="">Select design type</option>
                      <option value="Logo">Logo</option>
                      <option value="Poster">Poster</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Presentation">Presentation</option>
                      <option value="Print/Packaging">Print/Packaging</option>
                      <option value="Illustration/Art">Illustration/Art</option>
                      <option value="Social Media Graphic">
                        Social Media Graphic
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Category *
                    </label>
                    <select
                      required
                      value={formData.mainCategory}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          mainCategory: e.target.value,
                          subCategory: "", // Reset subCategory when mainCategory changes
                        });
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    >
                      <option value="">Select main category</option>
                      {categories.map((cat: any) => (
                        <option
                          key={cat._id || cat.id}
                          value={cat._id || cat.id}
                        >
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sub Category *
                    </label>
                    <select
                      required
                      value={formData.subCategory}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subCategory: e.target.value,
                        })
                      }
                      disabled={!formData.mainCategory}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Select sub category</option>
                      {formData.mainCategory &&
                        categories
                          .find(
                            (cat: any) =>
                              (cat._id || cat.id) === formData.mainCategory
                          )
                          ?.subcategories?.map((subcat: any) => (
                            <option
                              key={subcat._id || subcat.id}
                              value={subcat._id || subcat.id}
                            >
                              {subcat.name}
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                    placeholder="Describe your design in detail..."
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Price *
                    </label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      min="0"
                      value={formData.basePrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          basePrice: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discounted Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.discountedPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountedPrice: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Included Formats *
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formatsInput}
                      onChange={(e) =>
                        setFormatsInput(e.target.value.toUpperCase())
                      }
                      onKeyDown={(e) =>
                        handleTagKeyDown(
                          e,
                          "includedFormats",
                          formatsInput,
                          setFormatsInput
                        )
                      }
                      placeholder="e.g., PSD, AI, JPG, PNG, PDF..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                    <div className="text-xs text-gray-500 space-y-1">
                      <p className="font-medium">
                        Common design formats Example:
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 text-xs">
                        <span>• AI (Adobe Illustrator)</span>
                        <span>• PSD (Photoshop)</span>
                        <span>• SVG (Scalable Vector)</span>
                        <span>• PDF (Portable Document)</span>
                        <span>• EPS (Encapsulated PostScript)</span>
                        <span>• PNG (Portable Network Graphics)</span>
                        <span>• JPG/JPEG (Joint Photographic)</span>
                        <span>• SKETCH (Sketch App)</span>
                        <span>• FIG (Figma)</span>
                        <span>• CDR (CorelDRAW)</span>
                      </div>
                    </div>
                    {formData.includedFormats.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.includedFormats.map((format, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full"
                          >
                            {format}
                            <button
                              type="button"
                              onClick={() =>
                                removeTag("includedFormats", format)
                              }
                              className="ml-1 text-orange-600 hover:text-orange-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview Images *
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const newFiles = Array.from(e.target.files || []);

                        // Check for duplicates and limit total images
                        const existingFiles = previewImages;
                        const combinedFiles = [...existingFiles];
                        let skippedDuplicates = 0;
                        let skippedLimit = 0;

                        // Add new files, avoiding duplicates
                        newFiles.forEach((newFile) => {
                          const isDuplicate = combinedFiles.some(
                            (existingFile) =>
                              existingFile.name === newFile.name &&
                              existingFile.size === newFile.size
                          );
                          if (isDuplicate) {
                            skippedDuplicates++;
                          } else if (combinedFiles.length < 5) {
                            combinedFiles.push(newFile);
                          } else {
                            skippedLimit++;
                          }
                        });

                        // Show feedback for skipped files
                        if (skippedDuplicates > 0) {
                          toast.warning(
                            `${skippedDuplicates} duplicate image${
                              skippedDuplicates > 1 ? "s" : ""
                            } skipped`
                          );
                        }
                        if (skippedLimit > 0) {
                          toast.warning(
                            `Maximum 5 images allowed. ${skippedLimit} image${
                              skippedLimit > 1 ? "s" : ""
                            } skipped`
                          );
                        }

                        setPreviewImages(combinedFiles);

                        // Clear existing previews first
                        setImagePreviews([]);
                        setIsGeneratingPreviews(true);

                        // Generate image previews with proper error handling
                        if (combinedFiles.length > 0) {
                          const previewPromises = combinedFiles.map(
                            (file, index) => {
                              return new Promise<string>((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  if (e.target?.result) {
                                    resolve(e.target.result as string);
                                  } else {
                                    reject(
                                      new Error(
                                        `Failed to read file ${file.name}`
                                      )
                                    );
                                  }
                                };
                                reader.onerror = () => {
                                  reject(
                                    new Error(`Error reading file ${file.name}`)
                                  );
                                };
                                reader.readAsDataURL(file);
                              });
                            }
                          );

                          // Wait for all previews to be generated
                          Promise.all(previewPromises)
                            .then((previews) => {
                              setImagePreviews(previews);
                              setIsGeneratingPreviews(false);
                            })
                            .catch((error) => {
                              console.error(
                                "Error generating previews:",
                                error
                              );
                              // Still show what we can
                              setImagePreviews([]);
                              setIsGeneratingPreviews(false);
                            });
                        } else {
                          setImagePreviews([]);
                          setIsGeneratingPreviews(false);
                        }

                        // Reset the input value to allow selecting the same file again
                        e.target.value = "";
                      }}
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent hover:border-blue-400 transition-colors"
                    />
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                              <Image
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                // If this preview is a data URL, it's a newly selected File.
                                // If it's a remote URL (http/https), it's an existing preview that must be marked for deletion.
                                const isDataUrl =
                                  String(preview).startsWith("data:");

                                if (isDataUrl) {
                                  // Remove the corresponding File entry (by index among previewImages)
                                  const newFiles = previewImages.filter(
                                    (_, i) => i !== index
                                  );
                                  const newPreviews = imagePreviews.filter(
                                    (_, i) => i !== index
                                  );
                                  setPreviewImages(newFiles);
                                  setImagePreviews(newPreviews);
                                } else {
                                  // Existing URL: mark for deletion and remove from visible previews
                                  setDeletePreviewImages((prev) => [
                                    ...prev,
                                    preview,
                                  ]);
                                  const newPreviews = imagePreviews.filter(
                                    (_, i) => i !== index
                                  );
                                  setImagePreviews(newPreviews);
                                  // Also if there are no previewFiles selected, ensure previewImages stays empty
                                  if (
                                    previewImages.length > newPreviews.length
                                  ) {
                                    setPreviewImages((prev) =>
                                      prev.slice(0, newPreviews.length)
                                    );
                                  }
                                }
                              }}
                              className="absolute hover:cursor-pointer -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {isGeneratingPreviews && (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">
                          Generating previews...
                        </span>
                      </div>
                    )}
                    <p className="text-sm text-gray-600">
                      {previewImages.length > 0
                        ? `${previewImages.length} image${
                            previewImages.length > 1 ? "s" : ""
                          } selected (${
                            previewImages.reduce(
                              (total, file) => total + file.size,
                              0
                            ) /
                              1024 /
                              1024 <
                            1
                              ? `${(
                                  previewImages.reduce(
                                    (total, file) => total + file.size,
                                    0
                                  ) / 1024
                                ).toFixed(1)} KB`
                              : `${(
                                  previewImages.reduce(
                                    (total, file) => total + file.size,
                                    0
                                  ) /
                                  1024 /
                                  1024
                                ).toFixed(1)} MB`
                          })`
                        : "Add up to 5 preview images (PNG, JPG, JPEG, GIF, WebP) - you can add them one by one"}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Downloadable File *
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept=".zip,.rar,.psd,.ai,.jpg,.png,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setDownloadableFile(file || null);
                      }}
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent hover:border-blue-400 transition-colors"
                    />
                    {/* Show newly selected downloadable file (file input) */}
                    {downloadableFile && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          {downloadableFile.type.includes("zip") ||
                          downloadableFile.type.includes("rar") ? (
                            <svg
                              className="w-5 h-5 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                              />
                            </svg>
                          ) : downloadableFile.type.includes("pdf") ? (
                            <svg
                              className="w-5 h-5 text-red-600"
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
                          ) : downloadableFile.type.includes("photoshop") ||
                            downloadableFile.name
                              .toLowerCase()
                              .endsWith(".psd") ? (
                            <svg
                              className="w-5 h-5 text-purple-600"
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
                          ) : (
                            <svg
                              className="w-5 h-5 text-gray-600"
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
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {downloadableFile.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {downloadableFile.size / 1024 / 1024 < 1
                              ? `${(downloadableFile.size / 1024).toFixed(
                                  1
                                )} KB`
                              : `${(
                                  downloadableFile.size /
                                  1024 /
                                  1024
                                ).toFixed(1)} MB`}{" "}
                            • {downloadableFile.type || "Unknown type"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            // User removed the newly selected file
                            setDownloadableFile(null);
                            // ensure we don't accidentally send a delete flag for existing file when a new file was selected and then removed
                            setDeleteDownloadableFile(false);
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )}

                    {/* If editing an existing design and there's an existing downloadable file, show it with delete option */}
                    {!downloadableFile &&
                      editingDesign?.downloadableFile &&
                      !deleteDownloadableFile && (
                        <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                              />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {editingDesign.downloadableFile?.secure_url
                                ?.split("/")
                                .pop() ||
                                editingDesign.downloadableFile?.public_id}
                            </p>
                            <p className="text-xs text-gray-600">
                              {editingDesign.downloadableFile?.file_size
                                ? `${(
                                    Number(
                                      editingDesign.downloadableFile.file_size
                                    ) /
                                    1024 /
                                    1024
                                  ).toFixed(1)} MB`
                                : "Unknown size"}{" "}
                              •{" "}
                              {editingDesign.downloadableFile?.file_format ||
                                "Unknown format"}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              // Mark existing downloadable file for deletion
                              setDeleteDownloadableFile(true);
                              // Also clear any newly selected file (shouldn't be present)
                              setDownloadableFile(null);
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    <p className="text-sm text-gray-600">
                      {!downloadableFile
                        ? "Select a downloadable file (ZIP, RAR, PSD, AI, PDF, PNG, JPG)"
                        : "File ready for upload"}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags *
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) =>
                        handleTagKeyDown(e, "tags", tagInput, setTagInput)
                      }
                      placeholder="Type a tag and press Enter or comma..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag("tags", tag)}
                              className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Used Tools *
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={usedToolsInput}
                      onChange={(e) => setUsedToolsInput(e.target.value)}
                      onKeyDown={(e) =>
                        handleTagKeyDown(
                          e,
                          "usedTools",
                          usedToolsInput,
                          setUsedToolsInput
                        )
                      }
                      placeholder="Type a tool and press Enter or comma..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                    {formData.usedTools.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.usedTools.map((tool, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                          >
                            {tool}
                            <button
                              type="button"
                              onClick={() => removeTag("usedTools", tool)}
                              className="ml-1 text-purple-600 hover:text-purple-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Effects Used *
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={effectsInput}
                      onChange={(e) => setEffectsInput(e.target.value)}
                      onKeyDown={(e) =>
                        handleTagKeyDown(
                          e,
                          "effectsUsed",
                          effectsInput,
                          setEffectsInput
                        )
                      }
                      placeholder="Type an effect and press Enter or comma..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                    {formData.effectsUsed.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.effectsUsed.map((effect, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                          >
                            {effect}
                            <button
                              type="button"
                              onClick={() => removeTag("effectsUsed", effect)}
                              className="ml-1 text-green-600 hover:text-green-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    onClick={handleCloseModal}
                    variant="outline"
                    className="px-6 py-2.5 border-gray-300 text-gray-700 hover:bg-gray-50"
                    disabled={isCreating || isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    disabled={isCreating || isUpdating}
                  >
                    {isCreating || isUpdating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {editingDesign
                          ? "Updating Design..."
                          : "Creating Design..."}
                      </>
                    ) : (
                      <>
                        <span className="mr-2">
                          {editingDesign ? "✨" : "🚀"}
                        </span>
                        {editingDesign ? "Update Design" : "Create Design"}
                      </>
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
