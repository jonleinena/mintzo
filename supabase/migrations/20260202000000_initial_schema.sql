-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ACADEMIES (must come before profiles)
CREATE TABLE academies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subscription_tier TEXT DEFAULT 'basic',
    max_students INTEGER DEFAULT 50,
    admin_emails TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROFILES
CREATE TABLE profiles (
    id UUID REFERENCES auth.users PRIMARY KEY,
    display_name TEXT,
    avatar_url TEXT,
    auth_type TEXT CHECK (auth_type IN ('anonymous', 'email', 'oauth', 'academy_invite')),
    academy_id UUID REFERENCES academies(id),
    academy_group_id UUID,
    onboarding_complete BOOLEAN DEFAULT false,
    has_used_free_trial BOOLEAN DEFAULT false,
    target_exam_level TEXT CHECK (target_exam_level IN ('B2', 'C1', 'C2')),
    target_exam_date DATE,
    daily_practice_goal INTEGER DEFAULT 45,
    notification_preferences JSONB DEFAULT '{"streakReminders": true, "reminderTime": "18:00"}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, auth_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'auth_type', 'email')
  );
  INSERT INTO public.user_progress (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- GAMIFICATION
CREATE TABLE daily_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    minutes_practiced INTEGER DEFAULT 0,
    sessions_completed INTEGER DEFAULT 0,
    xp_earned INTEGER DEFAULT 0,
    UNIQUE(user_id, date)
);

CREATE TABLE user_progress (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
    total_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_practice_date DATE,
    streak_freezes_available INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    total_practice_minutes INTEGER DEFAULT 0,
    average_score DECIMAL(2,1) DEFAULT 0,
    level_stats JSONB DEFAULT '{
        "B2": {"sessions": 0, "avgScore": 0, "partScores": {"part1": 0, "part2": 0, "part3": 0, "part4": 0}},
        "C1": {"sessions": 0, "avgScore": 0, "partScores": {"part1": 0, "part2": 0, "part3": 0, "part4": 0}},
        "C2": {"sessions": 0, "avgScore": 0, "partScores": {"part1": 0, "part2": 0, "part3": 0}}
    }',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    category TEXT CHECK (category IN ('streak', 'sessions', 'level', 'score', 'time', 'special')),
    tier TEXT CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
    criteria JSONB NOT NULL,
    xp_reward INTEGER DEFAULT 0,
    is_secret BOOLEAN DEFAULT false
);

CREATE TABLE user_achievements (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    unlocked_at TIMESTAMPTZ,
    PRIMARY KEY (user_id, achievement_id)
);

-- EXAM CONTENT
CREATE TABLE exam_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level TEXT NOT NULL CHECK (level IN ('B2', 'C1', 'C2')),
    part TEXT NOT NULL CHECK (part IN ('part1', 'part2', 'part3', 'part4')),
    topic TEXT NOT NULL,
    difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 3),
    content JSONB NOT NULL,
    usage_count INTEGER DEFAULT 0,
    average_score DECIMAL(2,1),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- EXAM SESSIONS
CREATE TABLE exam_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    level TEXT NOT NULL CHECK (level IN ('B2', 'C1', 'C2')),
    session_type TEXT NOT NULL CHECK (session_type IN ('full_exam', 'single_part')),
    parts_practiced TEXT[] NOT NULL,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    is_free_trial BOOLEAN DEFAULT false,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    overall_score DECIMAL(2,1),
    scores JSONB,
    xp_earned INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exam_part_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES exam_sessions(id) ON DELETE CASCADE,
    part TEXT NOT NULL CHECK (part IN ('part1', 'part2', 'part3', 'part4')),
    content_id UUID REFERENCES exam_content(id),
    audio_url TEXT,
    user_transcript TEXT,
    ai_transcript TEXT,
    duration_seconds INTEGER,
    target_duration_seconds INTEGER,
    scores JSONB,
    feedback JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- EXAM CONTENT (specific tables for different parts)
CREATE TABLE exam_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level TEXT NOT NULL CHECK (level IN ('B2', 'C1', 'C2')),
    part TEXT NOT NULL CHECK (part IN ('part1', 'part4')),
    topic TEXT NOT NULL,
    question_text TEXT NOT NULL,
    follow_up_questions TEXT[],
    difficulty INTEGER DEFAULT 2 CHECK (difficulty BETWEEN 1 AND 3),
    audio_url TEXT,
    usage_count INTEGER DEFAULT 0,
    average_response_score DECIMAL(2,1),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exam_part2_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level TEXT NOT NULL CHECK (level IN ('B2', 'C1', 'C2')),
    topic TEXT NOT NULL,
    image_urls TEXT[] NOT NULL,
    prompt_text TEXT NOT NULL,
    follow_up_question TEXT NOT NULL,
    comparison_points TEXT[],
    difficulty INTEGER DEFAULT 2,
    audio_url TEXT,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exam_part3_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level TEXT NOT NULL CHECK (level IN ('B2', 'C1', 'C2')),
    topic TEXT NOT NULL,
    visual_prompt_url TEXT,
    discussion_prompt TEXT NOT NULL,
    options TEXT[] NOT NULL,
    decision_prompt TEXT,
    difficulty INTEGER DEFAULT 2,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONVERSATION SESSIONS (Part 3 tracking)
CREATE TABLE conversation_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    conversation_id TEXT UNIQUE,
    agent_id TEXT NOT NULL,
    level TEXT NOT NULL,
    content_id UUID,
    transcript TEXT,
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'error')),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SUBSCRIPTIONS
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    revenuecat_user_id TEXT,
    product_id TEXT,
    entitlement TEXT,
    status TEXT CHECK (status IN ('active', 'expired', 'cancelled', 'trial')),
    started_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_daily_activity_user_date ON daily_activity(user_id, date DESC);
CREATE INDEX idx_exam_sessions_user ON exam_sessions(user_id, created_at DESC);
CREATE INDEX idx_exam_content_level_part ON exam_content(level, part);
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_exam_questions_level_part ON exam_questions(level, part, is_active);
CREATE INDEX idx_exam_part2_level ON exam_part2_content(level, is_active);
CREATE INDEX idx_exam_part3_level ON exam_part3_content(level, is_active);
CREATE INDEX idx_conversation_sessions_user ON conversation_sessions(user_id);

-- ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_part_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_part2_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_part3_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users own data" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users own progress" ON user_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own activity" ON daily_activity FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own sessions" ON exam_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own results" ON exam_part_results FOR ALL
    USING (session_id IN (SELECT id FROM exam_sessions WHERE user_id = auth.uid()));
CREATE POLICY "Users own achievements" ON user_achievements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own subscription" ON subscriptions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public exam content" ON exam_questions FOR SELECT USING (is_active = true);
CREATE POLICY "Public part2 content" ON exam_part2_content FOR SELECT USING (is_active = true);
CREATE POLICY "Public part3 content" ON exam_part3_content FOR SELECT USING (is_active = true);
CREATE POLICY "Users own conv sessions" ON conversation_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public content" ON exam_content FOR SELECT USING (is_active = true);
CREATE POLICY "Public achievements" ON achievements FOR SELECT USING (true);

-- Function to increment usage count
CREATE OR REPLACE FUNCTION increment_usage_count(p_table TEXT, p_ids UUID[])
RETURNS VOID AS $$
BEGIN
  EXECUTE format('UPDATE %I SET usage_count = usage_count + 1 WHERE id = ANY($1)', p_table)
  USING p_ids;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER user_progress_updated_at BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
