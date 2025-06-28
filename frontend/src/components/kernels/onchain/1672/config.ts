"use client";

import p2pAbi from '../../../../mainContract/p2pAbi.json';

// Define contract address with type assertion
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string; 

// Define entry ID and access token with type assertions
export const ENTRY_ID = process.env.NEXT_PUBLIC_ENTRY_ID as string;
export const ACCESS_TOKEN = process.env.NEXT_PUBLIC_ACCESS_TOKEN as string;
export const KERNEL_ID = process.env.NEXT_PUBLIC_KERNEL_ID || "1672";

// Export the contract config
export const CONTRACT_CONFIG = {
  address: CONTRACT_ADDRESS,
  abi: p2pAbi,
  entryId: ENTRY_ID,
  accessToken: ACCESS_TOKEN,
  kernelId: KERNEL_ID
};

// Re-export the ABI for convenience
export { p2pAbi as abi };
