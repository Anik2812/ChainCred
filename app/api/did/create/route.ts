// app/api/did/create/route.ts
import { NextResponse } from 'next/server'
import { createDid } from '@/lib/did'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const method = url.searchParams.get('method')
    const network = url.searchParams.get('network')

    if (!method) {
      return NextResponse.json({ error: 'Missing method' }, { status: 400 })
    }

    const provider = `did:${method}` as 'did:key' | 'did:ethr'
    const identifier = await createDid(provider, network || undefined)

    return NextResponse.json(identifier)
  } catch (err: any) {
    console.error('🔥 DID creation error:', err)
    return NextResponse.json(
      { error: err.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
