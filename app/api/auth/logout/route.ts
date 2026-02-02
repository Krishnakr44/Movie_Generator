import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { buildClearAuthCookie } from "@/lib/auth/cookies";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", buildClearAuthCookie());
  return response;
}
