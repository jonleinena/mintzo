-- Add diagram_mermaid column to exam_part3_content for visual mindmaps
ALTER TABLE exam_part3_content
ADD COLUMN diagram_mermaid TEXT;

COMMENT ON COLUMN exam_part3_content.diagram_mermaid IS 'Mermaid diagram syntax for visual representation of Part 3 discussion options';

-- C2 Prompt Cards for Part 3 extended speaking
-- C2 Proficiency has a different Part 3 format: candidates receive a written prompt card
CREATE TABLE exam_c2_prompt_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic TEXT NOT NULL,
    prompt_text TEXT NOT NULL,
    bullet_points TEXT[] NOT NULL,
    follow_up_questions TEXT[],
    difficulty INTEGER DEFAULT 2 CHECK (difficulty BETWEEN 1 AND 3),
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE exam_c2_prompt_cards ENABLE ROW LEVEL SECURITY;

-- Public read access for active cards
CREATE POLICY "Public C2 prompt cards" ON exam_c2_prompt_cards
    FOR SELECT USING (is_active = true);

-- Index for efficient querying
CREATE INDEX idx_exam_c2_prompt_cards_active ON exam_c2_prompt_cards(is_active);

COMMENT ON TABLE exam_c2_prompt_cards IS 'C2 Proficiency Part 3 prompt cards with written topics and bullet points for extended speaking';
