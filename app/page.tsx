'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { useState, useEffect } from 'react'
import { formatEther, parseEther } from 'viem'
import { PresaleStats } from './components/PresaleStats'
import { TokenPurchase } from './components/TokenPurchase'
import { PresaleInfo } from './components/PresaleInfo'

// Contract addresses (replace with your deployed addresses)
const PRESALE_ADDRESS = '0x...' // Your presale contract address
const TOKEN_ADDRESS = '0x...' // Your token contract address
const USDT_ADDRESS = '0x...' // Your USDT contract address

export default function Home() {
  const { address, isConnected } = useAccount()
  const [purchaseAmount, setPurchaseAmount] = useState('')
  const [presaleInfo, setPresaleInfo] = useState<any>(null)

  // Read presale info
  const { data: presaleData } = useContractRead({
    address: PRESALE_ADDRESS as `0x${string}`,
    abi: [
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
      }
    ],
    functionName: 'getPresaleInfo',
  })

  // Prepare purchase transaction
  const { config } = usePrepareContractWrite({
    address: PRESALE_ADDRESS as `0x${string}`,
    abi: [
      {
        inputs: [{ name: "amount", type: "uint256" }],
        name: "buyTokens",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      }
    ],
    functionName: 'buyTokens',
    args: purchaseAmount ? [parseEther(purchaseAmount)] : undefined,
    enabled: !!purchaseAmount && parseFloat(purchaseAmount) > 0,
  })

  const { data: purchaseData, write: purchaseTokens } = useContractWrite(config)

  const { isLoading: isPurchasing, isSuccess: isPurchaseSuccess } = useWaitForTransaction({
    hash: purchaseData?.hash,
  })

  useEffect(() => {
    if (presaleData) {
      setPresaleInfo({
        tokenPrice: formatEther(presaleData[0]),
        minPurchase: formatEther(presaleData[1]),
        maxPurchase: formatEther(presaleData[2]),
        totalTokensForSale: formatEther(presaleData[3]),
        tokensSold: formatEther(presaleData[4]),
        totalRaised: formatEther(presaleData[5]),
        presaleStart: Number(presaleData[6]),
        presaleEnd: Number(presaleData[7]),
        presaleFinalized: presaleData[8],
        whitelistEnabled: presaleData[9],
      })
    }
  }, [presaleData])

  const handlePurchase = () => {
    if (purchaseTokens) {
      purchaseTokens()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">ERC20 Presale</h1>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected ? (
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Our Token Presale
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Connect your wallet to participate in the presale
            </p>
            <ConnectButton />
          </div>
        ) : (
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
                onPurchase={handlePurchase}
                isPurchasing={isPurchasing}
                presaleInfo={presaleInfo}
              />
            </div>
          </div>
        )}

        {/* Presale Information */}
        <div className="mt-12">
          <PresaleInfo presaleInfo={presaleInfo} />
        </div>
      </main>
    </div>
  )
} 