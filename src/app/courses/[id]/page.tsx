"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  useGetCourseQuery,
  useCheckCourseEnrollmentQuery,
  useEnrollInCourseMutation,
} from "@/services/api";
import type { ICourse } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Users,
  Star,
  BookOpen,
  Play,
  CheckCircle,
  Lock,
  ShoppingCart,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const courseId = params.id as string;

  const { data: courseData, isLoading } = useGetCourseQuery(courseId);
  const { data: enrollmentData } = useCheckCourseEnrollmentQuery(courseId, {
    skip: !session,
  });
  const [enrollInCourse, { isLoading: enrolling }] =
    useEnrollInCourseMutation();

  const course: ICourse | null = courseData?.data || null;
  const isEnrolled = enrollmentData?.data?.isEnrolled || false;
  const enrollment = enrollmentData?.data?.enrollment;

  const handleEnroll = async () => {
    if (!session) {
      toast.error("Please login to enroll in this course");
      router.push("/login");
      return;
    }

    try {
      await enrollInCourse({ courseId }).unwrap();
      toast.success("Successfully enrolled in course!");
      router.push(`/courses/${courseId}/learn`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to enroll in course");
    }
  };

  const handleBuyCourse = () => {
    router.push(`/payment?type=course&id=${courseId}`);
  };

  const handleStartLearning = () => {
    router.push(`/courses/${courseId}/learn`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-8" />
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Course not found
          </h2>
          <p className="text-gray-600 mb-4">
            The course you're looking for doesn't exist
          </p>
          <Button onClick={() => router.push("/courses")}>
            Browse Courses
          </Button>
        </div>
      </div>
    );
  }

  const totalLessons = course.modules.reduce(
    (sum, module) => sum + module.lessons.length,
    0
  );

  const freePreviewLessons = course.modules.flatMap((module, moduleIndex) =>
    module.lessons
      .map((lesson, lessonIndex) => ({
        ...lesson,
        moduleIndex,
        lessonIndex,
        moduleTitle: module.title,
      }))
      .filter((lesson) => lesson.isFreePreview)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge>{course.level}</Badge>
                <Badge variant="outline">{course.mainCategory.name}</Badge>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-gray-600 mb-6">{course.description}</p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{course.enrollmentCount} students</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>
                    {Math.floor(course.totalDurationMinutes / 60)}h{" "}
                    {course.totalDurationMinutes % 60}m
                  </span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  <span>{totalLessons} lessons</span>
                </div>
                {course.averageRating > 0 && (
                  <div className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-400 fill-current" />
                    <span className="font-medium">
                      {course.averageRating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Instructor */}
            <Card>
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  {course.instructor.profileImage ? (
                    <img
                      src={course.instructor.profileImage}
                      alt={course.instructor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-600">
                        {course.instructor.name[0]}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">
                      {course.instructor.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {course.instructor.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="curriculum" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="curriculum" className="flex-1">
                  Curriculum
                </TabsTrigger>
                <TabsTrigger value="description" className="flex-1">
                  Description
                </TabsTrigger>
              </TabsList>

              <TabsContent value="curriculum" className="mt-6">
                <div className="space-y-4">
                  {course.modules.map((module, moduleIndex) => (
                    <Card key={moduleIndex}>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Module {moduleIndex + 1}: {module.title}
                        </CardTitle>
                        {module.description && (
                          <p className="text-sm text-gray-600">
                            {module.description}
                          </p>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lessonIndex}
                              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                {lesson.isFreePreview ? (
                                  <Play className="h-4 w-4 text-green-600" />
                                ) : isEnrolled ? (
                                  <CheckCircle className="h-4 w-4 text-blue-600" />
                                ) : (
                                  <Lock className="h-4 w-4 text-gray-400" />
                                )}
                                <span className="text-sm">
                                  {lesson.segmentTitle}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">
                                  {lesson.durationMinutes} min
                                </span>
                                {lesson.isFreePreview && (
                                  <Badge variant="outline" className="text-xs">
                                    Free
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="description" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {course.description}
                    </p>
                    {course.tags.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-semibold mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {course.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img
                  src={course.thumbnailImageUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6 space-y-4">
                {/* Price */}
                <div className="text-center">
                  {course.discountedPrice !== undefined &&
                  course.discountedPrice < course.basePrice ? (
                    <div>
                      <div className="text-4xl font-bold text-green-600">
                        ${course.discountedPrice}
                      </div>
                      <div className="text-lg text-gray-500 line-through">
                        ${course.basePrice}
                      </div>
                    </div>
                  ) : (
                    <div className="text-4xl font-bold">
                      ${course.basePrice}
                    </div>
                  )}
                </div>

                {/* Enrollment Status */}
                {isEnrolled ? (
                  <div className="space-y-2">
                    <Button
                      onClick={handleStartLearning}
                      className="w-full"
                      size="lg"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Continue Learning
                    </Button>
                    {enrollment && (
                      <div className="text-center text-sm text-gray-600">
                        {enrollment.progress.overallProgress.toFixed(0)}%
                        Complete
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      onClick={handleBuyCourse}
                      className="w-full"
                      size="lg"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Buy Now
                    </Button>
                    {freePreviewLessons.length > 0 && (
                      <Button
                        onClick={() =>
                          router.push(`/courses/${courseId}/preview`)
                        }
                        variant="outline"
                        className="w-full"
                      >
                        Preview Course
                      </Button>
                    )}
                  </div>
                )}

                {/* Course Includes */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">This course includes:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {Math.floor(course.totalDurationMinutes / 60)} hours
                      on-demand video
                    </li>
                    <li className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      {totalLessons} lessons
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      {course.modules.length} modules
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Full lifetime access
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Certificate of completion
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
