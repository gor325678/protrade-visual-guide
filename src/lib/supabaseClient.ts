import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Safety check: if env vars are missing, create a mock client to prevent app crash
if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
        '⚠️ SUPABASE CONFIG ERROR: Missing environment variables!\n' +
        'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Netlify environment settings.\n' +
        'Go to: Site settings > Build & deploy > Environment > Environment variables'
    );
}

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createClient('https://placeholder.supabase.co', 'placeholder-key')
