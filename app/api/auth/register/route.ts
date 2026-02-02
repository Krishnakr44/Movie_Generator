import { NextRequest } from "next/server";
import { NextResponse } from "next/dist/server/web/spec-extension/response";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db/mongodb";
import { User } from "@/lib/db/schemas/user";
import { registerSchema } from "@/lib/auth/validate";
import { signToken } from "@/lib/auth/jwt";
import { buildSetAuthCookie } from "@/lib/auth/cookies";
import { isAuthConfigError } from "@/lib/auth/env";

const SALT_ROUNDS = 12;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Validation failed" },
        { status: 400 }
      );
    }
    const { email, password } = parsed.data;

    await dbConnect();

    const existing = await User.findOne({ email }).select("_id").lean();
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ email, password: hashed });

    const token = await signToken(user._id.toString());
    const response = NextResponse.json(
      { user: { id: user._id.toString(), email: user.email, createdAt: user.createdAt } },
      { status: 201 }
    );
    response.headers.set("Set-Cookie", buildSetAuthCookie(token));
    return response;
  } catch (e) {
    if (isAuthConfigError(e)) {
      return NextResponse.json(
        { error: "Auth not configured. Add JWT_SECRET (min 32 chars) and APP_URL to .env." },
        { status: 503 }
      );
    }
    console.error("[auth/register]", e);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
