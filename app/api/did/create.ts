// pages/api/did/create.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { ethers, Providers } from 'ethers';

// Use the deployed contract address and ABI from your DIDRegistry.sol compilation
const DID_REGISTRY_ADDRESS = process.env.DID_REGISTRY_ADDRESS || '0xaFAaD41d3642E35bE87e4577e899F69B97386d6b';
const DID_REGISTRY_ABI = [
  "function registerDID(string calldata didDocument) external",
  "event DIDRegistered(address indexed owner, string didDocument, uint256 timestamp)"
];

// Setup provider for Sepolia (Infura used as an example)
const provider = new Providers.InfuraProvider("sepolia", process.env.INFURA_API_KEY || "https://sepolia.infura.io/v3/24237cbb31974196acb8b8ec4969a760");
// Use a wallet (you should keep the private key secure, via env variables)
const walletPrivateKey = process.env.PRIVATE_KEY || "b8d62977efcf17f00bd79033630128398fe0ced70e0b221c8ae2f64166d089e0";
const wallet = new ethers.Wallet(walletPrivateKey, provider);

// Create a contract instance
const didRegistryContract = new ethers.Contract(DID_REGISTRY_ADDRESS, DID_REGISTRY_ABI, wallet);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Expect method and network to be provided in query (verify the expected values)
    const { method, network } = req.query;
    if (method !== 'ethr' || network !== 'sepolia') {
      return res.status(400).json({ error: 'Unsupported DID method or network' });
    }

    // Here you could have your client send the user’s public key
    // Alternatively, for demo purposes, we generate a new wallet.
    const userWallet = ethers.Wallet.createRandom();
    // Create a DID string following the did:ethr format.
    const did = `did:ethr:${network}:${userWallet.address}`;

    // Build the DID document. Add pointers to credential services if available.
    const didDocument = {
      '@context': 'https://www.w3.org/ns/did/v1',
      id: did,
      verificationMethod: [
        {
          id: `${did}#owner`,
          type: 'EcdsaSecp256k1VerificationKey2019',
          controller: did,
          publicKeyHex: userWallet.publicKey.replace('0x', '')
        }
      ],
      authentication: [`${did}#owner`],
      // Initially, credential pointer is empty. It can be updated later via updateCredential.
      service: [
        {
          id: `${did}#vc`,
          type: "VerifiableCredentialService",
          serviceEndpoint: ""  // This field can later point to your offchain storage service (e.g., IPFS)
        }
      ]
    };

    const didDocString = JSON.stringify(didDocument);

    // Register the DID on-chain by calling the smart contract
    const tx = await didRegistryContract.registerDID(didDocString);
    await tx.wait(); // Wait for confirmation

    return res.status(200).json({ did });
  } catch (error) {
    console.error("DID creation failed:", error);
    return res.status(500).json({ error: "Failed to create DID" });
  }
}
