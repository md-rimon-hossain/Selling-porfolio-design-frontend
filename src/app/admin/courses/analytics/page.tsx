"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetCoursesQuery, useGetCourseAnalyticsQuery } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  Award,
  Clock,
  BarChart3,
  ArrowLeft,
} from "lucide-react";

export default function CourseAnalyticsPage() {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  const { data: coursesData } = useGetCoursesQuery({ limit: 100 });
  const { data: analyticsData, isLoading } = useGetCourseAnalyticsQuery(
    selectedCourse,
    { skip: !selectedCourse }
  );

  const courses = coursesData?.data || [];
  const analytics = analyticsData?.data;

  // Calculate overall stats from all courses
  const overallStats = courses.reduce(
    (acc: any, course: any) => ({
      totalCourses: acc.totalCourses + 1,
      totalEnrollments: acc.totalEnrollments + (course.enrollmentCount || 0),
      totalRevenue:
        acc.totalRevenue +
        course.enrollmentCount * (course.discountedPrice || course.basePrice),
      avgRating: acc.avgRating + (course.averageRating || 0) / courses.length,
    }),
    { totalCourses: 0, totalEnrollments: 0, totalRevenue: 0, avgRating: 0 }
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              Course Analytics
            </h1>
            <p className="text-gray-600 mt-2">
              Comprehensive course performance and enrollment statistics
            </p>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Courses
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overallStats.totalCourses}
              </div>
              <p className="text-xs text-muted-foreground">
                Active learning content
              </p>
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
              <div className="text-2xl font-bold">
                {overallStats.totalEnrollments}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all courses
              </p>
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
                ${overallStats.totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">From course sales</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Rating
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overallStats.avgRating.toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">
                Student satisfaction
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Course-Specific Analytics */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Course-Specific Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Select Course
              </label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a course to analyze" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course: any) => (
                    <SelectItem key={course._id} value={course._id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading analytics...</p>
              </div>
            )}

            {analytics && (
              <div className="space-y-6">
                {/* Enrollment Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Total Enrollments
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {analytics.totalEnrollments}
                          </p>
                        </div>
                        <Users className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Active Students
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {analytics.activeEnrollments}
                          </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Completed
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {analytics.completedEnrollments}
                          </p>
                        </div>
                        <Award className="h-8 w-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Progress & Revenue */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">
                          Average Progress
                        </h3>
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-blue-600">
                              {analytics.averageProgress.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                          <div
                            style={{
                              width: `${analytics.averageProgress}%`,
                            }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                          ></div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-4">
                        Students are actively progressing through the course
                        content
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">
                          Total Revenue
                        </h3>
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-3xl font-bold text-green-600">
                        ${analytics.totalRevenue.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600 mt-4">
                        Revenue generated from {analytics.totalEnrollments}{" "}
                        enrollments
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Enrollment Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="mr-2 h-5 w-5" />
                      30-Day Enrollment Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analytics.enrollmentTrend
                        .slice(-10)
                        .map((trend: any, index: number) => (
                          <div key={index} className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 w-24">
                              {new Date(trend.date).toLocaleDateString()}
                            </span>
                            <div className="flex-1">
                              <div className="h-8 bg-blue-100 rounded-lg overflow-hidden">
                                <div
                                  className="h-full bg-blue-600 flex items-center px-3"
                                  style={{
                                    width: `${Math.min(
                                      (trend.count /
                                        Math.max(
                                          ...analytics.enrollmentTrend.map(
                                            (t: any) => t.count
                                          )
                                        )) *
                                        100,
                                      100
                                    )}%`,
                                  }}
                                >
                                  <span className="text-xs font-medium text-white">
                                    {trend.count}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {!selectedCourse && !isLoading && (
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Select a course to view detailed analytics</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Performing Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses
                .sort((a: any, b: any) => b.enrollmentCount - a.enrollmentCount)
                .slice(0, 10)
                .map((course: any, index: number) => (
                  <div
                    key={course._id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold">
                      {index + 1}
                    </div>
                    <img
                      src={course.thumbnailImageUrl}
                      alt={course.title}
                      className="w-16 h-10 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {course.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {course.level} • {course.modules.length} modules
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {course.enrollmentCount} students
                      </p>
                      <p className="text-sm text-gray-600">
                        $
                        {(
                          course.enrollmentCount *
                          (course.discountedPrice || course.basePrice)
                        ).toFixed(2)}{" "}
                        revenue
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCourse(course._id)}
                    >
                      View Analytics
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
