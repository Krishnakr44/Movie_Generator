import { Schema } from "mongoose";

export const TimelineEventSchema = new Schema(
  {
    chapterIndex: { type: Number, required: true },
    summary: { type: String, required: true },
    occurredAt: { type: String, required: true },
  },
  { _id: false }
);
