import { NextResponse, type NextRequest } from "next/server";
import { getStaff } from "@/lib/admin";
import { API_URL } from "@/lib/api";

// Downloads the registrations as CSV or Excel. A plain link can't send the sign-in token the API
// needs, so this route does it for the signed-in staff member and passes the file straight on.
// It keeps whatever search and filter the list was showing, so the file matches the screen.

const KEEP = ["event", "format", "q", "transport"];

export async function GET(request: NextRequest) {
  const staff = await getStaff();
  if (staff.status !== "staff") return new NextResponse("This download is for the ministry team.", { status: 403 });

  const params = new URLSearchParams();
  for (const key of KEEP) {
    const value = request.nextUrl.searchParams.get(key);
    if (value) params.set(key, value);
  }

  const upstream = await fetch(`${API_URL}/admin/registrations/export?${params}`, {
    headers: { Authorization: `Bearer ${staff.token}` },
    cache: "no-store",
  });
  if (!upstream.ok) return new NextResponse("The download didn’t work. Please go back and try again.", { status: 502 });

  return new NextResponse(upstream.body, {
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/octet-stream",
      "content-disposition": upstream.headers.get("content-disposition") ?? "attachment",
      "cache-control": "no-store",
    },
  });
}
