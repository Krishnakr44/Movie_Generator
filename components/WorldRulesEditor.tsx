"use client";

import { CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export interface WorldRuleDraft {
  id: string;
  category: string;
  rule: string;
}

const PRESETS: { category: string; rule: string }[] = [
  { category: "mythology", rule: "No resurrection. Death is final." },
  {
    category: "mythology",
    rule:
      "The river spirit can only be addressed at the ghat between sunset and first star.",
  },
  {
    category: "culture",
    rule: "Honour and family duty drive major decisions.",
  },
  {
    category: "magic",
    rule: "Magic requires a spoken mantra or ritual item.",
  },
  { category: "era", rule: "No modern technology (pre-20th century)." },
  { category: "geography", rule: "Story is set in the Indian subcontinent." },
];

const CATEGORIES = [
  "mythology",
  "culture",
  "magic",
  "era",
  "geography",
  "custom",
];

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export function WorldRulesEditor({
  rules,
  onChange,
}: {
  rules: WorldRuleDraft[];
  onChange: (list: WorldRuleDraft[]) => void;
}) {
  const add = () => {
    onChange([
      ...rules,
      { id: newId(), category: "culture", rule: "" },
    ]);
  };

  const addPreset = (p: { category: string; rule: string }) => {
    onChange([...rules, { ...p, id: newId() }]);
  };

  const update = (id: string, patch: Partial<WorldRuleDraft>) => {
    onChange(rules.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const remove = (id: string) => {
    onChange(rules.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <CardTitle>World rules</CardTitle>
        <Button type="button" variant="ghost" size="sm" onClick={add}>
          + Add rule
        </Button>
      </div>
      <p className="text-xs text-ink-500 max-w-prose">
        Constraints the story must follow—mythology, culture, era, magic. The
        AI will not break these.
      </p>

      {/* Presets: chip-style for quick add */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => addPreset(p)}
            className="rounded-full bg-ink-800 border border-ink-600 px-3 py-1.5 text-xs text-parchment-200 hover:bg-ink-700 hover:border-ink-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            + {p.category}: {p.rule.slice(0, 28)}
            {p.rule.length > 28 ? "…" : ""}
          </button>
        ))}
      </div>

      {/* Rule list: world-editor feel — minimal labels, clear hierarchy */}
      <div className="space-y-2">
        {rules.map((r) => (
          <div
            key={r.id}
            className="flex gap-2 items-start rounded-input bg-ink-800/60 border border-ink-700 p-3 transition-colors hover:border-ink-600"
          >
            <select
              value={r.category}
              onChange={(e) => update(r.id, { category: e.target.value })}
              className="shrink-0 w-28 rounded-input bg-ink-800 border border-ink-600 text-parchment-200 text-sm px-2.5 py-2 focus:border-accent/60 focus:ring-1 focus:ring-accent/20 focus:outline-none"
              aria-label="Rule category"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Rule (e.g. No resurrection)"
              value={r.rule}
              onChange={(e) => update(r.id, { rule: e.target.value })}
              className="flex-1 min-w-0 rounded-input bg-ink-800 border border-ink-600 text-parchment-100 placeholder:text-ink-500 px-3 py-2 text-sm focus:border-accent/60 focus:ring-2 focus:ring-accent/20 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => remove(r.id)}
              className="shrink-0 text-ink-500 hover:text-red-400 p-1.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              aria-label="Remove rule"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function worldRuleDraftsToApi(
  drafts: WorldRuleDraft[]
): Array<{ category: string; rule: string }> {
  return drafts
    .filter((r) => r.category.trim() && r.rule.trim())
    .map((r) => ({ category: r.category.trim(), rule: r.rule.trim() }));
}
