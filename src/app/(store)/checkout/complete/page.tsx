import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OrderComplete } from "@/components/store/OrderComplete";

export const metadata: Metadata = { title: "Order complete", robots: { index: false } };

export default async function OrderCompletePage({ searchParams }: PageProps<"/checkout/complete">) {
  const { ref } = await searchParams;
  // Only our own references (EG- plus six letters or digits) are shown back on the page.
  if (typeof ref !== "string" || !/^EG-[A-Z0-9]{6}$/.test(ref)) redirect("/books");
  return <OrderComplete reference={ref} />;
}
