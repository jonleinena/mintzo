/**
 * LLM utilities using Vercel AI SDK
 * Abstracts the LLM provider for easy switching between OpenAI, Anthropic, etc.
 */

import { generateObject, generateText } from 'https://esm.sh/ai@3';
import { createOpenAI } from 'https://esm.sh/@ai-sdk/openai@0.0.66';
import { z } from 'https://esm.sh/zod@3';

// Initialize OpenAI provider
const openai = createOpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY') ?? '',
});

// Default model for grading (cost-effective but capable)
const DEFAULT_MODEL = 'gpt-4o-mini';

/**
 * Generate a structured object response using Vercel AI SDK
 * Uses Zod schema for type-safe structured output
 */
export async function generateStructuredResponse<T>(options: {
  schema: z.ZodType<T>;
  prompt: string;
  system?: string;
  model?: string;
}): Promise<T> {
  const { schema, prompt, system, model = DEFAULT_MODEL } = options;

  const result = await generateObject({
    model: openai(model),
    schema,
    prompt,
    system,
  });

  return result.object;
}

/**
 * Generate a text response using Vercel AI SDK
 */
export async function generateTextResponse(options: {
  prompt: string;
  system?: string;
  model?: string;
  maxTokens?: number;
}): Promise<string> {
  const { prompt, system, model = DEFAULT_MODEL, maxTokens = 1024 } = options;

  const result = await generateText({
    model: openai(model),
    prompt,
    system,
    maxTokens,
  });

  return result.text;
}

// Re-export zod for schema definitions
export { z };
