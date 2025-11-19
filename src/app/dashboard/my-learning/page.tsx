"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useGetMyEnrollmentsQuery } from "@/services/api";
import type { ICourseEnrollment } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Play,
  Clock,
  CheckCircle,
  Trophy,
  GraduationCap,
} from "lucide-react";

export default function MyLearningPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetMyEnrollmentsQuery({
    page,
    limit: 12,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  if (!session) {
    router.push("/login");
    return null;
  }

  const enrollments: ICourseEnrollment[] = data?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Learning</h1>
          <p className="text-lg text-gray-600">
            Continue your learning journey with your enrolled courses
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {data?.pagination?.total || 0}
                  </div>
                  <div className="text-sm text-gray-600">Enrolled Courses</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {enrollments.filter((e) => e.status === "completed").length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Play className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {enrollments.filter((e) => e.status === "active").length}
                  </div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Trophy className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {enrollments.filter((e) => e.certificateIssued).length}
                  </div>
                  <div className="text-sm text-gray-600">Certificates</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Filter by status:</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="active">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200" />
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Enrollments Grid */}
        {!isLoading && enrollments.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => {
                const course = enrollment.course;
                const progress = enrollment.progress.overallProgress;
                const isCompleted = enrollment.status === "completed";

                return (
                  <Card
                    key={enrollment._id}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => router.push(`/courses/${course._id}/learn`)}
                  >
                    <div className="relative h-48">
                      <img
                        src={course.thumbnailImageUrl}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        {isCompleted ? (
                          <Badge className="bg-green-600">Completed</Badge>
                        ) : (
                          <Badge className="bg-blue-600">In Progress</Badge>
                        )}
                      </div>
                      {enrollment.certificateIssued && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-purple-600">
                            <GraduationCap className="h-3 w-3 mr-1" />
                            Certificate
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {course.title}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <span className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {course.modules.length} modules
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {Math.floor(course.totalDurationMinutes / 60)}h{" "}
                          {course.totalDurationMinutes % 60}m
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Progress</span>
                          <span className="text-gray-600">
                            {progress.toFixed(0)}%
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      <div className="mt-4">
                        <Button className="w-full" size="sm">
                          {isCompleted ? (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Review Course
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-4 w-4" />
                              Continue Learning
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="mt-2 text-xs text-gray-500 text-center">
                        Last accessed:{" "}
                        {new Date(
                          enrollment.progress.lastAccessedAt
                        ).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            {data?.pagination && data.pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2 px-4">
                  <span className="text-sm text-gray-600">
                    Page {page} of {data.pagination.totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  onClick={() =>
                    setPage((p) =>
                      Math.min(data.pagination.totalPages || p, p + 1)
                    )
                  }
                  disabled={page >= (data.pagination.totalPages || page)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && enrollments.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No courses yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start learning by enrolling in a course
            </p>
            <Button onClick={() => router.push("/courses")}>
              Browse Courses
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
