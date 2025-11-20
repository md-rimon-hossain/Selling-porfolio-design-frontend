// Course Types
export interface IVideoSegment {
  segmentTitle: string;
  durationMinutes: number;
  youtubeVideoId: string;
  isFreePreview: boolean;
}

export interface IModule {
  title: string;
  description?: string;
  lessons: IVideoSegment[];
  moduleDurationMinutes: number;
}

export interface ICourse {
  _id: string;
  title: string;
  mainCategory: {
    _id: string;
    name: string;
    slug: string;
  };
  subCategory: {
    _id: string;
    name: string;
    slug: string;
  };
  instructor: {
    _id: string;
    name: string;
    email?: string;
    profileImage?: string;
  };
  description: string;
  thumbnailImageUrl: string;
  modules: IModule[];
  totalDurationMinutes: number;
  basePrice: number;
  discountedPrice?: number;
  level: "Beginner" | "Intermediate" | "Expert";
  tags: string[];
  status: "Active" | "Draft" | "Archived";
  enrollmentCount: number;
  likesCount: number;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

// Enrollment Types
export interface INote {
  _id: string;
  moduleIndex: number;
  lessonIndex: number;
  timestamp: number;
  content: string;
  createdAt: string;
}

export interface IProgress {
  completedLessons: string[];
  currentModule: number;
  currentLesson: number;
  overallProgress: number;
  lastAccessedAt: string;
}

export interface ICourseEnrollment {
  _id: string;
  student: string;
  course: ICourse;
  purchase?: string;
  enrolledAt: string;
  completedAt?: string;
  status: "active" | "completed" | "suspended";
  progress: IProgress;
  notes: INote[];
  certificateIssued: boolean;
  certificateIssuedAt?: string;
  lastAccessedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Analytics Types
export interface ICourseAnalytics {
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  averageProgress: number;
  totalRevenue: number;
  enrollmentTrend: Array<{ date: string; count: number }>;
}

export interface IInstructorAnalytics {
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  averageRating: number;
  topCourses: Array<{
    course: ICourse;
    enrollmentCount: number;
    revenue: number;
  }>;
}

// Request/Response Types
export interface ICreateCourseDto {
  title: string;
  mainCategory: string;
  subCategory: string;
  instructor?: string;
  description: string;
  thumbnailImageUrl: string;
  modules: IModule[];
  basePrice: number;
  discountedPrice?: number;
  level: "Beginner" | "Intermediate" | "Expert";
  tags?: string[];
  status?: "Active" | "Draft" | "Archived";
}

export interface IUpdateCourseDto extends Partial<ICreateCourseDto> {}

export interface ICourseQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  mainCategory?: string;
  subCategory?: string;
  instructor?: string;
  level?: "Beginner" | "Intermediate" | "Expert";
  status?: "Active" | "Draft" | "Archived";
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
}

export interface IPaginatedCourseResponse {
  success: boolean;
  data: ICourse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IEnrollmentResponse {
  success: boolean;
  message: string;
  data: ICourseEnrollment;
}

export interface IProgressUpdate {
  moduleIndex: number;
  lessonIndex: number;
  completed: boolean;
  watchedDuration?: number;
}

export interface INoteCreate {
  moduleIndex: number;
  lessonIndex: number;
  timestamp: number;
  content: string;
}
