"use client";

interface ConnectWalletProps {
  connectWallet: () => void;
  loading: boolean;
}

export const ConnectWallet = ({ connectWallet, loading }: ConnectWalletProps) => {
  return (
    <div className="text-center py-12 relative z-10">
      <div className="border border-green-500/50 h-24 w-24 flex items-center justify-center mx-auto mb-6 relative overflow-hidden">
        {/* Matrix code animation inside icon */}
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
        
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-400 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      
      <h3 className="text-2xl font-mono font-bold text-green-400 mb-3">SYSTEM ACCESS REQUIRED</h3>
      <div className="text-white font-mono mb-8 max-w-md mx-auto border-t border-b border-green-500/30 py-4">
        <p className="mb-2">
          <span className="text-green-400">{`>`}</span> CONNECT WALLET TO ACCESS P2P MARKETPLACE
        </p>
        <p className="text-sm opacity-70">
          <span className="text-green-400">{`>`}</span> ALL TRANSACTIONS VERIFIED BY CHAINANALYSIS KRNL
        </p>
      </div>
      
      <button
        onClick={connectWallet}
        disabled={loading}
        className="px-6 py-3 font-mono font-medium text-base transition-all bg-black border border-green-500 text-green-400 hover:bg-green-900/20 hover:text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/30 disabled:opacity-50 flex items-center mx-auto relative overflow-hidden group"
      >
        {/* Matrix code rain effect on hover */}
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
        
        {loading ? (
          <>
            <div className="animate-spin h-5 w-5 border-2 border-green-400 border-t-transparent mr-3 relative z-10"></div>
            <span className="relative z-10 tracking-wider">INITIALIZING...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 relative z-10" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span className="relative z-10 tracking-wider">CONNECT_WALLET</span>
          </>
        )}
      </button>
      
      {/* Matrix-style animation */}
      <style jsx>{`
        @keyframes matrixRain {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(100px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// Component is already exported as a named export
