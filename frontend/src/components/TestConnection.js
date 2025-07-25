import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { NETWORKS, CURRENT_NETWORK, getCurrentConfig } from '../constants';

export default function TestConnection() {
  const [connectionStatus, setConnectionStatus] = useState('未連接');
  const [networkInfo, setNetworkInfo] = useState({});
  const [contractData, setContractData] = useState({});
  const [error, setError] = useState('');

  const testConnection = async () => {
    try {
      setConnectionStatus('測試中...');
      setError('');

      // 檢查 MetaMask
      if (typeof window.ethereum === 'undefined') {
        setError('MetaMask 未安裝');
        setConnectionStatus('失敗');
        return;
      }

      // 連接錢包
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (accounts.length === 0) {
        setError('未找到賬戶');
        setConnectionStatus('失敗');
        return;
      }

      // 檢查網絡
      const network = await provider.getNetwork();
      const expectedNetwork = NETWORKS[CURRENT_NETWORK];
      
      setNetworkInfo({
        connected: network.chainId === expectedNetwork.chainId,
        expected: expectedNetwork,
        actual: network,
        account: accounts[0]
      });

      if (network.chainId !== expectedNetwork.chainId) {
        setError(`網絡不匹配！期望: ${expectedNetwork.chainId}, 實際: ${network.chainId}`);
        setConnectionStatus('網絡錯誤');
        return;
      }

      // 測試合約連接
      const config = getCurrentConfig();
      const presale = new ethers.Contract(config.PRESALE_ADDRESS, [
        "function getPresaleInfo() public view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, bool, bool)",
        "function getUserInfo(address user) public view returns (uint256, bool)"
      ], provider);

      const presaleInfo = await presale.getPresaleInfo();
      const userInfo = await presale.getUserInfo(accounts[0]);

      setContractData({
        tokenPrice: ethers.utils.formatUnits(presaleInfo[0], 6),
        minPurchase: ethers.utils.formatUnits(presaleInfo[1], 18),
        maxPurchase: ethers.utils.formatUnits(presaleInfo[2], 18),
        totalForSale: ethers.utils.formatUnits(presaleInfo[3], 18),
        tokensSold: ethers.utils.formatUnits(presaleInfo[4], 18),
        totalRaised: ethers.utils.formatUnits(presaleInfo[5], 6),
        presaleStart: new Date(Number(presaleInfo[6]) * 1000).toLocaleString(),
        presaleEnd: new Date(Number(presaleInfo[7]) * 1000).toLocaleString(),
        presaleFinalized: presaleInfo[8],
        whitelistEnabled: presaleInfo[9],
        userPurchased: ethers.utils.formatUnits(userInfo[0], 18),
        userWhitelisted: userInfo[1]
      });

      setConnectionStatus('成功');
    } catch (error) {
      console.error('測試失敗:', error);
      setError(error.message);
      setConnectionStatus('失敗');
    }
  };

  return (
    <div className="p-6 bg-[#02080d] text-white">
      <h1 className="text-2xl font-bold mb-6">連接測試</h1>
      
      <button 
        onClick={testConnection}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mb-4"
      >
        測試連接
      </button>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">連接狀態: {connectionStatus}</h2>
        {error && <p className="text-red-400 mb-2">錯誤: {error}</p>}
      </div>

      {networkInfo.connected && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">網絡信息</h2>
          <div className="bg-gray-800 p-4 rounded">
            <p>期望網絡: {networkInfo.expected?.name} (Chain ID: {networkInfo.expected?.chainId})</p>
            <p>實際網絡: {networkInfo.actual?.name} (Chain ID: {networkInfo.actual?.chainId})</p>
            <p>賬戶: {networkInfo.account}</p>
          </div>
        </div>
      )}

      {contractData.tokenPrice && (
        <div>
          <h2 className="text-lg font-semibold mb-2">合約數據</h2>
          <div className="bg-gray-800 p-4 rounded space-y-2">
            <p>Token Price: {contractData.tokenPrice} USDT</p>
            <p>Min Purchase: {contractData.minPurchase} MTK</p>
            <p>Max Purchase: {contractData.maxPurchase} MTK</p>
            <p>Total for Sale: {contractData.totalForSale} MTK</p>
            <p>Tokens Sold: {contractData.tokensSold} MTK</p>
            <p>Total Raised: {contractData.totalRaised} USDT</p>
            <p>Presale Start: {contractData.presaleStart}</p>
            <p>Presale End: {contractData.presaleEnd}</p>
            <p>Presale Finalized: {contractData.presaleFinalized ? 'Yes' : 'No'}</p>
            <p>Whitelist Enabled: {contractData.whitelistEnabled ? 'Yes' : 'No'}</p>
            <p>User Purchased: {contractData.userPurchased} MTK</p>
            <p>User Whitelisted: {contractData.userWhitelisted ? 'Yes' : 'No'}</p>
          </div>
        </div>
      )}
    </div>
  );
} 