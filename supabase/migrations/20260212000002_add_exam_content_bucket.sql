-- Create exam-content storage bucket for audio cache and Part 2 photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('exam-content', 'exam-content', true);

-- Anyone can read exam content files
CREATE POLICY "Public read exam content"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'exam-content');

-- Service role can write exam content files
CREATE POLICY "Service role write exam content"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'exam-content');
