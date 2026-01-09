-- Pre-registrations table for Healer Registration
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

CREATE TABLE IF NOT EXISTS pre_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT,
    email TEXT NOT NULL,
    messenger TEXT NOT NULL,
    phone TEXT NOT NULL,
    telegram TEXT,
    instagram TEXT,
    income TEXT,
    problems TEXT[],
    expected_result TEXT,
    key_factor TEXT,
    main_request TEXT,
    why_choose_you TEXT,
    ready_to_invest TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pre_registrations_email ON pre_registrations(email);
CREATE INDEX IF NOT EXISTS idx_pre_registrations_created_at ON pre_registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pre_registrations_status ON pre_registrations(status);

-- Enable Row Level Security (RLS)
ALTER TABLE pre_registrations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (public form submission)
CREATE POLICY "Allow public insert" ON pre_registrations
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Policy: Only authenticated users can select (admin view)
CREATE POLICY "Allow authenticated select" ON pre_registrations
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Only authenticated users can update
CREATE POLICY "Allow authenticated update" ON pre_registrations
    FOR UPDATE
    TO authenticated
    USING (true);
