import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthCookieFromHeader, buildClearAuthCookie } from "@/lib/auth/cookies";
import { verifyToken } from "@/lib/auth/jwt";

/** Paths that require authentication. Add or remove as needed. */
const PROTECTED_PATHS = ["/dashboard", "/story"];

const LOGIN_PATH = "/login";

function isProtected(pathname: string): boolean {
  return PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!isProtected(pathname)) {
    return NextResponse.next();
  }

  const cookieHeader = request.headers.get("cookie");
  const token = getAuthCookieFromHeader(cookieHeader);
  if (!token) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  let payload = null;
  try {
    payload = await verifyToken(token);
  } catch {
    payload = null;
  }
  if (!payload) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("from", pathname);
    const res = NextResponse.redirect(loginUrl);
    res.headers.set("Set-Cookie", buildClearAuthCookie());
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/story/:path*"],
};
