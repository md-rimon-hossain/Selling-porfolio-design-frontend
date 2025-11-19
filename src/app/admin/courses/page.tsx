"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetCoursesQuery,
  useDeleteCourseMutation,
  useUpdateCourseMutation,
  useBulkUpdateCourseStatusMutation,
  useBulkDeleteCoursesMutation,
} from "@/services/api";
import type { ICourse } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Edit,
  Trash,
  Eye,
  Users,
  TrendingUp,
  DollarSign,
  BookOpen,
  Search,
  Filter,
  BarChart3,
  CheckSquare,
  Square,
  MoreVertical,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminCoursesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [search, setSearch] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>("");

  const { data, isLoading, refetch } = useGetCoursesQuery({
    page,
    limit: 20,
    status: status && status !== "all" ? status : undefined,
    level: level && level !== "all" ? level : undefined,
    search: search || undefined,
  });

  const [deleteCourse] = useDeleteCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [bulkUpdateStatus] = useBulkUpdateCourseStatusMutation();
  const [bulkDelete] = useBulkDeleteCoursesMutation();

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await deleteCourse(id).unwrap();
      toast.success("Course deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete course");
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: "Active" | "Draft" | "Archived"
  ) => {
    try {
      await updateCourse({ id, data: { status: newStatus } }).unwrap();
      toast.success(`Course status updated to ${newStatus}`);
      refetch();
    } catch (error: any) {
      toast.error("Failed to update course status");
    }
  };

  const handleBulkAction = async () => {
    if (selectedCourses.length === 0) {
      toast.error("Please select courses first");
      return;
    }

    if (!bulkAction) {
      toast.error("Please select an action");
      return;
    }

    try {
      if (bulkAction === "delete") {
        if (!confirm(`Delete ${selectedCourses.length} courses?`)) return;
        await bulkDelete(selectedCourses).unwrap();
        toast.success("Courses deleted successfully");
      } else {
        await bulkUpdateStatus({
          ids: selectedCourses,
          status: bulkAction,
        }).unwrap();
        toast.success(`Status updated to ${bulkAction}`);
      }
      setSelectedCourses([]);
      setBulkAction("");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Bulk operation failed");
    }
  };

  const toggleCourseSelection = (id: string) => {
    setSelectedCourses((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const toggleAllCourses = () => {
    if (selectedCourses.length === courses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(courses.map((c) => c._id));
    }
  };

  const courses: ICourse[] = data?.data || [];

  // Calculate stats
  const totalCourses = data?.pagination?.total || 0;
  const totalEnrollments = courses.reduce(
    (sum, course) => sum + course.enrollmentCount,
    0
  );
  const totalRevenue = courses.reduce(
    (sum, course) =>
      sum +
      course.enrollmentCount * (course.discountedPrice || course.basePrice),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Course Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage all courses, enrollments, and content
            </p>
          </div>
          <Button onClick={() => router.push("/admin/courses/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Courses
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCourses}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Enrollments
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEnrollments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalRevenue.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Students/Course
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalCourses > 0
                  ? Math.floor(totalEnrollments / totalCourses)
                  : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search courses by title, description, or tags..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.push("/admin/courses/analytics")}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </Button>
              </div>

              {/* Filters Row */}
              <div className="flex items-center gap-4 flex-wrap">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>

                {(status || level || search) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStatus("");
                      setLevel("");
                      setSearch("");
                      setPage(1);
                    }}
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>

              {/* Bulk Actions */}
              {selectedCourses.length > 0 && (
                <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedCourses.length} course(s) selected
                  </span>
                  <Select value={bulkAction} onValueChange={setBulkAction}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Bulk Actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Set Active</SelectItem>
                      <SelectItem value="Draft">Set Draft</SelectItem>
                      <SelectItem value="Archived">Set Archived</SelectItem>
                      <SelectItem value="delete">Delete Selected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleBulkAction} disabled={!bulkAction}>
                    Apply
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCourses([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Courses Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center">Loading...</div>
            ) : courses.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No courses found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <button
                        onClick={toggleAllCourses}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        {selectedCourses.length === courses.length ? (
                          <CheckSquare className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Square className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Enrollments</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course._id}>
                      <TableCell>
                        <button
                          onClick={() => toggleCourseSelection(course._id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          {selectedCourses.includes(course._id) ? (
                            <CheckSquare className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Square className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={course.thumbnailImageUrl}
                            alt={course.title}
                            className="w-16 h-10 object-cover rounded"
                          />
                          <div>
                            <div className="font-medium">{course.title}</div>
                            <div className="text-sm text-gray-500">
                              {course.modules.length} modules
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{course.instructor.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{course.level}</Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={course.status}
                          onValueChange={(value: any) =>
                            handleStatusChange(course._id, value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Draft">Draft</SelectItem>
                            <SelectItem value="Archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-500" />
                          {course.enrollmentCount}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            $
                            {course.discountedPrice !== undefined
                              ? course.discountedPrice
                              : course.basePrice}
                          </div>
                          {course.discountedPrice !== undefined &&
                            course.discountedPrice < course.basePrice && (
                              <div className="text-xs text-gray-500 line-through">
                                ${course.basePrice}
                              </div>
                            )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {course.averageRating > 0 ? (
                          <div className="flex items-center gap-1">
                            <span className="font-medium">
                              {course.averageRating.toFixed(1)}
                            </span>
                            <span className="text-yellow-400">★</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">No ratings</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              router.push(`/courses/${course._id}`)
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              router.push(`/admin/courses/${course._id}/edit`)
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDelete(course._id, course.title)
                            }
                          >
                            <Trash className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <div className="flex items-center px-4">
              <span className="text-sm text-gray-600">
                Page {page} of {data.pagination.totalPages}
              </span>
            </div>
            <Button
              variant="outline"
              onClick={() =>
                setPage((p) => Math.min(data.pagination.totalPages, p + 1))
              }
              disabled={page >= data.pagination.totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
