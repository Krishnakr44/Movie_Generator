import mongoose, { Schema, model, models } from "mongoose";

export interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  createdAt: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const UserSchema = new Schema<UserDoc>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, select: false },
    createdAt: { type: Date, default: Date.now },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: false }
);

// Prevent model recompilation in dev (Next.js hot reload)
export const User = models.User ?? model<UserDoc>("User", UserSchema);
