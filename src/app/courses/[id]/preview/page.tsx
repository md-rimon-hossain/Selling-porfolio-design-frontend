"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useGetCourseQuery } from "@/services/api";
import type { ICourse } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Clock, BookOpen } from "lucide-react";
import { toast } from "react-hot-toast";

export default function CoursePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const courseId = params.id as string;

  const { data: courseData, isLoading } = useGetCourseQuery(courseId);
  const course: ICourse | null = courseData?.data || null;

  const [currentLesson, setCurrentLesson] = useState<{
    moduleIndex: number;
    lessonIndex: number;
    lesson: any;
    moduleTitle: string;
  } | null>(null);

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

  if (freePreviewLessons.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Preview Available
          </h2>
          <p className="text-gray-600 mb-4">
            This course doesn't have any free preview lessons
          </p>
          <Button onClick={() => router.push(`/courses/${courseId}`)}>
            Back to Course
          </Button>
        </div>
      </div>
    );
  }

  const handleLessonClick = (lesson: any) => {
    setCurrentLesson(lesson);
  };

  const handleEnroll = () => {
    if (!session) {
      toast.error("Please login to enroll in this course");
      router.push("/login");
      return;
    }
    router.push(`/payment?type=course&id=${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push(`/courses/${courseId}`)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Course
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {course.title}
                </h1>
                <p className="text-sm text-gray-600">
                  Course Preview - {freePreviewLessons.length} free lessons
                </p>
              </div>
            </div>
            <Button onClick={handleEnroll} className="bg-blue-600 hover:bg-blue-700">
              Enroll Now - ${course.discountedPrice !== undefined &&
                course.discountedPrice < course.basePrice
                ? course.discountedPrice
                : course.basePrice}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                {currentLesson ? (
                  <div className="aspect-video bg-black rounded-t-lg overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${currentLesson.lesson.youtubeVideoId}`}
                      title={currentLesson.lesson.segmentTitle}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-900 rounded-t-lg flex items-center justify-center">
                    <div className="text-center text-white">
                      <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Select a lesson to start preview</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {currentLesson && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {currentLesson.moduleTitle} - {currentLesson.lesson.segmentTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {currentLesson.lesson.durationMinutes} minutes
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      Free Preview
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Lesson List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Preview Lessons</CardTitle>
                <p className="text-sm text-gray-600">
                  {freePreviewLessons.length} of {course.modules.reduce(
                    (sum, module) => sum + module.lessons.length,
                    0
                  )} lessons available
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                {course.modules.map((module, moduleIndex) => (
                  <div key={moduleIndex}>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Module {moduleIndex + 1}: {module.title}
                    </h4>
                    <div className="space-y-1 ml-4">
                      {module.lessons.map((lesson, lessonIndex) => {
                        if (!lesson.isFreePreview) return null;

                        const isActive = currentLesson?.moduleIndex === moduleIndex &&
                                        currentLesson?.lessonIndex === lessonIndex;

                        return (
                          <button
                            key={lessonIndex}
                            onClick={() => handleLessonClick({
                              moduleIndex,
                              lessonIndex,
                              lesson,
                              moduleTitle: module.title,
                            })}
                            className={`w-full text-left p-3 rounded-lg border transition-colors ${
                              isActive
                                ? 'bg-blue-50 border-blue-200'
                                : 'hover:bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Play className={`h-4 w-4 ${
                                  isActive ? 'text-blue-600' : 'text-gray-400'
                                }`} />
                                <span className={`text-sm ${
                                  isActive ? 'text-blue-900 font-medium' : 'text-gray-700'
                                }`}>
                                  {lesson.segmentTitle}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                {lesson.durationMinutes}m
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Course Info */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>About This Course</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                  <span>{course.modules.length} modules</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>
                    {Math.floor(course.totalDurationMinutes / 60)}h{" "}
                    {course.totalDurationMinutes % 60}m total
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Level:</strong> {course.level}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Instructor:</strong> {course.instructor.name}
                </div>
                <div className="pt-3 border-t">
                  <Button
                    onClick={handleEnroll}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Enroll Now - ${course.discountedPrice !== undefined &&
                      course.discountedPrice < course.basePrice
                      ? course.discountedPrice
                      : course.basePrice}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}