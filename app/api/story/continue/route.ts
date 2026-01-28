/**
 * POST /api/story/continue
 * Continues the story (next chapter) with optional user direction. Uses same state memory.
 */
import { dbConnect } from "@/lib/db/mongodb";
import Story from "@/lib/db/schemas/story";
import { apiError, notFound, rateLimited, serverError } from "@/lib/api/errors";
import { getClientIp, parseJson } from "@/lib/api/utils";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rateLimit";
import { ContinueStorySchema } from "@/lib/api/validate";
import { buildUnifiedPrompts } from "@/lib/ai/prompts";
import { generateText } from "@/lib/ai/provider";
import { getAIProvider } from "@/lib/ai/provider";
import type {
  ChapterRecord,
  TimelineEvent,
  Genre,
  StoryStateSnapshot,
} from "@/lib/types/story";
import mongoose from "mongoose";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return rateLimited();
  }
  const headers: Record<string, string> = {};
  const { remaining, resetAt } = getRateLimitHeaders(ip);
  headers["X-RateLimit-Remaining"] = String(remaining);
  headers["X-RateLimit-Reset"] = String(resetAt);

  try {
    const body = parseJson<unknown>(await request.text());
    if (body == null) return apiError("JSON body required", 400);
    const parsed = ContinueStorySchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { storyId, userPrompt, userControls, chapterGoal } = parsed.data;

    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      return notFound("Story not found");
    }

    await dbConnect();
    const story = await Story.findById(storyId);
    if (!story) return notFound("Story not found");

    const nextIndex = (story.chapterHistory?.length ?? 0);
    let nextAct: number | undefined;
    if (story.structure === "acts" && story.actCount) {
      const actSize = Math.ceil(20 / story.actCount);
      nextAct = Math.min(
        story.actCount,
        Math.floor(nextIndex / actSize) + 1
      );
    }

    const state: StoryStateSnapshot & { chapterHistory?: ChapterRecord[] } = {
      characters: (story.characters ?? []) as unknown as StoryStateSnapshot["characters"],
      worldRules: (story.worldRules ?? []) as unknown as StoryStateSnapshot["worldRules"],
      timelineEvents: (story.timelineEvents ?? []) as unknown as StoryStateSnapshot["timelineEvents"],
      chapterHistory: (story.chapterHistory ?? []) as unknown as ChapterRecord[],
    };
    const { systemPrompt, userPrompt: userPromptText } = buildUnifiedPrompts({
      title: story.title,
      genre: story.genre as Genre,
      premise: story.premise,
      structure: story.structure,
      actCount: story.actCount,
      state,
      nextChapterIndex: nextIndex,
      nextAct,
      userPrompt,
      isContinue: true,
      userControls: userControls ?? undefined,
      chapterGoal: chapterGoal ?? undefined,
    });

    const content = await generateText(systemPrompt, userPromptText, {
      maxTokens: 2500,
      temperature: 0.85,
    });

    const trimmed = content.trim();
    const title =
      trimmed.includes("\n")
        ? trimmed.split("\n")[0].replace(/^#+\s*|^Chapter\s+\d+[:.]?\s*/i, "").slice(0, 120) || `Chapter ${nextIndex + 1}`
        : `Chapter ${nextIndex + 1}`;
    const chapterContent =
      trimmed.includes("\n") ? trimmed.slice(trimmed.indexOf("\n") + 1).trim() : trimmed;

    const chapter: ChapterRecord = {
      index: nextIndex,
      title,
      content: chapterContent,
      act: nextAct,
      stateSnapshot: state,
      createdAt: new Date().toISOString(),
    };

    const timelineEvent: TimelineEvent = {
      chapterIndex: nextIndex,
      summary: chapterContent.slice(0, 200) + (chapterContent.length > 200 ? "…" : ""),
      occurredAt: new Date().toISOString(),
    };

    story.chapterHistory = [...(story.chapterHistory ?? []), chapter as unknown as Record<string, unknown>];
    story.timelineEvents = [...(story.timelineEvents ?? []), timelineEvent as unknown as Record<string, unknown>];
    story.updatedAt = new Date();
    await story.save();

    return Response.json(
      {
        storyId: story._id.toString(),
        chapter: { index: chapter.index, title: chapter.title, content: chapter.content },
        provider: getAIProvider(),
      },
      { headers }
    );
  } catch (e) {
    console.error("[story/continue]", e);
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("No AI provider") || msg.includes("GEMINI_API_KEY") || msg.includes("OPENAI_API_KEY")) {
      return apiError(msg.includes("No AI provider") ? msg : "AI provider not configured.", 503);
    }
    if (msg.includes("404") || msg.includes("not found") || msg.includes("Not Found")) {
      return apiError("AI model unavailable. Set GEMINI_MODEL in .env to a valid model (e.g. gemini-2.5-flash).", 503);
    }
    return serverError();
  }
}
