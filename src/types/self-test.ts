// Shapes returned by the API's /self-tests endpoints.

export type SelfTestSummary = {
  slug: string;
  title: string;
  summary: string | null;
  question_count: number;
};

export type SelfTest = {
  slug: string;
  title: string;
  summary: string | null;
  intro: string | null;
  scale: string[]; // rating labels, lowest first; an answer is 1..scale.length
  questions: { id: string; prompt: string }[];
};

export type SelfTestScore = {
  key: string;
  name: string;
  description: string | null;
  score: number;
  max: number;
  percent: number;
};

export type SelfTestResult = {
  id: string;
  created_at: string;
  test: string;
  scores: SelfTestScore[]; // highest first
};
