// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://your-supabase-url.supabase.co',
  'supabase anon key'
)
