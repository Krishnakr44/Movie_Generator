import { z } from "zod";

const CharacterInputSchema = z.object({
  name: z.string().min(1).max(200),
  traits: z.array(z.string()).optional().default([]),
  alive: z.boolean().optional().default(true),
  role: z.string().optional(),
  lastKnown: z.string().optional(),
});

const WorldRuleSchema = z.object({
  category: z.string().min(1).max(100),
  rule: z.string().min(1).max(1000),
});

export const CreateStorySchema = z.object({
  title: z.string().min(1).max(300),
  genre: z.enum([
    "indian_mythology",
    "desi_sci_fi",
    "folklore_horror",
    "historical_fiction",
    "urban_fantasy_indian",
    "other",
  ]),
  premise: z.string().max(2000).optional(),
  initialCharacters: z.array(CharacterInputSchema).optional().default([]),
  initialWorldRules: z.array(WorldRuleSchema).optional().default([]),
  structure: z.enum(["acts", "chapters"]),
  actCount: z.number().int().min(1).max(10).optional(),
});

const UserControlsSchema = z.object({
  genre: z.enum([
    "indian_mythology",
    "desi_sci_fi",
    "folklore_horror",
    "historical_fiction",
    "urban_fantasy_indian",
    "other",
  ]).optional(),
  tone: z.enum(["solemn", "lyrical", "tense", "wry", "mythic", "grounded", "noir"]).optional(),
  violenceLevel: z.enum(["none", "implied", "moderate", "graphic"]).optional(),
  twistLevel: z.enum(["none", "subtle", "moderate", "high"]).optional(),
});

export const GenerateChapterSchema = z.object({
  storyId: z.string().min(1),
  direction: z.string().max(2000).optional(),
  userControls: UserControlsSchema.optional(),
  chapterGoal: z.string().min(1).max(500).optional(),
});

export const ContinueStorySchema = z.object({
  storyId: z.string().min(1),
  userPrompt: z.string().max(2000).optional(),
  userControls: UserControlsSchema.optional(),
  chapterGoal: z.string().min(1).max(500).optional(),
});

export type CreateStoryBody = z.infer<typeof CreateStorySchema>;
export type GenerateChapterBody = z.infer<typeof GenerateChapterSchema>;
export type ContinueStoryBody = z.infer<typeof ContinueStorySchema>;
