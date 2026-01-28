# Fiction Movie – Backend Architecture

Backend for a fictional story generation platform (Indian/niche fiction): **System → Rules → Memory → Controlled Output**.

## Folder structure

```
fictionmovie/
├── app/
│   ├── api/
│   │   └── story/
│   │       ├── create/route.ts      # POST – create story
│   │       ├── generate-chapter/route.ts  # POST – next chapter
│   │       ├── continue/route.ts    # POST – continue with user prompt
│   │       ├── export/route.ts      # GET – export story (pdf, docx, txt, md, html)
│   │       └── [id]/route.ts        # GET – fetch story by ID
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── ai/
│   │   ├── provider.ts   # Gemini → OpenAI fallback
│   │   └── prompts.ts    # Prompt assembly from story state
│   ├── api/
│   │   ├── errors.ts     # API error responses
│   │   ├── utils.ts      # getClientIp, parseJson
│   │   └── validate.ts   # Zod schemas
│   ├── db/
│   │   ├── mongodb.ts    # Connection (serverless-safe)
│   │   ├── index.ts
│   │   └── schemas/
│   │       ├── story.ts
│   │       ├── character.ts
│   │       ├── worldRule.ts
│   │       ├── timelineEvent.ts
│   │       └── chapterRecord.ts
│   ├── export/            # Story export (manuscript-style)
│   │   ├── index.ts       # Dispatcher + payload builder
│   │   ├── pdf.ts         # PDF (pdfkit)
│   │   ├── docx.ts        # DOCX (docx)
│   │   ├── txt.ts, md.ts, html.ts
│   │   └── types.ts
│   ├── rateLimit.ts       # Per-IP rate limit (in-memory)
│   └── types/
│       └── story.ts      # Shared types
├── env.example           # Copy to .env
├── next.config.mjs
├── package.json
└── tsconfig.json
```

## Environment variables

Copy `env.example` to `.env` and set:

| Variable | Description |
|---------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `GEMINI_API_KEY` | Prefer Gemini; if set, used for generation |
| `OPENAI_API_KEY` | Fallback when Gemini key is absent |
| `STORY_RATE_LIMIT_PER_MIN` | Optional; default 10 req/min per IP |

## API

- **POST /api/story/create** – Create story (title, genre, premise, initial characters/rules, structure).
- **POST /api/story/generate-chapter** – Generate next chapter from current story state (`storyId`, optional `direction`).
- **POST /api/story/continue** – Same as generate-chapter with optional `userPrompt` for reader direction.

All generation routes return `X-RateLimit-Remaining` and `X-RateLimit-Reset`; 429 when rate limited.

## MongoDB schema (summary)

- **Story**: title, genre, premise, structure, actCount, characters[], worldRules[], timelineEvents[], chapterHistory[], timestamps.
- **Character** (embedded): name, traits[], alive, emotionalState, role, lastKnown.
- **WorldRule** (embedded): category, rule.
- **TimelineEvent** (embedded): chapterIndex, summary, occurredAt.
- **ChapterRecord** (embedded): index, title, content, act?, stateSnapshot?, createdAt.

## Story Engine prompt system

When you pass `chapterGoal` (and optionally `userControls`) to **generate-chapter** or **continue**, the backend uses the **STORY ENGINE** prompt system:

- **Base system prompt** – Disciplined novelist persona; obey story_state; no resurrection unless allowed; cultural grounding (Indian context); output only one structured chapter.
- **Guardrails** – No new named characters beyond story_state, no killing without logic, no breaking world_rules, tone/violence/twist levels respected.
- **Chapter format** – Title → Scene description → Character actions → Consequences (woven in).
- **Inputs** – `story_state` (JSON: characters, world_rules, past_events, chapter_summaries), `user_controls` (genre, tone, violenceLevel, twistLevel), `chapter_number`, `chapter_goal`.

Same prompt structure is used for **Gemini** (systemInstruction + user message) and **OpenAI** (system + user messages). See `lib/ai/story-engine-prompts.ts` and `lib/ai/STORY_ENGINE_EXAMPLE_PROMPT.md` for the full template and an example filled prompt.

### Example request (story engine)

```json
POST /api/story/generate-chapter
{
  "storyId": "<id>",
  "chapterGoal": "Show the first refusal: the priestess refuses to name a victim and asks for a boon instead.",
  "userControls": {
    "genre": "indian_mythology",
    "tone": "mythic",
    "violenceLevel": "implied",
    "twistLevel": "subtle"
  }
}
```

## Frontend

- **/** – Create story: title, genre, tone, story length, twist intensity, premise, characters (name, personality, moral alignment), world rules (text + presets). On success → redirect to `/story/[id]`.
- **/story/[id]** – Load story by ID; show title, premise, characters & rules (collapsible), chapter list (expand to read), **Download** (PDF/DOCX/TXT/MD/HTML), and **Continue story** form. **Generate first chapter** or **Continue** calls the API and refreshes the story.

**Components:** `StoryCreateForm`, `CharacterBuilder`, `WorldRulesEditor`, `ChapterList`, `ContinueStoryForm`, `DownloadStory`. API client: `lib/api/client.ts` (createStory, getStory, generateChapter, continueStory). No auth; mobile-responsive; loading and error states on create and story pages. **Download story:** On `/story/[id]`, use the Download button (dropdown: PDF, DOCX, TXT, Markdown, HTML) to export the manuscript; generation is server-side only.

## Run

```bash
npm install
# If you see "Cannot find module 'tailwindcss'", run:
# npm install tailwindcss @tailwindcss/typography postcss autoprefixer --save-dev
# Set .env (see env.example)
npm run dev
```

Then open **http://localhost:3000**. Create a story, then generate or continue chapters.

**Notes:**
- `postinstall` patches Next.js build-id generation so `npm run build` works in all environments.
- If `npm run build` fails with **EPERM** on `.next`, close other terminals using the project and try again, or build from a folder not synced by OneDrive.
- Development (`npm run dev`) does not require a production build.
