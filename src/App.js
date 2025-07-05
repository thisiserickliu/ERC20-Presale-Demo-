import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Header from './components/Header';
import PresaleStats from './components/PresaleStats';
import TokenPurchase from './components/TokenPurchase';
import PresaleInfo from './components/PresaleInfo';
import ConnectWallet from './components/ConnectWallet';
import './App.css';

// Contract addresses (replace with your deployed addresses)
const PRESALE_ADDRESS = '0x...'; // Your presale contract address
const TOKEN_ADDRESS = '0x...'; // Your token contract address
const USDT_ADDRESS = '0x...'; // Your USDT contract address

// Contract ABIs
const PRESALE_ABI = [
  {
    inputs: [],
    name: "getPresaleInfo",
    outputs: [
      { name: "_tokenPrice", type: "uint256" },
      { name: "_minPurchase", type: "uint256" },
      { name: "_maxPurchase", type: "uint256" },
      { name: "_totalTokensForSale", type: "uint256" },
      { name: "_tokensSold", type: "uint256" },
      { name: "_totalRaised", type: "uint256" },
      { name: "_presaleStart", type: "uint256" },
      { name: "_presaleEnd", type: "uint256" },
      { name: "_presaleFinalized", type: "bool" },
      { name: "_whitelistEnabled", type: "bool" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "amount", type: "uint256" }],
    name: "buyTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [presaleContract, setPresaleContract] = useState(null);
  const [presaleInfo, setPresaleInfo] = useState(null);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        const account = accounts[0];
        setAccount(account);
        
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
        
        const presaleContract = new ethers.Contract(
          PRESALE_ADDRESS,
          PRESALE_ABI,
          provider
        );
        setPresaleContract(presaleContract);
        
        // Load presale info
        await loadPresaleInfo(presaleContract);
      } else {
        setError('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError('Failed to connect wallet');
    }
  };

  // Load presale information
  const loadPresaleInfo = async (contract) => {
    try {
      const info = await contract.getPresaleInfo();
      setPresaleInfo({
        tokenPrice: ethers.formatEther(info[0]),
        minPurchase: ethers.formatEther(info[1]),
        maxPurchase: ethers.formatEther(info[2]),
        totalTokensForSale: ethers.formatEther(info[3]),
        tokensSold: ethers.formatEther(info[4]),
        totalRaised: ethers.formatEther(info[5]),
        presaleStart: Number(info[6]),
        presaleEnd: Number(info[7]),
        presaleFinalized: info[8],
        whitelistEnabled: info[9],
      });
    } catch (error) {
      console.error('Error loading presale info:', error);
      setError('Failed to load presale information');
    }
  };

  // Purchase tokens
  const purchaseTokens = async () => {
    if (!account || !presaleContract || !purchaseAmount) return;

    try {
      setIsLoading(true);
      setError('');

      const signer = await provider.getSigner();
      const contractWithSigner = presaleContract.connect(signer);
      
      const amount = ethers.parseEther(purchaseAmount);
      const tx = await contractWithSigner.buyTokens(amount);
      
      await tx.wait();
      
      // Reload presale info
      await loadPresaleInfo(presaleContract);
      setPurchaseAmount('');
      
      alert('Purchase successful!');
    } catch (error) {
      console.error('Error purchasing tokens:', error);
      setError('Failed to purchase tokens. Please check your balance and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
          setProvider(null);
          setPresaleContract(null);
          setPresaleInfo(null);
        }
      });
    }
  }, []);

  return (
    <div className="App">
      <Header account={account} onConnect={connectWallet} />
      
      <main className="container mx-auto px-4 py-8">
        {!account ? (
          <ConnectWallet onConnect={connectWallet} />
        ) : (
          <>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Presale Stats */}
              <div className="lg:col-span-2">
                <PresaleStats presaleInfo={presaleInfo} />
              </div>

              {/* Purchase Form */}
              <div className="lg:col-span-1">
                <TokenPurchase
                  purchaseAmount={purchaseAmount}
                  setPurchaseAmount={setPurchaseAmount}
                  onPurchase={purchaseTokens}
                  isLoading={isLoading}
                  presaleInfo={presaleInfo}
                />
              </div>
            </div>

            {/* Presale Information */}
            <div className="mt-12">
              <PresaleInfo presaleInfo={presaleInfo} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App; 