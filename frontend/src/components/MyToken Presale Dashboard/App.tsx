import { useState, useEffect } from 'react';
import svgPaths from "./imports/svg-nbqv5uv2oe";
import imgAFuturisticDigitalInterfaceDisplayingInterconnectedBlockchainNodesAndGlowingTokensInADarkModeTheme from "figma:asset/c56441b3649242b47c945dfc255fea27ab5260ce.png";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Progress } from "./components/ui/progress";
import { Badge } from "./components/ui/badge";
import { Separator } from "./components/ui/separator";
import { AlertTriangle, Clock, Users, DollarSign, Wallet, Copy, ExternalLink, Shield, CheckCircle } from "lucide-react";

export default function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [usdtBalance, setUsdtBalance] = useState("1,250.00");
  const [mtokenBalance, setMtokenBalance] = useState("0.00");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [timeRemaining, setTimeRemaining] = useState({
    days: 15,
    hours: 8,
    minutes: 42,
    seconds: 30
  });

  // Mock presale data
  const presaleData = {
    totalRaised: "847,230",
    totalTarget: "1,000,000",
    tokensSold: "4,236,150",
    totalTokens: "5,000,000",
    currentPrice: "0.20",
    nextPrice: "0.25",
    minPurchase: "10",
    maxPurchase: "10,000",
    bonus: "15"
  };

  // Mock transaction history
  const transactions = [
    { id: "1", type: "Purchase", amount: "500", tokens: "2,500", date: "2025-01-20", status: "Completed" },
    { id: "2", type: "Purchase", amount: "200", tokens: "1,000", date: "2025-01-18", status: "Completed" },
    { id: "3", type: "Referral", amount: "50", tokens: "250", date: "2025-01-15", status: "Completed" }
  ];

  // Mock whitelist data
  const whitelistAddresses = [
    { address: "0x742d35Cc6cF432...F8eA91c", status: "verified", joinedDate: "2025-01-15" },
    { address: "0x8ba1f109551bD4...2E90B5c", status: "verified", joinedDate: "2025-01-16" },
    { address: "0x1c39ba39e4735...A84D2Fc", status: "verified", joinedDate: "2025-01-17" },
    { address: "0x9f2049727dcd8...F3C1A8E", status: "verified", joinedDate: "2025-01-18" },
    { address: "0x4f3edf983ac636...E8C4F2A", status: "verified", joinedDate: "2025-01-19" },
    { address: "0x742d35Cc1234...Ab91c", status: "current", joinedDate: "2025-01-20" }
  ];

  const connectWallet = () => {
    // Mock wallet connection
    setIsWalletConnected(true);
    setWalletAddress("0x742d35Cc1234...Ab91c");
  };

  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletAddress("");
  };



  const progressPercentage = (parseFloat(presaleData.totalRaised.replace(/,/g, '')) / parseFloat(presaleData.totalTarget.replace(/,/g, ''))) * 100;
  const tokenProgressPercentage = (parseFloat(presaleData.tokensSold.replace(/,/g, '')) / parseFloat(presaleData.totalTokens.replace(/,/g, ''))) * 100;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative size-full bg-[#02080d] min-h-screen overflow-x-hidden">
      {/* Header */}
      <div className="box-border content-stretch flex flex-col items-start justify-start min-h-inherit min-w-inherit px-4 sm:px-8 lg:px-12 py-0 relative size-full bg-[#02080d]">
        <div className="bg-[#020b0d] box-border content-stretch flex flex-row gap-8 lg:gap-32 h-20 items-center justify-start pb-[18px] pt-5 px-0 relative shrink-0 w-full">
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
              <div className="font-['Sen:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[#00b3e6] text-[28px] text-left text-nowrap tracking-[-1.12px]">
                <p className="adjustLetterSpacing block leading-none whitespace-pre">MyToken</p>
              </div>
            </div>
            <div className="box-border content-stretch flex flex-row gap-4 lg:gap-10 items-start justify-start p-0 relative shrink-0">
              <a className="font-['Outfit:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#d7e2e4] text-[15px] text-left text-nowrap cursor-pointer hover:text-[#00b3e6]">
                <p className="block leading-[20px] whitespace-pre">WHITEPAPER</p>
              </a>
              <a className="font-['Outfit:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#d7e2e4] text-[15px] text-left text-nowrap cursor-pointer hover:text-[#00b3e6]">
                <p className="block leading-[20px] whitespace-pre">TOKENOMICS</p>
              </a>
              <div className="font-['Outfit:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#00b3e6] text-[15px] text-left text-nowrap">
                <p className="block leading-[20px] whitespace-pre">PRESALE</p>
              </div>
              <a className="font-['Outfit:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#d7e2e4] text-[15px] text-left text-nowrap cursor-pointer hover:text-[#00b3e6]">
                <p className="block leading-[20px] whitespace-pre">FAQ</p>
              </a>
            </div>
          </div>
          <div className="box-border content-stretch flex flex-row gap-4 items-center justify-center p-0 relative shrink-0 flex-1">
            <div className="font-['Outfit:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#d7dee4] text-[20px] lg:text-[34px] text-left text-nowrap">
              <p className="block leading-[40px] whitespace-pre">Presale Dashboard</p>
            </div>
            {!isWalletConnected ? (
              <Button onClick={connectWallet} className="bg-[#00b3e6] text-[#000405] hover:bg-[#0099cc] px-6 py-3 rounded-[14px] border-0">
                CONNECT WALLET
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Badge className="bg-green-600 text-white border-0">Connected</Badge>
                <span className="text-[#d7dee4] text-sm hidden sm:inline">{walletAddress}</span>
                <Button onClick={disconnectWallet} variant="outline" size="sm" className="text-[#d7dee4] border-[#d7dee4] bg-transparent hover:bg-[#02080d]">
                  Disconnect
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Security Warning */}
        <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4 mb-6 w-full">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-400" />
            <span className="text-orange-400">Security Notice:</span>
            <span className="text-[#d7dee4] text-sm">Only purchase tokens from official sources. Verify contract addresses and be aware of scams.</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full flex-1 pb-12 bg-[#02080d]">
          {/* Left Column - Presale Metrics */}
          <div className="lg:col-span-2 space-y-6 bg-[#02080d]">
            {/* Presale Progress */}
            <Card className="bg-[#020b0d] border-[rgba(145,164,182,0.2)] shadow-none">
              <CardHeader className="bg-[#020b0d]">
                <CardTitle className="text-[#d7dee4] text-xl">Presale Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 bg-[#020b0d]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-[#d7dee4] text-sm mb-2">Funds Raised</p>
                    <p className="text-[#00b3e6] text-2xl font-bold">${presaleData.totalRaised} USDT</p>
                    <p className="text-[#91a4b6] text-sm">of ${presaleData.totalTarget} target</p>
                    <Progress value={progressPercentage} className="mt-2 bg-[#02080d] [&>div]:bg-[#00b3e6]" />
                  </div>
                  <div>
                    <p className="text-[#d7dee4] text-sm mb-2">Tokens Sold</p>
                    <p className="text-[#00b3e6] text-2xl font-bold">{presaleData.tokensSold} MTK</p>
                    <p className="text-[#91a4b6] text-sm">of {presaleData.totalTokens} total</p>
                    <Progress value={tokenProgressPercentage} className="mt-2 bg-[#02080d] [&>div]:bg-[#00b3e6]" />
                  </div>
                </div>
                
                <Separator className="bg-[rgba(145,164,182,0.2)]" />
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Clock className="h-8 w-8 text-[#00b3e6] mx-auto mb-2" />
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
            <Card className="bg-[#020b0d] border-[rgba(145,164,182,0.2)] shadow-none">
              <CardHeader className="bg-[#020b0d]">
                <CardTitle className="text-[#d7dee4] text-xl">Purchase MyToken</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 bg-[#020b0d]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#02080d] p-4 rounded-lg">
                    <p className="text-[#91a4b6] text-sm">Current Price</p>
                    <p className="text-[#00b3e6] text-xl font-bold">${presaleData.currentPrice} USDT</p>
                  </div>
                  <div className="bg-[#02080d] p-4 rounded-lg">
                    <p className="text-[#91a4b6] text-sm">Wallet Address</p>
                    {isWalletConnected ? (
                      <div className="flex items-center gap-2">
                        <p className="text-[#00b3e6] text-sm font-mono truncate">{walletAddress}</p>
                        <Copy className="h-4 w-4 text-[#91a4b6] cursor-pointer hover:text-[#00b3e6] flex-shrink-0" />
                      </div>
                    ) : (
                      <p className="text-[#91a4b6] text-sm">Not Connected</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[#d7dee4] text-sm">Amount (USDT)</label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(e.target.value)}
                    className="bg-[#02080d] border-[rgba(145,164,182,0.2)] text-[#d7dee4]"
                  />
                  <div className="flex justify-between text-sm text-[#91a4b6]">
                    <span>Min: ${presaleData.minPurchase}</span>
                    <span>Max: ${presaleData.maxPurchase}</span>
                  </div>
                </div>

                {purchaseAmount && (
                  <div className="bg-[#02080d] p-4 rounded-lg">
                    <p className="text-[#91a4b6] text-sm">You will receive</p>
                    <p className="text-[#00b3e6] text-xl font-bold">{(parseFloat(purchaseAmount) / parseFloat(presaleData.currentPrice)).toLocaleString()} MTK</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Button disabled={!isWalletConnected || !purchaseAmount} className="w-full bg-[#00b3e6] text-[#000405] hover:bg-[#0099cc] border-0">
                    {!isWalletConnected ? "Connect Wallet First" : "Approve USDT"}
                  </Button>
                  <Button disabled={!isWalletConnected || !purchaseAmount} className="w-full bg-green-600 hover:bg-green-700 border-0">
                    Purchase Tokens
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - User Account & Stats */}
          <div className="space-y-6 bg-[#02080d]">
            {/* Wallet Balance */}
            <Card className="bg-[#020b0d] border-[rgba(145,164,182,0.2)] shadow-none">
              <CardHeader className="bg-[#020b0d]">
                <CardTitle className="text-[#d7dee4] text-lg flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Wallet Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 bg-[#020b0d]">
                <div>
                  <p className="text-[#91a4b6] text-sm">USDT Balance</p>
                  <p className="text-[#00b3e6] text-xl font-bold">{usdtBalance}</p>
                </div>
                <div>
                  <p className="text-[#91a4b6] text-sm">MyToken Balance</p>
                  <p className="text-[#00b3e6] text-xl font-bold">{mtokenBalance} MTK</p>
                </div>
              </CardContent>
            </Card>

            {/* Whitelist */}
            <Card className="bg-[#020b0d] border-[rgba(145,164,182,0.2)] shadow-none">
              <CardHeader className="bg-[#020b0d]">
                <CardTitle className="text-[#d7dee4] text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Whitelist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 bg-[#020b0d]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[#91a4b6] text-sm">Total Whitelisted</p>
                    <p className="text-[#00b3e6] text-lg font-bold">{whitelistAddresses.length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#91a4b6] text-sm">Your Status</p>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 text-sm font-medium">Whitelisted</span>
                    </div>
                  </div>
                </div>
                
                <Separator className="bg-[rgba(145,164,182,0.2)]" />
                
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  <p className="text-[#91a4b6] text-sm">Recent Addresses</p>
                  {whitelistAddresses.slice(-4).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-[#02080d] rounded-lg">
                      <div className="min-w-0 flex-1">
                        <p className="text-[#d7dee4] text-xs font-mono truncate">
                          {item.address}
                        </p>
                        <p className="text-[#91a4b6] text-xs">{item.joinedDate}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.status === "current" && (
                          <Badge className="bg-[#00b3e6] text-[#000405] text-xs border-0">You</Badge>
                        )}
                        <CheckCircle className="h-3 w-3 text-green-400 flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transaction History */}
        <Card className="bg-[#020b0d] border-[rgba(145,164,182,0.2)] w-full mb-6 shadow-none">
          <CardHeader className="bg-[#020b0d]">
            <CardTitle className="text-[#d7dee4] text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="bg-[#020b0d] overflow-x-auto">
            <div className="space-y-4 min-w-full">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-[#02080d] rounded-lg min-w-0">
                  <div className="flex items-center gap-4 min-w-0">
                    <DollarSign className="h-5 w-5 text-[#00b3e6] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[#d7dee4] font-medium">{tx.type}</p>
                      <p className="text-[#91a4b6] text-sm">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[#d7dee4] text-sm">{tx.amount} USDT → {tx.tokens} MTK</p>
                    <Badge className={tx.status === 'Completed' ? 'bg-green-600 border-0' : 'bg-yellow-600 border-0'}>
                      {tx.status}
                    </Badge>
                  </div>
                  <ExternalLink className="h-4 w-4 text-[#91a4b6] cursor-pointer hover:text-[#00b3e6] flex-shrink-0 ml-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="bg-[#02080d] h-12 shrink-0 w-full" />
      </div>
    </div>
  );
}