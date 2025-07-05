'use client'

import { useState } from 'react'

interface TokenPurchaseProps {
  purchaseAmount: string
  setPurchaseAmount: (amount: string) => void
  onPurchase: () => void
  isPurchasing: boolean
  presaleInfo: any
}

export function TokenPurchase({
  purchaseAmount,
  setPurchaseAmount,
  onPurchase,
  isPurchasing,
  presaleInfo
}: TokenPurchaseProps) {
  const [usdtAmount, setUsdtAmount] = useState('')

  const handleTokenAmountChange = (value: string) => {
    setPurchaseAmount(value)
    if (presaleInfo && value) {
      const tokens = parseFloat(value)
      const usdt = tokens * parseFloat(presaleInfo.tokenPrice)
      setUsdtAmount(usdt.toFixed(2))
    } else {
      setUsdtAmount('')
    }
  }

  const handleUsdtAmountChange = (value: string) => {
    setUsdtAmount(value)
    if (presaleInfo && value) {
      const usdt = parseFloat(value)
      const tokens = usdt / parseFloat(presaleInfo.tokenPrice)
      setPurchaseAmount(tokens.toFixed(2))
    } else {
      setPurchaseAmount('')
    }
  }

  const isActive = presaleInfo && !presaleInfo.presaleFinalized && 
    Date.now() >= presaleInfo.presaleStart * 1000 && 
    Date.now() <= presaleInfo.presaleEnd * 1000

  const isValidAmount = purchaseAmount && 
    parseFloat(purchaseAmount) >= parseFloat(presaleInfo?.minPurchase || '0') &&
    parseFloat(purchaseAmount) <= parseFloat(presaleInfo?.maxPurchase || '0')

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Purchase Tokens</h2>
      
      {!isActive ? (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">
            {presaleInfo?.presaleFinalized ? (
              <p>Presale has been finalized</p>
            ) : (
              <p>Presale is not active</p>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Token Amount Input */}
          <div className="mb-4">
            <label htmlFor="tokenAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Token Amount
            </label>
            <div className="relative">
              <input
                type="number"
                id="tokenAmount"
                value={purchaseAmount}
                onChange={(e) => handleTokenAmountChange(e.target.value)}
                placeholder="Enter token amount"
                className="input-field pr-12"
                min={presaleInfo?.minPurchase}
                max={presaleInfo?.maxPurchase}
                step="1"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 text-sm">MTK</span>
              </div>
            </div>
          </div>

          {/* USDT Amount Display */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              USDT Amount
            </label>
            <div className="relative">
              <input
                type="number"
                value={usdtAmount}
                onChange={(e) => handleUsdtAmountChange(e.target.value)}
                placeholder="0.00"
                className="input-field pr-12"
                step="0.01"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 text-sm">USDT</span>
              </div>
            </div>
          </div>

          {/* Purchase Button */}
          <button
            onClick={onPurchase}
            disabled={!isValidAmount || isPurchasing}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
              isValidAmount && !isPurchasing
                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isPurchasing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              'Purchase Tokens'
            )}
          </button>

          {/* Validation Messages */}
          {purchaseAmount && !isValidAmount && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                {parseFloat(purchaseAmount) < parseFloat(presaleInfo?.minPurchase || '0')
                  ? `Minimum purchase is ${parseFloat(presaleInfo?.minPurchase || '0').toLocaleString()} tokens`
                  : `Maximum purchase is ${parseFloat(presaleInfo?.maxPurchase || '0').toLocaleString()} tokens`
                }
              </p>
            </div>
          )}

          {/* Price Info */}
          {presaleInfo && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-600">
                Price: ${parseFloat(presaleInfo.tokenPrice).toFixed(2)} USDT per token
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
} 