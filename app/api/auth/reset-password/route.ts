import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db/mongodb";
import { User } from "@/lib/db/schemas/user";
import { resetPasswordSchema } from "@/lib/auth/validate";
import { hashResetToken } from "@/lib/auth/resetToken";
import { isAuthConfigError } from "@/lib/auth/env";

const SALT_ROUNDS = 12;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Validation failed" },
        { status: 400 }
      );
    }
    const { token, password } = parsed.data;

    await dbConnect();

    const hashedToken = hashResetToken(token);
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    })
      .select("_id")
      .lean();

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token. Request a new link." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await User.updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 },
      }
    );

    return NextResponse.json({ message: "Password reset successful. You can log in now." });
  } catch (e) {
    if (isAuthConfigError(e)) {
      return NextResponse.json(
        { error: "Auth not configured. Add JWT_SECRET and APP_URL to .env." },
        { status: 503 }
      );
    }
    console.error("[auth/reset-password]", e);
    return NextResponse.json({ error: "Reset failed" }, { status: 500 });
  }
}
