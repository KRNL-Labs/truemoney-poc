"use client";

import { useWallet } from '@/hooks/useWallet';
import { executeChainanalysisKrnl, createP2PListing, generateVerificationId } from '@/components/kernels/onchain/1672';
import { CONTRACT_ADDRESS } from '@/components/kernels/onchain/1672/config';
import { useState, FormEvent, useEffect } from 'react';
import { ethers } from 'krnl-sdk';
import Image from 'next/image';
import Link from 'next/link';

// Import our UI components
import { Header } from '@/components/p2p/Header';
import { HeroSection } from '@/components/p2p/HeroSection';
import { ConnectWallet } from '@/components/p2p/ConnectWallet';
import { ListingForm } from '@/components/p2p/ListingForm';
import { ListingsGrid } from '@/components/p2p/ListingsGrid';
import { Footer } from '@/components/p2p/Footer';

// Add JSX type declaration to fix element type errors
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

interface FormData {
  verificationId: string;
  assetType: string;
  assetName: string;
  gameTitle: string;
  price: string;
}

interface TxState {
  loading: boolean;
  error: string;
  success: boolean;
  txHash: string;
}

export default function P2PPage() {
  const {
    loading: walletLoading,
    walletConnected,
    connectedAddress,
    connectWallet,
    disconnectWallet,
    error: walletError,
    signer
  } = useWallet();
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    verificationId: '',
    assetType: '',
    assetName: '',
    gameTitle: '',
    price: ''
  });
  
  // State for listing form visibility
  const [showListingForm, setShowListingForm] = useState<boolean>(false);
  
  // State for transaction status management
  const [txState, setTxState] = useState<TxState>({
    loading: false,
    error: '',
    success: false,
    txHash: ''
  });
  
  // State for contract interaction
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  
  // State for buy functionality
  const [buyingListing, setBuyingListing] = useState<{id: number, price: bigint} | null>(null);
  const [buyTxState, setBuyTxState] = useState<TxState>({
    loading: false,
    error: '',
    success: false,
    txHash: ''
  });
  
  // Initialize contract when signer is available
  useEffect(() => {
    if (!signer || !CONTRACT_ADDRESS) return;
    
    const initContract = async () => {
      try {
        // Import the P2P contract ABI
        const p2pAbi = await import('@/mainContract/p2pAbi.json');
        
        // Create contract instance
        const p2pContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          p2pAbi.default || p2pAbi,
          signer
        );
        
        setContract(p2pContract);
      } catch (error) {
        console.error('Failed to initialize contract:', error);
      }
    };
    
    initContract();
  }, [signer]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Generate a verification ID
  const handleGenerateId = () => {
    const id = generateVerificationId();
    setFormData(prev => ({
      ...prev,
      verificationId: id
    }));
  };
  
  // Handle buy asset function
  const handleBuyAsset = async (listingId: number, price: bigint) => {
    if (!signer || !contract || !connectedAddress) {
      setBuyTxState({
        loading: false,
        error: 'Wallet not connected',
        success: false,
        txHash: ''
      });
      return;
    }
    
    setBuyingListing({ id: listingId, price });
    setBuyTxState({
      loading: true,
      error: '',
      success: false,
      txHash: ''
    });
    
    try {
      // Call the buyAsset function on the contract
      const tx = await contract.buyAsset(listingId, {
        value: price,
        gasLimit: 300000 // Setting gas limit explicitly for buy transaction
      });
      
      console.log('Buy transaction sent:', tx.hash);
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('Buy transaction confirmed:', receipt);
      
      setBuyTxState({
        loading: false,
        error: '',
        success: true,
        txHash: tx.hash
      });
    } catch (error: any) {
      console.error('Error buying asset:', error);
      
      let errorMessage = 'Failed to buy asset';
      if (error.message) errorMessage += ': ' + error.message;
      
      setBuyTxState({
        loading: false,
        error: errorMessage,
        success: false,
        txHash: ''
      });
    } finally {
      // Clear buying state after a delay
      setTimeout(() => {
        setBuyingListing(null);
      }, 5000);
    }
  };
  
  // Handle form submission for creating listing
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!connectedAddress || !signer) {
      setTxState({
        loading: false,
        error: 'Wallet not connected',
        success: false,
        txHash: ''
      });
      return;
    }
    
    // Validate form data before submission
    if (!formData.verificationId || !formData.assetType || 
        !formData.assetName || !formData.gameTitle || !formData.price) {
      setTxState({
        loading: false,
        error: 'All fields are required',
        success: false,
        txHash: ''
      });
      return;
    }

    if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      setTxState({
        loading: false,
        error: 'Price must be a valid positive number',
        success: false,
        txHash: ''
      });
      return;
    }
    
    setTxState({
      loading: true,
      error: '',
      success: false,
      txHash: ''
    });
    
    try {
      console.log('Submitting form with data:', formData);
      
      // Execute Chainanalysis KRNL
      console.log('Executing Chainanalysis KRNL with address:', connectedAddress);
      const krnlPayload = await executeChainanalysisKrnl(connectedAddress, {
        verificationId: formData.verificationId,
        assetType: formData.assetType,
        assetName: formData.assetName,
        gameTitle: formData.gameTitle,
        price: formData.price
      });
      
      console.log('KRNL payload received:', krnlPayload);
      
      // Create P2P listing with the KRNL payload
      console.log('Creating P2P listing...');
      const tx = await createP2PListing(
        krnlPayload,
        signer,
        {
          verificationId: formData.verificationId,
          assetType: formData.assetType,
          assetName: formData.assetName,
          gameTitle: formData.gameTitle,
          price: formData.price
        }
      );
      
      console.log('Transaction successful, hash:', tx);
      setTxState({
        loading: false,
        error: '',
        success: true,
        txHash: tx
      });
      
      // Reset form after successful submission
      setFormData({
        verificationId: '',
        assetType: '',
        assetName: '',
        gameTitle: '',
        price: ''
      });
      
      // Hide the form and show listings after successful submission
      setShowListingForm(false);
      
    } catch (error: any) {
      console.error('Error submitting listing:', error);
      
      // Try to extract more detailed error information
      let errorMessage = 'Unknown error occurred';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      // Check for ethers-specific error details
      if (error.data) {
        console.error('Error data:', error.data);
        errorMessage += ' - ' + JSON.stringify(error.data);
      }
      
      if (error.code) {
        console.error('Error code:', error.code);
        errorMessage += ` (Code: ${error.code})`;
      }
      
      setTxState({
        loading: false,
        error: errorMessage,
        success: false,
        txHash: ''
      });
    }
  };

  // Modal for buy transaction status
  const BuyTransactionModal = () => {
    if (!buyingListing || !buyTxState.loading && !buyTxState.success && !buyTxState.error) {
      return null;
    }
    
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
        <div className="bg-white text-black p-6 rounded-lg shadow-xl max-w-md w-full">
          {buyTxState.loading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-lg">Processing your purchase...</p>
              <p className="text-sm text-gray-500 mt-2">Please wait while your transaction is being processed</p>
            </div>
          )}
          
          {buyTxState.success && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="mt-4 text-lg font-medium">Purchase successful!</p>
              <p className="mt-2 text-sm text-gray-500">Your transaction has been confirmed</p>
              {buyTxState.txHash && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 break-all">
                    Transaction Hash: {buyTxState.txHash}
                  </p>
                </div>
              )}
              <button
                onClick={() => window.location.reload()}
                className="mt-6 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                Close
              </button>
            </div>
          )}
          
          {buyTxState.error && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="mt-4 text-lg font-medium">Transaction failed</p>
              <p className="mt-2 text-sm text-gray-500">{buyTxState.error}</p>
              <button
                onClick={() => setBuyTxState({loading: false, error: '', success: false, txHash: ''})}
                className="mt-6 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-black text-white bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Buy transaction modal */}
      <BuyTransactionModal />
      
      {/* Header */}
      <Header
        walletConnected={walletConnected}
        connectedAddress={connectedAddress}
        loading={walletLoading}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
      />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero section */}
        <HeroSection walletConnected={walletConnected} />

        {/* Main content area */}
        <div className="grid grid-cols-1 gap-8">
          {/* If wallet not connected, show connect wallet UI */}
          {!walletConnected ? (
            <ConnectWallet 
              connectWallet={connectWallet} 
              loading={walletLoading} 
            />
          ) : (
            /* If wallet is connected, show marketplace content */
            <div>
              {/* Create listing button or form */}
              {!showListingForm ? (
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">
                    P2P Game Marketplace
                  </h2>
                  <button
                    onClick={() => setShowListingForm(true)}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Create New Listing
                  </button>
                </div>
              ) : (
                /* Show listing form when creating a new listing */
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">
                      Create New Listing
                    </h2>
                    <button
                      onClick={() => setShowListingForm(false)}
                      className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-800 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                  
                  <ListingForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleGenerateId={handleGenerateId}
                    handleSubmit={handleSubmit}
                    txState={txState}
                    error={walletError}
                  />
                </div>
              )}
              
              {/* Show listings grid when not creating a listing */}
              {!showListingForm && (
                <ListingsGrid
                  provider={signer?.provider}
                  contract={contract}
                  walletAddress={connectedAddress}
                  onBuyClick={handleBuyAsset}
                />
              )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
