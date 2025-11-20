"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  useGetCourseQuery,
  useCheckCourseEnrollmentQuery,
  useUpdateLessonProgressMutation,
  useAddNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from "@/services/api";
import type { ICourse, ICourseEnrollment, INote } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronRight,
  Plus,
  Edit,
  Trash,
  Save,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function CourseLearnPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const courseId = params.id as string;

  const [currentModule, setCurrentModule] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);
  const [showNotes, setShowNotes] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [editingNote, setEditingNote] = useState<INote | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const { data: courseData } = useGetCourseQuery(courseId);
  const { data: enrollmentData, refetch: refetchEnrollment } =
    useCheckCourseEnrollmentQuery(courseId, { skip: !session });

  const [updateProgress] = useUpdateLessonProgressMutation();
  const [addNote] = useAddNoteMutation();
  const [updateNote] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const course: ICourse | null = courseData?.data || null;
  const enrollment: ICourseEnrollment | null =
    enrollmentData?.data?.enrollment || null;

  useEffect(() => {
    if (!session) {
      router.push(`/login?redirect=/courses/${courseId}/learn`);
    }
  }, [session, courseId, router]);

  useEffect(() => {
    if (enrollment?.progress) {
      setCurrentModule(enrollment.progress.currentModule);
      setCurrentLesson(enrollment.progress.currentLesson);
    }
  }, [enrollment]);

  if (!course || !enrollment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  const currentModuleData = course.modules[currentModule];
  const currentLessonData = currentModuleData?.lessons[currentLesson];

  const isLessonCompleted = (moduleIdx: number, lessonIdx: number) => {
    const lessonKey = `${moduleIdx}-${lessonIdx}`;
    return enrollment.progress.completedLessons.includes(lessonKey);
  };

  const handleMarkComplete = async () => {
    try {
      await updateProgress({
        enrollmentId: enrollment._id,
        moduleIndex: currentModule,
        lessonIndex: currentLesson,
        completed: true,
        watchedDuration: Math.floor(currentTime),
      }).unwrap();

      toast.success("Lesson marked as complete!");
      refetchEnrollment();

      // Auto-advance to next lesson
      if (currentLesson < currentModuleData.lessons.length - 1) {
        setCurrentLesson(currentLesson + 1);
      } else if (currentModule < course.modules.length - 1) {
        setCurrentModule(currentModule + 1);
        setCurrentLesson(0);
      }
    } catch (error: any) {
      toast.error("Failed to update progress");
    }
  };

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;

    try {
      await addNote({
        enrollmentId: enrollment._id,
        moduleIndex: currentModule,
        lessonIndex: currentLesson,
        timestamp: Math.floor(currentTime),
        content: noteContent,
      }).unwrap();

      toast.success("Note added!");
      setNoteContent("");
      refetchEnrollment();
    } catch (error: any) {
      toast.error("Failed to add note");
    }
  };

  const handleUpdateNote = async () => {
    if (!editingNote || !noteContent.trim()) return;

    try {
      await updateNote({
        enrollmentId: enrollment._id,
        noteId: editingNote._id,
        content: noteContent,
      }).unwrap();

      toast.success("Note updated!");
      setEditingNote(null);
      setNoteContent("");
      refetchEnrollment();
    } catch (error: any) {
      toast.error("Failed to update note");
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteNote({
        enrollmentId: enrollment._id,
        noteId,
      }).unwrap();

      toast.success("Note deleted!");
      refetchEnrollment();
    } catch (error: any) {
      toast.error("Failed to delete note");
    }
  };

  const toggleModule = (moduleIdx: number) => {
    setExpandedModules((prev) =>
      prev.includes(moduleIdx)
        ? prev.filter((idx) => idx !== moduleIdx)
        : [...prev, moduleIdx]
    );
  };

  const lessonNotes = enrollment.notes.filter(
    (note) =>
      note.moduleIndex === currentModule && note.lessonIndex === currentLesson
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar - Course Content */}
        <div className="w-80 bg-white border-r overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="font-bold text-lg mb-2">{course.title}</h2>
            <div className="text-sm text-gray-600">
              {enrollment.progress.overallProgress.toFixed(0)}% Complete
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${enrollment.progress.overallProgress}%` }}
              />
            </div>
          </div>

          <div className="p-4 space-y-2">
            {course.modules.map((module, moduleIdx) => (
              <div key={moduleIdx}>
                <button
                  onClick={() => toggleModule(moduleIdx)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg text-left"
                >
                  <div className="flex items-center gap-2">
                    {expandedModules.includes(moduleIdx) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="font-medium text-sm">
                      {moduleIdx + 1}. {module.title}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {module.lessons.length} lessons
                  </span>
                </button>

                {expandedModules.includes(moduleIdx) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {module.lessons.map((lesson, lessonIdx) => {
                      const isActive =
                        moduleIdx === currentModule &&
                        lessonIdx === currentLesson;
                      const isCompleted = isLessonCompleted(
                        moduleIdx,
                        lessonIdx
                      );

                      return (
                        <button
                          key={lessonIdx}
                          onClick={() => {
                            setCurrentModule(moduleIdx);
                            setCurrentLesson(lessonIdx);
                          }}
                          className={`w-full flex items-center gap-2 p-2 rounded text-left text-sm ${
                            isActive
                              ? "bg-blue-50 text-blue-600"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Circle className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="flex-1">{lesson.segmentTitle}</span>
                          <span className="text-xs text-gray-500">
                            {lesson.durationMinutes}m
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Video Player */}
          <div className="bg-black aspect-video">
            {currentLessonData && (
              <iframe
                src={`https://www.youtube.com/embed/${currentLessonData.youtubeVideoId}?enablejsapi=1`}
                title={currentLessonData.segmentTitle}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>

          {/* Lesson Info & Controls */}
          <div className="p-6 bg-white border-b">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  {currentLessonData?.segmentTitle}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    Module {currentModule + 1}, Lesson {currentLesson + 1}
                  </span>
                  <span>•</span>
                  <span>{currentLessonData?.durationMinutes} minutes</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowNotes(!showNotes)}
                  variant={showNotes ? "default" : "outline"}
                >
                  Notes ({lessonNotes.length})
                </Button>
                {!isLessonCompleted(currentModule, currentLesson) && (
                  <Button onClick={handleMarkComplete}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>

            {currentModuleData?.description && (
              <p className="text-gray-600">{currentModuleData.description}</p>
            )}
          </div>

          {/* Notes Section */}
          {showNotes && (
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Lesson Notes</h3>

                  {/* Add/Edit Note Form */}
                  <div className="mb-6">
                    <Textarea
                      placeholder="Add a note at current time..."
                      value={noteContent}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setNoteContent(e.target.value)
                      }
                      rows={3}
                      className="mb-2"
                    />
                    <div className="flex gap-2">
                      {editingNote ? (
                        <>
                          <Button onClick={handleUpdateNote} size="sm">
                            <Save className="mr-2 h-4 w-4" />
                            Update Note
                          </Button>
                          <Button
                            onClick={() => {
                              setEditingNote(null);
                              setNoteContent("");
                            }}
                            variant="outline"
                            size="sm"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button onClick={handleAddNote} size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Note
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Notes List */}
                  <div className="space-y-4">
                    {lessonNotes.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No notes for this lesson yet
                      </p>
                    ) : (
                      lessonNotes.map((note) => (
                        <Card key={note._id} className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="outline">
                              {formatTime(note.timestamp)}
                            </Badge>
                            <div className="flex gap-1">
                              <Button
                                onClick={() => {
                                  setEditingNote(note);
                                  setNoteContent(note.content);
                                }}
                                variant="ghost"
                                size="sm"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => handleDeleteNote(note._id)}
                                variant="ghost"
                                size="sm"
                              >
                                <Trash className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-gray-700">{note.content}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(note.createdAt).toLocaleString()}
                          </p>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
