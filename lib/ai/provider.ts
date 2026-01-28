/**
 * AI provider selector: Gemini if key exists, else OpenAI fallback.
 * All generation goes through generateText() for consistent interface.
 */
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import type { AIProvider } from "@/lib/types/story";

const GEMINI_KEY = process.env.GEMINI_API_KEY?.trim();
const OPENAI_KEY = process.env.OPENAI_API_KEY?.trim();

function detectProvider(): AIProvider {
  if (GEMINI_KEY) return "gemini";
  if (OPENAI_KEY) return "openai";
  throw new Error(
    "No AI provider configured. Set GEMINI_API_KEY or OPENAI_API_KEY in .env"
  );
}

let cachedProvider: AIProvider | null = null;
export function getAIProvider(): AIProvider {
  if (cachedProvider === null) cachedProvider = detectProvider();
  return cachedProvider;
}

/** Single entry point for LLM text generation; handles both providers */
export async function generateText(
  systemPrompt: string,
  userPrompt: string,
  options?: { maxTokens?: number; temperature?: number }
): Promise<string> {
  const provider = getAIProvider();
  const maxTokens = options?.maxTokens ?? 2048;
  const temperature = Math.min(1, Math.max(0, options?.temperature ?? 0.8));

  if (provider === "gemini") {
    return generateWithGemini(systemPrompt, userPrompt, {
      maxOutputTokens: maxTokens,
      temperature,
    });
  }
  return generateWithOpenAI(systemPrompt, userPrompt, {
    max_tokens: maxTokens,
    temperature,
  });
}

async function generateWithGemini(
  systemPrompt: string,
  userPrompt: string,
  opts: { maxOutputTokens: number; temperature: number }
): Promise<string> {
  if (!GEMINI_KEY) throw new Error("GEMINI_API_KEY is not set");
  const genAI = new GoogleGenerativeAI(GEMINI_KEY);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash",
    systemInstruction: systemPrompt,
    generationConfig: {
      maxOutputTokens: opts.maxOutputTokens,
      temperature: opts.temperature,
    },
  });
  const result = await model.generateContent(userPrompt);
  const response = result.response;
  if (!response.text) {
    throw new Error("Gemini returned empty response");
  }
  return response.text();
}

async function generateWithOpenAI(
  systemPrompt: string,
  userPrompt: string,
  opts: { max_tokens: number; temperature: number }
): Promise<string> {
  if (!OPENAI_KEY) throw new Error("OPENAI_API_KEY is not set");
  const openai = new OpenAI({ apiKey: OPENAI_KEY });
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: opts.max_tokens,
    temperature: opts.temperature,
  });
  const content = completion.choices[0]?.message?.content;
  if (content == null) {
    throw new Error("OpenAI returned empty response");
  }
  return content;
}
