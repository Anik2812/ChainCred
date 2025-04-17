// lib/supabaseServer.ts
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  'https://your-supabase-url.supabase.co',
  'supabase+url+key',
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
