/**
 * Shared types for story state memory and API contracts.
 * System → Rules → Memory → Controlled Output.
 */

export type EmotionalState =
  | "neutral"
  | "hopeful"
  | "angry"
  | "grieving"
  | "fearful"
  | "determined"
  | "joyful"
  | "betrayed"
  | "resigned"
  | string;

export interface CharacterMemory {
  name: string;
  traits: string[];
  alive: boolean;
  emotionalState: EmotionalState;
  /** Optional: role (e.g. protagonist, antagonist) */
  role?: string;
  /** Optional: last known location/situation */
  lastKnown?: string;
}

export interface WorldRule {
  /** Category: mythology, cultural, magic, geography */
  category: string;
  /** Constraint the AI must not violate */
  rule: string;
}

export interface TimelineEvent {
  chapterIndex: number;
  summary: string;
  /** ISO date string for ordering */
  occurredAt: string;
}

export interface ChapterRecord {
  index: number;
  title: string;
  content: string;
  /** Act number if act-based (1-based) */
  act?: number;
  /** Snapshot of story state after this chapter (for continuity) */
  stateSnapshot?: StoryStateSnapshot;
  createdAt: string;
}

export interface StoryStateSnapshot {
  characters: CharacterMemory[];
  worldRules: WorldRule[];
  timelineEvents: TimelineEvent[];
}

/** In-memory / DB story state: single source of truth for AI constraints */
export interface StoryState {
  characters: CharacterMemory[];
  worldRules: WorldRule[];
  timelineEvents: TimelineEvent[];
  chapterHistory: ChapterRecord[];
}

export type Genre =
  | "indian_mythology"
  | "desi_sci_fi"
  | "folklore_horror"
  | "historical_fiction"
  | "urban_fantasy_indian"
  | "other";

export interface CreateStoryInput {
  title: string;
  genre: Genre;
  /** Optional seed: premise, setting, or initial conflict */
  premise?: string;
  /** Initial characters to populate story state */
  initialCharacters?: Omit<CharacterMemory, "emotionalState">[];
  /** Initial world rules (e.g. "No character can use modern tech in this era") */
  initialWorldRules?: WorldRule[];
  /** Act-based (e.g. 3 acts) or chapter-based */
  structure: "acts" | "chapters";
  /** If acts: how many acts */
  actCount?: number;
}

/** User-controlled levers for generation (tone, safety, surprise). */
export type Tone =
  | "solemn"
  | "lyrical"
  | "tense"
  | "wry"
  | "mythic"
  | "grounded"
  | "noir";

export type ViolenceLevel = "none" | "implied" | "moderate" | "graphic";
export type TwistLevel = "none" | "subtle" | "moderate" | "high";

export interface UserControls {
  genre: Genre;
  tone?: Tone;
  violenceLevel?: ViolenceLevel;
  twistLevel?: TwistLevel;
}

/** Single-sentence goal for the next chapter (e.g. "Reveal the curse at the temple"). */
export type ChapterGoal = string;

export interface GenerateChapterInput {
  storyId: string;
  /** Optional: user-directed beat or prompt for this chapter */
  direction?: string;
  /** Optional: story-engine controls and chapter goal */
  userControls?: Partial<UserControls>;
  chapterGoal?: ChapterGoal;
}

export interface ContinueStoryInput {
  storyId: string;
  /** Optional: user's continuation prompt (e.g. "then the temple collapses") */
  userPrompt?: string;
  userControls?: Partial<UserControls>;
  chapterGoal?: ChapterGoal;
}

export type AIProvider = "gemini" | "openai";
