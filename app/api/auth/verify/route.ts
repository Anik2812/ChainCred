// app/api/auth/verify/route.ts
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'
import { verifyDidSignature } from '@/lib/didAuth'  // we’ll create this helper
import { signJwt } from '@/lib/jwt'

export async function POST(req: Request) {
  const { did, signature } = await req.json()

  // fetch the latest challenge
  const { data: challenge } = await supabaseAdmin
    .from('did_challenges')
    .select('*')
    .eq('did', did)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!challenge) {
    return NextResponse.json({ error: 'No challenge found' }, { status: 400 })
  }

  // verify signature over the nonce
  const valid = await verifyDidSignature(did, challenge.nonce, signature)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // delete used challenge
  await supabaseAdmin
    .from('did_challenges')
    .delete()
    .eq('id', challenge.id)

  // issue a JWT session cookie
  const token = signJwt({ did })
  const res = NextResponse.json({ ok: true })
  res.cookies.set('session', token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}
