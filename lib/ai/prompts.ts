/**
 * Prompt assembly: injects story state (characters, rules, timeline, chapters)
 * so the AI never violates stored memory. System → Rules → Memory → Output.
 * When chapterGoal (and optionally userControls) are provided, uses the STORY ENGINE prompt system.
 */
import type {
  StoryStateSnapshot,
  CharacterMemory,
  WorldRule,
  TimelineEvent,
  ChapterRecord,
  Genre,
  UserControls,
} from "@/lib/types/story";
import {
  buildStoryEngineSystemPrompt,
  buildStoryEngineUserPrompt,
} from "@/lib/ai/story-engine-prompts";

const GENRE_GUIDANCE: Record<string, string> = {
  indian_mythology:
    "Write in the spirit of Indian mythology: deities, dharma, karma, and regional lore. Keep names and concepts consistent with the established world.",
  desi_sci_fi:
    "Indian/South Asian sci-fi: blend futuristic or alternate tech with desi culture, languages, and social contexts. Maintain internal logic.",
  folklore_horror:
    "Draw from Indian/South Asian folklore, regional ghost stories, and superstitions. Horror should feel rooted in the culture.",
  historical_fiction:
    "Historical fiction set in the Indian subcontinent. Respect period-appropriate language, customs, and events.",
  urban_fantasy_indian:
    "Contemporary Indian settings with magic or myth woven into modern life. Keep cultural details accurate.",
  other: "Follow the established tone and setting of the story.",
};

/** Build system prompt that encodes RULES and MEMORY; AI must not contradict this. */
export function buildSystemPrompt(opts: {
  title: string;
  genre: Genre;
  premise?: string;
  structure: "acts" | "chapters";
  actCount?: number;
  state: StoryStateSnapshot & { chapterHistory?: ChapterRecord[] };
  nextChapterIndex: number;
  nextAct?: number;
}): string {
  const {
    title,
    genre,
    premise,
    structure,
    actCount,
    state,
    nextChapterIndex,
    nextAct,
  } = opts;
  const genreGuide = GENRE_GUIDANCE[genre] ?? GENRE_GUIDANCE.other;

  const charactersBlock = formatCharacters(state.characters);
  const rulesBlock = formatWorldRules(state.worldRules);
  const timelineBlock = formatTimeline(state.timelineEvents);
  const chapterSummaries = formatChapterSummaries(state.chapterHistory ?? []);

  const structureNote =
    structure === "acts" && actCount != null && nextAct != null
      ? `This story is in ${actCount} acts. You are writing Chapter ${nextChapterIndex + 1}, Act ${nextAct}.`
      : `You are writing Chapter ${nextChapterIndex + 1}.`;

  return `You are a fiction writer for an Indian/niche fiction platform. Your output must NEVER violate the following story state.

# Story
Title: ${title}
Genre: ${genre}
${premise ? `Premise: ${premise}` : ""}

# CRITICAL: Story state (DO NOT contradict)
## Characters (alive/dead, traits, emotional state)
${charactersBlock}

## World rules (mythology, culture, constraints)
${rulesBlock}

## Timeline of events (in order)
${timelineBlock}

## Chapters so far (summaries)
${chapterSummaries}

# Instructions
- ${genreGuide}
- ${structureNote}
- Write only the new chapter prose. Do not repeat previous chapters.
- Do not kill or resurrect characters unless explicitly noted in the instruction.
- Do not break world rules. Stay consistent with the timeline and character states.
- Output raw chapter text only; no meta-commentary or "Chapter N" headers unless you title the chapter with a single line.`;
}

function formatCharacters(characters: CharacterMemory[]): string {
  if (!characters?.length) return "None defined yet.";
  return characters
    .map(
      (c) =>
        `- ${c.name}: ${c.traits?.join(", ") ?? "—"} | Alive: ${c.alive} | Emotional state: ${c.emotionalState}${c.lastKnown ? ` | Last: ${c.lastKnown}` : ""}`
    )
    .join("\n");
}

function formatWorldRules(rules: WorldRule[]): string {
  if (!rules?.length) return "None defined yet.";
  return rules.map((r) => `- [${r.category}] ${r.rule}`).join("\n");
}

function formatTimeline(events: TimelineEvent[]): string {
  if (!events?.length) return "None yet.";
  const sorted = [...events].sort(
    (a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime()
  );
  return sorted.map((e) => `- Ch${e.chapterIndex + 1}: ${e.summary}`).join("\n");
}

function formatChapterSummaries(chapters: ChapterRecord[]): string {
  if (!chapters?.length) return "None yet.";
  return chapters
    .map((ch) => `- Ch${ch.index + 1} (${ch.title}): ${ch.content.slice(0, 200)}...`)
    .join("\n");
}

/** Build user prompt for generate-chapter (next chapter) or continue (user-directed). */
export function buildUserPrompt(opts: {
  direction?: string;
  userPrompt?: string;
  isContinue: boolean;
}): string {
  if (opts.isContinue && opts.userPrompt) {
    return `Continue the story with this direction from the reader: ${opts.userPrompt}`;
  }
  if (opts.direction) {
    return `Write the next chapter with this direction: ${opts.direction}`;
  }
  return "Write the next chapter, advancing the plot naturally while respecting all story state above.";
}

/** Unified prompt builder: uses STORY ENGINE when chapterGoal is set, else legacy prompts. */
export function buildUnifiedPrompts(opts: {
  title: string;
  genre: Genre;
  premise?: string;
  structure: "acts" | "chapters";
  actCount?: number;
  state: StoryStateSnapshot & { chapterHistory?: ChapterRecord[] };
  nextChapterIndex: number;
  nextAct?: number;
  direction?: string;
  userPrompt?: string;
  isContinue: boolean;
  userControls?: Partial<UserControls>;
  chapterGoal?: string;
}): { systemPrompt: string; userPrompt: string } {
  const useStoryEngine = Boolean(opts.chapterGoal?.trim());

  if (useStoryEngine) {
    const genre = opts.userControls?.genre ?? opts.genre;
    const systemPrompt = buildStoryEngineSystemPrompt({
      story_state: opts.state,
      user_controls: { ...opts.userControls, genre },
      chapter_number: opts.nextChapterIndex + 1,
      chapter_goal: opts.chapterGoal!,
      title: opts.title,
      premise: opts.premise,
      structure: opts.structure,
      actCount: opts.actCount,
      nextAct: opts.nextAct,
    });
    const userPrompt = buildStoryEngineUserPrompt({
      chapter_goal: opts.chapterGoal!,
      direction: opts.direction,
      userPrompt: opts.userPrompt,
      isContinue: opts.isContinue,
    });
    return { systemPrompt, userPrompt };
  }

  const systemPrompt = buildSystemPrompt({
    title: opts.title,
    genre: opts.genre,
    premise: opts.premise,
    structure: opts.structure,
    actCount: opts.actCount,
    state: opts.state,
    nextChapterIndex: opts.nextChapterIndex,
    nextAct: opts.nextAct,
  });
  const userPrompt = buildUserPrompt({
    direction: opts.direction,
    userPrompt: opts.userPrompt,
    isContinue: opts.isContinue,
  });
  return { systemPrompt, userPrompt };
}
