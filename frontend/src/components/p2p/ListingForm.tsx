"use client";

import { FormEvent } from 'react';

interface FormData {
  verificationId: string;
  assetType: string;
  assetName: string;
  gameTitle: string;
  price: string;
}

interface ListingFormProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleGenerateId: () => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  txState: {
    loading: boolean;
    error: string;
    success: boolean;
    txHash: string;
  };
  error: string;
}

export const ListingForm = ({
  formData,
  handleInputChange,
  handleGenerateId,
  handleSubmit,
  txState,
  error
}: ListingFormProps) => {
  return (
    <div className="bg-black/90 rounded-xl shadow-2xl border border-green-500/30 mb-8 overflow-hidden relative">
      {/* Matrix code background */}
      <div className="absolute inset-0 opacity-5 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
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
      
      <div className="bg-black/80 backdrop-blur-sm px-6 py-4 border-b border-green-500/30 relative z-10">
        <h3 className="text-xl font-mono font-bold text-green-400 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-400 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          CREATE_NEW_LISTING
        </h3>
      </div>
      
      <div className="p-6 relative z-10">
        {error && (
          <div className="mb-6 bg-black/80 text-red-400 text-sm p-3 border border-red-500/50 flex items-start font-mono">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="animate-pulse">ERROR:</span> {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="verificationId" className="block text-sm font-mono font-medium text-green-400 mb-1.5">
              VERIFICATION_ID
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="verificationId"
                name="verificationId"
                value={formData.verificationId}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2.5 bg-black/70 border border-green-500/30 shadow-inner focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 text-green-300 font-mono"
                placeholder="Enter verification ID"
                required
              />
              <button
                type="button"
                onClick={handleGenerateId}
                className="px-4 py-2.5 bg-black border border-green-500/50 text-green-400 font-mono hover:bg-green-900/20 hover:text-white transition-all relative overflow-hidden group"
              >
                <span className="relative z-10">GENERATE_ID</span>
                {/* Matrix code rain effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-30 overflow-hidden">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute font-mono text-xs text-green-400"
                      style={{
                        left: `${i * 30}%`,
                        top: '-20px',
                        animation: `matrixRain ${1 + Math.random() * 2}s linear infinite`,
                        animationDelay: `${Math.random() * 1}s`,
                      }}
                    >
                      {Math.random() > 0.5 ? '1' : '0'}
                    </div>
                  ))}
                </div>
              </button>
            </div>
            <p className="mt-1 text-xs text-green-500/70 font-mono">// Unique identifier for asset verification</p>
          </div>
          
          <div>
            <label htmlFor="assetType" className="block text-sm font-mono font-medium text-green-400 mb-1.5">
              ASSET_TYPE
            </label>
            <select
              id="assetType"
              name="assetType"
              value={formData.assetType}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 bg-black/70 border border-green-500/30 shadow-inner focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 text-green-300 font-mono"
              required
            >
              <option value="" className="bg-black text-green-300">Select asset type</option>
              <option value="skin" className="bg-black text-green-300">Skin</option>
              <option value="weapon" className="bg-black text-green-300">Weapon</option>
              <option value="character" className="bg-black text-green-300">Character</option>
              <option value="item" className="bg-black text-green-300">Item</option>
              <option value="other" className="bg-black text-green-300">Other</option>
            </select>
            <p className="mt-1 text-xs text-green-500/70 font-mono">// Classification of digital asset</p>
          </div>
          
          <div>
            <label htmlFor="assetName" className="block text-sm font-mono font-medium text-green-400 mb-1.5">
              ASSET_NAME
            </label>
            <input
              type="text"
              id="assetName"
              name="assetName"
              value={formData.assetName}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 bg-black/70 border border-green-500/30 shadow-inner focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 text-green-300 font-mono"
              placeholder="Enter asset name"
              required
            />
            <p className="mt-1 text-xs text-green-500/70 font-mono">// Unique identifier for the digital asset</p>
          </div>
          
          <div>
            <label htmlFor="gameTitle" className="block text-sm font-mono font-medium text-green-400 mb-1.5">
              GAME_TITLE
            </label>
            <input
              type="text"
              id="gameTitle"
              name="gameTitle"
              value={formData.gameTitle}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 bg-black/70 border border-green-500/30 shadow-inner focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 text-green-300 font-mono"
              placeholder="Enter game title"
              required
            />
            <p className="mt-1 text-xs text-green-500/70 font-mono">// Source game environment</p>
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-mono font-medium text-green-400 mb-1.5">
              PRICE_ETH
            </label>
            <div className="relative">
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.001"
                min="0"
                className="w-full pl-10 pr-3 py-2.5 bg-black/70 border border-green-500/30 shadow-inner focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 text-green-300 font-mono"
                placeholder="0.00"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-green-400 font-mono">Ξ</span>
              </div>
            </div>
            <p className="mt-1 text-xs text-green-500/70 font-mono">// Transaction value in ETH</p>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={error !== '' || txState.loading}
              className={`w-full flex justify-center items-center py-3 px-4 shadow-lg text-base font-mono font-medium transition-all duration-300 relative overflow-hidden group ${
                error !== '' || txState.loading 
                  ? 'bg-black/50 border border-green-500/30 text-green-400/50 cursor-not-allowed' 
                  : 'bg-black border border-green-500 text-green-400 hover:bg-green-900/20 hover:text-white shadow-green-500/20 hover:shadow-green-500/30'
              }`}
            >
              {/* Matrix code rain effect on hover */}
              {!txState.loading && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-30 overflow-hidden">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute font-mono text-xs text-green-400"
                      style={{
                        left: `${i * 20}%`,
                        top: '-20px',
                        animation: `matrixRain ${1 + Math.random() * 2}s linear infinite`,
                        animationDelay: `${Math.random() * 1}s`,
                      }}
                    >
                      {Math.random() > 0.5 ? '1' : '0'}
                    </div>
                  ))}
                </div>
              )}
              
              {txState.loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-green-400 border-t-transparent mr-3 relative z-10"></div>
                  <span className="relative z-10 tracking-wider">PROCESSING_TRANSACTION...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 relative z-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <span className="relative z-10 tracking-wider">CREATE_LISTING</span>
                </>
              )}
            </button>
          </div>
          
          {/* Transaction status */}
          {txState.success && (
            <div className="mt-6 p-4 bg-black/80 border border-green-500/50 relative overflow-hidden">
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
              
              <div className="flex items-center relative z-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-green-400 font-mono font-medium">TRANSACTION_SUCCESSFUL</p>
              </div>
              
              <div className="mt-3 pt-3 border-t border-green-500/30 relative z-10">
                <div className="font-mono text-xs text-green-500/70 mb-1">// Transaction verified by KRNL</div>
                <p className="text-green-300 text-sm font-mono flex items-center">
                  <span className="text-white mr-2">TX_HASH:</span>
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${txState.txHash}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-green-400 hover:text-green-300 hover:underline transition-all"
                  >
                    {txState.txHash.substring(0, 10)}...{txState.txHash.substring(txState.txHash.length - 8)}
                  </a>
                  <span className="ml-2 h-2 w-2 bg-green-400 rounded-full animate-pulse"></span>
                </p>
              </div>
            </div>
          )}
          
          {txState.error && (
            <div className="mt-6 p-4 bg-black/80 border border-red-500/50 relative overflow-hidden">
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
              
              <div className="flex items-start relative z-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-red-400 font-mono font-medium animate-pulse">TRANSACTION_ERROR</p>
                  <div className="mt-2 pt-2 border-t border-red-500/30">
                    <p className="text-red-300 text-sm font-mono">
                      <span className="text-white mr-2">ERROR_MSG:</span>
                      {txState.error}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

// Component is already exported as a named export
