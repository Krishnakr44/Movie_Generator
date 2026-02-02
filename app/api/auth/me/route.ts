import { NextRequest } from "next/server";
import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { dbConnect } from "@/lib/db/mongodb";
import { User } from "@/lib/db/schemas/user";
import { verifyToken } from "@/lib/auth/jwt";
import { AUTH_COOKIE_NAME } from "@/lib/auth/cookies";
import { isAuthConfigError } from "@/lib/auth/env";

export const dynamic = "force-dynamic";

/** GET /api/auth/me — return current user from JWT cookie (no password). */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value ?? null;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
    }

    await dbConnect();
    const user = (await User.findById(payload.sub)
      .select("email createdAt _id")
      .lean()) as { _id: { toString(): string }; email: string; createdAt: Date } | null;
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }
    return NextResponse.json({
      user: { id: user._id.toString(), email: user.email, createdAt: user.createdAt },
    });
  } catch (e) {
    if (isAuthConfigError(e)) {
      return NextResponse.json(
        { error: "Auth not configured. Add JWT_SECRET (min 32 chars) and APP_URL to .env." },
        { status: 503 }
      );
    }
    console.error("[auth/me]", e);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
