import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SelfTestRunner } from "@/components/self-test/SelfTestRunner";
import { SelfTestsUnavailable } from "@/components/self-test/SelfTestsUnavailable";
import { api, ApiError } from "@/lib/api";
import type { SelfTest } from "@/types/self-test";

/** The test, or null if the API can't be reached. An unknown slug is a 404. */
async function getTest(slug: string): Promise<SelfTest | null> {
  try {
    return await api<SelfTest>(`/self-tests/${encodeURIComponent(slug)}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    console.error(`Self-test "${slug}" unavailable:`, err);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps<"/self-test/[slug]">): Promise<Metadata> {
  const test = await getTest((await params).slug);
  return test ? { title: test.title, description: test.summary ?? undefined } : { title: "Self-tests" };
}

export default async function SelfTestPage({ params }: PageProps<"/self-test/[slug]">) {
  const test = await getTest((await params).slug);
  return test ? <SelfTestRunner test={test} /> : <SelfTestsUnavailable />;
}
