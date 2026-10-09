import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SelfTestRunner } from "@/components/self-test/SelfTestRunner";
import { api, ApiError } from "@/lib/api";
import type { SelfTest } from "@/types/self-test";

async function getTest(slug: string) {
  try {
    return await api<SelfTest>(`/self-tests/${encodeURIComponent(slug)}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }
}

export async function generateMetadata({ params }: PageProps<"/self-test/[slug]">): Promise<Metadata> {
  const test = await getTest((await params).slug);
  return { title: test.title, description: test.summary ?? undefined };
}

export default async function SelfTestPage({ params }: PageProps<"/self-test/[slug]">) {
  const test = await getTest((await params).slug);
  return <SelfTestRunner test={test} />;
}
