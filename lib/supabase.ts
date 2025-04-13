// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://zypsytuagcvfguzlkhcq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5cHN5dHVhZ2N2Zmd1emxraGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NjM3MjksImV4cCI6MjA2MDAzOTcyOX0.58hSb5QE0gPq_msEULR5zwO0OCl3FUanlh6qJyEAK28'
)
