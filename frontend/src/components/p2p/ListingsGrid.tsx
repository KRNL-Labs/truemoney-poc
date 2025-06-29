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
      "currency": "/assets/currency.png",
      "character": "/assets/character.png"
    };
    
    return types[assetType.toLowerCase()] || "/assets/item.png";
  };

  // Get risk level color
  const getRiskLevelColor = (riskLevel: string) => {
    const colors: {[key: string]: string} = {
      "Low": "text-green-400 border-b border-green-400/30",
      "Medium": "text-yellow-300 border-b border-yellow-400/30",
      "High": "text-orange-400 border-b border-orange-400/30 animate-pulse",
      "Severe": "text-red-500 border-b border-red-500/50 animate-pulse"
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
      <div className="flex justify-center items-center my-12 relative">
        <div className="animate-pulse font-mono text-green-400 text-lg mb-4">LOADING_DATA...</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-24 w-24 border border-green-500/50 flex items-center justify-center relative overflow-hidden">
            {/* Matrix code animation inside loader */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute font-mono text-xs text-green-400"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.8 + 0.2,
                    animation: `matrixRain ${1 + Math.random() * 3}s linear infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                >
                  {Math.random() > 0.5 ? '1' : '0'}
                </div>
              ))}
            </div>
            <div className="animate-spin h-12 w-12 border-2 border-green-400 border-t-transparent relative z-10"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black/80 border border-red-500/50 text-red-400 p-4 my-4 relative overflow-hidden">
        {/* Matrix code background with red tint */}
        <div className="absolute inset-0 opacity-5 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i}
              className="absolute font-mono text-xs text-red-400"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.8 + 0.2
              }}
            >
              {Math.random() > 0.5 ? '0' : 'X'}
            </div>
          ))}
        </div>
        
        <div className="relative z-10">
          <p className="font-mono"><span className="text-white mr-2">ERROR:</span> {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 text-red-400 bg-black border border-red-500/50 hover:bg-red-900/20 py-2 px-4 font-mono transition-all"
          >
            RETRY_CONNECTION
          </button>
        </div>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="bg-black/80 border border-green-500/30 p-8 text-center my-8 relative overflow-hidden">
        {/* Matrix code background */}
        <div className="absolute inset-0 opacity-5 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute font-mono text-xs text-green-400"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.8 + 0.2
              }}
            >
              {Math.random() > 0.5 ? '1' : '0'}
            </div>
          ))}
        </div>
        
        <div className="relative z-10">
          <h3 className="text-xl font-mono font-bold text-green-400">NO_LISTINGS_FOUND</h3>
          <p className="text-white font-mono mt-2">Be the first to create a listing in the marketplace.</p>
          <div className="mt-4 h-px w-24 bg-green-500/30 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 relative">
      {/* Add Matrix style keyframe animation */}
      <style jsx>{`
        @keyframes matrixRain {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(1000%);
            opacity: 0;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
          }
          50% {
            box-shadow: 0 0 15px rgba(0, 255, 0, 0.8);
          }
        }
      `}</style>
      
      <h2 className="text-2xl font-mono font-bold mb-6 text-green-400 border-b border-green-500/30 pb-2">
        <span className="inline-block mr-2">AVAILABLE_LISTINGS</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div 
            key={listing.listingId}
            className="bg-black/80 border border-green-500/30 overflow-hidden hover:border-green-400/50 transition-all duration-300 relative"
          >
            {/* Matrix code background */}
            <div className="absolute inset-0 opacity-5 overflow-hidden pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute font-mono text-xs text-green-400"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.8 + 0.2
                  }}
                >
                  {Math.random() > 0.5 ? '1' : '0'}
                </div>
              ))}
            </div>
            
            <div className="p-4 border-b border-green-500/30 relative z-10">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-mono font-bold text-green-400">{listing.assetName}</h3>
                <span className="text-sm text-white/70 font-mono">{listing.gameTitle}</span>
              </div>
            </div>
            
            <div className="relative h-48 bg-black/50">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 relative border border-green-500/30 p-2">
                  <div className="w-full h-full flex items-center justify-center bg-black/80">
                    <img
                      src={getAssetImage(listing.assetType)}
                      alt={listing.assetType}
                      className="max-w-full max-h-full object-contain opacity-80 filter brightness-200 contrast-125"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/assets/item.png";
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 relative z-10">
              <div className="mb-4">
                <div className="text-sm text-green-500/70 font-mono mb-1">ASSET_TYPE</div>
                <div className="font-mono text-white">{listing.assetType}</div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-green-500/70 font-mono mb-1">SELLER_ID</div>
                <div className="font-mono text-white text-xs truncate">{listing.seller}</div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-green-500/70 font-mono mb-1">RISK_LEVEL</div>
                <div className={`font-mono ${getRiskLevelColor(listing.sellerRisk.riskLevel)}`}>
                  {listing.sellerRisk.riskLevel.toUpperCase()}
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-green-500/30">
                <div>
                  <div className="text-sm text-green-500/70 font-mono">PRICE</div>
                  <div className="text-lg font-bold font-mono text-white">
                    {ethers.formatEther(listing.price)} ETH
                  </div>
                </div>
                
                <button
                  disabled={!walletAddress}
                  onClick={() => walletAddress && onBuyClick(listing.listingId, listing.price)}
                  className="px-4 py-2 bg-black border border-green-500 text-green-400 font-mono hover:bg-green-900/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  {/* Matrix rain animation on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 overflow-hidden pointer-events-none">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute font-mono text-xs text-green-400"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: '-20%',
                          opacity: Math.random() * 0.8 + 0.2,
                          animation: `matrixRain ${1 + Math.random() * 2}s linear infinite`,
                          animationDelay: `${Math.random() * 1}s`,
                        }}
                      >
                        {Math.random() > 0.5 ? '1' : '0'}
                      </div>
                    ))}
                  </div>
                  <span className="relative z-10">PURCHASE</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component is already exported as a named export
