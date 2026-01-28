import { Schema } from "mongoose";

export const ChapterRecordSchema = new Schema(
  {
    index: { type: Number, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    act: { type: Number },
    stateSnapshot: { type: Schema.Types.Mixed },
    createdAt: { type: String, required: true },
  },
  { _id: false }
);
