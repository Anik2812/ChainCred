// lib/didAuth.ts
import { agent } from './veramo'

// verifies a did:ethr signature over a plain message
export async function verifyDidSignature(
  did: string,
  message: string,
  signature: string
): Promise<boolean> {
  try {
    // Veramo’s didAuth API will verify for you
    const result = await agent.verifyDidAuth({
      did,
      proof: signature,
      data: message,
    })
    return result.verified === true
  } catch {
    return false
  }
}
