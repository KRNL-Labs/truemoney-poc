"use client";

import Image from 'next/image';
import Link from 'next/link';

interface HeaderProps {
  walletConnected: boolean;
  connectedAddress: string;
  loading: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
  showListingForm?: boolean;
  setShowListingForm?: (show: boolean) => void;
}

export const Header = ({
  walletConnected,
  connectedAddress,
  loading,
  connectWallet,
  disconnectWallet,
  showListingForm,
  setShowListingForm
}: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-black/80 border-b border-green-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative overflow-hidden">
          {/* Matrix-style binary pattern background */}
          <div className="absolute inset-0 opacity-10 overflow-hidden">
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
          
          {/* Logo */}
          <div className="flex items-center relative z-10">
            <Link href="/" className="flex items-center group">
              <div className="relative h-8 w-8 mr-2 bg-black border border-green-500/50 overflow-hidden flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-green-400 font-mono text-xs animate-pulse">01</span>
                </div>
                <Image src="/logo.svg" width={20} height={20} alt="Logo" className="z-10 opacity-90 mix-blend-screen" />
              </div>
              <div>
                <span className="text-white font-mono font-bold text-xl tracking-tight">KRNL</span>
                <span className="text-green-400 font-mono font-bold text-xl tracking-tight ml-1">P2P</span>
              </div>
            </Link>
          </div>

          {/* Matrix-style Wallet Connection Button */}
          <div className="flex items-center space-x-4 relative z-10">
            {/* Create Listing Button - Only show when wallet is connected and setShowListingForm is available */}
            {walletConnected && setShowListingForm && (
              <button
                onClick={() => setShowListingForm(!showListingForm)}
                className="px-4 py-2 mr-3 font-mono font-medium transition-all flex items-center bg-black border border-green-500 text-green-400 hover:bg-green-900/20 hover:text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/30 relative overflow-hidden group"
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
                <span className="tracking-wider">{showListingForm ? 'CANCEL_LISTING' : 'CREATE_NEW_LISTING'}</span>
              </button>
            )}
            
            {!walletConnected ? (
              <button
                onClick={connectWallet}
                disabled={loading}
                className="px-4 py-2 font-mono font-medium transition-all disabled:opacity-50 flex items-center bg-black border border-green-500 text-green-400 hover:bg-green-900/20 hover:text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/30 relative overflow-hidden group"
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
                    <div className="animate-spin h-4 w-4 border-2 border-green-400 border-t-transparent mr-2"></div>
                    <span className="tracking-wider">INITIALIZING...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="tracking-wider">CONNECT_WALLET</span>
                  </>
                )}
              </button>
            ) : (
              <div className="relative group">
                <div className="flex items-center bg-black px-4 py-2 border border-green-500/50 shadow-lg">
                  <div className="w-2 h-2 bg-green-400 mr-2 animate-pulse"></div>
                  <span className="text-sm font-mono text-green-400 truncate max-w-[120px]">
                    {connectedAddress.substring(0, 6)}...{connectedAddress.substring(connectedAddress.length - 4)}
                  </span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black border border-red-500 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-mono"
                >
                  <span className="tracking-wider">DISCONNECT</span>
                </button>
              </div>
            )}
            
            {/* Matrix-style animation for the header */}
            <style jsx>{`
              @keyframes matrixRain {
                0% { transform: translateY(0); opacity: 1; }
                100% { transform: translateY(100px); opacity: 0; }
              }
            `}</style>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
