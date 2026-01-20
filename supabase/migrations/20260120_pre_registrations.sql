-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous inserts" ON pre_registrations;
DROP POLICY IF EXISTS "Allow authenticated read" ON pre_registrations;
DROP POLICY IF EXISTS "Allow authenticated update" ON pre_registrations;

-- Create pre_registrations table for storing healer application forms
CREATE TABLE IF NOT EXISTS pre_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  messenger TEXT,
  telegram_nick TEXT,
  instagram_nick TEXT,
  income TEXT,
  problems TEXT[],
  main_request TEXT,
  desired_result TEXT,
  why_now TEXT,
  ready_to_pay TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_pre_registrations_email ON pre_registrations(email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_pre_registrations_status ON pre_registrations(status);

-- Enable Row Level Security
ALTER TABLE pre_registrations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for webhook)
CREATE POLICY "Allow anonymous inserts" ON pre_registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read all
CREATE POLICY "Allow authenticated read" ON pre_registrations
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated update" ON pre_registrations
  FOR UPDATE
  TO authenticated
  USING (true);
