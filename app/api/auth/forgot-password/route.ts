import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/mongodb";
import { User } from "@/lib/db/schemas/user";
import { forgotPasswordSchema } from "@/lib/auth/validate";
import { generateResetToken } from "@/lib/auth/resetToken";
import { getAppUrl, isAuthConfigError } from "@/lib/auth/env";

const RESET_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Validation failed" },
        { status: 400 }
      );
    }
    const { email } = parsed.data;

    await dbConnect();

    const user = await User.findOne({ email }).select("_id").lean();
    // Always return same success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ message: "If an account exists, you will receive a reset link." });
    }

    const { token, hashed } = generateResetToken();
    const expires = new Date(Date.now() + RESET_EXPIRY_MS);
    await User.updateOne(
      { _id: user._id },
      { $set: { resetPasswordToken: hashed, resetPasswordExpires: expires } }
    );

    const appUrl = getAppUrl();
    const resetLink = `${appUrl}/reset-password?token=${encodeURIComponent(token)}`;
    // Log only in dev / or send via email in production
    console.log("[auth/forgot-password] Reset link for", email, ":", resetLink);

    return NextResponse.json({
      message: "If an account exists, you will receive a reset link.",
    });
  } catch (e) {
    if (isAuthConfigError(e)) {
      return NextResponse.json(
        { error: "Auth not configured. Add JWT_SECRET (min 32 chars) and APP_URL to .env." },
        { status: 503 }
      );
    }
    console.error("[auth/forgot-password]", e);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
