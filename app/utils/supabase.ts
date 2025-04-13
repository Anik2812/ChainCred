// utils/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabase = createClient(
  'https://zypsytuagcvfguzlkhcq.supabase.co',  // Replace with your Supabase URL
  'your-anon-key'  // Replace with your Supabase anon key
);

export async function storeDIDMetadata(did: string, ipfsHash: string, provider: string, network: string) {
  try {
    const { data, error } = await supabase
      .from('did_metadata')
      .insert([{ did, ipfs_hash: ipfsHash, provider, network }]);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error storing DID metadata:', error);
    throw error;
  }
}
