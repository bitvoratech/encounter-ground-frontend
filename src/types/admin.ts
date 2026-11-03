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
