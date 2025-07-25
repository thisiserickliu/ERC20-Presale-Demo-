import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
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

export function FAQSection() {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
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
        <div className="font-['Outfit:SemiBold',_sans-serif] font-semibold leading-[0] relative text-[#d7dee4] text-[32px] sm:text-[48px] lg:text-[72px] text-left">
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
                  <span className="font-['Outfit:Medium',_sans-serif] font-medium text-[#d7dee4] text-[16px] sm:text-[18px] lg:text-[20px] leading-[24px] sm:leading-[26px] lg:leading-[28px] pr-4">
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
                    <p className="font-['Public_Sans:Regular',_sans-serif] font-normal text-[#a1a8b0] text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px]">
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