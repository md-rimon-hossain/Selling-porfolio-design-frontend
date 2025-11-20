"use client";

import { useState } from "react";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/services/api";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  Tags,
  Loader2,
  AlertCircle,
  Calendar,
  Filter,
  X,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ICategory {
  id: string;
  name: string;
  slug?: string;
  parentCategory: ICategory | null;
  description: string;
  isActive: boolean;
  subcategories?: ICategory[];
  createdAt: string;
  updatedAt: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  categoryType?: string;
}

import { useEffect, useRef } from "react";
import { useToast } from "@/components/ToastProvider";
// Simple debounce hook for search
// ...existing code...
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function CategoriesPage() {
  // Tab state: 'parent', 'sub' or 'all'
  const [activeTab, setActiveTab] = useState<"parent" | "sub" | "all">("all");
  // Track if modal is for subcategory creation
  const [isSubcategoryMode, setIsSubcategoryMode] = useState(false);

  const toast = useToast();
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  // ...existing code...
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  // Fetch categories with pagination and search
  // If your RTK Query API doesn't support params, fallback to local filtering
  const { data, isLoading, refetch } = useGetCategoriesQuery({
    page,
    limit,
    search: debouncedSearchTerm,
  } as any);

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
    parentCategory: null as string | null,
    categoryType: "design" as "design" | "course",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const categories: ICategory[] = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 20, pages: 1 };

  // Apply filters
  // Only filter by status, search is handled by backend
  const filteredCategories = categories.filter((cat) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && cat.isActive) ||
      (statusFilter === "inactive" && !cat.isActive);
    return matchesStatus;
  });
  // No console logs or dead code

  // Validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Category name is required";
    } else if (formData.name.length < 2) {
      errors.name = "Category name must be at least 2 characters long";
    } else if (formData.name.length > 50) {
      errors.name = "Category name cannot exceed 50 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      errors.name = "Category name can only contain letters and spaces";
    }

    // Description validation
    if (!formData.description.trim()) {
      errors.description = "Category description is required";
    } else if (formData.description.length < 10) {
      errors.description = "Description must be at least 10 characters long";
    } else if (formData.description.length > 200) {
      errors.description = "Description cannot exceed 200 characters";
    }

    // Category type validation
    if (!formData.categoryType) {
      errors.categoryType = "Category type is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    try {
      if (editingCategory) {
        const updateData = {
          id: editingCategory.id,
          name: formData.name,
          description: formData.description,
          isActive: formData.isActive,
          parentCategory: formData.parentCategory,
          categoryType: formData.categoryType,
        };
        await updateCategory(updateData).unwrap();
        toast.success("Category updated successfully!");
      } else {
        await createCategory(formData).unwrap();
        toast.success("Category created successfully!");
      }
      setShowModal(false);
      setFormData({
        name: "",
        description: "",
        isActive: true,
        parentCategory: null,
        categoryType: "design",
      });
      setEditingCategory(null);
      setFormErrors({});
      refetch();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const error = err as { data?: { message?: string }; message?: string };
      setError(
        error?.data?.message ||
          error?.message ||
          "An error occurred while saving category"
      );
    }
  };

  const handleEdit = (category: ICategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      parentCategory: category.parentCategory?.id || null,
      categoryType: (category as any).categoryType || "design",
    });
    setFormErrors({});
    setError(null);
    setShowModal(true);
  };

  const handleDeleteClick = (id: string) => {
    setCategoryToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    setError(null);
    try {
      await deleteCategory(categoryToDelete).unwrap();
      setSuccess("Category deleted successfully!");
      setShowDeleteConfirm(false);
      setCategoryToDelete(null);
      refetch();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const error = err as { data?: { message?: string }; message?: string };
      setError(
        error?.data?.message ||
          error?.message ||
          "An error occurred while deleting category"
      );
      setShowDeleteConfirm(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      isActive: true,
      parentCategory: null,
      categoryType: "design",
    });
    setFormErrors({});
    setError(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="min-h-screen ">
        <div className=" mx-auto px-6 space-y-6">
          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>{success}</span>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <Tags className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Categories Management
                  </h1>
                  <p className="text-slate-600 mt-1">
                    Organize and manage design categories
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setEditingCategory(null);
                    setFormData({
                      name: "",
                      description: "",
                      isActive: true,
                      parentCategory: null,
                      categoryType: "design",
                    });
                    setFormErrors({});
                    setError(null);
                    setShowModal(true);
                    setIsSubcategoryMode(false);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Parent Category
                </Button>
                <Button
                  onClick={() => {
                    setEditingCategory(null);
                    setFormData({
                      name: "",
                      description: "",
                      isActive: true,
                      parentCategory: "",
                      categoryType: "design",
                    });
                    setFormErrors({});
                    setError(null);
                    setShowModal(true);
                    setIsSubcategoryMode(true);
                  }}
                  // Track if modal is for subcategory creation

                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Subcategory
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                <div className="text-sm text-blue-600 font-medium">
                  Total Categories
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {categories.length +
                    categories.flatMap((cat) => cat.subcategories || []).length}
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                <div className="text-sm text-green-600 font-medium">Active</div>
                <div className="text-2xl font-bold text-green-900">
                  {categories.filter((c: ICategory) => c.isActive).length +
                    categories
                      .flatMap((cat) => cat.subcategories || [])
                      .filter((s: ICategory) => s.isActive).length}
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                <div className="text-sm text-orange-600 font-medium">
                  Inactive
                </div>
                <div className="text-2xl font-bold text-orange-900">
                  {categories.filter((c: ICategory) => !c.isActive).length +
                    categories
                      .flatMap((cat) => cat.subcategories || [])
                      .filter((s: ICategory) => !s.isActive).length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        {/* Tabs for Parent/Subcategories/All */}
        <div className="mt-8 flex gap-2 px-6">
          <Button
            variant={activeTab === "all" ? "default" : "outline"}
            onClick={() => setActiveTab("all")}
            className={activeTab === "all" ? "font-bold" : ""}
          >
            All Categories
          </Button>
          <Button
            variant={activeTab === "parent" ? "default" : "outline"}
            onClick={() => setActiveTab("parent")}
            className={activeTab === "parent" ? "font-bold" : ""}
          >
            Parent Categories
          </Button>
          <Button
            variant={activeTab === "sub" ? "default" : "outline"}
            onClick={() => setActiveTab("sub")}
            className={activeTab === "sub" ? "font-bold" : ""}
          >
            Subcategories
          </Button>
        </div>
        {/* Categories Table */}
        <div className="  overflow-hidden mt-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-3 text-slate-600">Loading categories...</span>
            </div>
          ) : (
            <>
              {/* Refactored tab logic for new backend response */}
              {activeTab === "all" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {/* All Parent Categories */}
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="bg-white border border-slate-200 rounded-xl shadow p-6 flex flex-col gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <Tags className="w-8 h-8 text-blue-600" />
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">
                            {category.name}
                          </h3>
                          <p className="text-xs text-slate-500">
                            ID: {category.id?.slice(-8)} | Parent Category
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">
                        {category.description}
                      </p>
                      <div className="flex gap-2 text-xs">
                        <span
                          className={
                            category.isActive
                              ? "bg-green-100 text-green-800 px-2 py-1 rounded"
                              : "bg-red-100 text-red-800 px-2 py-1 rounded"
                          }
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                        <span className="text-slate-400">
                          Created: {formatDate(category.createdAt)}
                        </span>
                      </div>
                      {category.subcategories &&
                        category.subcategories.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-indigo-600 font-medium">
                              Subcategories:
                            </span>
                            <ul className="ml-2 list-disc text-xs text-slate-500">
                              {category.subcategories.map((sub) => (
                                <li key={sub.id}>{sub.name}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteClick(category.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                  {/* All Subcategories */}
                  {categories
                    .flatMap((cat) => cat.subcategories || [])
                    .map((subcat) => (
                      <div
                        key={subcat.id}
                        className="bg-white border border-slate-200 rounded-xl shadow p-6 flex flex-col gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <Tags className="w-8 h-8 text-indigo-600" />
                          <div>
                            <h3 className="font-bold text-lg text-slate-900">
                              {subcat.name}
                            </h3>
                            <p className="text-xs text-slate-500">
                              ID: {subcat.id?.slice(-8)} | Subcategory
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600">
                          {subcat.description}
                        </p>
                        <div className="flex gap-2 text-xs">
                          <span
                            className={
                              subcat.isActive
                                ? "bg-green-100 text-green-800 px-2 py-1 rounded"
                                : "bg-red-100 text-red-800 px-2 py-1 rounded"
                            }
                          >
                            {subcat.isActive ? "Active" : "Inactive"}
                          </span>
                          <span className="text-slate-400">
                            Created: {formatDate(subcat.createdAt)}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          <span className="font-medium text-slate-700">
                            Parent:
                          </span>{" "}
                          {subcat.parentCategory?.name || "Unknown"}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(subcat)}
                          >
                            <Edit className="w-4 h-4 mr-1" /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteClick(subcat.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  {categories.length === 0 &&
                    categories.flatMap((cat) => cat.subcategories || [])
                      .length === 0 && (
                      <div className="col-span-full text-center text-slate-500 py-12">
                        No categories found.
                      </div>
                    )}
                </div>
              ) : activeTab === "parent" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="bg-white border border-slate-200 rounded-xl shadow p-6 flex flex-col gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <Tags className="w-8 h-8 text-blue-600" />
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">
                            {category.name}
                          </h3>
                          <p className="text-xs text-slate-500">
                            ID: {category.id?.slice(-8)}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">
                        {category.description}
                      </p>
                      <div className="flex gap-2 text-xs">
                        <span
                          className={
                            category.isActive
                              ? "bg-green-100 text-green-800 px-2 py-1 rounded"
                              : "bg-red-100 text-red-800 px-2 py-1 rounded"
                          }
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                        <span className="text-slate-400">
                          Created: {formatDate(category.createdAt)}
                        </span>
                      </div>
                      {category.subcategories &&
                        category.subcategories.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-indigo-600 font-medium">
                              Subcategories:
                            </span>
                            <ul className="ml-2 list-disc text-xs text-slate-500">
                              {category.subcategories.map((sub) => (
                                <li key={sub.id}>{sub.name}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteClick(category.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <div className="col-span-full text-center text-slate-500 py-12">
                      No parent categories found.
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {categories
                    .flatMap((cat) => cat.subcategories || [])
                    .map((subcat) => (
                      <div
                        key={subcat.id}
                        className="bg-white border border-slate-200 rounded-xl shadow p-6 flex flex-col gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <Tags className="w-8 h-8 text-indigo-600" />
                          <div>
                            <h3 className="font-bold text-lg text-slate-900">
                              {subcat.name}
                            </h3>
                            <p className="text-xs text-slate-500">
                              ID: {subcat.id?.slice(-8)}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600">
                          {subcat.description}
                        </p>
                        <div className="flex gap-2 text-xs">
                          <span
                            className={
                              subcat.isActive
                                ? "bg-green-100 text-green-800 px-2 py-1 rounded"
                                : "bg-red-100 text-red-800 px-2 py-1 rounded"
                            }
                          >
                            {subcat.isActive ? "Active" : "Inactive"}
                          </span>
                          <span className="text-slate-400">
                            Created: {formatDate(subcat.createdAt)}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          <span className="font-medium text-slate-700">
                            Parent:
                          </span>{" "}
                          {subcat.parentCategory?.name || "Unknown"}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(subcat)}
                          >
                            <Edit className="w-4 h-4 mr-1" /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteClick(subcat.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  {categories.flatMap((cat) => cat.subcategories || [])
                    .length === 0 && (
                    <div className="col-span-full text-center text-slate-500 py-12">
                      No subcategories found.
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-modal-title"
            tabIndex={-1}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleCloseModal();
            }}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              tabIndex={0}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2
                    id="category-modal-title"
                    className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                  >
                    {editingCategory
                      ? "Edit Category"
                      : isSubcategoryMode
                      ? "Create Subcategory"
                      : "Create Parent Category"}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                {error && (
                  <div
                    className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2"
                    role="alert"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Category Type Field */}
                  <div>
                    <label
                      htmlFor="category-type"
                      className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                      Category Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category-type"
                      value={formData.categoryType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          categoryType: e.target.value as "design" | "course",
                        })
                      }
                      className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50"
                    >
                      <option value="design">Design</option>
                      <option value="course">Course</option>
                    </select>
                  </div>
                  {/* Parent Category Field - for subcategory creation and editing */}
                  {(isSubcategoryMode ||
                    (editingCategory && editingCategory.parentCategory)) && (
                    <div className="mb-4">
                      <label
                        htmlFor="parent-category"
                        className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2"
                      >
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 rounded-full">
                          <Tags className="w-4 h-4 text-blue-600" />
                        </span>
                        Parent Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="parent-category"
                        value={formData.parentCategory || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            parentCategory: e.target.value || null,
                          })
                        }
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50"
                      >
                        <option value="">Select a parent category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="category-name"
                      className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                      Category Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="category-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50"
                      placeholder="Enter category name"
                    />
                    {formErrors.name && (
                      <p className="mt-2 text-sm text-red-600">
                        {formErrors.name}
                      </p>
                    )}
                  </div>
                  {/* Description Field */}
                  <div>
                    <label
                      htmlFor="category-description"
                      className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="category-description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50"
                      placeholder="Enter category description"
                      rows={3}
                    />
                    {formErrors.description && (
                      <p className="mt-2 text-sm text-red-600">
                        {formErrors.description}
                      </p>
                    )}
                  </div>
                  {/* Status Toggle */}
                  <div className="flex items-center gap-3">
                    <input
                      id="category-status"
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="category-status"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Active
                    </label>
                  </div>
                  {/* Submit Button */}
                  <div className="flex justify-end gap-4">
                    <Button
                      onClick={handleCloseModal}
                      className="w-full sm:w-auto"
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all"
                    >
                      {editingCategory ? "Update Category" : "Create Category"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
