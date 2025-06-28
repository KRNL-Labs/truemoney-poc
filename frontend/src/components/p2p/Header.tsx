"use client";

import Image from 'next/image';
import Link from 'next/link';

interface HeaderProps {
  walletConnected: boolean;
  connectedAddress: string;
  loading: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

export const Header = ({
  walletConnected,
  connectedAddress,
  loading,
  connectWallet,
  disconnectWallet
}: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-gradient-to-r from-black/80 to-gray-900/80 border-b border-indigo-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="relative h-8 w-8 mr-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full overflow-hidden flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                <Image src="/logo.svg" width={24} height={24} alt="Logo" className="z-10" />
              </div>
              <div>
                <span className="text-white font-bold text-xl tracking-tight">KRNL</span>
                <span className="text-indigo-400 font-bold text-xl tracking-tight ml-1">P2P</span>
              </div>
            </Link>
          </div>

          {/* Wallet Connection Button */}
          <div className="flex items-center space-x-4">
            {!walletConnected ? (
              <button
                onClick={connectWallet}
                disabled={loading}
                className="px-4 py-2 rounded-lg font-medium transition-all 
                  disabled:opacity-50 flex items-center bg-gradient-to-r 
                  from-blue-600 to-indigo-600 hover:from-blue-700 
                  hover:to-indigo-700 shadow-lg shadow-indigo-900/30 
                  hover:shadow-indigo-900/40"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>Connect Wallet</span>
                  </>
                )}
              </button>
            ) : (
              <div className="relative group">
                <div className="flex items-center bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 rounded-lg border border-indigo-900/30 shadow-lg">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium truncate max-w-[120px]">
                    {connectedAddress.substring(0, 6)}...{connectedAddress.substring(connectedAddress.length - 4)}
                  </span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gradient-to-r from-red-600 to-red-700 bg-opacity-90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-medium"
                >
                  <span>Disconnect</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
