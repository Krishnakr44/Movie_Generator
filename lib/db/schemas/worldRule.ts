import { Schema } from "mongoose";

/** Embedded schema for WorldRule */
export const WorldRuleSchema = new Schema(
  {
    category: { type: String, required: true },
    rule: { type: String, required: true },
  },
  { _id: false }
);
