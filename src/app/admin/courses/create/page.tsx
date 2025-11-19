"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCreateCourseMutation, useGetCategoriesQuery } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash, Save, X } from "lucide-react";
import { toast } from "react-hot-toast";

interface Lesson {
  segmentTitle: string;
  durationMinutes: number;
  youtubeVideoId: string;
  isFreePreview: boolean;
}

interface Module {
  title: string;
  description?: string;
  lessons: Lesson[];
  moduleDurationMinutes: number;
}

export default function CreateCoursePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const { data: categoriesData } = useGetCategoriesQuery({
    categoryType: "course",
  });

  const [formData, setFormData] = useState({
    title: "",
    mainCategory: "",
    subCategory: "",
    instructor: session?.user?.id || "",
    description: "",
    thumbnailImageUrl: "",
    basePrice: 0,
    discountedPrice: 0,
    level: "Beginner" as "Beginner" | "Intermediate" | "Expert",
    tags: "",
    status: "Draft" as "Draft" | "Active" | "Archived",
  });

  const [modules, setModules] = useState<Module[]>([
    {
      title: "",
      description: "",
      lessons: [
        {
          segmentTitle: "",
          durationMinutes: 0,
          youtubeVideoId: "",
          isFreePreview: false,
        },
      ],
      moduleDurationMinutes: 0,
    },
  ]);

  const categories = categoriesData?.data || [];

  // Helper function to get category ID (handles both _id and id fields)
  const getCategoryId = (cat: any) => cat._id || cat.id;

  // Filter categories to only include those with valid IDs
  const validCategories = categories.filter((cat: any) => {
    const id = getCategoryId(cat);
    return id && typeof id === "string" && id.trim().length > 0;
  });

  const mainCategories = validCategories.filter(
    (cat: any) => !cat.parentCategory
  );
  const selectedMainCategory = mainCategories.find(
    (cat: any) => getCategoryId(cat) === formData.mainCategory
  );
  const subCategories = selectedMainCategory?.subcategories || [];

  const addModule = () => {
    setModules([
      ...modules,
      {
        title: "",
        description: "",
        lessons: [
          {
            segmentTitle: "",
            durationMinutes: 0,
            youtubeVideoId: "",
            isFreePreview: false,
          },
        ],
        moduleDurationMinutes: 0,
      },
    ]);
  };

  const removeModule = (index: number) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const updateModule = (index: number, field: string, value: any) => {
    const updated = [...modules];
    (updated[index] as any)[field] = value;
    setModules(updated);
  };

  const addLesson = (moduleIndex: number) => {
    const updated = [...modules];
    updated[moduleIndex].lessons.push({
      segmentTitle: "",
      durationMinutes: 0,
      youtubeVideoId: "",
      isFreePreview: false,
    });
    setModules(updated);
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const updated = [...modules];
    updated[moduleIndex].lessons = updated[moduleIndex].lessons.filter(
      (_, i) => i !== lessonIndex
    );
    setModules(updated);
  };

  const updateLesson = (
    moduleIndex: number,
    lessonIndex: number,
    field: string,
    value: any
  ) => {
    const updated = [...modules];
    (updated[moduleIndex].lessons[lessonIndex] as any)[field] = value;

    // Auto-calculate module duration
    const totalDuration = updated[moduleIndex].lessons.reduce(
      (sum, lesson) => sum + (lesson.durationMinutes || 0),
      0
    );
    updated[moduleIndex].moduleDurationMinutes = totalDuration;

    setModules(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.mainCategory || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (modules.length === 0 || modules[0].lessons.length === 0) {
      toast.error("Please add at least one module with one lesson");
      return;
    }

    try {
      // Clean up modules data
      const cleanedModules = modules.map((module) => {
        const cleanedModule = { ...module };
        if (
          !cleanedModule.description ||
          cleanedModule.description.trim() === ""
        ) {
          delete cleanedModule.description;
        }
        return cleanedModule;
      });

      const courseData: any = {
        ...formData,
        instructor: session?.user?.id || formData.instructor,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        modules: cleanedModules,
      };

      // Remove subCategory if it's empty
      if (!courseData.subCategory) {
        delete courseData.subCategory;
      }

      // Remove instructor if it's empty (will be set by backend)
      if (!courseData.instructor) {
        delete courseData.instructor;
      }

      // Remove discountedPrice if it's 0 or empty
      if (!courseData.discountedPrice || courseData.discountedPrice === 0) {
        delete courseData.discountedPrice;
      }

      await createCourse(courseData).unwrap();
      toast.success("Course created successfully!");
      router.push("/admin/courses");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create course");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Course</h1>
            <p className="text-gray-600 mt-2">
              Add a new course to your platform
            </p>
          </div>
          <Button variant="outline" onClick={() => router.back()}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Course Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Complete Web Development Bootcamp"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Main Category *
                  </label>
                  {mainCategories.length === 0 ? (
                    <div className="text-red-500 text-sm mb-2">
                      No course categories found. Please create course
                      categories first.
                    </div>
                  ) : null}
                  <Select
                    value={formData.mainCategory}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        mainCategory: value,
                        subCategory: "",
                      })
                    }
                    disabled={mainCategories.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {mainCategories
                        .map((cat: any) => {
                          const id = getCategoryId(cat);
                          if (
                            !id ||
                            typeof id !== "string" ||
                            id.trim().length === 0
                          ) {
                            return null;
                          }
                          return (
                            <SelectItem key={id} value={id}>
                              {cat.name}
                            </SelectItem>
                          );
                        })
                        .filter(Boolean)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Sub Category
                  </label>
                  {formData.mainCategory && subCategories.length === 0 ? (
                    <div className="text-yellow-500 text-sm mb-2">
                      No subcategories found for selected main category.
                    </div>
                  ) : null}
                  <Select
                    value={formData.subCategory}
                    onValueChange={(value) =>
                      setFormData({ ...formData, subCategory: value })
                    }
                    disabled={
                      !formData.mainCategory || subCategories.length === 0
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sub-category" />
                    </SelectTrigger>
                    <SelectContent>
                      {subCategories
                        .map((cat: any) => {
                          const id = getCategoryId(cat);
                          if (
                            !id ||
                            typeof id !== "string" ||
                            id.trim().length === 0
                          ) {
                            return null;
                          }
                          return (
                            <SelectItem key={id} value={id}>
                              {cat.name}
                            </SelectItem>
                          );
                        })
                        .filter(Boolean)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description *
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe what students will learn..."
                  rows={5}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Thumbnail Image URL *
                </label>
                <Input
                  type="url"
                  value={formData.thumbnailImageUrl}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      thumbnailImageUrl: e.target.value,
                    })
                  }
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Base Price ($) *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.basePrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        basePrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Discounted Price ($)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discountedPrice || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountedPrice: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Level *
                  </label>
                  <Select
                    value={formData.level}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, level: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tags (comma-separated)
                  </label>
                  <Input
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="web, design, javascript"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Status *
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modules & Lessons */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Course Content</CardTitle>
                <Button type="button" onClick={addModule} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Module
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {modules.map((module, moduleIndex) => (
                <Card key={moduleIndex} className="border-2">
                  <CardHeader className="bg-gray-50">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Module {moduleIndex + 1}
                      </CardTitle>
                      {modules.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeModule(moduleIndex)}
                        >
                          <Trash className="h-4 w-4 text-red-600" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Module Title *
                      </label>
                      <Input
                        value={module.title}
                        onChange={(e) =>
                          updateModule(moduleIndex, "title", e.target.value)
                        }
                        placeholder="e.g., Introduction to React"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Module Description
                      </label>
                      <Textarea
                        value={module.description}
                        onChange={(e) =>
                          updateModule(
                            moduleIndex,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Brief module overview..."
                        rows={2}
                      />
                    </div>

                    {/* Lessons */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Lessons</label>
                        <Button
                          type="button"
                          onClick={() => addLesson(moduleIndex)}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Lesson
                        </Button>
                      </div>

                      {module.lessons.map((lesson, lessonIndex) => (
                        <Card key={lessonIndex} className="border">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">
                                Lesson {lessonIndex + 1}
                              </span>
                              {module.lessons.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    removeLesson(moduleIndex, lessonIndex)
                                  }
                                >
                                  <Trash className="h-4 w-4 text-red-600" />
                                </Button>
                              )}
                            </div>

                            <Input
                              value={lesson.segmentTitle}
                              onChange={(e) =>
                                updateLesson(
                                  moduleIndex,
                                  lessonIndex,
                                  "segmentTitle",
                                  e.target.value
                                )
                              }
                              placeholder="Lesson title"
                              required
                            />

                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                type="number"
                                min="1"
                                value={lesson.durationMinutes || ""}
                                onChange={(e) =>
                                  updateLesson(
                                    moduleIndex,
                                    lessonIndex,
                                    "durationMinutes",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                placeholder="Duration (minutes)"
                                required
                              />
                              <Input
                                value={lesson.youtubeVideoId}
                                onChange={(e) =>
                                  updateLesson(
                                    moduleIndex,
                                    lessonIndex,
                                    "youtubeVideoId",
                                    e.target.value
                                  )
                                }
                                placeholder="YouTube Video ID (e.g., dQw4w9WgXcQ) or full URL"
                                required
                              />
                            </div>

                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={lesson.isFreePreview}
                                onChange={(e) =>
                                  updateLesson(
                                    moduleIndex,
                                    lessonIndex,
                                    "isFreePreview",
                                    e.target.checked
                                  )
                                }
                                className="rounded"
                              />
                              Free Preview
                            </label>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      Total Module Duration: {module.moduleDurationMinutes}{" "}
                      minutes
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              <Save className="mr-2 h-4 w-4" />
              {isCreating ? "Creating..." : "Create Course"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
