import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import {
  MYTOKEN_ADDRESS,
  USDT_ADDRESS,
  PRESALE_ADDRESS,
  PRESALE_ABI,
  USDT_ABI,
  MYTOKEN_ABI,
  NETWORKS,
  CURRENT_NETWORK,
  getCurrentConfig
} from '../constants';

// SVG Logo Path
const svgPaths = {
  p1d5a9040: "M14 2.33333V25.6667M22.2496 5.75042L5.75042 22.2496M25.6667 14H2.33333M22.2496 22.2496L5.75042 5.75042"
};

// FAQ Data for Presale
const presaleFaqData = [
  {
    question: "What is the presale?",
    answer: "The presale is an early token sale event that allows investors to purchase MyToken at a discounted price before the official launch. This helps fund the project development and gives early supporters exclusive access to tokens."
  },
  {
    question: "How do I participate in the presale?",
    answer: "To participate, connect your MetaMask wallet, ensure you have USDT tokens, approve the USDT spending, and then purchase tokens using the purchase interface. Make sure you're connected to the correct network."
  },
  {
    question: "What is the minimum and maximum purchase?",
    answer: "The minimum purchase is 100 MTK tokens and the maximum purchase is 10,000 MTK tokens per transaction. This helps ensure fair distribution and prevents large investors from dominating the presale."
  },
  {
    question: "When will tokens be distributed?",
    answer: "Tokens will be distributed immediately after the presale ends and is finalized. You can claim your tokens through the same interface where you made the purchase. Make sure to keep your wallet connected."
  },
  {
    question: "What happens if the presale doesn't reach its target?",
    answer: "If the presale doesn't reach its target, participants can claim a refund of their USDT. The smart contract includes safety mechanisms to ensure all funds are returned if the presale fails to meet its goals."
  },
  {
    question: "Can I sell my tokens immediately after the presale?",
    answer: "Tokens purchased during the presale will be locked for a short period after the presale ends to ensure market stability. After the lock period, you can freely trade your tokens on supported exchanges."
  }
];

// UI Components (保持不變)
const Button = ({ children, onClick, disabled, className, variant, size, ...props }) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = {
    default: "bg-[#00b3e6] text-[#000405] hover:bg-[#0099cc] border-0",
    outline: "bg-transparent border border-[#d7dee4] text-[#d7dee4] hover:bg-[#02080d]",
    green: "bg-green-600 hover:bg-green-700 border-0"
  };
  const sizeClasses = {
    default: "px-4 py-2",
    sm: "px-3 py-1 text-sm"
  };
  
  const classes = `${baseClasses} ${variantClasses[variant || 'default']} ${sizeClasses[size || 'default']} ${className || ''}`;
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ value, onChange, placeholder, type = "text", className, ...props }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 bg-[#02080d] border border-[rgba(145,164,182,0.2)] text-[#d7dee4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b3e6] ${className || ''}`}
      {...props}
    />
  );
};

const Card = ({ children, className, ...props }) => {
  return (
    <div className={`bg-[#020b0d] border border-[rgba(145,164,182,0.2)] rounded-lg shadow-none ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className, ...props }) => {
  return (
    <div className={`p-6 bg-[#020b0d] ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

const CardTitle = ({ children, className, ...props }) => {
  return (
    <h3 className={`text-[#d7dee4] font-semibold ${className || ''}`} {...props}>
      {children}
    </h3>
  );
};

const CardContent = ({ children, className, ...props }) => {
  return (
    <div className={`p-6 bg-[#020b0d] ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

const Progress = ({ value, className, ...props }) => {
  return (
    <div className={`w-full bg-[#02080d] rounded-full h-2 ${className || ''}`} {...props}>
      <div 
        className="bg-[#00b3e6] h-2 rounded-full transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

const Badge = ({ children, className, ...props }) => {
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${className || ''}`} {...props}>
      {children}
    </span>
  );
};

const Separator = ({ className, ...props }) => {
  return (
    <div className={`h-px bg-[rgba(145,164,182,0.2)] ${className || ''}`} {...props} />
  );
};

// Icons (保持不變)
const AlertTriangle = ({ className, ...props }) => (
  <svg className={`h-5 w-5 text-orange-400 ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const Clock = ({ className, ...props }) => (
  <svg className={`h-8 w-8 text-[#00b3e6] ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DollarSign = ({ className, ...props }) => (
  <svg className={`h-5 w-5 text-[#00b3e6] ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);

const Wallet = ({ className, ...props }) => (
  <svg className={`h-5 w-5 ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const Copy = ({ className, ...props }) => (
  <svg className={`h-4 w-4 text-[#91a4b6] cursor-pointer hover:text-[#00b3e6] ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const ExternalLink = ({ className, ...props }) => (
  <svg className={`h-4 w-4 text-[#91a4b6] cursor-pointer hover:text-[#00b3e6] ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const Shield = ({ className, ...props }) => (
  <svg className={`h-5 w-5 ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const CheckCircle = ({ className, ...props }) => (
  <svg className={`h-4 w-4 text-green-400 ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// FAQ Section Component for Presale
function PresaleFAQSection() {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleItem = (index) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div id="faq" className="bg-[#02080d] box-border content-stretch flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-start px-4 sm:px-8 lg:px-12 py-12 lg:py-24 relative shrink-0 w-full">
      {/* Left side - FAQ Title */}
      <div className="lg:w-1/2 flex-shrink-0">
        <div className="font-semibold leading-[0] relative text-[#d7dee4] text-[32px] sm:text-[48px] lg:text-[72px] text-left">
          <p className="block leading-[36px] sm:leading-[52px] lg:leading-[76px]">
            Presale FAQ
          </p>
        </div>
      </div>

      {/* Right side - FAQ Items */}
      <div className="lg:w-1/2 flex-shrink-0">
        <div className="space-y-0">
          {presaleFaqData.map((item, index) => {
            const isExpanded = expandedItems.has(index);
            
            return (
              <div 
                key={index} 
                className={`border-b border-[#2a3441] transition-all duration-300 ${
                  isExpanded ? 'pb-6' : 'pb-0'
                }`}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full text-left py-6 flex items-center justify-between hover:text-[#00b3e6] transition-colors duration-200"
                >
                  <span className="font-medium text-[#d7dee4] text-[16px] sm:text-[18px] lg:text-[20px] leading-[24px] sm:leading-[26px] lg:leading-[28px] pr-4">
                    {item.question}
                  </span>
                  <span className={`text-[#00b3e6] text-[24px] transform transition-transform duration-300 flex-shrink-0 ${
                    isExpanded ? 'rotate-45' : 'rotate-0'
                  }`}>
                    +
                  </span>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="pb-6">
                    <p className="font-normal text-[#a1a8b0] text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function PresalePage() {
  const navigate = useNavigate();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  
  // 智能合約實例
  const [presaleContract, setPresaleContract] = useState(null);
  const [usdtContract, setUsdtContract] = useState(null);
  const [mytokenContract, setMytokenContract] = useState(null);
  
  // 預售數據
  const [presaleData, setPresaleData] = useState({
    totalRaised: "0",
    totalTarget: "0",
    tokensSold: "0",
    totalTokens: "0",
    currentPrice: "0",
    minPurchase: "0",
    maxPurchase: "0",
    presaleStart: 0,
    presaleEnd: 0,
    presaleFinalized: false
  });
  
  // 用戶數據
  const [userData, setUserData] = useState({
    usdtBalance: "0",
    mtokenBalance: "0",
    purchased: "0"
  });
  
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 檢查並自動連接錢包
  useEffect(() => {
    const checkAndConnectWallet = async () => {
      // 檢查 URL 參數
      const urlParams = new URLSearchParams(window.location.search);
      const autoConnect = urlParams.get('autoConnect');
      
      if (typeof window.ethereum !== 'undefined' && !isWalletConnected) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            // 如果已經有連接的帳戶，自動連接
            console.log("🔄 檢測到已連接的錢包，自動連接...");
            await connectWallet();
          } else if (autoConnect === 'true') {
            // 如果 URL 參數要求自動連接，嘗試連接
            console.log("🔄 從 HOME 頁面跳轉，嘗試連接錢包...");
            await connectWallet();
          }
        } catch (error) {
          console.error('檢查錢包狀態時出錯:', error);
        }
      }
    };

    checkAndConnectWallet();
  }, []);

  // 初始化合約
  const initializeContracts = async (provider) => {
    try {
      console.log("Contract addresses:", {
        PRESALE_ADDRESS,
        USDT_ADDRESS,
        MYTOKEN_ADDRESS
      });
      
      const signer = provider.getSigner();
      setSigner(signer);
      
      const presale = new ethers.Contract(PRESALE_ADDRESS, PRESALE_ABI, signer);
      const usdt = new ethers.Contract(USDT_ADDRESS, USDT_ABI, signer);
      const mytoken = new ethers.Contract(MYTOKEN_ADDRESS, MYTOKEN_ABI, signer);
      
      setPresaleContract(presale);
      setUsdtContract(usdt);
      setMytokenContract(mytoken);
      
      console.log("Contracts created successfully");
      return { presale, usdt, mytoken };
    } catch (error) {
      console.error('Error initializing contracts:', error);
      setError('Failed to initialize contracts');
    }
  };

  // 連接錢包
  const connectWallet = async () => {
    try {
      setLoading(true);
      setError("");
      
      // 檢查 MetaMask 是否可用
      if (typeof window.ethereum !== 'undefined') {
        // 檢查 MetaMask 是否已解鎖
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        
        if (accounts.length === 0) {
          // 如果沒有連接的帳戶，請求連接
          try {
            const newAccounts = await window.ethereum.request({ 
              method: 'eth_requestAccounts' 
            });
            
            if (newAccounts.length === 0) {
              setError('請在 MetaMask 中選擇一個帳戶');
              return;
            }
            
            accounts.push(...newAccounts);
          } catch (requestError) {
            console.error('MetaMask 連接請求失敗:', requestError);
            setError('請在 MetaMask 中授權連接此網站');
            return;
          }
        }
        
        // 創建 provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // 等待 provider 準備就緒
        await provider.ready;
        
        if (accounts.length > 0) {
          // 檢查網絡
          const network = await provider.getNetwork();
          console.log("Connected to network:", network);
          
          // 檢查是否連接到正確的網絡
          const expectedChainId = NETWORKS[CURRENT_NETWORK].chainId;
          if (network.chainId !== expectedChainId) {
            console.log(`Network mismatch. Expected: ${expectedChainId}, Got: ${network.chainId}`);
            
            // 嘗試自動切換到正確的網絡
            try {
              await switchToCorrectNetwork();
              // 重新獲取網絡信息
              const newNetwork = await provider.getNetwork();
              if (newNetwork.chainId !== expectedChainId) {
                setError(`請連接到 ${NETWORKS[CURRENT_NETWORK].name} (Chain ID: ${expectedChainId})`);
                return;
              }
            } catch (switchError) {
              console.error('Failed to switch network:', switchError);
              setError(`請連接到 ${NETWORKS[CURRENT_NETWORK].name} (Chain ID: ${expectedChainId})`);
              return;
            }
          }
          
          setIsWalletConnected(true);
          setWalletAddress(accounts[0]);
          setProvider(provider);
          
          // 初始化合約
          console.log("Initializing contracts...");
          await initializeContracts(provider);
          
          console.log("Loading data directly...");
          await loadPresaleData(provider);
          await loadUserData(provider, accounts[0]);
          console.log("Data loaded successfully");
          
        }
      } else {
        setError('請安裝 MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      
      // 更詳細的錯誤處理
      if (error.code === 4001) {
        setError('用戶拒絕了連接請求');
      } else if (error.code === -32002) {
        setError('請檢查 MetaMask 彈出窗口並確認連接');
      } else if (error.message.includes('message port closed')) {
        setError('MetaMask 連接問題，請重新整理頁面或重啟 MetaMask');
      } else {
        setError('連接錢包失敗: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // 斷開錢包
  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletAddress("");
    setProvider(null);
    setSigner(null);
    setPresaleContract(null);
    setUsdtContract(null);
    setMytokenContract(null);
    setPresaleData({
      totalRaised: "0",
      totalTarget: "0",
      tokensSold: "0",
      totalTokens: "0",
      currentPrice: "0",
      minPurchase: "0",
      maxPurchase: "0",
      presaleStart: 0,
      presaleEnd: 0,
      presaleFinalized: false
    });
    setUserData({
      usdtBalance: "0",
      mtokenBalance: "0",
      purchased: "0"
    });
  };

  // 加載預售數據
  const loadPresaleData = async (providerParam) => {
    try {
      console.log("Loading presale data...");
      
      const providerToUse = providerParam || provider;
      if (!providerToUse) {
        console.log("Provider not available");
        return;
      }
      
      const contract = new ethers.Contract(PRESALE_ADDRESS, PRESALE_ABI, providerToUse);
      console.log("Calling getPresaleInfo...");
      
      const presaleInfo = await contract.getPresaleInfo();
      console.log("Presale info received:", presaleInfo);
      
      const presaleData = {
        totalRaised: ethers.utils.formatUnits(presaleInfo[5], 6), // USDT 6 decimals
        totalTarget: ethers.utils.formatUnits(presaleInfo[5], 6), // 使用總籌集作為目標
        tokensSold: ethers.utils.formatEther(presaleInfo[4]), // MyToken 18 decimals
        totalTokens: ethers.utils.formatEther(presaleInfo[3]), // MyToken 18 decimals
        currentPrice: ethers.utils.formatUnits(presaleInfo[0], 6), // USDT 6 decimals
        minPurchase: ethers.utils.formatEther(presaleInfo[1]), // MyToken 18 decimals
        maxPurchase: ethers.utils.formatEther(presaleInfo[2]), // MyToken 18 decimals
        presaleStart: new Date(Number(presaleInfo[6]) * 1000),
        presaleEnd: new Date(Number(presaleInfo[7]) * 1000),
        presaleFinalized: presaleInfo[8]
      };
      
      console.log("Setting presale data:", presaleData);
      setPresaleData(presaleData);
      
    } catch (error) {
      console.error('Error loading presale data:', error);
      setError('無法載入預售數據: ' + error.message);
    }
  };

  // 加載用戶數據
  const loadUserData = async (providerParam, address) => {
    try {
      console.log("Loading user data for address:", address);
      
      const providerToUse = providerParam || provider;
      if (!providerToUse || !address) {
        console.log("Provider or address not available");
        return;
      }
      
      // 獲取合約實例
      const presaleContract = new ethers.Contract(PRESALE_ADDRESS, PRESALE_ABI, providerToUse);
      const usdtContract = new ethers.Contract(USDT_ADDRESS, USDT_ABI, providerToUse);
      const mytokenContract = new ethers.Contract(MYTOKEN_ADDRESS, MYTOKEN_ABI, providerToUse);
      
      // 獲取用戶信息
      const userInfo = await presaleContract.getUserInfo(address);
      const usdtBalance = await usdtContract.balanceOf(address);
      const mtokenBalance = await mytokenContract.balanceOf(address);
      
      const userData = {
        purchased: ethers.utils.formatEther(userInfo), // MyToken 18 decimals - 直接使用 userInfo，不是 userInfo[0]
        usdtBalance: ethers.utils.formatUnits(usdtBalance, 6), // USDT 6 decimals
        mtokenBalance: ethers.utils.formatEther(mtokenBalance) // MyToken 18 decimals
      };
      
      console.log("Setting user data:", userData);
      setUserData(userData);
      
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('無法載入用戶數據: ' + error.message);
    }
  };

  // 批准 USDT
  const approveUSDT = async () => {
    try {
      setLoading(true);
      setError("");
      
      if (!purchaseAmount || !usdtContract || !presaleContract) return;
      
      const amount = ethers.utils.parseUnits(purchaseAmount, 18); // MTK amount
      const cost = amount.mul(ethers.utils.parseUnits(presaleData.currentPrice, 6)).div(ethers.utils.parseEther("1"));
      
      const tx = await usdtContract.approve(PRESALE_ADDRESS, cost);
      await tx.wait();
      
      alert('USDT approved successfully!');
    } catch (error) {
      console.error('Error approving USDT:', error);
      setError('Failed to approve USDT');
    } finally {
      setLoading(false);
    }
  };

  // 購買代幣
  const purchaseTokens = async () => {
    try {
      console.log("🔄 開始購買代幣...");
      console.log("購買金額:", purchaseAmount);
      console.log("預售合約:", presaleContract);
      console.log("錢包連接:", isWalletConnected);
      console.log("可以購買:", canPurchase);
      
      setLoading(true);
      setError("");
      
      if (!purchaseAmount || !presaleContract) {
        console.log("❌ 缺少必要參數");
        console.log("purchaseAmount:", purchaseAmount);
        console.log("presaleContract:", presaleContract);
        return;
      }
      
      const amount = ethers.utils.parseUnits(purchaseAmount, 18);
      
      const tx = await presaleContract.buyTokens(amount);
      await tx.wait();
      
      alert('Tokens purchased successfully!');
      
      // 重新加載數據
      await loadPresaleData(provider);
      await loadUserData(provider, walletAddress);
      
      setPurchaseAmount("");
    } catch (error) {
      console.error('Error purchasing tokens:', error);
      setError('Failed to purchase tokens: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 切換到正確的網絡
  const switchToCorrectNetwork = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const network = NETWORKS[CURRENT_NETWORK];
        const chainIdHex = '0x' + network.chainId.toString(16);
        
        // 嘗試切換到網絡
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainIdHex }]
          });
        } catch (switchError) {
          // 如果網絡不存在，添加網絡
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: chainIdHex,
                chainName: network.name,
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: [network.rpcUrl],
                blockExplorerUrls: network.explorer ? [network.explorer] : []
              }]
            });
          } else {
            throw switchError;
          }
        }
        
        // 等待網絡切換完成
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error('Error switching network:', error);
      throw error; // 重新拋出錯誤，讓調用者處理
    }
  };

  // 監聽 MetaMask 狀態變化
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          // 用戶斷開連接
          disconnectWallet();
          setError('錢包已斷開連接');
        } else if (accounts[0] !== walletAddress) {
          // 用戶切換帳戶
          setWalletAddress(accounts[0]);
          loadUserData(provider, accounts[0]);
        }
      };

      const handleChainChanged = (chainId) => {
        // 重新整理頁面以確保正確的網絡
        window.location.reload();
      };

      const handleDisconnect = (error) => {
        console.error('MetaMask disconnected:', error);
        disconnectWallet();
        setError('MetaMask 連接已斷開');
      };

      // 添加事件監聽器
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);

      // 清理函數
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      };
    }
  }, [walletAddress]);

  // 計算倒計時
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = Math.floor(Date.now() / 1000);
      const endTime = presaleData.presaleEnd;
      
      if (endTime > now) {
        const diff = endTime - now;
        const days = Math.floor(diff / (24 * 60 * 60));
        const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((diff % (60 * 60)) / 60);
        const seconds = diff % 60;
        
        setTimeRemaining({ days, hours, minutes, seconds });
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(timer);
  }, [presaleData.presaleEnd]);

  // 計算進度百分比
  const progressPercentage = presaleData.totalTarget > 0 
    ? (parseFloat(presaleData.totalRaised) / parseFloat(presaleData.totalTarget)) * 100 
    : 0;
    
  const tokenProgressPercentage = presaleData.totalTokens > 0 
    ? (parseFloat(presaleData.tokensSold) / parseFloat(presaleData.totalTokens)) * 100 
    : 0;

  // 檢查是否可以購買
  const canPurchase = presaleData.presaleStart > 0 && 
    !presaleData.presaleFinalized &&
    Date.now() >= presaleData.presaleStart.getTime() &&
    Date.now() <= presaleData.presaleEnd.getTime();

  // 漢堡選單狀態
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 切換漢堡選單
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 關閉漢堡選單
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="relative size-full bg-[#02080d] min-h-screen overflow-x-hidden">
      {/* Header */}
      <div className="box-border content-stretch flex flex-col items-start justify-start min-h-inherit min-w-inherit px-4 sm:px-8 lg:px-12 py-0 relative size-full bg-[#02080d]">
        <div className="bg-[#020b0d] box-border content-stretch flex flex-row gap-8 lg:gap-32 h-20 items-center justify-start pb-[18px] pt-5 px-0 relative shrink-0 w-full">
          {/* Logo */}
          <div className="box-border content-stretch flex flex-row gap-4 lg:gap-[52px] items-center justify-start p-0 relative shrink-0">
            <div className="box-border content-stretch flex flex-row gap-1 h-8 items-center justify-start p-0 relative shrink-0">
              <div className="relative shrink-0 size-7">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
                  <g>
                    <path
                      d={svgPaths.p1d5a9040}
                      stroke="#00B3E6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                    />
                  </g>
                </svg>
              </div>
              <div className="font-bold leading-[0] relative shrink-0 text-[#00b3e6] text-[28px] text-left text-nowrap tracking-[-1.12px]">
                <p className="block leading-none whitespace-pre">MyToken</p>
              </div>
            </div>
            
            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden lg:flex box-border content-stretch flex-row gap-4 lg:gap-10 items-start justify-start p-0 relative shrink-0">
              <button 
                onClick={() => navigate('/')}
                className="font-medium leading-[0] relative shrink-0 text-[#d7e2e4] text-[15px] text-left text-nowrap cursor-pointer hover:text-[#00b3e6] transition-colors duration-200"
              >
                <p className="block leading-[20px] whitespace-pre">HOME</p>
              </button>
              <a 
                href="https://w3s.link/ipfs/bafybeiak2cjoekyjgelszlan3ywm7ivtppz2gzp2w5oopt7e4tnkus2nc4/MTK-whitepaper-demo.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium leading-[0] relative shrink-0 text-[#d7e2e4] text-[15px] text-left text-nowrap cursor-pointer hover:text-[#00b3e6] transition-colors duration-200"
              >
                <p className="block leading-[20px] whitespace-pre">WHITEPAPER</p>
              </a>
              <a 
                href="https://bafybeiccomwmgswuumnpthrhk7z2uyyj5khnyx3txhqfq4izo3dw2k5ib4.ipfs.w3s.link/tokenomics.png"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium leading-[0] relative shrink-0 text-[#d7e2e4] text-[15px] text-left text-nowrap cursor-pointer hover:text-[#00b3e6] transition-colors duration-200"
              >
                <p className="block leading-[20px] whitespace-pre">TOKENOMICS</p>
              </a>
              <div className="font-medium leading-[0] relative shrink-0 text-[#00b3e6] text-[15px] text-left text-nowrap">
                <p className="block leading-[20px] whitespace-pre">PRESALE</p>
              </div>
              <button 
                onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
                className="font-medium leading-[0] relative shrink-0 text-[#d7e2e4] text-[15px] text-left text-nowrap cursor-pointer hover:text-[#00b3e6] transition-colors duration-200"
              >
                <p className="block leading-[20px] whitespace-pre">FAQ</p>
              </button>
            </div>
          </div>

          {/* Wallet Status and Mobile Menu */}
          <div className="box-border content-stretch flex flex-row gap-4 items-center justify-center p-0 relative shrink-0 flex-1">
            {/* Desktop Title - Hidden on mobile */}
            <div className="hidden lg:block font-semibold leading-[0] relative shrink-0 text-[#d7dee4] text-[20px] lg:text-[34px] text-left text-nowrap">
              <p className="block leading-[40px] whitespace-pre">Presale Dashboard</p>
            </div>
            
            {/* Mobile Title - Visible on mobile */}
            <div className="lg:hidden font-semibold leading-[0] relative shrink-0 text-[#d7dee4] text-[18px] text-left text-nowrap">
              <p className="block leading-[24px] whitespace-pre">Presale</p>
            </div>
            
            {/* Wallet Status */}
            <div className="flex items-center gap-2">
              {!isWalletConnected ? (
                <Button onClick={connectWallet} disabled={loading} className="bg-[#00b3e6] text-[#000405] hover:bg-[#0099cc] px-4 lg:px-6 py-2 lg:py-3 rounded-[14px] border-0 text-sm lg:text-base">
                  {loading ? "CONNECTING..." : "CONNECT"}
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600 text-white border-0 text-xs">Connected</Badge>
                  <span className="text-[#d7dee4] text-xs hidden sm:inline">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                  <Button onClick={disconnectWallet} variant="outline" size="sm" className="text-[#d7dee4] border-[#d7dee4] bg-transparent hover:bg-[#02080d] text-xs">
                    Disconnect
                  </Button>
                </div>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1.5 z-50 relative"
            >
              <div className={`w-6 h-0.5 bg-[#d7dee4] transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`} />
              <div className={`w-6 h-0.5 bg-[#d7dee4] transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`} />
              <div className={`w-6 h-0.5 bg-[#d7dee4] transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={closeMobileMenu}
          />
        )}

        {/* Mobile Menu Panel */}
        <div className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-[#020b0d] border-l border-[#2a3441] z-50 transform transition-transform duration-300 lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex flex-col h-full p-6">
            {/* Close Button */}
            <div className="flex justify-end mb-8">
              <button
                onClick={closeMobileMenu}
                className="w-8 h-8 flex items-center justify-center text-[#d7dee4] hover:text-[#00b3e6] transition-colors duration-200"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M15 5L5 15M5 5L15 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col gap-6 mb-8">
              <button 
                onClick={() => { navigate('/'); closeMobileMenu(); }}
                className="font-medium text-[#d7e2e4] text-[16px] text-left hover:text-[#00b3e6] transition-colors duration-200 py-2"
              >
                HOME
              </button>
              <a 
                href="https://w3s.link/ipfs/bafybeiak2cjoekyjgelszlan3ywm7ivtppz2gzp2w5oopt7e4tnkus2nc4/MTK-whitepaper-demo.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMobileMenu}
                className="font-medium text-[#d7e2e4] text-[16px] text-left hover:text-[#00b3e6] transition-colors duration-200 py-2"
              >
                WHITEPAPER
              </a>
              <a 
                href="https://bafybeiccomwmgswuumnpthrhk7z2uyyj5khnyx3txhqfq4izo3dw2k5ib4.ipfs.w3s.link/tokenomics.png"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMobileMenu}
                className="font-medium text-[#d7e2e4] text-[16px] text-left hover:text-[#00b3e6] transition-colors duration-200 py-2"
              >
                TOKENOMICS
              </a>
              <div className="font-medium text-[#00b3e6] text-[16px] text-left py-2">
                PRESALE
              </div>
              <button 
                onClick={() => { document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }); closeMobileMenu(); }}
                className="font-medium text-[#d7e2e4] text-[16px] text-left hover:text-[#00b3e6] transition-colors duration-200 py-2"
              >
                FAQ
              </button>
            </div>

            {/* Mobile Wallet Status */}
            <div className="mt-auto p-4 bg-[#0f1419] rounded-[14px] border border-[#2a3441]">
              <div className="flex items-center justify-between mb-4">
                <div className="font-semibold text-[#d7dee4] text-[18px] leading-[24px]">
                  {isWalletConnected ? 'Wallet Connected' : 'Wallet Status'}
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  isWalletConnected ? 'bg-green-500' : 'bg-gray-500'
                }`} />
              </div>
              {!isWalletConnected ? (
                <button
                  onClick={() => { connectWallet(); closeMobileMenu(); }}
                  disabled={loading}
                  className="w-full bg-[#00b3e6] hover:bg-[#0099cc] px-4 py-3 rounded-[12px] transition-colors duration-200 disabled:opacity-50"
                >
                  <div className="font-medium text-[#000405] text-[16px] leading-[20px]">
                    {loading ? "CONNECTING..." : "CONNECT WALLET"}
                  </div>
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="text-[#d7dee4] text-sm break-all">
                    {walletAddress}
                  </div>
                  <button
                    onClick={() => { disconnectWallet(); closeMobileMenu(); }}
                    className="w-full bg-transparent border border-[#d7dee4] text-[#d7dee4] hover:bg-[#02080d] px-4 py-2 rounded-[12px] transition-colors duration-200"
                  >
                    <div className="font-medium text-[16px] leading-[20px]">
                      DISCONNECT WALLET
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6 w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle />
                <span className="text-red-400">Error:</span>
                <span className="text-[#d7dee4] text-sm">{error}</span>
              </div>
              {error.includes('connect to') && (
                <Button 
                  onClick={switchToCorrectNetwork}
                  size="sm"
                  className="bg-[#00b3e6] text-[#000405] hover:bg-[#0099cc]"
                >
                  Switch Network
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Security Warning */}
        <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4 mb-6 w-full">
          <div className="flex items-center gap-2">
            <AlertTriangle />
            <span className="text-orange-400">Security Notice:</span>
            <span className="text-[#d7dee4] text-sm">Only purchase tokens from official sources. Verify contract addresses and be aware of scams.</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full flex-1 pb-12 bg-[#02080d]">
          {/* Left Column - Presale Metrics */}
          <div className="lg:col-span-2 space-y-6 bg-[#02080d]">
            {/* Presale Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Presale Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-[#d7dee4] text-sm mb-2">Funds Raised</p>
                    <p className="text-[#00b3e6] text-2xl font-bold">${parseFloat(presaleData.totalRaised).toLocaleString()} USDT</p>
                    <p className="text-[#91a4b6] text-sm">of ${parseFloat(presaleData.totalTarget).toLocaleString()} target</p>
                    <Progress value={progressPercentage} className="mt-2" />
                  </div>
                  <div>
                    <p className="text-[#d7dee4] text-sm mb-2">Tokens Sold</p>
                    <p className="text-[#00b3e6] text-2xl font-bold">{parseFloat(presaleData.tokensSold).toLocaleString()} MTK</p>
                    <p className="text-[#91a4b6] text-sm">of {parseFloat(presaleData.totalTokens).toLocaleString()} total</p>
                    <Progress value={tokenProgressPercentage} className="mt-2" />
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Clock className="mx-auto mb-2" />
                    <p className="text-[#d7dee4] text-lg font-bold">{timeRemaining.days}</p>
                    <p className="text-[#91a4b6] text-sm">Days</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[#d7dee4] text-lg font-bold">{timeRemaining.hours}</p>
                    <p className="text-[#91a4b6] text-sm">Hours</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[#d7dee4] text-lg font-bold">{timeRemaining.minutes}</p>
                    <p className="text-[#91a4b6] text-sm">Minutes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[#d7dee4] text-lg font-bold">{timeRemaining.seconds}</p>
                    <p className="text-[#91a4b6] text-sm">Seconds</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Purchase Interface */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Purchase MyToken</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#02080d] p-4 rounded-lg">
                    <p className="text-[#91a4b6] text-sm">Current Price</p>
                    <p className="text-[#00b3e6] text-xl font-bold">${parseFloat(presaleData.currentPrice).toFixed(2)} USDT</p>
                  </div>
                  <div className="bg-[#02080d] p-4 rounded-lg">
                    <p className="text-[#91a4b6] text-sm">Wallet Address</p>
                    {isWalletConnected ? (
                      <div className="flex items-center gap-2">
                        <p className="text-[#00b3e6] text-sm font-mono truncate">{walletAddress}</p>
                        <Copy />
                      </div>
                    ) : (
                      <p className="text-[#91a4b6] text-sm">Not Connected</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[#d7dee4] text-sm">Amount (MTK)</label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(e.target.value)}
                  />
                  <div className="flex justify-between text-sm text-[#91a4b6]">
                    <span>Min: {parseFloat(presaleData.minPurchase).toLocaleString()} MTK</span>
                    <span>Max: {parseFloat(presaleData.maxPurchase).toLocaleString()} MTK</span>
                  </div>
                </div>

                {purchaseAmount && (
                  <div className="bg-[#02080d] p-4 rounded-lg">
                    <p className="text-[#91a4b6] text-sm">Cost in USDT</p>
                    <p className="text-[#00b3e6] text-xl font-bold">
                      ${(parseFloat(purchaseAmount) * parseFloat(presaleData.currentPrice)).toFixed(2)} USDT
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Button 
                    disabled={!isWalletConnected || !purchaseAmount || !canPurchase || loading} 
                    onClick={approveUSDT}
                    className="w-full"
                  >
                    {loading ? "APPROVING..." : !canPurchase ? "PRESALE NOT ACTIVE" : "Approve USDT"}
                  </Button>
                  <Button 
                    disabled={!isWalletConnected || !purchaseAmount || !canPurchase || loading} 
                    onClick={purchaseTokens}
                    className="w-full" 
                    variant="green"
                  >
                    {loading ? "PURCHASING..." : "Purchase Tokens"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - User Account & Stats */}
          <div className="space-y-6 bg-[#02080d]">
            {/* Wallet Balance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wallet />
                  Wallet Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-[#91a4b6] text-sm">USDT Balance</p>
                  <p className="text-[#00b3e6] text-xl font-bold">{parseFloat(userData.usdtBalance).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[#91a4b6] text-sm">MyToken Balance</p>
                  <p className="text-[#00b3e6] text-xl font-bold">{parseFloat(userData.mtokenBalance).toFixed(2)} MTK</p>
                </div>
                <div>
                  <p className="text-[#91a4b6] text-sm">Purchased in Presale</p>
                  <p className="text-[#00b3e6] text-xl font-bold">{parseFloat(userData.purchased).toFixed(2)} MTK</p>
                </div>
              </CardContent>
            </Card>

            {/* Presale Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign />
                  Presale Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#d7dee4] text-sm">Status:</span>
                      <span className={`text-sm font-medium ${canPurchase ? 'text-green-400' : 'text-red-400'}`}>
                        {canPurchase ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#d7dee4] text-sm">Finalized:</span>
                      <span className={`text-sm font-medium ${presaleData.presaleFinalized ? 'text-red-400' : 'text-green-400'}`}>
                        {presaleData.presaleFinalized ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#d7dee4] text-sm">Token Price:</span>
                      <span className="text-sm font-medium text-[#00b3e6]">
                        ${parseFloat(presaleData.currentPrice).toFixed(6)} USDT
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <PresaleFAQSection />

        {/* Footer */}
        <div className="bg-[#02080d] h-12 shrink-0 w-full" />
      </div>
    </div>
  );
} 