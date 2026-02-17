import { supabase } from '../supabase/client';
import type { ExamLevel } from '@/types/exam';

// Fixed intro questions for Part 1 - always asked first
const PART1_INTRO_QUESTIONS = [
  {
    id: 'intro-name',
    question_text: "What's your name and surname?",
    topic: 'intro',
    level: '' as ExamLevel,
    part: 'part1',
    follow_up_questions: [],
    difficulty: 1,
    is_active: true,
    usage_count: 0,
    audio_url: null,
  },
  {
    id: 'intro-origin',
    question_text: 'Where are you from?',
    topic: 'intro',
    level: '' as ExamLevel,
    part: 'part1',
    follow_up_questions: [],
    difficulty: 1,
    is_active: true,
    usage_count: 0,
    audio_url: null,
  },
];

export async function getRandomQuestions(level: ExamLevel, part: 'part1' | 'part4', count: number = 6) {
  const isInterview = part === 'part1';

  // For part1, reserve 2 slots for intro questions
  const dbCount = isInterview ? count - 2 : count;

  const { data, error } = await supabase
    .from('exam_questions')
    .select('*')
    .eq('level', level)
    .eq('part', part)
    .eq('is_active', true)
    .order('usage_count', { ascending: true })
    .limit(dbCount * 2);

  if (error) throw error;

  const shuffled = (data ?? []).sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, dbCount);

  if (isInterview) {
    // Intro questions first, then random ones
    const intro = PART1_INTRO_QUESTIONS.map((q) => ({ ...q, level }));
    return [...intro, ...selected];
  }

  return selected;
}

export async function getRandomPart2Content(level: ExamLevel) {
  const { data, error } = await supabase
    .from('exam_part2_content')
    .select('*')
    .eq('level', level)
    .eq('is_active', true)
    .order('usage_count', { ascending: true })
    .limit(10);

  if (error) throw error;
  if (!data?.length) return null;

  return data[Math.floor(Math.random() * data.length)];
}

export async function getRandomPart3Content(level: ExamLevel) {
  const { data, error } = await supabase
    .from('exam_part3_content')
    .select('*')
    .eq('level', level)
    .eq('is_active', true)
    .order('usage_count', { ascending: true })
    .limit(10);

  if (error) throw error;
  if (!data?.length) return null;

  return data[Math.floor(Math.random() * data.length)];
}

export async function constructExamSession(level: ExamLevel) {
  const [part1Questions, part2Content, part3Content, part4Questions] = await Promise.all([
    getRandomQuestions(level, 'part1', 6),
    getRandomPart2Content(level),
    getRandomPart3Content(level),
    getRandomQuestions(level, 'part4', 5),
  ]);

  return { part1Questions, part2Content, part3Content, part4Questions };
}

export async function markContentUsed(contentIds: string[], table: string) {
  await supabase.rpc('increment_usage_count', {
    p_table: table,
    p_ids: contentIds,
  });
}
