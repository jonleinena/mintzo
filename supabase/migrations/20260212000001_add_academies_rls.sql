-- Enable RLS on academies table (was missing from initial schema)
ALTER TABLE academies ENABLE ROW LEVEL SECURITY;

-- Anyone can read academies
CREATE POLICY "Public read academies"
  ON academies FOR SELECT
  USING (true);

-- Academy admins can manage their own academy
CREATE POLICY "Academy admins manage own"
  ON academies FOR ALL
  USING (auth.jwt() ->> 'email' = ANY(admin_emails));
