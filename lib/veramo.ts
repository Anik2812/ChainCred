// lib/veramo.ts
import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { createAgent, IDIDManagerCreateArgs, IIdentifier } from '@veramo/core'
import { DIDManager } from '@veramo/did-manager'
import { KeyManager } from '@veramo/key-manager'
import { KeyManagementSystem, SecretBox } from '@veramo/kms-local'
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { KeyDIDProvider } from '@veramo/did-provider-key'
import { EthrDIDProvider } from '@veramo/did-provider-ethr'
import { getResolver as keyDidResolver } from 'key-did-resolver'
import { getResolver as ethrDidResolver } from 'ethr-did-resolver'
import {
  KeyStore,
  DIDStore,
  PrivateKeyStore,
  Entities,
} from '@veramo/data-store'
import { Resolver } from 'did-resolver'

// ── FOR DEV ONLY: hard‑coded secrets ──
const KMS_SECRET = 'f7a4b0d9e3c1fbb8a96e2d84ec3f4c66b8e9d2a1f52c738e6a1c0d5b3f27e911'
const SEPOLIA_RPC = 'https://sepolia.infura.io/v3/c26b6ce821ff40da8809ead2788c511e'

// 1) Initialize TypeORM DataSource with synchronize: true
export const dataSource = new DataSource({
  type: 'postgres',
  url: 'postgresql://postgres:coc28125@db.zypsytuagcvfguzlkhcq.supabase.co:5432/postgres',
  synchronize: true,          // ← auto-create tables from entities :contentReference[oaicite:0]{index=0}
  logging: ['error', 'schema'],
  entities: Entities,         // Veramo’s Key, PrivateKey, DID, etc.
})

// 2) Initialize connection once at startup
dataSource.initialize().catch((e) => {
  console.error('❌ DataSource initialization error:', e)
})

// 3) Create the Veramo agent using the synced DataSource
export const agent = createAgent({
  plugins: [
    new KeyManager({
      store: new KeyStore(dataSource),
      kms: {
        local: new KeyManagementSystem(new PrivateKeyStore(dataSource, new SecretBox(KMS_SECRET))),
      },
    }),
    new DIDManager({
      store: new DIDStore(dataSource),
      defaultProvider: 'did:ethr',
      providers: {
        'did:key': new KeyDIDProvider({ defaultKms: 'local' }),
        'did:ethr': new EthrDIDProvider({
          defaultKms: 'local',
          networks: [{ name: 'sepolia', rpcUrl: SEPOLIA_RPC, chainId: 11155111 }],
        }),
      },
    }),
    new DIDResolverPlugin({
      resolver: new Resolver({
        ...keyDidResolver(),
        ...ethrDidResolver({ networks: [{ name: 'sepolia', rpcUrl: SEPOLIA_RPC, chainId: 11155111 }] }),
      }),
    }),
  ],
})

/**  
 * Creates (and persists) a new DID.  
 */
export async function createDid(
  provider: 'did:key' | 'did:ethr',
  network?: string
): Promise<IIdentifier> {
  const args: IDIDManagerCreateArgs = { provider }
  if (provider === 'did:ethr') {
    if (network !== 'sepolia') {
      throw new Error('invalid_setup: ethr only configured for sepolia')
    }
    args.options = { network }
  }
  return agent.didManagerCreate(args)
}
