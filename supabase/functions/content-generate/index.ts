import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { createSupabaseClient, createSupabaseAdmin, getUserId } from '../_shared/supabase.ts';
import { generateStructuredResponse, z } from '../_shared/llm.ts';

interface GenerateContentRequest {
  level: string;
  part: string;
  topic?: string;
  count?: number;
}

// Schemas for each part type
const Part1QuestionSchema = z.object({
  topic: z.string(),
  question_text: z.string(),
  follow_up_questions: z.array(z.string()).length(2),
  difficulty: z.number().min(1).max(3),
});

const Part2ContentSchema = z.object({
  topic: z.string(),
  prompt_text: z.string(),
  follow_up_question: z.string(),
  comparison_points: z.array(z.string()).min(3).max(5),
  difficulty: z.number().min(1).max(3),
});

const Part3ContentSchema = z.object({
  topic: z.string(),
  discussion_prompt: z.string(),
  options: z.array(z.string()).length(5),
  decision_prompt: z.string(),
  difficulty: z.number().min(1).max(3),
  diagram_mermaid: z.string(),
});

const Part4QuestionSchema = Part1QuestionSchema;

function getSystemPrompt(level: string, part: string): string {
  const levelDesc: Record<string, string> = {
    B2: 'B2 First (upper-intermediate). Questions should be accessible but require opinion and explanation.',
    C1: 'C1 Advanced. Questions should demand nuanced thinking, analysis, and sophisticated language.',
    C2: 'C2 Proficiency. Questions should challenge with abstract concepts, philosophical depth, and complex argumentation.',
  };

  const partDesc: Record<string, string> = {
    part1: 'Part 1 Interview: Short personal questions the examiner asks to warm up. 2 follow-up questions per main question.',
    part2: 'Part 2 Long Turn: Candidate compares 2-3 photos and speaks for 1 minute. Provide a prompt describing what the photos show, a follow-up question, and 3-5 comparison points.',
    part3: 'Part 3 Collaborative Task: Two candidates discuss options on a topic. Provide a discussion prompt, exactly 5 options, a decision prompt, and a mermaid mindmap diagram.',
    part4: 'Part 4 Discussion: Follow-up questions exploring the Part 3 topic more deeply. 2 follow-up questions per main question.',
  };

  return `You are a Cambridge English exam content creator for ${levelDesc[level] ?? level}.

${partDesc[part] ?? part}

Requirements:
- Match the difficulty and language expectations of the ${level} level precisely
- Questions should feel natural and conversational, as spoken by a real examiner
- Topics should be relevant to adult learners
- Avoid culturally insensitive or controversial topics
- For Part 3 mermaid diagrams, use the mindmap format with root((Topic)) and 3 sub-points per option
- Each item must be unique and not repeat common exam cliches`;
}

function getItemSchema(part: string) {
  switch (part) {
    case 'part1': return Part1QuestionSchema;
    case 'part2': return Part2ContentSchema;
    case 'part3': return Part3ContentSchema;
    case 'part4': return Part4QuestionSchema;
    default: throw new Error(`Unknown part: ${part}`);
  }
}

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const authHeader = req.headers.get('Authorization');
    const supabase = createSupabaseClient(authHeader);
    const userId = await getUserId(supabase);

    if (!userId) {
      return errorResponse('Unauthorized', 401);
    }

    const { level, part, topic, count = 3 } = await req.json() as GenerateContentRequest;

    if (!level || !['B2', 'C1', 'C2'].includes(level)) {
      return errorResponse('Invalid level. Must be B2, C1, or C2');
    }
    if (!part || !['part1', 'part2', 'part3', 'part4'].includes(part)) {
      return errorResponse('Invalid part. Must be part1, part2, part3, or part4');
    }

    const clampedCount = Math.min(Math.max(count, 1), 5);
    const system = getSystemPrompt(level, part);
    const itemSchema = getItemSchema(part);

    const prompt = `Generate ${clampedCount} unique ${level} ${part} exam content items${topic ? ` on the topic of "${topic}"` : ' on varied topics'}.

Return them as a JSON object with an "items" array. Each item must match this structure:
${JSON.stringify(itemSchema.shape, null, 2)}`;

    const result = await generateStructuredResponse({
      schema: z.object({ items: z.array(itemSchema).min(1).max(5) }),
      prompt,
      system,
      model: 'gpt-4o-mini',
    });

    // Insert into database
    const admin = createSupabaseAdmin();
    const inserted: unknown[] = [];

    for (const item of result.items) {
      let tableName: string;
      let row: Record<string, unknown>;

      if (part === 'part1' || part === 'part4') {
        tableName = 'exam_questions';
        const q = item as z.infer<typeof Part1QuestionSchema>;
        row = {
          level,
          part,
          topic: q.topic,
          question_text: q.question_text,
          follow_up_questions: q.follow_up_questions,
          difficulty: q.difficulty,
        };
      } else if (part === 'part2') {
        tableName = 'exam_part2_content';
        const c = item as z.infer<typeof Part2ContentSchema>;
        row = {
          level,
          topic: c.topic,
          image_urls: [],
          prompt_text: c.prompt_text,
          follow_up_question: c.follow_up_question,
          comparison_points: c.comparison_points,
          difficulty: c.difficulty,
        };
      } else {
        tableName = 'exam_part3_content';
        const c = item as z.infer<typeof Part3ContentSchema>;
        row = {
          level,
          topic: c.topic,
          discussion_prompt: c.discussion_prompt,
          options: c.options,
          decision_prompt: c.decision_prompt,
          difficulty: c.difficulty,
          diagram_mermaid: c.diagram_mermaid,
        };
      }

      const { data, error } = await admin
        .from(tableName)
        .insert(row)
        .select('id')
        .single();

      if (error) {
        console.error(`Failed to insert ${part} content:`, error);
      } else {
        inserted.push({ ...row, id: data.id });
      }
    }

    return jsonResponse({
      generated: result.items.length,
      inserted: inserted.length,
      items: inserted,
    });
  } catch (error) {
    console.error('Content generation error:', error);
    return errorResponse(`Failed to generate content: ${(error as Error).message}`, 500);
  }
});
