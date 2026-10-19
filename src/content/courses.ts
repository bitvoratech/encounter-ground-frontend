// The Beth-El Institute classes as online courses. SAMPLE OUTLINES: module themes come from
// each class's description on the site; lesson titles, lengths and files are placeholders until
// the ministry supplies the real course content. These move to the courses, course_modules and
// lessons tables (admin-editable) when the school backend is built.
//
// Learning model, after GOMYCODE: lessons at your own pace, a written checkpoint at the end of
// each module that a teacher reviews, and a short final check at the end of the class.

import { schoolClasses } from "./school";

export type LessonKind = "video" | "audio" | "text" | "pdf" | "checkpoint" | "quiz";

export type Lesson = {
  slug: string;
  title: string;
  kind: LessonKind;
  minutes?: number;
  /** Open to everyone, enrolled or not (lessons.is_preview). */
  preview?: boolean;
  /** For checkpoints: what the student is asked to write about. */
  prompt?: string;
};

export type CourseModule = { title: string; summary: string; lessons: Lesson[] };

export type QuizQuestion = { question: string; options: string[]; answer: number; why: string };

export type Course = {
  slug: string;
  /** The class name, e.g. "Halak". */
  name: string;
  meaning: string;
  summary: string;
  /** Short label for cards, e.g. "Start here". */
  badge?: string;
  outcomes: string[];
  modules: CourseModule[];
  quiz: QuizQuestion[];
};

export const sampleCourses = true;

const bethElQuestion: QuizQuestion = {
  question: "What does “Beth-El” mean?",
  options: ["House of God", "To walk", "Strength and valour"],
  answer: 0,
  why: "Beth-El means “house of God”, the place where Jacob saw heaven open (Genesis 28:19).",
};

const checkpoint = (slug: string, title: string, prompt: string): Lesson => ({
  slug,
  title: `Checkpoint: ${title}`,
  kind: "checkpoint",
  minutes: 10,
  prompt,
});

const byName = (name: string) => schoolClasses.find((c) => c.name === name)!;

export const courses: Course[] = [
  {
    slug: "halak",
    name: "Halak",
    meaning: byName("Halak").meaning,
    summary: byName("Halak").body,
    badge: "Start here",
    outcomes: [
      "Understand what it means to be saved and made new",
      "Build a daily habit of reading the Word",
      "Grow in a life of prayer",
      "Know and walk with the Holy Spirit",
    ],
    modules: [
      {
        title: "Salvation",
        summary: "What it means to belong to God, and the new life that begins there.",
        lessons: [
          { slug: "welcome", title: "Welcome to Halak", kind: "video", minutes: 6, preview: true },
          { slug: "new-life", title: "New life in Christ", kind: "video", minutes: 14 },
          checkpoint("salvation-checkpoint", "Salvation", "Write a few sentences about how you came to know Christ, or what you are still asking Him."),
        ],
      },
      {
        title: "The Word",
        summary: "Reading the Bible daily, and letting it move from hearing to doing.",
        lessons: [
          { slug: "reading-daily", title: "Reading the Bible daily", kind: "video", minutes: 12 },
          { slug: "reading-plan", title: "Study guide: a reading plan", kind: "pdf", minutes: 5 },
          checkpoint("word-checkpoint", "The Word", "Share a passage you read this week and one thing you will do because of it."),
        ],
      },
      {
        title: "Prayer",
        summary: "Learning to talk with God, and to listen.",
        lessons: [
          { slug: "learning-to-pray", title: "Learning to pray", kind: "video", minutes: 15 },
          { slug: "morning-prayer", title: "A guided morning prayer", kind: "audio", minutes: 8 },
          checkpoint("prayer-checkpoint", "Prayer", "Describe your prayer time this week: when, where, and what you noticed."),
        ],
      },
      {
        title: "Fellowship with the Holy Spirit",
        summary: "An interactive, loving relationship with the Holy Spirit.",
        lessons: [
          { slug: "knowing-the-spirit", title: "Knowing the Holy Spirit", kind: "video", minutes: 16 },
          { slug: "walking-it-out", title: "Walking it out", kind: "text", minutes: 6 },
          checkpoint("spirit-checkpoint", "Fellowship with the Holy Spirit", "How have you sensed the Holy Spirit’s leading recently?"),
          { slug: "final-check", title: "Final check", kind: "quiz", minutes: 5 },
        ],
      },
    ],
    quiz: [
      {
        question: "What does “Halak” mean?",
        options: ["To walk", "Strength and valour", "Hearing His voice"],
        answer: 0,
        why: "Halak is Hebrew for “to walk”: the class lays the foundations of walking with God.",
      },
      {
        question: "Which class should someone new to the school start with?",
        options: ["Chayil", "Halak", "Whispers"],
        answer: 1,
        why: "New students begin with Halak, then follow the path as the Spirit leads.",
      },
      bethElQuestion,
    ],
  },
  {
    slug: "chayil",
    name: "Chayil",
    meaning: byName("Chayil").meaning,
    summary: byName("Chayil").body,
    outcomes: [
      "Stand in your identity in Christ",
      "Understand the authority you carry as a believer",
      "Engage in prayer as a warrior",
    ],
    modules: [
      {
        title: "Identity in Christ",
        summary: "Who God says you are.",
        lessons: [
          { slug: "welcome", title: "Welcome to Chayil", kind: "video", minutes: 6, preview: true },
          { slug: "who-you-are", title: "Who God says you are", kind: "video", minutes: 14 },
          { slug: "identity-declarations", title: "Identity declarations", kind: "text", minutes: 5 },
          checkpoint("identity-checkpoint", "Identity in Christ", "Which truth about your identity in Christ do you find hardest to believe, and why?"),
        ],
      },
      {
        title: "Authority in Christ",
        summary: "The authority given to every believer, and how to walk in it.",
        lessons: [
          { slug: "authority", title: "Authority in Christ", kind: "video", minutes: 16 },
          { slug: "authority-guide", title: "Study guide: authority in Scripture", kind: "pdf", minutes: 5 },
          checkpoint("authority-checkpoint", "Authority in Christ", "Where in your life do you need to stand in the authority you have in Christ?"),
        ],
      },
      {
        title: "Prayer as a warrior",
        summary: "Strength and valour in prayer.",
        lessons: [
          { slug: "warrior-prayer", title: "Praying as a warrior", kind: "video", minutes: 15 },
          { slug: "prayer-session", title: "A guided prayer session", kind: "audio", minutes: 10 },
          checkpoint("warrior-checkpoint", "Prayer as a warrior", "Write a short prayer for someone or something you are standing in faith for."),
          { slug: "final-check", title: "Final check", kind: "quiz", minutes: 5 },
        ],
      },
    ],
    quiz: [
      {
        question: "What does “Chayil” mean?",
        options: ["To walk", "Strength and valour", "House of God"],
        answer: 1,
        why: "Chayil is Hebrew for “strength, valour”.",
      },
      {
        question: "What does Chayil help you stand strong in?",
        options: ["Identity and authority in Christ", "Church history", "Public speaking"],
        answer: 0,
        why: "Chayil is about standing strong in identity and authority in Christ, and engaging in prayer as a warrior.",
      },
      bethElQuestion,
    ],
  },
  {
    slug: "becoming",
    name: "Becoming",
    meaning: byName("Becoming").meaning,
    summary: byName("Becoming").body,
    badge: "Pre-teens and teens",
    outcomes: ["Know who God made you to be", "Discover purpose for your life", "Build a daily habit with your journal"],
    modules: [
      {
        title: "Who I am",
        summary: "Identity for young people, in God’s words.",
        lessons: [
          { slug: "welcome", title: "Welcome to Becoming", kind: "video", minutes: 5, preview: true },
          { slug: "made-on-purpose", title: "Made on purpose", kind: "video", minutes: 10 },
          { slug: "journal-start", title: "Starting your journal", kind: "text", minutes: 5 },
          checkpoint("who-checkpoint", "Who I am", "Write three things God says about you that you want to remember."),
        ],
      },
      {
        title: "Living with purpose",
        summary: "What your life is for, one day at a time.",
        lessons: [
          { slug: "purpose", title: "Living with purpose", kind: "video", minutes: 12 },
          { slug: "journal-pages", title: "Journal pages", kind: "pdf", minutes: 5 },
          checkpoint("purpose-checkpoint", "Living with purpose", "What is one small thing you can do this week that reflects who God made you to be?"),
          { slug: "final-check", title: "Final check", kind: "quiz", minutes: 5 },
        ],
      },
    ],
    quiz: [
      {
        question: "Who is the Becoming class for?",
        options: ["Pre-teens and teenagers", "Church leaders", "New parents"],
        answer: 0,
        why: "Becoming teaches identity and purpose for pre-teens and teenagers.",
      },
      {
        question: "Which journals go alongside Becoming?",
        options: ["Whispers: The Journal", "Who I Am Becoming", "Burn"],
        answer: 1,
        why: "Becoming goes alongside the Who I Am Becoming journals, for girls and for guys.",
      },
      bethElQuestion,
    ],
  },
  {
    slug: "whispers",
    name: "Whispers",
    meaning: byName("Whispers").meaning,
    summary: byName("Whispers").body,
    outcomes: ["Learn to recognise God’s voice", "Journal what He says", "Grow in conversation with Him"],
    modules: [
      {
        title: "Hearing His voice",
        summary: "How God speaks, and how to listen.",
        lessons: [
          { slug: "welcome", title: "Welcome to Whispers", kind: "video", minutes: 6, preview: true },
          { slug: "how-god-speaks", title: "How God speaks", kind: "video", minutes: 14 },
          { slug: "quiet-listening", title: "A time of quiet listening", kind: "audio", minutes: 10 },
          checkpoint("hearing-checkpoint", "Hearing His voice", "Describe a moment when you sensed God speaking to you."),
        ],
      },
      {
        title: "Journaling what He says",
        summary: "Writing down what you hear, and living it out.",
        lessons: [
          { slug: "journaling", title: "Journaling what He says", kind: "video", minutes: 12 },
          { slug: "journal-guide", title: "Study guide: journaling", kind: "pdf", minutes: 5 },
          checkpoint("journal-checkpoint", "Journaling what He says", "Share one entry from your journal this week, or what you are listening for."),
          { slug: "final-check", title: "Final check", kind: "quiz", minutes: 5 },
        ],
      },
    ],
    quiz: [
      {
        question: "What is Whispers about?",
        options: ["Hearing God and journaling what He says", "Leading worship", "Bible languages"],
        answer: 0,
        why: "Whispers is about learning to hear God and journal what He says.",
      },
      {
        question: "Which journal goes alongside Whispers?",
        options: ["Burn", "Whispers: The Journal", "Who I Am Becoming"],
        answer: 1,
        why: "The class goes alongside Whispers: The Journal.",
      },
      bethElQuestion,
    ],
  },
];

export const findCourse = (slug: string) => courses.find((c) => c.slug === slug);

/** Every lesson in order, with its module, for navigation and progress. */
export function courseLessons(course: Course) {
  return course.modules.flatMap((module, moduleIndex) =>
    module.lessons.map((lesson) => ({ lesson, module, moduleIndex, id: `${course.slug}/${lesson.slug}` })),
  );
}

export function findLesson(course: Course, lessonSlug: string) {
  const all = courseLessons(course);
  const index = all.findIndex((l) => l.lesson.slug === lessonSlug);
  if (index < 0) return null;
  return { ...all[index], index, prev: all[index - 1] ?? null, next: all[index + 1] ?? null, total: all.length };
}

export const courseMinutes = (course: Course) =>
  courseLessons(course).reduce((sum, { lesson }) => sum + (lesson.minutes ?? 0), 0);

export const lessonCount = (course: Course) => courseLessons(course).length;

export const isLessonId = (id: string) => {
  const [courseSlug, lessonSlug] = id.split("/");
  const course = findCourse(courseSlug ?? "");
  return !!course && !!lessonSlug && !!findLesson(course, lessonSlug);
};
