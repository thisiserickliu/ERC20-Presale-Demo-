import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function UserDashboard({ account, provider, presaleAddress, presaleABI, tokenAddress, usdtAddress }) {
  const [userInfo, setUserInfo] = useState({
    purchased: '0',
    whitelisted: false,
    tokenBalance: '0',
    usdtBalance: '0',
    usdtAllowance: '0'
  });
  const [loading, setLoading] = useState(false);

  // 載入用戶資訊
  const loadUserInfo = async () => {
    if (!account || !provider) return;

    try {
      setLoading(true);
      const presale = new ethers.Contract(presaleAddress, presaleABI, provider);
      
      // 獲取用戶購買資訊
      const userData = await presale.getUserInfo(account);
      
      // 獲取代幣餘額
      const tokenContract = new ethers.Contract(tokenAddress, [
        "function balanceOf(address owner) view returns (uint256)",
        "function decimals() view returns (uint8)"
      ], provider);
      
      const tokenBalance = await tokenContract.balanceOf(account);
      const tokenDecimals = await tokenContract.decimals();
      
      // 獲取 USDT 餘額和授權
      console.log('[DEBUG] USDT 查詢參數', { usdtAddress, account, presaleAddress });
      const usdtContract = new ethers.Contract(usdtAddress, [
        "function balanceOf(address owner) view returns (uint256)",
        "function allowance(address owner, address spender) view returns (uint256)",
        "function decimals() view returns (uint8)"
      ], provider);
      const usdtBalance = await usdtContract.balanceOf(account);
      const usdtAllowance = await usdtContract.allowance(account, presaleAddress);
      const usdtDecimals = await usdtContract.decimals();
      console.log('[DEBUG] USDT 查詢結果', {
        usdtBalance: usdtBalance.toString(),
        usdtAllowance: usdtAllowance.toString(),
        usdtDecimals
      });
      
      setUserInfo({
        purchased: ethers.formatUnits(userData[0], 18),
        whitelisted: userData[1],
        tokenBalance: ethers.formatUnits(tokenBalance, tokenDecimals),
        usdtBalance: ethers.formatUnits(usdtBalance, usdtDecimals),
        usdtAllowance: ethers.formatUnits(usdtAllowance, usdtDecimals)
      });
    } catch (error) {
      console.error('Error loading user info:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserInfo();
    // 每 30 秒更新一次
    const interval = setInterval(loadUserInfo, 30000);
    return () => clearInterval(interval);
  }, [account, provider]);

  if (!account) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">👤</div>
          <h3 className="text-lg font-medium mb-2">Please connect your wallet</h3>
          <p className="text-gray-600">Connect your wallet to view your information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">User Dashboard</h3>
      
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Wallet Address */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600 mb-1">Wallet Address</div>
            <div className="font-mono text-sm break-all">
              {account}
            </div>
          </div>

          {/* Purchase Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-sm text-gray-600 mb-1">Tokens Purchased</div>
              <div className="text-lg font-bold text-blue-600">
                {parseFloat(userInfo.purchased).toLocaleString()} TOKEN
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-sm text-gray-600 mb-1">Token Balance</div>
              <div className="text-lg font-bold text-green-600">
                {parseFloat(userInfo.tokenBalance).toLocaleString()} TOKEN
              </div>
            </div>
          </div>

          {/* USDT Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-yellow-50 rounded-lg p-3">
              <div className="text-sm text-gray-600 mb-1">USDT Balance</div>
              <div className="text-lg font-bold text-yellow-600">
                {Number(userInfo.usdtBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-sm text-gray-600 mb-1">USDT Allowance</div>
              <div className="text-lg font-bold text-purple-600">
                {userInfo.usdtAllowance} USDT
              </div>
            </div>
          </div>

          {/* Whitelist Status */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Whitelist Status</div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                userInfo.whitelisted 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {userInfo.whitelisted ? '✅ Whitelisted' : '❌ Not Whitelisted'}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h4>
            <div className="flex space-x-2">
              <button
                onClick={loadUserInfo}
                className="btn-secondary text-sm px-3 py-1"
              >
                🔄 Refresh
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(account);
                  alert('Address copied to clipboard');
                }}
                className="btn-secondary text-sm px-3 py-1"
              >
                📋 Copy Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 