"use client";

import { useState, useRef, useEffect } from "react";

export type ExportFormat = "pdf" | "docx" | "txt" | "md" | "html";

const FORMAT_LABELS: Record<ExportFormat, string> = {
  pdf: "PDF (book layout)",
  docx: "Word (DOCX)",
  txt: "Plain text (TXT)",
  md: "Markdown (.md)",
  html: "HTML",
};

interface DownloadStoryProps {
  storyId: string;
  storyTitle: string;
  /** Only show when there is at least one chapter to export */
  hasChapters?: boolean;
  className?: string;
}

export function DownloadStory({
  storyId,
  storyTitle,
  hasChapters = true,
  className = "",
}: DownloadStoryProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExport = async (format: ExportFormat) => {
    setOpen(false);
    setError(null);
    setLoading(true);
    try {
      const url = `/api/story/export?storyId=${encodeURIComponent(storyId)}&format=${format}`;
      const res = await fetch(url);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? `Export failed: ${res.status}`);
      }
      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition");
      let filename = `${storyTitle}.${format}`;
      const match = disposition?.match(/filename\*?=(?:UTF-8'')?([^;]+)/);
      if (match) {
        try {
          filename = decodeURIComponent(match[1].trim().replace(/^["']|["']$/g, ""));
        } catch {
          // keep default filename
        }
      }
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed");
    } finally {
      setLoading(false);
    }
  };

  if (!hasChapters) {
    return null;
  }

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg border border-ink-600 bg-ink-800/80 px-3 py-2 text-sm font-medium text-parchment-200 hover:bg-ink-700 hover:border-ink-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Download story"
      >
        {loading ? (
          <>
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-parchment-300 border-t-transparent" />
            Preparing…
          </>
        ) : (
          <>
            <span aria-hidden>↓</span>
            Download
          </>
        )}
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-full z-20 mt-1 min-w-[200px] rounded-lg border border-ink-600 bg-ink-900 py-1 shadow-lg focus:outline-none"
        >
          {(Object.entries(FORMAT_LABELS) as [ExportFormat, string][]).map(([format, label]) => (
            <button
              key={format}
              role="option"
              type="button"
              onClick={() => handleExport(format)}
              className="w-full px-4 py-2.5 text-left text-sm text-parchment-200 hover:bg-ink-700 focus:bg-ink-700 focus:outline-none"
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
