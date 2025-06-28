"use client";

import { useState, useEffect } from "react";
import { ethers } from "krnl-sdk";
import Image from "next/image";

// Define the listing type based on the contract struct
interface Listing {
  listingId: number;
  seller: string;
  assetType: string;
  assetName: string;
  gameTitle: string;
  price: bigint;
  isActive: boolean;
  createdAt: number;
  sellerRisk: {
    walletAddress: string;
    riskLevel: string;
    riskReason: string;
    isVerified: boolean;
    timestamp: number;
  };
}

export const ListingsGrid = ({ 
  provider, 
  contract, 
  walletAddress,
  onBuyClick 
}: { 
  provider: any;
  contract: any;
  walletAddress: string | null;
  onBuyClick: (listingId: number, price: bigint) => Promise<void>;
}) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get image based on asset type
  const getAssetImage = (assetType: string) => {
    const types: {[key: string]: string} = {
      "weapon": "/assets/weapon.png",
      "armor": "/assets/armor.png",
      "skin": "/assets/skin.png",
      "currency": "/assets/currency.png"
    };
    
    return types[assetType.toLowerCase()] || "/assets/item.png";
  };

  // Get risk level color
  const getRiskLevelColor = (riskLevel: string) => {
    const colors: {[key: string]: string} = {
      "Low": "text-green-500",
      "Medium": "text-yellow-500",
      "High": "text-orange-500",
      "Severe": "text-red-500"
    };
    
    return colors[riskLevel] || "text-gray-400";
  };

  useEffect(() => {
    const fetchListings = async () => {
      if (!contract) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Get the next listing ID to know how many listings exist
        const nextListingIdBN = await contract.nextListingId();
        const nextListingId = Number(nextListingIdBN);
        
        // Fetch all active listings
        const fetchedListings: Listing[] = [];
        
        for (let i = 1; i < nextListingId; i++) {
          try {
            const listing = await contract.getListing(i);
            
            // Only add active listings
            if (listing && listing.isActive) {
              fetchedListings.push({
                listingId: Number(listing.listingId),
                seller: listing.seller,
                assetType: listing.assetType,
                assetName: listing.assetName,
                gameTitle: listing.gameTitle,
                price: listing.price,
                isActive: listing.isActive,
                createdAt: Number(listing.createdAt),
                sellerRisk: {
                  walletAddress: listing.sellerRisk.walletAddress,
                  riskLevel: listing.sellerRisk.riskLevel,
                  riskReason: listing.sellerRisk.riskReason,
                  isVerified: listing.sellerRisk.isVerified,
                  timestamp: Number(listing.sellerRisk.timestamp)
                }
              });
            }
          } catch (err) {
            console.error(`Error fetching listing ${i}:`, err);
          }
        }
        
        setListings(fetchedListings);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching listings:", err);
        setError("Failed to load listings");
        setLoading(false);
      }
    };

    fetchListings();
  }, [contract]);

  if (loading) {
    return (
      <div className="flex justify-center items-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 my-4">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 text-white bg-red-600 hover:bg-red-700 py-2 px-4 rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center my-8">
        <h3 className="text-xl font-semibold text-gray-700">No Listings Available</h3>
        <p className="text-gray-500 mt-2">Be the first to create a listing in the marketplace!</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
        Available Marketplace Listings
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div 
            key={listing.listingId}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-50 hover:shadow-xl transition-all duration-300"
          >
            <div className="p-4 bg-gradient-to-r from-indigo-500/10 to-blue-500/10">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">{listing.assetName}</h3>
                <span className="text-sm text-gray-500">{listing.gameTitle}</span>
              </div>
            </div>
            
            <div className="relative h-48 bg-gradient-to-r from-indigo-500/5 to-blue-500/5">
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50">
                <div className="w-32 h-32 relative">
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={getAssetImage(listing.assetType)}
                      alt={listing.assetType}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/assets/item.png";
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Asset Type</div>
                <div className="font-medium">{listing.assetType}</div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Seller</div>
                <div className="font-medium text-xs truncate">{listing.seller}</div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Risk Assessment</div>
                <div className={`font-medium ${getRiskLevelColor(listing.sellerRisk.riskLevel)}`}>
                  {listing.sellerRisk.riskLevel}
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div>
                  <div className="text-sm text-gray-500">Price</div>
                  <div className="text-lg font-bold">
                    {ethers.formatEther(listing.price)} ETH
                  </div>
                </div>
                
                <button
                  disabled={!walletAddress}
                  onClick={() => walletAddress && onBuyClick(listing.listingId, listing.price)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListingsGrid;
