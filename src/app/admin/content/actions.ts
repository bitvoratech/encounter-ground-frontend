"use server";

import { updateTag } from "next/cache";
import { getStaff } from "@/lib/admin";
import { SITE_CONTENT_TAG } from "@/lib/siteContent";

/** After an edit in Admin → Site content, show the new wording on the website straight away. */
export async function refreshSiteContent() {
  if ((await getStaff()).status !== "staff") return;
  updateTag(SITE_CONTENT_TAG);
}
