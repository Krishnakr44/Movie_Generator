"use client";

import { useState } from "react";
import { CharacterBuilder, characterDraftsToApi, type CharacterDraft } from "./CharacterBuilder";
import {
  WorldRulesEditor,
  worldRuleDraftsToApi,
  type WorldRuleDraft,
} from "./WorldRulesEditor";
import { api } from "@/lib/api/client";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button, Input, Select, Slider } from "@/components/ui";
import type { SelectOption } from "@/components/ui/Select";

const GENRES: SelectOption[] = [
  { value: "indian_mythology", label: "Indian mythology" },
  { value: "folklore_horror", label: "Folklore horror" },
  { value: "desi_sci_fi", label: "Desi sci-fi" },
  { value: "historical_fiction", label: "Historical fiction" },
  { value: "urban_fantasy_indian", label: "Urban fantasy (Indian)" },
  { value: "other", label: "Other" },
];

const TONES: SelectOption[] = [
  { value: "dark", label: "Dark" },
  { value: "emotional", label: "Emotional" },
  { value: "epic", label: "Epic" },
  { value: "hopeful", label: "Hopeful" },
  { value: "solemn", label: "Solemn" },
  { value: "lyrical", label: "Lyrical" },
  { value: "tense", label: "Tense" },
  { value: "wry", label: "Wry" },
  { value: "mythic", label: "Mythic" },
  { value: "grounded", label: "Grounded" },
  { value: "noir", label: "Noir" },
];

/** Length slider: 0=short, 1=medium, 2=long → actCount 1, 3, 5 */
const LENGTH_STEPS = [
  { label: "Short (1 act)" },
  { label: "Medium (3 acts)" },
  { label: "Long (5 acts)" },
];
const ACT_COUNT_BY_STEP = [1, 3, 5];

const TWIST_LABELS: Record<number, string> = {
  0: "None",
  1: "Subtle",
  2: "Moderate",
  3: "High",
};
const TWIST_VALUES = ["none", "subtle", "moderate", "high"] as const;

const DEPTH_LABELS: Record<number, string> = {
  0: "Light",
  1: "Medium",
  2: "Deep",
};

export function StoryCreateForm({
  onCreated,
  onError,
}: {
  onCreated: (storyId: string) => void;
  onError: (message: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("indian_mythology");
  const [tone, setTone] = useState("mythic");
  const [lengthStep, setLengthStep] = useState(1); // 0=short, 1=medium, 2=long → map to 1,3,5 acts
  const [twistLevelIndex, setTwistLevelIndex] = useState(1); // 0–3
  const [emotionalDepthIndex, setEmotionalDepthIndex] = useState(1); // 0–2, UI-only / can inform tone
  const [premise, setPremise] = useState("");
  const [characters, setCharacters] = useState<CharacterDraft[]>([
    { id: "1", name: "", personality: "", moralAlignment: "true_neutral" },
  ]);
  const [worldRules, setWorldRules] = useState<WorldRuleDraft[]>([]);
  const [loading, setLoading] = useState(false);

  const actCount = ACT_COUNT_BY_STEP[lengthStep] ?? 3;
  const twistLevel = TWIST_VALUES[twistLevelIndex] ?? "subtle";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) {
      onError("Please enter a story title.");
      return;
    }
    const chars = characterDraftsToApi(characters);
    if (chars.length === 0) {
      onError("Add at least one character with a name.");
      return;
    }
    setLoading(true);
    onError("");
    try {
      const res = await api.createStory({
        title: t,
        genre,
        premise: premise.trim() || undefined,
        initialCharacters: chars,
        initialWorldRules: worldRuleDraftsToApi(worldRules),
        structure: "acts",
        actCount,
      });
      onCreated(res.id);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to create story");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title & premise: one card */}
      <Card padding="md">
        <CardHeader>
          <CardTitle>Story</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. The Curse of the River"
            maxLength={300}
          />
          <div>
            <label className="block text-sm font-medium text-parchment-200 mb-1.5">
              Premise (optional)
            </label>
            <textarea
              value={premise}
              onChange={(e) => setPremise(e.target.value)}
              placeholder="One or two sentences: setting, conflict, or hook."
              rows={2}
              className="w-full rounded-input bg-ink-800 border border-ink-600 text-parchment-100 placeholder:text-ink-500 px-3 py-2.5 focus:border-accent/60 focus:ring-2 focus:ring-accent/20 focus:outline-none resize-y transition-colors"
              maxLength={2000}
            />
          </div>
        </div>
      </Card>

      {/* Genre & tone: card */}
      <Card padding="md">
        <CardHeader>
          <CardTitle>Mood & world</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Genre"
            options={GENRES}
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
          <Select
            label="Tone"
            options={TONES}
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          />
        </div>
        <div className="mt-5 space-y-5">
          <Slider
            label="Story length"
            min={0}
            max={2}
            value={lengthStep}
            onChange={setLengthStep}
            displayValue={LENGTH_STEPS[lengthStep]?.label ?? "Medium (3 acts)"}
            minLabel="Short"
            maxLabel="Long"
          />
          <Slider
            label="Twist level"
            min={0}
            max={3}
            value={twistLevelIndex}
            onChange={setTwistLevelIndex}
            displayValue={TWIST_LABELS[twistLevelIndex]}
            minLabel="None"
            maxLabel="High"
          />
          <Slider
            label="Emotional depth"
            min={0}
            max={2}
            value={emotionalDepthIndex}
            onChange={setEmotionalDepthIndex}
            displayValue={DEPTH_LABELS[emotionalDepthIndex]}
            minLabel="Light"
            maxLabel="Deep"
          />
        </div>
      </Card>

      {/* Characters */}
      <Card padding="md">
        <CharacterBuilder characters={characters} onChange={setCharacters} />
      </Card>

      {/* World rules */}
      <Card padding="md">
        <WorldRulesEditor rules={worldRules} onChange={setWorldRules} />
      </Card>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        block
        loading={loading}
        disabled={loading}
      >
        {loading ? "Creating story…" : "Create story"}
      </Button>
    </form>
  );
}
