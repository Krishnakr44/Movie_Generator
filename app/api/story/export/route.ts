/**
 * GET /api/story/export?storyId=...&format=pdf|docx|txt|md|html
 * Fetches story from MongoDB and returns the file for download.
 * Server-side generation only; no third-party SaaS.
 */
import { dbConnect } from "@/lib/db/mongodb";
import Story from "@/lib/db/schemas/story";
import { apiError, notFound, serverError } from "@/lib/api/errors";
import { buildExportPayload, exportStory } from "@/lib/export";
import type { ExportFormat } from "@/lib/export";
import mongoose from "mongoose";

const VALID_FORMATS: ExportFormat[] = ["pdf", "docx", "txt", "md", "html"];

function isValidFormat(s: string): s is ExportFormat {
  return VALID_FORMATS.includes(s as ExportFormat);
}

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const storyId = searchParams.get("storyId");
    const formatParam = searchParams.get("format")?.toLowerCase();

    if (!storyId) {
      return apiError("Missing storyId", 400);
    }
    if (!formatParam || !isValidFormat(formatParam)) {
      return apiError(
        `Invalid format. Use one of: ${VALID_FORMATS.join(", ")}`,
        400
      );
    }

    const format = formatParam as ExportFormat;

    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      return notFound("Story not found");
    }

    await dbConnect();
    const story = await Story.findById(storyId).lean();
    if (!story) {
      return notFound("Story not found");
    }

    const payload = buildExportPayload({
      title: story.title,
      genre: story.genre,
      premise: story.premise,
      chapterHistory: (story.chapterHistory ?? []) as Array<{
        index: number;
        title: string;
        content: string;
      }>,
    });

    const result = await exportStory(payload, format);

    const filename = encodeURIComponent(result.suggestedFilename);
    return new Response(new Uint8Array(result.buffer), {
      status: 200,
      headers: {
        "Content-Type": result.mimeType,
        "Content-Disposition": `attachment; filename*=UTF-8''${filename}`,
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (e) {
    console.error("[story/export]", e);
    return serverError();
  }
}
