"use client";

import { useState } from "react";

export interface Chapter {
  index: number;
  title: string;
  content: string;
  act?: number;
  createdAt?: string;
}

export function ChapterList({ chapters }: { chapters: Chapter[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(
    chapters.length > 0 ? 0 : null
  );

  if (chapters.length === 0) {
    return (
      <div className="rounded-card border border-ink-700 bg-ink-900/50 px-6 py-10 text-center">
        <p className="text-ink-500 font-medium">No chapters yet</p>
        <p className="text-sm text-ink-600 mt-1">
          Generate the first chapter below.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium text-ink-500 uppercase tracking-wider">
        Chapters
      </h2>
      {chapters.map((ch) => (
        <article
          key={ch.index}
          className="rounded-card border border-ink-700 bg-ink-900 overflow-hidden transition-colors hover:border-ink-600"
        >
          <button
            type="button"
            onClick={() =>
              setOpenIndex(openIndex === ch.index ? null : ch.index)
            }
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-parchment-100 hover:bg-ink-800/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/50"
            aria-expanded={openIndex === ch.index}
          >
            <span className="font-medium">
              {ch.index + 1}. {ch.title}
            </span>
            <span
              className="text-ink-500 shrink-0 transition-transform duration-smooth"
              aria-hidden
            >
              {openIndex === ch.index ? "▾" : "▸"}
            </span>
          </button>
          {openIndex === ch.index && (
            <div
              className="px-5 pb-6 pt-0 border-t border-ink-700/80 animate-fade-in"
              role="region"
              aria-label={`Chapter ${ch.index + 1} content`}
            >
              <div className="reader-prose mt-4 whitespace-pre-wrap">
                {ch.content}
              </div>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
