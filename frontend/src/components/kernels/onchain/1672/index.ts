"use client";

import { ethers } from "krnl-sdk";
import { abi as p2pAbi, CONTRACT_ADDRESS, ENTRY_ID, ACCESS_TOKEN, KERNEL_ID } from "./config";

// Create a provider for KRNL RPC
const krnlProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_KRNL || '');

// Check if required environment variables are available
if (!CONTRACT_ADDRESS) {
    throw new Error("Contract address not found");
}

if (!ENTRY_ID || !ACCESS_TOKEN) {
    throw new Error("Entry ID or Access Token not found");
}

// ABI Coder for encoding parameters
const abiCoder = new ethers.AbiCoder();

/**
 * Execute KRNL with the Chainanalysis kernel for P2P contract
 * @param address Wallet address to use (from wallet connection)
 * @param listingDetails Details for the listing
 * @returns KRNL payload result
 */
export async function executeChainanalysisKrnl(
    address: string,
    listingDetails: {
        verificationId: string;
        assetType: string;
        assetName: string;
        gameTitle: string;
        price: string; // In ETH
    }
 ) {
    // Validate inputs
    if (!address) {
        throw new Error("Wallet address is required");
    }
    
    if (!listingDetails) {
        throw new Error("Listing details are required");
    }
    
    // Make sure all required fields are present and valid
    if (!listingDetails.verificationId || !listingDetails.assetType || 
        !listingDetails.assetName || !listingDetails.gameTitle || !listingDetails.price) {
        throw new Error("All listing fields are required");
    }

    if (isNaN(Number(listingDetails.price)) || Number(listingDetails.price) <= 0) {
        throw new Error("Price must be a valid positive number");
    }
    
    // Create the kernel request data with the correct structure for Chainanalysis
    const kernelRequestData = {
        senderAddress: address,
        kernelPayload: {
            [KERNEL_ID]: {
                "parameters": {
                    "header": {},
                    "body": {
                        "address": address
                    },
                    "query": {},
                    "path": {}
                }
            }
        }
    } as any;

    // Encode the function parameters for the contract call
    // These will be passed to the contract's createListing function
    // Format must match: string, string, string, string, uint256
    const functionParams = abiCoder.encode(
        ["string", "string", "string", "string", "uint256"], 
        [listingDetails.verificationId, listingDetails.assetType, listingDetails.assetName, 
         listingDetails.gameTitle, ethers.parseEther(listingDetails.price)]
    );
    
    // Execute KRNL kernels
    const krnlPayload = await krnlProvider.executeKernels(
        ENTRY_ID, 
        ACCESS_TOKEN, 
        kernelRequestData, 
        functionParams,
    );
    
    return krnlPayload;
}

/**
 * Call the createListing function on the P2P contract with KRNL payload
 * @param krnlPayload The result from executeChainanalysisKrnl
 * @param signer The signer to use for the transaction
 * @param listingDetails Details for the listing
 * @returns Transaction hash
 */
export async function createP2PListing(
    krnlPayload: any, 
    signer: ethers.Signer,
    listingDetails: {
        verificationId: string;
        assetType: string;
        assetName: string;
        gameTitle: string;
        price: string; // In ETH
    }
) {
    if (!signer) {
        throw new Error("Signer is required");
    }
    
    console.log("KRNL Payload:", krnlPayload);
    console.log("Listing Details:", listingDetails);
    
    // Create contract instance with the provided signer
    const contract = new ethers.Contract(CONTRACT_ADDRESS, p2pAbi, signer);
    
    // Format the payload for the contract
    // The KRNL SDK returns snake_case properties but the contract expects camelCase
    // Add more detailed logging to debug the payload structure
    console.log("Raw KRNL payload structure:", Object.keys(krnlPayload));
    
    const formattedKrnlPayload = {
        auth: krnlPayload.auth,
        kernelResponses: krnlPayload.kernel_responses || krnlPayload.kernelResponses,
        kernelParams: krnlPayload.kernel_params || krnlPayload.kernelParams
    };
    
    // Log the formatted payload to verify structure
    console.log("Formatted payload for contract:", formattedKrnlPayload);
    
    // Convert price from ETH to Wei
    const priceInWei = ethers.parseEther(listingDetails.price);
    
    // Call the createListing function
    const tx = await contract.createListing(
        formattedKrnlPayload,
        listingDetails.verificationId,
        listingDetails.assetType,
        listingDetails.assetName,
        listingDetails.gameTitle,
        priceInWei
    );
    
    // Wait for the transaction to be mined
    await tx.wait();
    
    return tx.hash;
}

/**
 * Generate a unique verification ID
 * @returns A unique verification ID string
 */
export function generateVerificationId(): string {
    return `verify-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}
