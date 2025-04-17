// pages/api/did/update-credential.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { ethers, Contract, InfuraProvider } from 'ethers';

const DID_REGISTRY_ADDRESS = process.env.DID_REGISTRY_ADDRESS || 'contract_address_here';
const DID_REGISTRY_ABI = [
  "function updateCredential(string calldata credentialCID) external",
  "event CredentialUpdated(address indexed owner, string credentialCID, uint256 timestamp)"
];

const provider = new InfuraProvider("sepolia", process.env.INFURA_API_KEY || "https://sepolia.infura.io/v3/url");
const walletPrivateKey = process.env.PRIVATE_KEY || "private_key_here";
const wallet = new ethers.Wallet(walletPrivateKey, provider);

const didRegistryContract = new Contract(DID_REGISTRY_ADDRESS, DID_REGISTRY_ABI, wallet);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { credentialCID } = req.body;
    if (!credentialCID) {
      return res.status(400).json({ error: 'credentialCID is required' });
    }

    // Here, you might also authenticate the caller to ensure the proper DID owner is updating.
    // This example assumes the caller is correctly authorized.

    const tx = await didRegistryContract.updateCredential(credentialCID);
    await tx.wait();
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to update credential:", error);
    return res.status(500).json({ error: "Failed to update credential" });
  }
}
