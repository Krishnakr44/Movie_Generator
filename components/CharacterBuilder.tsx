"use client";

import { CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui";
import type { SelectOption } from "@/components/ui/Select";

export type MoralAlignment =
  | "lawful_good"
  | "neutral_good"
  | "chaotic_good"
  | "lawful_neutral"
  | "true_neutral"
  | "chaotic_neutral"
  | "lawful_evil"
  | "neutral_evil"
  | "chaotic_evil";

export interface CharacterDraft {
  id: string;
  name: string;
  personality: string;
  moralAlignment: MoralAlignment;
  role?: string;
}

const ALIGNMENTS: SelectOption[] = [
  { value: "lawful_good", label: "Lawful good" },
  { value: "neutral_good", label: "Neutral good" },
  { value: "chaotic_good", label: "Chaotic good" },
  { value: "lawful_neutral", label: "Lawful neutral" },
  { value: "true_neutral", label: "True neutral" },
  { value: "chaotic_neutral", label: "Chaotic neutral" },
  { value: "lawful_evil", label: "Lawful evil" },
  { value: "neutral_evil", label: "Neutral evil" },
  { value: "chaotic_evil", label: "Chaotic evil" },
];

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export function CharacterBuilder({
  characters,
  onChange,
}: {
  characters: CharacterDraft[];
  onChange: (list: CharacterDraft[]) => void;
}) {
  const add = () => {
    onChange([
      ...characters,
      {
        id: newId(),
        name: "",
        personality: "",
        moralAlignment: "true_neutral",
      },
    ]);
  };

  const update = (id: string, patch: Partial<CharacterDraft>) => {
    onChange(
      characters.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  };

  const remove = (id: string) => {
    if (characters.length <= 1) return;
    onChange(characters.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <CardTitle>Characters</CardTitle>
        <Button type="button" variant="ghost" size="sm" onClick={add}>
          + Add character
        </Button>
      </div>
      {characters.length === 0 && (
        <p className="text-sm text-ink-500">
          No characters yet. Add at least one with a name.
        </p>
      )}
      <ul className="space-y-3 list-none p-0 m-0">
        {characters.map((c, index) => (
          <li
            key={c.id}
            className="rounded-card bg-ink-800/60 border border-ink-700 p-4 transition-all duration-smooth hover:border-ink-600 animate-fade-in"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <span className="text-xs font-medium text-ink-500 uppercase tracking-wider">
                Character {index + 1}
              </span>
              {characters.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(c.id)}
                  className="text-ink-500 hover:text-red-400 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded"
                  aria-label={`Remove character ${index + 1}`}
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                placeholder="Name"
                value={c.name}
                onChange={(e) => update(c.id, { name: e.target.value })}
                className="sm:col-span-2"
              />
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-ink-500 mb-1">
                  Personality (traits, mannerisms)
                </label>
                <textarea
                  placeholder="e.g. Cunning, speaks in riddles"
                  value={c.personality}
                  onChange={(e) =>
                    update(c.id, { personality: e.target.value })
                  }
                  rows={2}
                  className="w-full rounded-input bg-ink-800 border border-ink-600 text-parchment-100 placeholder:text-ink-500 px-3 py-2 resize-y focus:border-accent/60 focus:ring-2 focus:ring-accent/20 focus:outline-none transition-colors"
                />
              </div>
              <Select
                label="Moral alignment"
                options={ALIGNMENTS}
                value={c.moralAlignment}
                onChange={(e) =>
                  update(c.id, {
                    moralAlignment: e.target.value as MoralAlignment,
                  })
                }
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Map CharacterDraft[] to API initialCharacters (traits include personality + alignment). */
export function characterDraftsToApi(
  drafts: CharacterDraft[]
): Array<{
  name: string;
  traits: string[];
  alive?: boolean;
  role?: string;
}> {
  return drafts
    .filter((c) => c.name.trim())
    .map((c) => ({
      name: c.name.trim(),
      traits: [
        ...(c.personality.trim() ? [c.personality.trim()] : []),
        `moral alignment: ${c.moralAlignment.replace("_", " ")}`,
      ].filter(Boolean),
      alive: true,
      role: c.role?.trim() || undefined,
    }));
}
