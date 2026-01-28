/**
 * POST /api/story/create
 * Creates a new story with initial state (characters, world rules). No AI call.
 */
import { dbConnect } from "@/lib/db/mongodb";
import Story from "@/lib/db/schemas/story";
import { apiError, serverError } from "@/lib/api/errors";
import { CreateStorySchema } from "@/lib/api/validate";
import type { CharacterMemory, WorldRule } from "@/lib/types/story";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = CreateStorySchema.safeParse(body);
    if (!parsed.success) {
      const msg =
        parsed.error.flatten().fieldErrors?.title?.[0] ?? parsed.error.message;
      return apiError("Invalid input: " + msg, 400);
    }
    const input = parsed.data;

    // Validate actCount when structure is acts
    if (input.structure === "acts" && !input.actCount) {
      return apiError("actCount is required when structure is 'acts'", 400);
    }

    await dbConnect();

    const characters: CharacterMemory[] = input.initialCharacters.map((c) => ({
      name: c.name,
      traits: c.traits ?? [],
      alive: c.alive ?? true,
      emotionalState: "neutral",
      role: c.role,
      lastKnown: c.lastKnown,
    }));
    const worldRules: WorldRule[] = input.initialWorldRules;

    const story = await Story.create({
      title: input.title,
      genre: input.genre,
      premise: input.premise,
      structure: input.structure,
      actCount: input.actCount,
      characters,
      worldRules,
      timelineEvents: [],
      chapterHistory: [],
    });

    return Response.json({
      id: story._id.toString(),
      title: story.title,
      genre: story.genre,
      structure: story.structure,
      actCount: story.actCount,
      characters: story.characters,
      worldRules: story.worldRules,
    });
  } catch (e) {
    console.error("[story/create]", e);
    const msg = e instanceof Error ? e.message : String(e);
    const code = (e as NodeJS.ErrnoException)?.code;
    const mongoCode = (e as { code?: number; codeName?: string })?.codeName ?? (e as { code?: number })?.code;
    if (msg.includes("MONGODB_URI") || msg.includes("not set")) {
      return apiError("Database not configured. Set MONGODB_URI in .env (see env.example).", 503);
    }
    if (code === "ECONNREFUSED" || code === "ENOTFOUND" || msg.includes("connect")) {
      return apiError("Database connection failed. Check MONGODB_URI and that MongoDB is running.", 503);
    }
    if (mongoCode === "AtlasError" || msg.includes("Authentication failed") || msg.includes("bad auth")) {
      return apiError("Database authentication failed. Check username and password in MONGODB_URI (Atlas).", 503);
    }
    return serverError();
  }
}
