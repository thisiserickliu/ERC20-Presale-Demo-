import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/digital-interface.png';

// SVG Logo Path
const svgPaths = {
  p1d5a9040: "M14 2L26 14M26 14L14 26M26 14H2"
};

// FAQ Data
const faqData = [
  {
    question: "What is MyToken?",
    answer: "MyToken is a revolutionary blockchain-based digital asset designed to provide secure, decentralized financial services. Our token leverages cutting-edge blockchain technology to ensure transparency, security, and accessibility for all users."
  },
  {
    question: "How do I connect my wallet?",
    answer: "To connect your wallet, simply click the 'CONNECT WALLET' button in the top right corner of our application. We support popular wallets including MetaMask, WalletConnect, and Coinbase Wallet. Make sure your wallet is installed and unlocked before attempting to connect."
  },
  {
    question: "Is MyToken secure?",
    answer: "Yes, MyToken is built with security as our top priority. We utilize industry-standard encryption, multi-signature protocols, and regular security audits. Our smart contracts have been thoroughly tested and audited by leading blockchain security firms."
  },
  {
    question: "What are the transaction fees?",
    answer: "MyToken operates on a low-fee structure to ensure accessibility for all users. Transaction fees are minimal and depend on network congestion. We're committed to keeping costs low while maintaining fast transaction speeds and network security."
  },
  {
    question: "How can I stake my tokens?",
    answer: "Staking MyToken is simple and rewarding. Once you have tokens in your connected wallet, navigate to our staking platform where you can choose your staking duration and earn competitive rewards. Staking helps secure the network while providing you with passive income."
  }
];

// Navigation Link Component
function NavigationLink({ children, href, onClick, openInNewTab = false }) {
  const [isHovered, setIsHovered] = useState(false);

  const content = (
    <div
      className="box-border content-stretch flex flex-row gap-1.5 items-center justify-start p-2 lg:p-0 relative shrink-0 cursor-pointer transition-colors duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className={`font-medium leading-[0] relative shrink-0 text-[16px] lg:text-[15px] text-left text-nowrap transition-colors duration-200 ${
        isHovered ? 'text-[#00b3e6]' : 'text-[#d7e2e4]'
      }`}>
        <p className="block leading-[20px] lg:leading-[20px] whitespace-pre">{children}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a 
        href={href} 
        className="overflow-visible"
        target={openInNewTab ? "_blank" : undefined}
        rel={openInNewTab ? "noopener noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }

  return content;
}

// Mobile Menu Component
function MobileMenu({ isWalletConnected, onConnectWallet, onNavigateToPresale }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="lg:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1.5 z-50 relative"
      >
        <div className={`w-6 h-0.5 bg-[#d7dee4] transition-all duration-300 ${
          isOpen ? 'rotate-45 translate-y-2' : ''
        }`} />
        <div className={`w-6 h-0.5 bg-[#d7dee4] transition-all duration-300 ${
          isOpen ? 'opacity-0' : ''
        }`} />
        <div className={`w-6 h-0.5 bg-[#d7dee4] transition-all duration-300 ${
          isOpen ? '-rotate-45 -translate-y-2' : ''
        }`} />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu Panel */}
      <div className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-[#020b0d] border-l border-[#2a3441] z-50 transform transition-transform duration-300 lg:hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full p-6">
          {/* Close Button */}
          <div className="flex justify-end mb-8">
            <button
              onClick={closeMenu}
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

          {/* Mobile Wallet Status */}
          <div className="mb-8 p-4 bg-[#0f1419] rounded-[14px] border border-[#2a3441]">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold text-[#d7dee4] text-[18px] leading-[24px]">
                {isWalletConnected ? 'Wallet Connected' : 'Wallet Status'}
              </div>
              <div className={`w-3 h-3 rounded-full ${
                isWalletConnected ? 'bg-green-500' : 'bg-gray-500'
              }`} />
            </div>
            <button
              onClick={() => {
                onConnectWallet();
                closeMenu();
              }}
              className="w-full bg-[#00b3e6] hover:bg-[#0099cc] px-4 py-3 rounded-[12px] transition-colors duration-200"
            >
              <div className="font-medium text-[#000405] text-[16px] leading-[20px]">
                {isWalletConnected ? 'DISCONNECT WALLET' : 'CONNECT WALLET'}
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-6 mb-8">
            <div onClick={closeMenu}>
              <NavigationLink 
                href="https://w3s.link/ipfs/bafybeiak2cjoekyjgelszlan3ywm7ivtppz2gzp2w5oopt7e4tnkus2nc4/MTK-whitepaper-demo.pdf"
                openInNewTab={true}
              >
                WHITEPAPER
              </NavigationLink>
            </div>
            <div onClick={closeMenu}>
              <NavigationLink 
                href="https://bafybeiccomwmgswuumnpthrhk7z2uyyj5khnyx3txhqfq4izo3dw2k5ib4.ipfs.w3s.link/tokenomics.png"
                openInNewTab={true}
              >
                TOKENOMICS
              </NavigationLink>
            </div>
            <div onClick={closeMenu}>
              <NavigationLink onClick={() => {
                onNavigateToPresale();
                closeMenu();
              }}>
                PRESALE
              </NavigationLink>
            </div>
            <div onClick={closeMenu}>
              <NavigationLink onClick={() => {
                document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                closeMenu();
              }}>
                FAQ
              </NavigationLink>
            </div>

          </div>

          {/* Footer */}
          <div className="mt-auto pt-6 border-t border-[#2a3441]">
            <div className="font-normal text-[#717182] text-[14px] leading-[20px] text-center">
              &copy; 2024 MyToken. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// FAQ Section Component
function FAQSection() {
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
    <div className="bg-[#02080d] box-border content-stretch flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-start px-0 py-12 lg:py-24 relative shrink-0 w-full">
      {/* Left side - FAQ Title */}
      <div className="lg:w-1/2 flex-shrink-0">
        <div className="font-semibold leading-[0] relative text-[#d7dee4] text-[32px] sm:text-[48px] lg:text-[72px] text-left">
          <p className="block leading-[36px] sm:leading-[52px] lg:leading-[76px]">
            Frequently Asked Questions
          </p>
        </div>
      </div>

      {/* Right side - FAQ Items */}
      <div className="lg:w-1/2 flex-shrink-0">
        <div className="space-y-0">
          {faqData.map((item, index) => {
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

export default function FigmaHomePage() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const navigate = useNavigate();

  const handleConnectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setProvider(provider);
          setIsWalletConnected(true);
          return true; // 返回連接成功
        }
      } else {
        alert('Please install MetaMask!');
      }
      return false; // 返回連接失敗
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
      return false; // 返回連接失敗
    }
  };

  const handleDisconnectWallet = () => {
    setAccount('');
    setProvider(null);
    setIsWalletConnected(false);
  };

  const handleWalletAction = async () => {
    if (isWalletConnected) {
      handleDisconnectWallet();
    } else {
      const connected = await handleConnectWallet();
      // 連接成功後自動跳轉到 presale 頁面
      if (connected) {
        navigate('/presale?autoConnect=true');
      }
    }
  };

  const handleNavigateToPresale = () => {
    navigate('/presale');
  };



  return (
    <div className="bg-[#02080d] min-h-screen w-full">
      <div className="min-h-screen w-full">
        <div className="box-border content-stretch flex flex-col items-start justify-start min-h-screen w-full px-4 md:px-8 lg:px-12 py-0">
          {/* Header */}
          <div className="bg-[#020b0d] box-border content-stretch flex flex-row items-center justify-between min-h-16 lg:min-h-20 pb-4 lg:pb-[18px] pt-5 px-0 relative shrink-0 w-full">
            {/* Left side - Logo and Desktop Navigation */}
            <div className="box-border content-stretch flex flex-row gap-4 lg:gap-[52px] items-center justify-start p-0 relative shrink-0">
              {/* Logo */}
              <div className="box-border content-stretch flex flex-row gap-1 h-8 items-center justify-start p-0 relative shrink-0">
                <div className="relative shrink-0 size-6 lg:size-7">
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 28 28"
                  >
                    <path
                      d={svgPaths.p1d5a9040}
                      stroke="#00B3E6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>
                <div className="font-bold leading-[0] relative shrink-0 text-[#00b3e6] text-[22px] lg:text-[28px] text-left text-nowrap tracking-[-1.12px]">
                  <p className="adjustLetterSpacing block leading-none whitespace-pre">
                    MyToken
                  </p>
                </div>
              </div>

              {/* Desktop Navigation - Hidden on mobile */}
              <div className="hidden lg:flex box-border content-stretch flex-row gap-10 items-start justify-start p-0 relative shrink-0">
                <NavigationLink 
                  href="https://w3s.link/ipfs/bafybeiak2cjoekyjgelszlan3ywm7ivtppz2gzp2w5oopt7e4tnkus2nc4/MTK-whitepaper-demo.pdf"
                  openInNewTab={true}
                >
                  WHITEPAPER
                </NavigationLink>
                <NavigationLink 
                  href="https://bafybeiccomwmgswuumnpthrhk7z2uyyj5khnyx3txhqfq4izo3dw2k5ib4.ipfs.w3s.link/tokenomics.png"
                  openInNewTab={true}
                >
                  TOKENOMICS
                </NavigationLink>
                <NavigationLink onClick={handleNavigateToPresale}>
                  PRESALE
                </NavigationLink>
                <NavigationLink onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}>
                  FAQ
                </NavigationLink>

              </div>
            </div>

            {/* Right side - Desktop Wallet Status + Mobile Menu */}
            <div className="flex items-center gap-4">
              {/* Desktop Wallet Status - Hidden on mobile */}
              <div className="hidden lg:flex box-border content-stretch flex-row gap-4 items-center justify-center p-0 relative shrink-0">
                <div className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0">
                  <div className="font-semibold leading-[0] relative shrink-0 text-[#d7dee4] text-[34px] text-left text-nowrap">
                    <p className="block leading-[40px] whitespace-pre">
                      {isWalletConnected ? 'Wallet Connected' : 'Wallet Status'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleWalletAction}
                  className="bg-[#00b3e6] hover:bg-[#0099cc] box-border content-stretch flex flex-row items-center justify-center px-[22px] py-3 relative rounded-[14px] shrink-0 transition-colors duration-200"
                >
                  <div className="font-medium leading-[0] relative shrink-0 text-[#000405] text-[20px] text-left text-nowrap">
                    <p className="block leading-[24px] whitespace-pre">
                      {isWalletConnected ? 'DISCONNECT' : 'CONNECT WALLET'}
                    </p>
                  </div>
                </button>
              </div>

              {/* Mobile Wallet Status - Compact version */}
              <div className="lg:hidden flex items-center gap-2">
                <div className="font-semibold text-[#d7dee4] text-[14px] leading-[18px]">
                  {isWalletConnected ? 'Connected' : 'Status'}
                </div>
                <button
                  onClick={handleWalletAction}
                  className="bg-[#00b3e6] hover:bg-[#0099cc] px-3 py-1.5 rounded-[10px] transition-colors duration-200"
                >
                  <div className="font-medium text-[#000405] text-[12px] leading-[16px]">
                    {isWalletConnected ? 'DISC.' : 'CONNECT'}
                  </div>
                </button>
              </div>

              {/* Mobile Menu */}
              <MobileMenu 
                isWalletConnected={isWalletConnected}
                onConnectWallet={handleWalletAction}
                onNavigateToPresale={handleNavigateToPresale}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="box-border content-stretch flex flex-row-reverse items-start justify-start px-0 py-6 md:py-12 relative shrink-0 w-full">
            <div className="basis-0 box-border content-stretch flex flex-col-reverse grow items-start justify-start min-h-px min-w-px order-1 p-0 relative shrink-0">
              
              {/* Hero Section */}
              <div className="bg-[#02080d] box-border content-stretch flex flex-col gap-8 sm:gap-[52px] items-center justify-start order-4 px-0 py-12 sm:py-24 relative shrink-0 w-full">
                <div className="font-semibold leading-[0] relative shrink-0 text-[#d7dee4] text-[36px] sm:text-[72px] lg:text-[120px] text-center w-full px-4">
                  <p className="block leading-[40px] sm:leading-[76px] lg:leading-[120px]">Welcome to MyToken</p>
                </div>
              </div>

              {/* Hero Image */}
              <div
                className="bg-center bg-cover bg-no-repeat h-[300px] sm:h-[500px] lg:h-[672px] order-3 relative rounded-[20px] sm:rounded-[28px] shrink-0 w-full"
                style={{
                  backgroundImage: `url('${heroImg}')`,
                }}
              >
                <div className="absolute border-[1.5px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[20px] sm:rounded-[28px]" />
              </div>

              {/* CTA Section */}
              <div className="bg-[#02080d] box-border content-stretch flex flex-col gap-4 sm:gap-8 items-center justify-end order-2 overflow-clip px-0 py-4 sm:py-8 relative shrink-0 w-full">
                <div className="box-border content-stretch flex flex-row-reverse items-start justify-start pb-24 sm:pb-48 pt-0 px-0 relative shrink-0 w-full">
                  <div className="basis-0 box-border content-stretch flex flex-col-reverse grow items-start justify-start min-h-px min-w-px order-1 p-0 relative shrink-0">
                    <div className="bg-[#020b0d] h-[400px] sm:h-[720px] order-1 relative shrink-0 w-full">
                      <div
                        className="absolute bottom-0 left-[-48px] sm:left-[-96px] right-[-48px] sm:right-[-96px] top-0"
                        style={{
                          backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\\'0 0 1516 720\\\' xmlns=\\\'http://www.w3.org/2000/svg\\\' preserveAspectRatio=\\\'none\\\'><rect x=\\\'0\\\' y=\\\'0\\\' height=\\\'100%\\\' width=\\\'100%\\\' fill=\\\'url(%23grad)\\\' opacity=\\\'1\\\'/><defs><radialGradient id=\\\'grad\\\' gradientUnits=\\\'userSpaceOnUse\\\' cx=\\\'0\\\' cy=\\\'0\\\' r=\\\'10\\\' gradientTransform=\\\'matrix(9.9916e-14 29.347 -96.537 4.4691e-14 758 742.18)\\\'><stop stop-color=\\\'rgba(143,230,255,0.16)\\\' offset=\\\'0\\\'/><stop stop-color=\\\'rgba(72,120,134,0.08)\\' offset=\\\'0.5\\\'/><stop stop-color=\\\'rgba(2,11,13,0)\\\' offset=\\\'1\\\'/></radialGradient></defs></svg>')",
                        }}
                      />
                      <div
                        className="absolute box-border content-stretch flex flex-col gap-6 sm:gap-11 h-[200px] sm:h-[254px] items-center justify-center left-0 p-0 right-0 translate-y-[-50%]"
                        style={{ top: "calc(50% + 23px)" }}
                      >
                        <div className="box-border content-stretch flex flex-col gap-3 sm:gap-4 items-start justify-start leading-[0] max-w-[320px] sm:max-w-[600px] lg:max-w-[1260px] p-0 relative shrink-0 text-[#d7e2e4] text-center w-full px-4">
                          <div className="font-bold relative shrink-0 text-[28px] sm:text-[48px] lg:text-[64px] tracking-[-0.56px] sm:tracking-[-1.28px] w-full">
                            <p className="block leading-[32px] sm:leading-[52px] lg:leading-[68px]">
                              Secure your digital assets
                            </p>
                          </div>
                          <div className="font-normal relative shrink-0 text-[14px] sm:text-[20px] lg:text-[24px] tracking-[-0.07px] sm:tracking-[-0.12px] w-full">
                            <p className="block leading-[18px] sm:leading-[28px] lg:leading-[32px]">
                              Connect your wallet to access the world of
                              decentralized finance.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleWalletAction}
                          className="bg-[#00b3e6] hover:bg-[#0099cc] box-border content-stretch flex flex-row items-center justify-center px-4 sm:px-[22px] py-2 sm:py-3 relative rounded-[14px] shrink-0 transition-colors duration-200"
                        >
                          <div className="font-medium leading-[0] relative shrink-0 text-[#000405] text-[14px] sm:text-[20px] text-left text-nowrap">
                            <p className="block leading-[18px] sm:leading-[24px] whitespace-pre">
                              {isWalletConnected ? 'WALLET CONNECTED' : 'CONNECT WALLET'}
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div id="faq" className="order-1">
                <FAQSection />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-[#02080d] h-12 shrink-0 w-full" />
        </div>
      </div>
    </div>
  );
} 