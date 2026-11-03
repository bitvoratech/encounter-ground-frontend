// Shapes returned by the API's /admin endpoints and /me.

export type Role = "member" | "editor" | "admin";

/** The signed-in account's profile (GET /me). */
export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: Role;
};

export type CheckpointSubmission = {
  id: string;
  body: string;
  submitted_at: string;
  feedback: string | null;
  reviewed_at: string | null;
  student_name: string | null;
  student_email: string | null;
  course_slug: string;
  course_name: string;
  lesson_slug: string;
  lesson_title: string;
  prompt: string | null;
  reviewer_name: string | null;
};

export type ContactMessage = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  created_at: string;
  handled_at: string | null;
};

export type Member = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: Role;
  created_at: string;
  enrolments: number;
};

export type Overview = {
  counts: {
    members: number;
    new_members: number;
    enrolments: number;
    checkpoints_waiting: number;
    messages_open: number;
    self_tests: number;
  };
  checkpoints: CheckpointSubmission[];
  messages: ContactMessage[];
  classes: { slug: string; name: string; status: "draft" | "published" | "archived"; enrolments: number; completed: number }[];
};

export type PublishStatus = "draft" | "published" | "archived";

/** Prices in minor units (cents, kobo) per currency; a currency left out isn't sold in. */
export type AdminPrices = Partial<Record<"CAD" | "USD" | "NGN", number>>;

/** A book as the admin sees it (GET /admin/books). */
export type AdminBook = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  author: string | null;
  audience: string | null;
  description: string | null;
  cover_image_url: string | null;
  amazon_url: string | null;
  page_count: number | null;
  sort_order: number;
  status: PublishStatus;
  updated_at: string;
  prices: AdminPrices;
  /** How many members own it. */
  owners: number;
};

export type AdminCourseSummary = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  badge: string | null;
  sort_order: number;
  status: PublishStatus;
  updated_at: string;
  module_count: number;
  lesson_count: number;
  enrolments: number;
};

export type AdminLessonKind = "video" | "audio" | "text" | "pdf" | "checkpoint" | "quiz";

export type AdminLesson = {
  id: string;
  slug: string;
  title: string;
  kind: AdminLessonKind;
  body: string | null;
  video_url: string | null;
  /** Path in the private lesson-files bucket. */
  attachment_path: string | null;
  prompt: string | null;
  minutes: number;
  preview: boolean;
  position: number;
};

export type AdminModule = { id: string; title: string; summary: string | null; position: number; lessons: AdminLesson[] };

export type AdminQuizQuestion = { question: string; options: string[]; answer_index: number; explanation: string | null };

/** A class with everything the editor needs (GET /admin/courses/:id). */
export type AdminCourse = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  meaning: string | null;
  badge: string | null;
  outcomes: string[];
  sort_order: number;
  status: PublishStatus;
  enrolments: number;
  modules: AdminModule[];
  quiz: AdminQuizQuestion[];
};
