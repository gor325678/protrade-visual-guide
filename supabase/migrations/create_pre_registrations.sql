-- Pre-registrations table for ProTrader Systems
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

CREATE TABLE IF NOT EXISTS pre_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    telegram TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted', 'rejected'))
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_pre_registrations_email ON pre_registrations(email);
CREATE INDEX IF NOT EXISTS idx_pre_registrations_created_at ON pre_registrations(created_at DESC);

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
