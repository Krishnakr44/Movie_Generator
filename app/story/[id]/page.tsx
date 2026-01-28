"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import type { StoryResponse } from "@/lib/api/client";
import { ChapterList } from "@/components/ChapterList";
import { ContinueStoryForm } from "@/components/ContinueStoryForm";
import { DownloadStory } from "@/components/DownloadStory";
import { ErrorBox } from "@/components/ui/ErrorBox";
import { ChapterSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";

export default function StoryPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const [story, setStory] = useState<StoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [rulesOpen, setRulesOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    api
      .getStory(id)
      .then(setStory)
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load story")
      )
      .finally(() => setLoading(false));
  }, [id]);

  const refreshStory = () => {
    if (!id) return;
    api.getStory(id).then(setStory).catch(() => {});
  };

  const handleGenerate = (opts?: {
    chapterGoal?: string;
    tone?: string;
    twistLevel?: string;
  }) => {
    if (!id) return;
    setGenerating(true);
    setError("");
    api
      .generateChapter(id, {
        chapterGoal: opts?.chapterGoal,
        userControls:
          opts?.tone || opts?.twistLevel
            ? { tone: opts.tone, twistLevel: opts.twistLevel }
            : undefined,
      })
      .then(() => refreshStory())
      .catch((e) =>
        setError(
          e instanceof Error ? e.message : "Generation failed"
        )
      )
      .finally(() => setGenerating(false));
  };

  const handleContinue = (opts: {
    userPrompt?: string;
    chapterGoal?: string;
    tone?: string;
    twistLevel?: string;
  }) => {
    if (!id) return;
    setGenerating(true);
    setError("");
    api
      .continueStory(id, {
        userPrompt: opts.userPrompt,
        chapterGoal: opts.chapterGoal,
        userControls:
          opts.tone || opts.twistLevel
            ? { tone: opts.tone, twistLevel: opts.twistLevel }
            : undefined,
      })
      .then(() => refreshStory())
      .catch((e) =>
        setError(
          e instanceof Error ? e.message : "Continue failed"
        )
      )
      .finally(() => setGenerating(false));
  };

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-8 sm:py-12">
        <div className="max-w-reader mx-auto reader-x">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-parchment-200 transition-colors mb-8"
          >
            ← Back to home
          </Link>
          <div className="h-8 w-48 rounded bg-ink-800 animate-pulse mb-4" />
          <div className="h-4 w-32 rounded bg-ink-800 animate-pulse mb-8" />
          <ChapterSkeleton />
        </div>
      </div>
    );
  }

  if (error && !story) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
        <ErrorBox title="Couldn’t load story" message={error} />
        <Button variant="secondary" onClick={() => router.push("/")}>
          Back to home
        </Button>
      </div>
    );
  }

  if (!story) {
    return null;
  }

  const hasChapters = story.chapterHistory.length > 0;

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-parchment-200 transition-colors mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 rounded"
        >
          ← All stories
        </Link>

        {/* Story header: title, genre, premise, download */}
        <header className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-parchment-100 tracking-tight leading-tight">
                {story.title}
              </h1>
              <p className="text-sm text-ink-500 mt-2">
                {story.genre.replace(/_/g, " ")}
                {story.structure === "acts" && story.actCount
                  ? ` · ${story.actCount} act${story.actCount > 1 ? "s" : ""}`
                  : " · Chapters"}
              </p>
              {story.premise && (
                <p className="mt-3 text-parchment-200/90 leading-relaxed max-w-prose">
                  {story.premise}
                </p>
              )}
            </div>
            <DownloadStory
              storyId={id}
              storyTitle={story.title}
              hasChapters={hasChapters}
            />
          </div>
        </header>

        {error && (
          <div className="mb-6">
            <ErrorBox message={error} onDismiss={() => setError("")} />
          </div>
        )}

        {/* Characters & world rules: collapsible */}
        <details
          className="rounded-card border border-ink-700 bg-ink-900/50 mb-8 group"
          open={rulesOpen}
          onToggle={(e) => setRulesOpen((e.target as HTMLDetailsElement).open)}
        >
          <summary className="list-none cursor-pointer px-4 py-3 text-sm font-medium text-parchment-200 hover:bg-ink-800/50 transition-colors flex items-center justify-between gap-2 [&::-webkit-details-marker]:hidden">
            <span>Characters & world rules</span>
            <span className="text-ink-500 group-open:rotate-180 transition-transform">
              ▾
            </span>
          </summary>
          <div className="px-4 pb-4 pt-0 border-t border-ink-700/80 space-y-3 text-sm text-ink-400">
            <div>
              <span className="font-medium text-parchment-200">Characters</span>:{" "}
              {story.characters.length === 0
                ? "None"
                : story.characters.map((c) => c.name).join(", ")}
            </div>
            {story.worldRules.length > 0 && (
              <div>
                <span className="font-medium text-parchment-200">
                  World rules
                </span>
                <ul className="list-none mt-1 space-y-0.5">
                  {story.worldRules.map((r, i) => (
                    <li key={i}>
                      <span className="text-ink-500">[{r.category}]</span>{" "}
                      {r.rule}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </details>

        {/* Chapters: reading-optimized width */}
        <section className="mb-10">
          <ChapterList chapters={story.chapterHistory} />
        </section>

        {/* Continue / Generate: card with loading state */}
        <section>
          {generating && (
            <div className="rounded-card border border-ink-700 bg-ink-900/50 p-6 mb-4 animate-fade-in">
              <p className="text-sm text-ink-500 mb-3">Writing next chapter…</p>
              <ChapterSkeleton />
            </div>
          )}
          <ContinueStoryForm
            onGenerate={handleGenerate}
            onContinue={handleContinue}
            hasChapters={hasChapters}
            loading={generating}
          />
        </section>
      </div>
    </div>
  );
}
