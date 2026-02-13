-- Fix RLS on achievements table (policies exist but RLS not enabled)
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Fix RLS on exam_content table (policies exist but RLS not enabled)
ALTER TABLE exam_content ENABLE ROW LEVEL SECURITY;
