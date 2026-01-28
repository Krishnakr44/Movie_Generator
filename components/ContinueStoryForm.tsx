"use client";

import { useState } from "react";
import { Button, Input, Select } from "@/components/ui";
import type { SelectOption } from "@/components/ui/Select";

const TONES: SelectOption[] = [
  { value: "", label: "Default" },
  { value: "solemn", label: "Solemn" },
  { value: "lyrical", label: "Lyrical" },
  { value: "tense", label: "Tense" },
  { value: "wry", label: "Wry" },
  { value: "mythic", label: "Mythic" },
  { value: "grounded", label: "Grounded" },
  { value: "noir", label: "Noir" },
];

const TWIST_LEVELS: SelectOption[] = [
  { value: "", label: "Default" },
  { value: "none", label: "None" },
  { value: "subtle", label: "Subtle" },
  { value: "moderate", label: "Moderate" },
  { value: "high", label: "High" },
];

export function ContinueStoryForm({
  onGenerate,
  onContinue,
  hasChapters,
  loading,
}: {
  onGenerate: (opts?: {
    chapterGoal?: string;
    tone?: string;
    twistLevel?: string;
  }) => void;
  onContinue: (opts: {
    userPrompt?: string;
    chapterGoal?: string;
    tone?: string;
    twistLevel?: string;
  }) => void;
  hasChapters: boolean;
  loading: boolean;
}) {
  const [chapterGoal, setChapterGoal] = useState("");
  const [direction, setDirection] = useState("");
  const [tone, setTone] = useState("");
  const [twistLevel, setTwistLevel] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const opts = {
      chapterGoal: chapterGoal.trim() || undefined,
      userPrompt: direction.trim() || undefined,
      tone: tone.trim() || undefined,
      twistLevel: twistLevel.trim() || undefined,
    };
    if (hasChapters) {
      onContinue(opts);
    } else {
      onGenerate(opts);
    }
    setChapterGoal("");
    setDirection("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-card border border-ink-700 bg-ink-900 p-5 sm:p-6 space-y-4"
    >
      <h3 className="text-base font-semibold text-parchment-100">
        {hasChapters ? "Continue story" : "Generate first chapter"}
      </h3>
      <Input
        label="Chapter goal (optional)"
        value={chapterGoal}
        onChange={(e) => setChapterGoal(e.target.value)}
        placeholder="e.g. Reveal the curse at the temple"
        maxLength={500}
      />
      {hasChapters && (
        <Input
          label="Direction (optional)"
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
          placeholder="e.g. The priestess refuses to name a victim"
          maxLength={500}
        />
      )}
      <div className="flex flex-wrap gap-4">
        <Select
          label="Tone"
          options={TONES}
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="min-w-[140px]"
        />
        <Select
          label="Twist"
          options={TWIST_LEVELS}
          value={twistLevel}
          onChange={(e) => setTwistLevel(e.target.value)}
          className="min-w-[140px]"
        />
      </div>
      <Button
        type="submit"
        variant="primary"
        size="lg"
        block
        loading={loading}
        disabled={loading}
      >
        {loading
          ? "Writing…"
          : hasChapters
            ? "Continue story"
            : "Generate first chapter"}
      </Button>
    </form>
  );
}
