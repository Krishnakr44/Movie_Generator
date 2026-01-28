import mongoose, { Schema, model, models } from "mongoose";

/** Embedded schema for CharacterMemory (used inside Story) */
const CharacterSchema = new Schema(
  {
    name: { type: String, required: true },
    traits: [{ type: String }],
    alive: { type: Boolean, default: true },
    emotionalState: { type: String, default: "neutral" },
    role: { type: String },
    lastKnown: { type: String },
  },
  { _id: false }
);

export const CharacterSchemaDefinition = CharacterSchema;
export type CharacterDoc = mongoose.InferSchemaType<typeof CharacterSchema>;

// No standalone model; used as subdocument in Story
export function getCharacterSchema(): Schema {
  return CharacterSchema;
}
