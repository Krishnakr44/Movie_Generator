/**
 * Frontend API client for story endpoints.
 * Uses relative URLs so it works with the same Next.js origin.
 */

const base = "";

async function jsonRequest<T>(
  path: string,
  options: { method?: string; body?: Record<string, unknown>; headers?: HeadersInit } = {}
): Promise<T> {
  const { body, method = "GET", headers: optHeaders } = options;
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...optHeaders,
    },
    ...(body != null && { body: JSON.stringify(body) as BodyInit }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return data as T;
}

export interface CreateStoryResponse {
  id: string;
  title: string;
  genre: string;
  structure: string;
  actCount?: number;
  characters: unknown[];
  worldRules: unknown[];
}

export interface ChapterResponse {
  storyId: string;
  chapter: { index: number; title: string; content: string };
  provider: string;
}

export interface StoryResponse {
  id: string;
  title: string;
  genre: string;
  premise?: string;
  structure: string;
  actCount?: number;
  characters: Array<{
    name: string;
    traits: string[];
    alive: boolean;
    emotionalState: string;
    role?: string;
    lastKnown?: string;
  }>;
  worldRules: Array<{ category: string; rule: string }>;
  timelineEvents: Array<{ chapterIndex: number; summary: string; occurredAt: string }>;
  chapterHistory: Array<{
    index: number;
    title: string;
    content: string;
    act?: number;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export const api = {
  createStory(body: {
    title: string;
    genre: string;
    premise?: string;
    initialCharacters?: Array<{
      name: string;
      traits: string[];
      alive?: boolean;
      role?: string;
      lastKnown?: string;
    }>;
    initialWorldRules?: Array<{ category: string; rule: string }>;
    structure: "acts" | "chapters";
    actCount?: number;
  }): Promise<CreateStoryResponse> {
    return jsonRequest<CreateStoryResponse>("/api/story/create", {
      method: "POST",
      body: body as Record<string, unknown>,
    });
  },

  getStory(id: string): Promise<StoryResponse> {
    return fetch(`${base}/api/story/${id}`).then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as { error?: string }).error ?? "Failed to load story");
      return data as StoryResponse;
    });
  },

  generateChapter(
    storyId: string,
    options?: {
      direction?: string;
      chapterGoal?: string;
      userControls?: {
        genre?: string;
        tone?: string;
        violenceLevel?: string;
        twistLevel?: string;
      };
    }
  ): Promise<ChapterResponse> {
    return jsonRequest<ChapterResponse>("/api/story/generate-chapter", {
      method: "POST",
      body: { storyId, ...options } as Record<string, unknown>,
    });
  },

  continueStory(
    storyId: string,
    options?: {
      userPrompt?: string;
      chapterGoal?: string;
      userControls?: {
        genre?: string;
        tone?: string;
        violenceLevel?: string;
        twistLevel?: string;
      };
    }
  ): Promise<ChapterResponse> {
    return jsonRequest<ChapterResponse>("/api/story/continue", {
      method: "POST",
      body: { storyId, ...options } as Record<string, unknown>,
    });
  },
};
