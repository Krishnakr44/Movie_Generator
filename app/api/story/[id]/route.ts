/**
 * GET /api/story/[id]
 * Returns a single story by ID for the frontend (chapter history, state).
 */
import { dbConnect } from "@/lib/db/mongodb";
import Story from "@/lib/db/schemas/story";
import { notFound, serverError } from "@/lib/api/errors";
import mongoose from "mongoose";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return notFound("Story not found");
    }
    await dbConnect();
    const story = await Story.findById(id).lean();
    if (!story) return notFound("Story not found");
    return Response.json({
      id: story._id.toString(),
      title: story.title,
      genre: story.genre,
      premise: story.premise,
      structure: story.structure,
      actCount: story.actCount,
      characters: story.characters ?? [],
      worldRules: story.worldRules ?? [],
      timelineEvents: story.timelineEvents ?? [],
      chapterHistory: story.chapterHistory ?? [],
      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
    });
  } catch (e) {
    console.error("[story/[id] GET]", e);
    return serverError();
  }
}
