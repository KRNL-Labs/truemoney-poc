"use client";

interface ConnectWalletProps {
  connectWallet: () => void;
  loading: boolean;
}

export const ConnectWallet = ({ connectWallet, loading }: ConnectWalletProps) => {
  return (
    <div className="text-center py-12">
      <div className="bg-indigo-900/10 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      
      <h3 className="text-2xl font-semibold text-white mb-3">Connect Your Wallet</h3>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        Connect your wallet to view and create listings in the P2P marketplace. 
        All transactions are verified and secured with Chainanalysis KRNL.
      </p>
      
      <button
        onClick={connectWallet}
        disabled={loading}
        className="px-6 py-3 rounded-lg font-medium text-base transition-all
          bg-gradient-to-r from-blue-600 to-indigo-600 
          hover:from-blue-700 hover:to-indigo-700
          shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 
          disabled:opacity-50 flex items-center mx-auto"
      >
        {loading ? (
          <>
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Connect Wallet</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ConnectWallet;
