import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Header from './components/Header';
import PresaleStats from './components/PresaleStats';
import TokenPurchase from './components/TokenPurchase';
import PresaleInfo from './components/PresaleInfo';
import ConnectWallet from './components/ConnectWallet';
import WhitelistManager from './components/WhitelistManager';
import CountdownTimer from './components/CountdownTimer';
import UserDashboard from './components/UserDashboard';
import TransactionHistory from './components/TransactionHistory';
import './App.css';
import { PRESALE_ADDRESS, MYTOKEN_ADDRESS, USDT_ADDRESS } from './constants';

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
    inputs: [{ name: "user", type: "address" }],
    name: "getUserInfo",
    outputs: [
      { name: "_purchased", type: "uint256" },
      { name: "_whitelisted", type: "bool" }
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
  },
  {
    inputs: [{ name: "users", type: "address[]" }, { name: "statuses", type: "bool[]" }],
    name: "setWhitelist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "enabled", type: "bool" }],
    name: "setWhitelistEnabled",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "whitelistEnabled",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "", type: "address" }],
    name: "whitelist",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  }
];

// USDT ABI (只需 approve 與 allowance)
const USDT_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)"
];

function Roadmap() {
  const milestones = [
    { quarter: '2025 Q3', milestone: 'Complete Sepolia testnet presale and finalize tokenomics' },
    { quarter: '2025 Q4', milestone: 'Deploy to Mainnet and establish initial liquidity' },
    { quarter: '2026 Q1', milestone: 'Launch DAO governance module for community proposals and voting' },
    { quarter: '2026 Q2', milestone: 'Introduce cross-chain bridge functionality' },
    { quarter: '2026 Q3', milestone: 'Release mobile wallet and integrated NFT platform' },
  ];
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 drop-shadow-lg tracking-wide">Project Roadmap</h1>
      <div className="w-full max-w-2xl bg-white/90 rounded-2xl shadow-xl p-6">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2 px-4 text-lg text-cyan-700">Quarter</th>
              <th className="py-2 px-4 text-lg text-cyan-700">Milestone</th>
            </tr>
          </thead>
          <tbody>
            {milestones.map((item, idx) => (
              <tr key={idx} className="border-b last:border-b-0">
                <td className="py-3 px-4 font-semibold text-cyan-900 whitespace-nowrap">{item.quarter}</td>
                <td className="py-3 px-4 text-gray-800">{item.milestone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link to="/" className="mt-8 inline-block px-6 py-2 bg-cyan-600 text-white rounded-full shadow hover:bg-cyan-700 transition">Back to Home</Link>
    </div>
  );
}

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [presaleContract, setPresaleContract] = useState(null);
  const [presaleInfo, setPresaleInfo] = useState(null);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const faqRef = useRef(null);
  const roadmapRef = useRef(null);

  const handleScrollToFAQ = () => {
    if (faqRef.current) {
      faqRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const handleScrollToRoadmap = () => {
    if (roadmapRef.current) {
      roadmapRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    console.log('Connect wallet button clicked');
    try {
      if (window.ethereum) {
        console.log('MetaMask detected, requesting accounts...');
        
        // Check network first
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        console.log('Current chainId:', chainId);
        
        // 直接呼叫 requestAccounts 前加 log
        console.log('即將呼叫 eth_requestAccounts');
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        console.log('accounts:', accounts);

        if (chainId !== '0xaa36a7' && chainId !== '0x7a69' && chainId !== '0x539') {
          setError('Please switch to Sepolia or Hardhat network');
          return;
        }
        
        // const accounts = await window.ethereum.request({
        //   method: 'eth_requestAccounts'
        // });
        // const account = accounts[0];
        // console.log('Connected account:', account);
        // setAccount(account);
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
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
        minPurchase: ethers.utils.formatUnits(info[1], 18),
        maxPurchase: ethers.utils.formatUnits(info[2], 18),
        totalTokensForSale: ethers.utils.formatUnits(info[3], 18),
        tokensSold: ethers.utils.formatUnits(info[4], 18),
        totalRaised: ethers.utils.formatUnits(info[5], 6), // USDT 6 decimals
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
    console.log('purchaseTokens called, purchaseAmount:', purchaseAmount, 'account:', account, 'presaleContract:', presaleContract);
    if (!account || !presaleContract || !purchaseAmount) return;

    try {
      setIsLoading(true);
      setError('');

      const signer = await provider.getSigner();
      const contractWithSigner = presaleContract.connect(signer);
      const usdt = new ethers.Contract(USDT_ADDRESS, USDT_ABI, signer);
      const amount = ethers.utils.parseUnits(purchaseAmount, 18); // bigint
      const tokenPrice = presaleInfo.tokenPrice; // 直接用 BigInt
      const usdtCost = amount * tokenPrice / ethers.utils.parseUnits("1", 18); // bigint
      
      console.log('Purchase details:', {
        amount: amount.toString(),
        tokenPrice: tokenPrice.toString(),
        usdtCost: usdtCost.toString(),
        account
      });
      
      // 1. 先檢查 allowance
      let allowance = await usdt.allowance(account, PRESALE_ADDRESS);
      console.log('Current allowance:', allowance.toString());
      
      if (allowance < usdtCost) {
        console.log('Approving USDT...');
        // 2. 若不足，先 approve 足夠數量（這裡直接 approve usdtCost）
        const approveTx = await usdt.approve(PRESALE_ADDRESS, usdtCost);
        await approveTx.wait();
        // 再查一次 allowance 確保已經足夠
        allowance = await usdt.allowance(account, PRESALE_ADDRESS);
        console.log('New allowance:', allowance.toString());
        
        if (allowance < usdtCost) {
          setError('Failed to approve USDT. Please try again.');
          setIsLoading(false);
          return;
        }
      }
      
      // 3. 再購買
      console.log('Purchasing tokens...');
      const tx = await contractWithSigner.buyTokens(amount);
      await tx.wait();
      
      // Reload presale info
      await loadPresaleInfo(presaleContract);
      setPurchaseAmount('');
      alert('Purchase successful!');
    } catch (error) {
      console.error('Error purchasing tokens:', error);
      setError(`Failed to purchase tokens: ${error.message}`);
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
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] flex flex-col">
        <Header account={account} onConnect={connectWallet} />
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <Routes>
            <Route path="/" element={
              !account ? (
                <>
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-8 drop-shadow-lg tracking-wide">MyToken</h1>
                    <div className="mb-10">
                      <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-600 to-purple-600 flex items-center justify-center shadow-2xl animate-pulse">
                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="40" cy="40" r="36" stroke="#00fff7" strokeWidth="4" fill="none" />
                          <rect x="28" y="28" width="24" height="24" rx="6" fill="#00fff7" fillOpacity="0.2" />
                          <path d="M40 32L48 40L40 48L32 40L40 32Z" fill="#00fff7" />
                        </svg>
                      </div>
                    </div>
                    <button
                      onClick={connectWallet}
                      className="px-10 py-4 bg-gradient-to-r from-cyan-400 to-blue-600 text-white text-xl font-bold rounded-full shadow-lg hover:from-blue-500 hover:to-cyan-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 mb-12 animate-glow"
                    >
                      CONNECT WALLET
                    </button>
                    <div className="flex space-x-8 mt-8">
                      <a href="https://w3s.link/ipfs/bafybeiak2cjoekyjgelszlan3ywm7ivtppz2gzp2w5oopt7e4tnkus2nc4/MTK-whitepaper-demo.pdf" target="_blank" rel="noopener noreferrer" className="text-white text-lg font-medium tracking-wider hover:text-cyan-400 transition">WHITEPAPER</a>
                      <a href="https://bafybeiccomwmgswuumnpthrhk7z2uyyj5khnyx3txhqfq4izo3dw2k5ib4.ipfs.w3s.link/tokenomics.png" target="_blank" rel="noopener noreferrer" className="text-white text-lg font-medium tracking-wider hover:text-cyan-400 transition">TOKENOMICS</a>
                      <button onClick={handleScrollToRoadmap} className="text-white text-lg font-medium tracking-wider hover:text-cyan-400 transition bg-transparent border-none cursor-pointer">ROADMAP</button>
                      <button onClick={handleScrollToFAQ} className="text-white text-lg font-medium tracking-wider hover:text-cyan-400 transition bg-transparent border-none cursor-pointer">FAQ</button>
                    </div>
                  </div>
                  {/* Roadmap Section */}
                  <div ref={roadmapRef} className="w-full max-w-3xl mt-24 mb-12 bg-white/90 rounded-2xl shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-cyan-700 mb-6">Project Roadmap</h2>
                    <table className="w-full text-left">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 text-lg text-cyan-700">Quarter</th>
                          <th className="py-2 px-4 text-lg text-cyan-700">Milestone</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b last:border-b-0">
                          <td className="py-3 px-4 font-semibold text-cyan-900 whitespace-nowrap">2025 Q3</td>
                          <td className="py-3 px-4 text-gray-800">Complete Sepolia testnet presale and finalize tokenomics</td>
                        </tr>
                        <tr className="border-b last:border-b-0">
                          <td className="py-3 px-4 font-semibold text-cyan-900 whitespace-nowrap">2025 Q4</td>
                          <td className="py-3 px-4 text-gray-800">Deploy to Mainnet and establish initial liquidity</td>
                        </tr>
                        <tr className="border-b last:border-b-0">
                          <td className="py-3 px-4 font-semibold text-cyan-900 whitespace-nowrap">2026 Q1</td>
                          <td className="py-3 px-4 text-gray-800">Launch DAO governance module for community proposals and voting</td>
                        </tr>
                        <tr className="border-b last:border-b-0">
                          <td className="py-3 px-4 font-semibold text-cyan-900 whitespace-nowrap">2026 Q2</td>
                          <td className="py-3 px-4 text-gray-800">Introduce cross-chain bridge functionality</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-semibold text-cyan-900 whitespace-nowrap">2026 Q3</td>
                          <td className="py-3 px-4 text-gray-800">Release mobile wallet and integrated NFT platform</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* FAQ Section */}
                  <div ref={faqRef} className="w-full max-w-3xl mt-24 mb-12 bg-white/90 rounded-2xl shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-cyan-700 mb-6">FAQ: ERC20 Presale Smart Contract</h2>
                    <div className="space-y-6 text-gray-800 text-lg">
                      <div>
                        <strong>1. What is this presale platform?</strong>
                        <div>This platform is a blockchain-based ERC20 token presale DApp. It allows users to purchase MyToken (MTK) with USDT during the presale period and receive tokens instantly.</div>
                      </div>
                      <div>
                        <strong>2. How do I participate in the presale?</strong>
                        <div>Connect your wallet (MetaMask is recommended). Switch to the Sepolia testnet (or Hardhat local network). Make sure your wallet has enough USDT test tokens. Click “Connect Wallet,” enter the amount of MTK you want to buy, and click “Purchase Tokens.”</div>
                      </div>
                      <div>
                        <strong>3. Why do I need USDT? How can I get it?</strong>
                        <div>The presale only accepts USDT as payment. On testnets, USDT must be sent to you by the contract owner or admin, or you can use a test script to receive it.</div>
                      </div>
                      <div>
                        <strong>4. What is the whitelist? How do I join?</strong>
                        <div>If the whitelist is enabled, only addresses on the whitelist can participate in the presale. You can apply for the whitelist via the User Dashboard by clicking “Apply for Whitelist” (if supported by the contract). Admins can also add users to the whitelist in batches.</div>
                      </div>
                      <div>
                        <strong>5. Are there any purchase limits?</strong>
                        <div>Each user has a minimum (e.g., 100 MTK) and maximum (e.g., 10,000 MTK) purchase amount. The total presale supply is limited and sold on a first-come, first-served basis.</div>
                      </div>
                      <div>
                        <strong>6. How soon will I receive my tokens after purchase?</strong>
                        <div>Tokens (MTK) are sent to your wallet address immediately after a successful purchase.</div>
                      </div>
                      <div>
                        <strong>7. What happens after the presale ends?</strong>
                        <div>Unsold tokens are automatically returned to the contract owner. The owner can withdraw all USDT funds collected during the presale.</div>
                      </div>
                      <div>
                        <strong>8. How can I check my purchase history and balances?</strong>
                        <div>After connecting your wallet, the User Dashboard displays your purchased amount, MTK balance, USDT balance, and allowance. The Transaction History section shows all your purchase records.</div>
                      </div>
                      <div>
                        <strong>9. What should I do if I see “Please switch to Sepolia or Hardhat network”?</strong>
                        <div>Please switch your MetaMask network to Sepolia testnet or Hardhat local network; otherwise, you cannot participate in the presale.</div>
                      </div>
                      <div>
                        <strong>10. Is the presale contract secure? Has it been audited?</strong>
                        <div>The contract uses OpenZeppelin’s standard ERC20 and security modules (Ownable, ReentrancyGuard). For production/mainnet use, a third-party security audit is strongly recommended.</div>
                      </div>
                      <div>
                        <strong>11. Where can I get more help?</strong>
                        <div>Please refer to the WHITEPAPER and Tokenomics on the homepage. For further questions, contact the development team or project admin.</div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="container mx-auto px-4 py-8">
                  {error && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-red-500/80 to-pink-500/80 border border-red-400 rounded-lg shadow-lg">
                      <p className="text-white font-semibold">{error}</p>
                    </div>
                  )}
                  {/* Countdown Timer */}
                  <div className="mb-8">
                    <CountdownTimer presaleInfo={presaleInfo} />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Presale Stats */}
                    <div className="lg:col-span-2">
                      <div className="card bg-gradient-to-br from-[#232526] to-[#414345] border border-cyan-400/30 rounded-2xl shadow-xl p-6 mb-8">
                        <PresaleStats presaleInfo={presaleInfo} />
                      </div>
                    </div>
                    {/* Purchase Form */}
                    <div className="lg:col-span-1">
                      <div className="card bg-gradient-to-br from-[#232526] to-[#414345] border border-cyan-400/30 rounded-2xl shadow-xl p-6 mb-8">
                        <TokenPurchase
                          account={account}
                          usdtAddress={USDT_ADDRESS}
                          presaleAddress={PRESALE_ADDRESS}
                          provider={provider}
                          purchaseAmount={purchaseAmount}
                          setPurchaseAmount={setPurchaseAmount}
                          onPurchase={purchaseTokens}
                          isLoading={isLoading}
                          presaleInfo={presaleInfo}
                        />
                      </div>
                    </div>
                  </div>
                  {/* User Dashboard and Transaction History */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    <div className="card bg-gradient-to-br from-[#232526] to-[#414345] border border-cyan-400/30 rounded-2xl shadow-xl p-6">
                      <UserDashboard
                        account={account}
                        provider={provider}
                        presaleAddress={PRESALE_ADDRESS}
                        presaleABI={PRESALE_ABI}
                        tokenAddress={MYTOKEN_ADDRESS}
                        usdtAddress={USDT_ADDRESS}
                      />
                    </div>
                    <div className="card bg-gradient-to-br from-[#232526] to-[#414345] border border-cyan-400/30 rounded-2xl shadow-xl p-6">
                      <TransactionHistory
                        account={account}
                        provider={provider}
                        presaleAddress={PRESALE_ADDRESS}
                        presaleABI={PRESALE_ABI}
                      />
                    </div>
                  </div>
                </div>
              )}
            } />
            <Route path="/roadmap" element={<Roadmap />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 