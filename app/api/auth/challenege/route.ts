// app/api/auth/challenge/route.ts
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'
import { randomBytes } from 'crypto'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const did = searchParams.get('did')
  if (!did) return NextResponse.json({ error: 'Missing DID' }, { status: 400 })

  // ensure user exists
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('did')
    .eq('did', did)
    .single()

  if (!user) {
    return NextResponse.json({ error: 'Unknown DID' }, { status: 404 })
  }

  // create a 32‑byte hex nonce
  const nonce = randomBytes(16).toString('hex')
  await supabaseAdmin.from('did_challenges').insert({ did, nonce })

  return NextResponse.json({ nonce })
}
