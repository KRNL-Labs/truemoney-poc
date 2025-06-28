"use client";

interface HeroSectionProps {
  walletConnected: boolean;
}

export const HeroSection = ({ walletConnected }: HeroSectionProps) => {
  return (
    <div className="relative overflow-hidden mb-12">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-blue-900/20 z-0"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 z-0"></div>
      
      <div className="relative z-10 py-12 px-4 sm:px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-indigo-200">
          P2P <span className="text-indigo-400">Marketplace</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          {walletConnected
            ? 'Buy and sell digital assets securely with Chainanalysis verification'
            : 'Connect your wallet to start trading digital assets with Chainanalysis verification'}
        </p>
        
        <div className="flex flex-wrap gap-3 justify-center text-sm text-gray-400">
          <div className="flex items-center bg-gray-800/50 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span>Chainanalysis Verified</span>
          </div>
          
          <div className="flex items-center bg-gray-800/50 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
            <span>KRNL Protocol</span>
          </div>
          
          <div className="flex items-center bg-gray-800/50 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
            <span>Secure Transactions</span>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl z-0"></div>
    </div>
  );
};

export default HeroSection;
