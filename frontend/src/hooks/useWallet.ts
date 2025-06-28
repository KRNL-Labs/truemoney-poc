import { useState, useEffect } from 'react';
import { ethers } from 'krnl-sdk';

// Add TypeScript declaration for ethereum property on window
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Network configurations
const NETWORKS = {
  sepolia: {
    chainId: '0xaa36a7', // 11155111 in hex
    chainName: 'Sepolia',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://eth-sepolia.public.blastapi.io'],
    blockExplorerUrls: ['https://sepolia.etherscan.io']
  }
};

export function useWallet() {
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState('');
  const [error, setError] = useState('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState('sepolia');
  const [networkSwitchPending, setNetworkSwitchPending] = useState(false);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(web3Provider);
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const web3Signer = await web3Provider.getSigner();
          setSigner(web3Signer);
          setConnectedAddress(accounts[0]);
          setWalletConnected(true);
          const network = await web3Provider.getNetwork();
          const chainIdHex = '0x' + network.chainId.toString(16);
          for (const [networkName, config] of Object.entries(NETWORKS)) {
            if (config.chainId === chainIdHex) {
              setSelectedNetwork(networkName);
              break;
            }
          }
        }
      } catch (err) {
        console.error('Failed to check wallet connection', err);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        setLoading(true);
        setError('');
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const web3Signer = await web3Provider.getSigner();
        setProvider(web3Provider);
        setSigner(web3Signer);
        setConnectedAddress(accounts[0]);
        setWalletConnected(true);
        await switchNetwork(selectedNetwork);
      } catch (err: any) {
        setError('Failed to connect wallet: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    } else {
      setError('Ethereum wallet not found. Please install MetaMask.');
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setConnectedAddress('');
    setSigner(null);
    setError('');
  };

  const switchNetwork = async (networkName: string) => {
    if (!window.ethereum) {
      setError('Ethereum wallet not found');
      return;
    }
    try {
      setNetworkSwitchPending(true);
      const network = NETWORKS[networkName as keyof typeof NETWORKS];
      if (!network) throw new Error('Network configuration not found');
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: network.chainId }]
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [network]
          });
        } else {
          throw switchError;
        }
      }
      setSelectedNetwork(networkName);
      if (walletConnected) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const web3Signer = await web3Provider.getSigner();
        setProvider(web3Provider);
        setSigner(web3Signer);
      }
    } catch (err: any) {
      setError('Failed to switch network: ' + (err.message || 'Unknown error'));
    } finally {
      setNetworkSwitchPending(false);
    }
  };

  return {
    loading,
    walletConnected,
    connectedAddress,
    error,
    provider,
    signer,
    selectedNetwork,
    networkSwitchPending,
    connectWallet,
    disconnectWallet,
    switchNetwork
  };
}
