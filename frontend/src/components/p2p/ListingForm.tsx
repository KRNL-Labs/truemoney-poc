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
    <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl shadow-2xl border border-indigo-900/20 mb-8 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-900/20 to-blue-900/20 px-6 py-4 border-b border-indigo-900/30">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-400 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Create New Listing
        </h3>
      </div>
      
      <div className="p-6">
        {error && (
          <div className="mb-6 bg-red-900/30 text-red-400 text-sm p-3 rounded-lg border border-red-900/50 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="verificationId" className="block text-sm font-medium text-indigo-300 mb-1.5">
              Verification ID
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="verificationId"
                name="verificationId"
                value={formData.verificationId}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2.5 bg-gray-800/50 border border-indigo-900/30 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-gray-200"
                placeholder="Enter verification ID"
                required
              />
              <button
                type="button"
                onClick={handleGenerateId}
                className="px-4 py-2.5 bg-indigo-700/30 hover:bg-indigo-600/50 text-indigo-300 font-medium rounded-lg border border-indigo-700/30 hover:border-indigo-600/50 transition-all"
              >
                Generate ID
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-400">A unique identifier for this verification</p>
          </div>
          
          <div>
            <label htmlFor="assetType" className="block text-sm font-medium text-indigo-300 mb-1.5">
              Asset Type
            </label>
            <select
              id="assetType"
              name="assetType"
              value={formData.assetType}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 bg-gray-800/50 border border-indigo-900/30 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-gray-200"
              required
            >
              <option value="">Select asset type</option>
              <option value="skin">Skin</option>
              <option value="weapon">Weapon</option>
              <option value="character">Character</option>
              <option value="item">Item</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="assetName" className="block text-sm font-medium text-indigo-300 mb-1.5">
              Asset Name
            </label>
            <input
              type="text"
              id="assetName"
              name="assetName"
              value={formData.assetName}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 bg-gray-800/50 border border-indigo-900/30 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-gray-200"
              placeholder="Enter asset name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="gameTitle" className="block text-sm font-medium text-indigo-300 mb-1.5">
              Game Title
            </label>
            <input
              type="text"
              id="gameTitle"
              name="gameTitle"
              value={formData.gameTitle}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 bg-gray-800/50 border border-indigo-900/30 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-gray-200"
              placeholder="Enter game title"
              required
            />
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-indigo-300 mb-1.5">
              Price (ETH)
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
                className="w-full pl-10 pr-3 py-2.5 bg-gray-800/50 border border-indigo-900/30 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-gray-200"
                placeholder="0.00"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">Ξ</span>
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={error !== '' || txState.loading}
              className={`w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-lg text-base font-medium transition-all duration-300 ${
                error !== '' || txState.loading 
                  ? 'bg-indigo-400/50 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-indigo-500/20 hover:shadow-indigo-500/40'
              }`}
            >
              {txState.loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Create Listing
                </>
              )}
            </button>
          </div>
          
          {/* Transaction status */}
          {txState.success && (
            <div className="mt-6 p-4 bg-green-900/30 border border-green-700/30 rounded-lg">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-green-300 font-medium">Listing created successfully!</p>
              </div>
              <p className="text-green-200 text-sm mt-2">
                Transaction hash: 
                <a 
                  href={`https://sepolia.etherscan.io/tx/${txState.txHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="ml-1 underline hover:text-green-100 font-medium"
                >
                  {txState.txHash.substring(0, 10)}...{txState.txHash.substring(txState.txHash.length - 8)}
                </a>
              </p>
            </div>
          )}
          
          {txState.error && (
            <div className="mt-6 p-4 bg-red-900/30 border border-red-700/30 rounded-lg">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-red-300 font-medium">Transaction failed</p>
              </div>
              <p className="text-red-200 text-sm mt-2 break-all">{txState.error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ListingForm;
