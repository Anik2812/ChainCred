// lib/did.ts
import { createAgent, IDIDManagerCreateArgs, IIdentifier } from '@veramo/core'
import { DIDManager, MemoryDIDStore } from '@veramo/did-manager'
import { KeyManager } from '@veramo/key-manager'
import { KeyManagementSystem } from '@veramo/kms-local'
import { MemoryKeyStore, MemoryPrivateKeyStore } from '@veramo/key-manager'
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { getResolver as keyDidResolver } from 'key-did-resolver'
import { getResolver as ethrDidResolver } from 'ethr-did-resolver'
import { KeyDIDProvider } from '@veramo/did-provider-key'
import { EthrDIDProvider } from '@veramo/did-provider-ethr'

// ── FOR DEV ONLY: hard‑coded secret ──
const kmsSecret = '0123456789abcdef0123456789abcdef'

// ── FOR DEV ONLY: Sepolia RPC ──
const sepoliaRpc = 'https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID'

const agent = createAgent({
  plugins: [
    new KeyManager({
      store: new MemoryKeyStore(),
      kms: {
        local: new KeyManagementSystem(new MemoryPrivateKeyStore()),
      },
    }),
    new DIDManager({
      store: new MemoryDIDStore(), // Replaced with MemoryDIDStore
      defaultProvider: 'did:key',
      providers: {
        'did:key': new KeyDIDProvider({ defaultKms: 'local' }),
        'did:ethr': new EthrDIDProvider({
          defaultKms: 'local',
          networks: [
            { name: 'sepolia', rpcUrl: sepoliaRpc, chainId: 11155111 },
          ],
        }),
      },
    }),
    new DIDResolverPlugin({
      // just pass the mapping directly; Veramo will wrap it in did-resolver for you
      ...keyDidResolver(),
      ...ethrDidResolver({
        networks: [{ name: 'sepolia', rpcUrl: sepoliaRpc, chainId: 11155111 }],
      }),
    }),
  ],
})

export async function createDid(
  provider: 'did:key' | 'did:ethr',
  network?: string
): Promise<IIdentifier> {
  if (provider === 'did:ethr' && network !== 'sepolia') {
    throw new Error('invalid_setup: ethr only configured for sepolia')
  }
  const args: IDIDManagerCreateArgs = { provider }
  if (provider === 'did:ethr') {
    args.options = { network }
  }
  return agent.didManagerCreate(args)
}
