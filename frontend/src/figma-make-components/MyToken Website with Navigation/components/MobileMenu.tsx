import { useState } from 'react';
import { NavigationLink } from './NavigationLink';

interface MobileMenuProps {
  isWalletConnected: boolean;
  onConnectWallet: () => void;
}

export function MobileMenu({ isWalletConnected, onConnectWallet }: MobileMenuProps) {
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
              <div className="font-['Outfit:SemiBold',_sans-serif] font-semibold text-[#d7dee4] text-[18px] leading-[24px]">
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
              <div className="font-['Public_Sans:Medium',_sans-serif] font-medium text-[#000405] text-[16px] leading-[20px]">
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
                document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                closeMenu();
              }}>
                ROADMAP
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
            <div className="font-['Public_Sans:Regular',_sans-serif] font-normal text-[#717182] text-[14px] leading-[20px] text-center">
              &copy; 2024 MyToken. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}