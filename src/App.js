import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Header from './components/Header';
import PresaleStats from './components/PresaleStats';
import TokenPurchase from './components/TokenPurchase';
import PresaleInfo from './components/PresaleInfo';
import ConnectWallet from './components/ConnectWallet';
import './App.css';
import { PRESALE_ADDRESS, TOKEN_ADDRESS, USDT_ADDRESS } from './constants';

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

// USDT ABI (只需 approve 與 allowance)
const USDT_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)"
];

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [presaleContract, setPresaleContract] = useState(null);
  const [presaleInfo, setPresaleInfo] = useState(null);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  // Connect wallet
  const connectWallet = async () => {
    console.log('Connect wallet button clicked');
    try {
      if (window.ethereum) {
        console.log('MetaMask detected, requesting accounts...');
        
        // Check network first
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        console.log('Current chainId:', chainId);
        
        if (chainId !== '0x7a69' && chainId !== '0x539') { // 31337 or 1337 in hex
          setError('Please switch to Hardhat network (Chain ID: 31337 or 1337)');
          return;
        }
        
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        const account = accounts[0];
        console.log('Connected account:', account);
        setAccount(account);
        
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
        
        console.log('Creating presale contract instance...');
        const presaleContract = new ethers.Contract(
          PRESALE_ADDRESS,
          PRESALE_ABI,
          provider
        );
        setPresaleContract(presaleContract);
        
        // Load presale info
        await loadPresaleInfo(presaleContract);
      } else {
        console.log('MetaMask not detected');
        setError('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError(`Failed to connect wallet: ${error.message}`);
    }
  };

  // Load presale information
  const loadPresaleInfo = async (contract) => {
    try {
      console.log('Loading presale info from contract:', contract.target);
      const info = await contract.getPresaleInfo();
      console.log('Raw presale info:', info);
      
      setPresaleInfo({
        tokenPrice: info[0], // 保留原始 BigInt，不 formatUnits
        minPurchase: ethers.formatUnits(info[1], 18),
        maxPurchase: ethers.formatUnits(info[2], 18),
        totalTokensForSale: ethers.formatUnits(info[3], 18),
        tokensSold: ethers.formatUnits(info[4], 18),
        totalRaised: ethers.formatUnits(info[5], 6), // USDT 6 decimals
        presaleStart: Number(info[6]),
        presaleEnd: Number(info[7]),
        presaleFinalized: info[8],
        whitelistEnabled: info[9],
      });
      console.log('Presale info loaded successfully');
    } catch (error) {
      console.error('Error loading presale info:', error);
      setError(`Failed to load presale information: ${error.message}`);
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
      const usdt = new ethers.Contract(USDT_ADDRESS, USDT_ABI, signer);
      const amount = ethers.parseUnits(purchaseAmount, 18); // bigint
      const tokenPrice = presaleInfo.tokenPrice; // 直接用 BigInt
      const usdtCost = amount * tokenPrice / ethers.parseUnits("1", 18); // bigint
      // 1. 先檢查 allowance
      let allowance = await usdt.allowance(account, PRESALE_ADDRESS);
      if (allowance < usdtCost) {
        // 2. 若不足，先 approve 足夠數量（這裡直接 approve usdtCost）
        const approveTx = await usdt.approve(PRESALE_ADDRESS, usdtCost);
        await approveTx.wait();
        // 再查一次 allowance 確保已經足夠
        allowance = await usdt.allowance(account, PRESALE_ADDRESS);
        if (allowance < usdtCost) {
          setError('Approve USDT 失敗，請重試');
          setIsLoading(false);
          return;
        }
      }
      // 3. 再購買
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
    
    // Set page as loaded
    setIsPageLoaded(true);
    console.log('Page loaded, MetaMask available:', !!window.ethereum);
  }, []);

  return (
    <div className="App">
      <Header account={account} onConnect={connectWallet} />
      
      <main className="container mx-auto px-4 py-8">
        {!account ? (
          <ConnectWallet onConnect={connectWallet} isPageLoaded={isPageLoaded} />
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