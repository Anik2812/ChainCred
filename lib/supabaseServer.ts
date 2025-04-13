// lib/supabaseServer.ts
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  'https://zypsytuagcvfguzlkhcq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5cHN5dHVhZ2N2Zmd1emxraGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDQ2MzcyOSwiZXhwIjoyMDYwMDM5NzI5fQ.GuDDF5zjt58BUxh4PmDC2bwBM2uFXlx0fy1iA9CievM',
  { auth: { persistSession: false } }
)

async function createDID(provider: string, network: string) {
    const { data, error } = await supabaseAdmin
      .from('did_table')
      .insert([{ provider, network }]);
  
    if (error) {
      console.error('DID creation error:', error);
      throw error;
    }
  
    return data;
  }
