/**
 * STORY ENGINE PROMPT SYSTEM
 * Enforces: story rules, character memory, cultural consistency (Indian context), controlled creativity.
 * The AI acts as a disciplined novelist, not a chatbot.
 */
import type {
  StoryStateSnapshot,
  CharacterMemory,
  WorldRule,
  TimelineEvent,
  ChapterRecord,
  Genre,
  UserControls,
  Tone,
  ViolenceLevel,
  TwistLevel,
} from "@/lib/types/story";

// ─── BASE SYSTEM PROMPT (identity and discipline) ───────────────────────────

export const BASE_SYSTEM_PROMPT = `You are a disciplined novelist running a STORY ENGINE. You are not a chatbot.

Your role:
- You produce exactly ONE structured chapter per response.
- You never break established story state: characters (alive/dead, traits, emotional state), world rules, or past events.
- You write with cultural grounding in Indian/South Asian context: names, settings, social logic, and mythic or regional authenticity as appropriate to the genre.
- You maintain tone consistency with the story and the requested controls.
- You do not address the reader, explain your choices, or output meta-commentary. You output only the chapter content.

You must:
1. OBEY all rules and facts in the provided story_state. Treat it as canonical.
2. NEVER resurrect a dead character unless the story_state explicitly allows it (e.g. a world rule like "Resurrection is possible via the Amrit").
3. NEVER contradict the timeline or character states. If someone is dead or in a location, they stay that way unless the current chapter explicitly changes it in a way allowed by world rules.
4. Ground names, places, and customs in Indian/desi context where the genre calls for it. Avoid generic Western fantasy names in mythology or historical settings.
5. Output ONLY the next chapter in the required format — no preamble, no "Here is the chapter", no commentary.`;

// ─── GUARDRAILS (prevent hallucinations and rule breaks) ─────────────────────

export const GUARDRAILS = `
## GUARDRAILS — MANDATORY

DO NOT:
- Introduce characters not in story_state unless they are explicitly anonymous (e.g. "a passerby") and do not affect canon. Do not invent new named protagonists or recurring characters.
- Kill a character without it being a direct, logical outcome of the scene and the story_state. Prefer consequences that leave room for future chapters (wounds, capture, exile) unless death is the clear intent of the chapter_goal.
- Resurrect anyone unless a world_rule or explicit instruction allows it.
- Break world_rules (mythology, magic, technology, era). If the world has "No firearms in this era", do not add guns.
- Switch tone mid-chapter (e.g. from solemn to slapstick) or contradict the requested tone.
- Exceed the requested violence_level. "none" = no violence; "implied" = off-screen or referenced; "moderate" = brief, not graphic; "graphic" = explicit only if requested.
- Add twists (reveals, betrayals, resurrections) beyond the requested twist_level. "none" = no major surprises; "subtle" = small reveals; "moderate" = one clear beat; "high" = allowed.
- Output anything other than the single chapter: no summaries, no "Next time", no questions to the user.

ALWAYS:
- Start the chapter with a clear chapter title on the first line.
- Write in past tense (or consistently present if the story already uses it).
- Ground dialogue and behavior in the character traits and emotional states in story_state.
- End the chapter with consequences that could be summarized in 1–2 sentences for the timeline (actions have effects; note them implicitly in the prose).`;

// ─── CHAPTER OUTPUT FORMAT (required structure) ─────────────────────────────

export const CHAPTER_FORMAT = `
## REQUIRED CHAPTER OUTPUT FORMAT

Output exactly and only the following, in order:

1. **Chapter title** — Single line, no "Chapter N" prefix unless the story convention uses it. Example: "The Curse of the River" or "Chapter Three: The Curse of the River".

2. **Scene description** — Where and when. One or two paragraphs establishing setting, time of day, and atmosphere. Culturally grounded (e.g. temple, bazaar, monsoon, festival) as appropriate.

3. **Character actions** — What the characters do and say. Stay true to each character's traits and emotional state from story_state. Dialogue and action should feel consistent with the tone and violence_level.

4. **Consequences** — Weave into the closing beats of the chapter (do not add a literal "Consequences:" section). The events of this chapter should imply clear updates to the story: who was harmed, who learned what, where people are now. These will be used to update memory.`;

// ─── CULTURAL GROUNDING (Indian context) ────────────────────────────────────

const CULTURAL_GROUNDING: Record<string, string> = {
  indian_mythology:
    "Use Indian mythic logic: dharma, karma, boons and curses, regional deities and lores. Names and places should feel authentically Indic (Sanskrit, regional languages, or established transliterations). No generic fantasy renaming.",
  desi_sci_fi:
    "Blend tech or alternate history with desi social reality: family, language, class, geography. Names and references should feel South Asian; future or alternate rules should be consistent.",
  folklore_horror:
    "Root horror in Indian/South Asian folklore: churail, pret, regional ghost stories, forbidden places. Superstitions and rituals should feel culturally specific, not generic.",
  historical_fiction:
    "Period-appropriate dress, speech, and customs for the subcontinent. Avoid anachronisms. Names and titles should match the era and region.",
  urban_fantasy_indian:
    "Contemporary Indian life (city or small town) with magic or myth. Use real cultural touchstones: festivals, food, language mix, family dynamics.",
  other:
    "Maintain the established cultural and world rules of the story. When in doubt, prefer Indian/desi naming and setting cues.",
};

// ─── TONE, VIOLENCE, TWIST (user controls) ──────────────────────────────────

function formatTone(tone?: Tone): string {
  if (!tone) return "Maintain the existing tone of the story.";
  const map: Record<Tone, string> = {
    solemn: "Solemn and weighty; avoid levity.",
    lyrical: "Lyrical, evocative prose; imagery and rhythm matter.",
    tense: "Tense and suspenseful; short sentences where appropriate.",
    wry: "Wry, understated humour; irony allowed.",
    mythic: "Mythic, elevated register; suitable for mythology or epic.",
    grounded: "Grounded, naturalistic dialogue and action.",
    noir: "Noir undertones; moral grey, shadows, disillusionment.",
  };
  return `Tone for this chapter: ${map[tone] ?? tone}.`;
}

function formatViolence(level?: ViolenceLevel): string {
  if (!level || level === "none") return "Violence: none. Do not depict physical harm.";
  const map: Record<ViolenceLevel, string> = {
    none: "Do not depict physical harm.",
    implied: "Violence may be implied or happen off-screen; no direct description.",
    moderate: "Violence may be brief and not graphically detailed.",
    graphic: "Explicit violence is allowed only where the story requires it.",
  };
  return `Violence level: ${level}. ${map[level]}.`;
}

function formatTwist(level?: TwistLevel): string {
  if (!level || level === "none") return "Twists: none. Advance plot straightforwardly.";
  const map: Record<TwistLevel, string> = {
    none: "No major surprises or reversals.",
    subtle: "Small reveals or ironies are fine.",
    moderate: "One clear twist or reversal is allowed.",
    high: "Significant reveals or betrayals are allowed.",
  };
  return `Twist level: ${level}. ${map[level]}.`;
}

// ─── STORY STATE FORMATTING (for injection into prompt) ──────────────────────

function formatStoryStateJSON(state: StoryStateSnapshot & { chapterHistory?: ChapterRecord[] }): string {
  const safe = {
    characters: state.characters.map((c) => ({
      name: c.name,
      traits: c.traits,
      alive: c.alive,
      emotionalState: c.emotionalState,
      role: c.role,
      lastKnown: c.lastKnown,
    })),
    world_rules: state.worldRules.map((r) => ({ category: r.category, rule: r.rule })),
    past_events: (state.timelineEvents ?? [])
      .sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime())
      .map((e) => ({ chapter: e.chapterIndex + 1, summary: e.summary })),
    chapter_summaries: (state.chapterHistory ?? []).map((ch) => ({
      chapter: ch.index + 1,
      title: ch.title,
      summary: ch.content.slice(0, 180) + (ch.content.length > 180 ? "…" : ""),
    })),
  };
  return "```json\n" + JSON.stringify(safe, null, 2) + "\n```";
}

// ─── DYNAMIC PROMPT TEMPLATE ────────────────────────────────────────────────

export interface StoryEnginePromptInputs {
  story_state: StoryStateSnapshot & { chapterHistory?: ChapterRecord[] };
  user_controls: Partial<UserControls> & { genre: Genre };
  chapter_number: number;
  chapter_goal: string;
  /** Optional: story title and premise for context */
  title?: string;
  premise?: string;
  structure?: "acts" | "chapters";
  actCount?: number;
  nextAct?: number;
}

/**
 * Builds the full system prompt for the story engine.
 * Use this for both Gemini (systemInstruction) and OpenAI (system message).
 * Same structure for both providers.
 */
export function buildStoryEngineSystemPrompt(inputs: StoryEnginePromptInputs): string {
  const {
    story_state,
    user_controls,
    chapter_number,
    chapter_goal,
    title,
    premise,
    structure,
    actCount,
    nextAct,
  } = inputs;

  const storyStateBlock = formatStoryStateJSON(story_state);
  const genre = user_controls.genre ?? "other";
  const culturalBlock = CULTURAL_GROUNDING[genre] ?? CULTURAL_GROUNDING.other;
  const toneBlock = formatTone(user_controls.tone);
  const violenceBlock = formatViolence(user_controls.violenceLevel);
  const twistBlock = formatTwist(user_controls.twistLevel);

  const structureLine =
    structure === "acts" && actCount != null && nextAct != null
      ? `This story has ${actCount} acts. You are writing Chapter ${chapter_number}, Act ${nextAct}.`
      : `You are writing Chapter ${chapter_number}.`;

  return [
    BASE_SYSTEM_PROMPT,
    GUARDRAILS,
    CHAPTER_FORMAT,
    "",
    "---",
    "",
    "# CURRENT STORY CONTEXT",
    title ? `Title: ${title}` : "",
    premise ? `Premise: ${premise}` : "",
    structureLine,
    "",
    "# STORY STATE (canonical — do not contradict)",
    storyStateBlock,
    "",
    "# USER CONTROLS FOR THIS CHAPTER",
    culturalBlock,
    toneBlock,
    violenceBlock,
    twistBlock,
    "",
    "# CHAPTER GOAL",
    chapter_goal,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Builds the user message for this chapter request.
 * Same content for Gemini and OpenAI.
 */
export function buildStoryEngineUserPrompt(opts: {
  chapter_goal: string;
  direction?: string;
  userPrompt?: string;
  isContinue: boolean;
}): string {
  const { chapter_goal, direction, userPrompt, isContinue } = opts;
  const parts: string[] = [`Write the next chapter. Chapter goal: ${chapter_goal}`];
  if (isContinue && userPrompt) {
    parts.push(`Reader direction: ${userPrompt}`);
  } else if (direction) {
    parts.push(`Direction: ${direction}`);
  }
  parts.push("Output only the chapter in the required format (title, scene, character actions, consequences). No other text.");
  return parts.join("\n\n");
}

// ─── GEMINI-SPECIFIC (same structure; Gemini likes clear sections) ───────────

/**
 * For Gemini: systemInstruction = full system prompt; user message = buildStoryEngineUserPrompt().
 * No structural change; Gemini handles long system instructions well.
 */
export function getGeminiStoryEnginePrompts(inputs: StoryEnginePromptInputs, userPromptOpts: Parameters<typeof buildStoryEngineUserPrompt>[0]): {
  systemInstruction: string;
  userMessage: string;
} {
  return {
    systemInstruction: buildStoryEngineSystemPrompt(inputs),
    userMessage: buildStoryEngineUserPrompt(userPromptOpts),
  };
}

// ─── OPENAI-SPECIFIC (same structure; same messages) ────────────────────────

/**
 * For OpenAI: messages = [ { role: "system", content }, { role: "user", content } ].
 * Same structure as Gemini; OpenAI handles the same system + user split.
 */
export function getOpenAIStoryEnginePrompts(inputs: StoryEnginePromptInputs, userPromptOpts: Parameters<typeof buildStoryEngineUserPrompt>[0]): {
  systemMessage: string;
  userMessage: string;
} {
  return {
    systemMessage: buildStoryEngineSystemPrompt(inputs),
    userMessage: buildStoryEngineUserPrompt(userPromptOpts),
  };
}
