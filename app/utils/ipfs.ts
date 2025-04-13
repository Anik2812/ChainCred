// utils/ipfs.ts
import { create } from 'ipfs-http-client'

// Infura project ID and secret key
const projectId = 'c26b6ce821ff40da8809ead2788c511e';  // Replace with your Infura Project ID
const projectSecret = 'XjOz2y6Dzhxwb4WDbCUu8IqcdJ//rHjLBfSsNb+PMmkBLhq5UeM+PQ';  // Replace with your Infura Project Secret

// Create an auth header with the project ID and secret
const auth = 'Basic ' + Buffer.from(`${projectId}:${projectSecret}`).toString('base64');

// Initialize the IPFS client with authentication
const ipfs = create({
  url: 'https://ipfs.infura.io:5001/api/v0',
  headers: {
    authorization: auth,  // Add the authorization header
  },
});

export async function uploadToIPFS(data: any): Promise<string> {
  try {
    const result = await ipfs.add(JSON.stringify(data))  // Add the data to IPFS
    return result.path  // Return the IPFS hash (CID)
  } catch (error) {
    console.error('Error uploading to IPFS:', error)
    throw error
  }
}
