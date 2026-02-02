import { supabase } from '../supabase/client';
import type { ExamLevel } from '@/types/exam';

export async function getRandomQuestions(level: ExamLevel, part: 'part1' | 'part4', count: number = 6) {
  const { data, error } = await supabase
    .from('exam_questions')
    .select('*')
    .eq('level', level)
    .eq('part', part)
    .eq('is_active', true)
    .order('usage_count', { ascending: true })
    .limit(count * 2);

  if (error) throw error;

  const shuffled = (data ?? []).sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
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
