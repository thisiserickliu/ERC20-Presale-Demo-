import { useState } from 'react';
import svgPaths from "./imports/svg-zrz0rbnd0i";
import imgAFuturisticDigitalInterfaceDisplayingInterconnectedBlockchainNodesAndGlowingTokensInADarkModeTheme from "figma:asset/c56441b3649242b47c945dfc255fea27ab5260ce.png";
import { NavigationLink } from './components/NavigationLink';
import { FAQSection } from './components/FAQSection';
import { MobileMenu } from './components/MobileMenu';

export default function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleConnectWallet = () => {
    // Mock wallet connection
    setIsWalletConnected(!isWalletConnected);
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
                <div className="font-['Sen:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[#00b3e6] text-[22px] lg:text-[28px] text-left text-nowrap tracking-[-1.12px]">
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
                <NavigationLink onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}>
                  ROADMAP
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
                  <div className="font-['Outfit:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#d7dee4] text-[34px] text-left text-nowrap">
                    <p className="block leading-[40px] whitespace-pre">
                      {isWalletConnected ? 'Wallet Connected' : 'Wallet Status'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleConnectWallet}
                  className="bg-[#00b3e6] hover:bg-[#0099cc] box-border content-stretch flex flex-row items-center justify-center px-[22px] py-3 relative rounded-[14px] shrink-0 transition-colors duration-200"
                >
                  <div className="font-['Public_Sans:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#000405] text-[20px] text-left text-nowrap">
                    <p className="block leading-[24px] whitespace-pre">
                      {isWalletConnected ? 'DISCONNECT' : 'CONNECT WALLET'}
                    </p>
                  </div>
                </button>
              </div>

              {/* Mobile Wallet Status - Compact version */}
              <div className="lg:hidden flex items-center gap-2">
                <div className="font-['Outfit:SemiBold',_sans-serif] font-semibold text-[#d7dee4] text-[14px] leading-[18px]">
                  {isWalletConnected ? 'Connected' : 'Status'}
                </div>
                <button
                  onClick={handleConnectWallet}
                  className="bg-[#00b3e6] hover:bg-[#0099cc] px-3 py-1.5 rounded-[10px] transition-colors duration-200"
                >
                  <div className="font-['Public_Sans:Medium',_sans-serif] font-medium text-[#000405] text-[12px] leading-[16px]">
                    {isWalletConnected ? 'DISC.' : 'CONNECT'}
                  </div>
                </button>
              </div>

              {/* Mobile Menu */}
              <MobileMenu 
                isWalletConnected={isWalletConnected}
                onConnectWallet={handleConnectWallet}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="box-border content-stretch flex flex-row-reverse items-start justify-start px-0 py-6 md:py-12 relative shrink-0 w-full">
            <div className="basis-0 box-border content-stretch flex flex-col-reverse grow items-start justify-start min-h-px min-w-px order-1 p-0 relative shrink-0">
              
              {/* Hero Section - Further reduced mobile text size */}
              <div className="bg-[#02080d] box-border content-stretch flex flex-col gap-8 sm:gap-[52px] items-center justify-start order-4 px-0 py-12 sm:py-24 relative shrink-0 w-full">
                <div className="font-['Outfit:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#d7dee4] text-[36px] sm:text-[72px] lg:text-[120px] text-center w-full px-4">
                  <p className="block leading-[40px] sm:leading-[76px] lg:leading-[120px]">Welcome to MyToken</p>
                </div>
              </div>

              {/* Hero Image */}
              <div
                className="bg-center bg-cover bg-no-repeat h-[300px] sm:h-[500px] lg:h-[672px] order-3 relative rounded-[20px] sm:rounded-[28px] shrink-0 w-full"
                style={{
                  backgroundImage: `url('${imgAFuturisticDigitalInterfaceDisplayingInterconnectedBlockchainNodesAndGlowingTokensInADarkModeTheme}')`,
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
                          backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 1516 720\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(9.9916e-14 29.347 -96.537 4.4691e-14 758 742.18)\\'><stop stop-color=\\'rgba(143,230,255,0.16)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(72,120,134,0.08)\\' offset=\\'0.5\\'/><stop stop-color=\\'rgba(2,11,13,0)\\' offset=\\'1\\'/></radialGradient></defs></svg>')",
                        }}
                      />
                      <div
                        className="absolute box-border content-stretch flex flex-col gap-6 sm:gap-11 h-[200px] sm:h-[254px] items-center justify-center left-0 p-0 right-0 translate-y-[-50%]"
                        style={{ top: "calc(50% + 23px)" }}
                      >
                        <div className="box-border content-stretch flex flex-col gap-3 sm:gap-4 items-start justify-start leading-[0] max-w-[320px] sm:max-w-[600px] lg:max-w-[1260px] p-0 relative shrink-0 text-[#d7e2e4] text-center w-full px-4">
                          <div className="font-['Public_Sans:Bold',_sans-serif] font-bold relative shrink-0 text-[28px] sm:text-[48px] lg:text-[64px] tracking-[-0.56px] sm:tracking-[-1.28px] w-full">
                            <p className="block leading-[32px] sm:leading-[52px] lg:leading-[68px]">
                              Secure your digital assets
                            </p>
                          </div>
                          <div className="font-['Public_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[14px] sm:text-[20px] lg:text-[24px] tracking-[-0.07px] sm:tracking-[-0.12px] w-full">
                            <p className="block leading-[18px] sm:leading-[28px] lg:leading-[32px]">
                              Connect your wallet to access the world of
                              decentralized finance.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleConnectWallet}
                          className="bg-[#00b3e6] hover:bg-[#0099cc] box-border content-stretch flex flex-row items-center justify-center px-4 sm:px-[22px] py-2 sm:py-3 relative rounded-[14px] shrink-0 transition-colors duration-200"
                        >
                          <div className="font-['Public_Sans:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#000405] text-[14px] sm:text-[20px] text-left text-nowrap">
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