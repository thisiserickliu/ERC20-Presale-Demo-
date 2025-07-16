import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const TokenPurchase = ({ 
  account, 
  usdtAddress, // 新增
  presaleAddress, // 新增
  provider, // 新增
  presaleContract, 
  presaleInfo, 
  onPurchase, 
  isLoading, 
  error, 
  purchaseAmount, // 新增
  setPurchaseAmount, // 新增
  isWhitelisted // 新增
}) => {
  const [userInfo, setUserInfo] = useState(null);
  const [allowance, setAllowance] = useState('0');
  const [usdtBalance, setUsdtBalance] = useState('0');
  const [transactions, setTransactions] = useState([]);

  // 獲取用戶資訊
  const fetchUserInfo = async () => {
    if (!presaleContract || !account) return;
    try {
      // 這裡可以實作獲取用戶資訊的邏輯
      setUserInfo({
        tokensPurchased: '0',
        totalSpent: '0',
        isWhitelisted: false
      });
    } catch (err) {
      console.error('Error fetching user info:', err);
    }
  };

  // 獲取 USDT 餘額和授權額度
  const fetchBalances = async () => {
    if (!account || !usdtAddress || !presaleAddress || !provider) return;
    try {
      const usdtContract = new ethers.Contract(usdtAddress, [
        "function balanceOf(address owner) view returns (uint256)",
        "function allowance(address owner, address spender) view returns (uint256)",
        "function decimals() view returns (uint8)"
      ], provider);
      const usdtBalanceRaw = await usdtContract.balanceOf(account);
      const usdtAllowanceRaw = await usdtContract.allowance(account, presaleAddress);
      const usdtDecimals = await usdtContract.decimals();
      setUsdtBalance(ethers.utils.formatUnits(usdtBalanceRaw, usdtDecimals));
      setAllowance(ethers.utils.formatUnits(usdtAllowanceRaw, usdtDecimals));
    } catch (err) {
      console.error('Error fetching balances:', err);
    }
  };

  // 獲取交易歷史
  const fetchTransactions = async () => {
    if (!account) return;
    try {
      // 這裡可以實作獲取交易歷史的邏輯
      setTransactions([
        {
          hash: '0x123...',
          amount: '1000',
          timestamp: Date.now(),
          status: 'confirmed'
        }
      ]);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  useEffect(() => {
    if (account && provider && usdtAddress && presaleAddress) {
      fetchUserInfo();
      fetchBalances();
      fetchTransactions();
    }
  }, [account, provider, usdtAddress, presaleAddress]);

  const handlePurchase = () => {
    console.log('handlePurchase called');
    if (onPurchase) {
      onPurchase(); // 不要傳 purchaseAmount
    }
  };

  const canPurchase = presaleInfo && 
    !presaleInfo.presaleFinalized && 
    Date.now() >= presaleInfo.presaleStart * 1000 && 
    Date.now() <= presaleInfo.presaleEnd * 1000;

  function replacer(key, value) {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  }

  return (
    <>
      
      <div className="space-y-6">
      {/* User Info Panel */}
      {userInfo && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Tokens Purchased</p>
              <p className="text-xl font-bold text-primary-600">
                {parseFloat(userInfo.tokensPurchased).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-xl font-bold text-green-600">
                ${parseFloat(userInfo.totalSpent).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Whitelist Status</p>
              <p className={`text-xl font-bold ${userInfo.isWhitelisted ? 'text-green-600' : 'text-red-600'}`}> 
                {userInfo.isWhitelisted ? 'Whitelisted' : 'Not Whitelisted'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Balance Info */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Balances</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">USDT Balance</p>
            <p className="text-xl font-bold text-green-600">
              {parseFloat(usdtBalance).toLocaleString()} USDT
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">USDT Allowance</p>
            <p className="text-xl font-bold text-blue-600">
              {parseFloat(allowance).toLocaleString()} USDT
            </p>
          </div>
        </div>
      </div>

      {/* Purchase Form */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase Tokens</h3>
        {!canPurchase && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              {presaleInfo?.presaleFinalized 
                ? 'Presale Ended' 
                : 'Presale not started or already ended'
              }
            </p>
          </div>
        )}
        {/* 新增：未在白名單時顯示提示 */}
        {canPurchase && !isWhitelisted && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">您尚未在白名單，請先申請加入白名單才能購買。</p>
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount of Tokens to Purchase
            </label>
            <input
              type="number"
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={!canPurchase || isLoading || !isWhitelisted}
            />
            {purchaseAmount && presaleInfo && (
              <p className="mt-1 text-sm text-gray-500">
                Cost: ${(parseFloat(purchaseAmount || '0') * parseFloat(ethers.utils.formatUnits(presaleInfo.tokenPrice, 6))).toFixed(2)} USDT
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => { console.log('purchase click!'); handlePurchase(); }}
            disabled={!canPurchase || isLoading || !purchaseAmount || !isWhitelisted}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Purchase Tokens'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Transaction History */}
      {transactions.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction History</h3>
          <div className="space-y-3">
            {transactions.map((tx, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Purchase {tx.amount} tokens</p>
                  <p className="text-sm text-gray-500">{tx.hash}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  tx.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {tx.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default TokenPurchase; 