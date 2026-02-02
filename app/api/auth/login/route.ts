import { NextRequest } from "next/server";
import { NextResponse } from "next/dist/server/web/spec-extension/response";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db/mongodb";
import { User } from "@/lib/db/schemas/user";
import { loginSchema } from "@/lib/auth/validate";
import { signToken } from "@/lib/auth/jwt";
import { buildSetAuthCookie } from "@/lib/auth/cookies";
import { isAuthConfigError } from "@/lib/auth/env";

/** Dummy hash for constant-time behaviour when user not found (avoid enumeration). */
const DUMMY_HASH =
  "$2a$12$dummy.dummy.dummy.dummy.dummy.dummy.dummy.dummy.dummy.dummy.dummy.dummy";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Validation failed" },
        { status: 400 }
      );
    }
    const { email, password } = parsed.data;

    await dbConnect();

    const user = (await User.findOne({ email }).select("password _id email createdAt").lean()) as {
      password: string;
      _id: { toString(): string };
      email: string;
      createdAt: Date;
    } | null;
    const hashToCompare = user?.password ?? DUMMY_HASH;
    const valid = await bcrypt.compare(password, hashToCompare);
    if (!user || !valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = await signToken(user._id.toString());
    const response = NextResponse.json({
      user: { id: user._id.toString(), email: user.email, createdAt: user.createdAt },
    });
    response.headers.set("Set-Cookie", buildSetAuthCookie(token));
    return response;
  } catch (e) {
    if (isAuthConfigError(e)) {
      return NextResponse.json(
        { error: "Auth not configured. Add JWT_SECRET (min 32 chars) and APP_URL to .env." },
        { status: 503 }
      );
    }
    console.error("[auth/login]", e);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
