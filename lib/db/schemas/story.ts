import mongoose, { Schema, model, models } from "mongoose";

export interface StoryDoc extends mongoose.Document {
  title: string;
  genre: string;
  premise?: string;
  structure: "acts" | "chapters";
  actCount?: number;
  characters: Record<string, unknown>[];
  worldRules: Record<string, unknown>[];
  timelineEvents: Record<string, unknown>[];
  chapterHistory: Record<string, unknown>[];
  createdAt: Date;
  updatedAt: Date;
}

const StorySchema = new Schema(
  {
    title: { type: String, required: true },
    genre: { type: String, required: true },
    premise: { type: String },
    structure: { type: String, enum: ["acts", "chapters"], required: true },
    actCount: { type: Number },

    characters: [Schema.Types.Mixed],
    worldRules: [Schema.Types.Mixed],
    timelineEvents: [Schema.Types.Mixed],
    chapterHistory: [Schema.Types.Mixed],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Story = (models.Story ?? model<StoryDoc>("Story", StorySchema)) as mongoose.Model<StoryDoc>;
export default Story;
