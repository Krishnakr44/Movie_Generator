# UI Structure & Design Decisions

## Folder structure

```
app/
  layout.tsx          # Root layout: Inter (sans) + Crimson Pro (serif) via CSS vars
  page.tsx            # Landing: Hero + scroll-to Create section
  globals.css         # Theme tokens, reader-prose, focus/selection
  story/[id]/page.tsx # Story reader: header, chapters, continue form

components/
  ui/                 # Primitives (no external UI lib)
    Button.tsx        # primary / secondary / ghost / danger; loading state
    Card.tsx          # Card, CardHeader, CardTitle
    Input.tsx         # Label, hint, error; accessible
    Select.tsx        # Options array; custom chevron
    Slider.tsx        # Range with label, min/max labels, displayValue
    Skeleton.tsx      # Skeleton, ChapterSkeleton, CardSkeleton
    ErrorBox.tsx      # Alert with optional dismiss
    index.ts
  StoryCreateForm.tsx # Creation panel: story card, mood card, sliders, characters, rules
  CharacterBuilder.tsx# Per-character cards; add/remove
  WorldRulesEditor.tsx# Presets + rule rows (world-editor feel)
  ChapterList.tsx     # Collapsible chapters; reader-prose for content
  ContinueStoryForm.tsx # Chapter goal, direction, tone/twist; Continue CTA
```

## Tailwind theme (tailwind.config.ts)

- **Colors**: `ink` (950–400) for backgrounds and muted text; `parchment` (100–400) for readable text; `accent` (amber) for CTAs and emphasis. Dark-first; no bright gradients.
- **Typography**: `font-sans` (Inter) for UI; `font-serif` (Crimson Pro) for story body via `.reader-prose`.
- **Reading**: `max-w-reader` (42rem) for optimal line length; `text-reader` for size/line-height.
- **Motion**: Short transitions (200ms), `animate-fade-in` / `animate-slide-up`; no flashy effects.

## Design decisions

1. **Landing**: One clear headline (“AI-powered Indian fiction, you’re the director”), short explanation (rules, memory, chapters), single CTA that scrolls to the creation form. No nav bar to keep focus.
2. **Creation**: Card-based sections (Story, Mood & world, Characters, World rules). Sliders map to API: length → act count (1/3/5), twist → API twist level, emotional depth kept as UI-only for now.
3. **Characters**: One card per character; hierarchy (name, personality, alignment); add/remove with at least one required. No clutter.
4. **World rules**: Preset chips for quick add; rows with category + rule. Feels like a “world editor” rather than a long form.
5. **Reader**: Serif for story content only; chapter list is collapsible; “Characters & world rules” in a details/summary so power users can open without dominating the layout. Continue Story shows a skeleton while generating and disables the button to prevent double submissions.
6. **Feedback**: ErrorBox for API errors (dismissible); ChapterSkeleton and loading states on buttons; focus-visible rings and sufficient contrast for accessibility.

## API compatibility

- `StoryCreateForm` still calls `api.createStory()` with the same payload (title, genre, premise, initialCharacters, initialWorldRules, structure: "acts", actCount). Tone and twist are sent as before; sliders only change how they’re chosen.
- Story page uses `api.getStory`, `api.generateChapter`, `api.continueStory` unchanged.
- No new environment variables or backend changes required.
