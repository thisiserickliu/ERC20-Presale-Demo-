import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { NETWORKS, CURRENT_NETWORK } from '../constants';

const NetworkSwitcher = ({ onNetworkChange }) => {
  const [currentNetwork, setCurrentNetwork] = useState(CURRENT_NETWORK);
  const [isConnected, setIsConnected] = useState(false);
  const [walletChainId, setWalletChainId] = useState(null);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        setWalletChainId(network.chainId);
        setIsConnected(true);
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const switchNetwork = async (networkKey) => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const network = NETWORKS[networkKey];
        const chainIdHex = '0x' + network.chainId.toString(16);
        
        // 嘗試切換到網絡
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainIdHex }]
          });
        } catch (switchError) {
          // 如果網絡不存在，添加網絡
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: chainIdHex,
                chainName: network.name,
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: [network.rpcUrl],
                blockExplorerUrls: network.explorer ? [network.explorer] : []
              }]
            });
          } else {
            throw switchError;
          }
        }
        
        setCurrentNetwork(networkKey);
        if (onNetworkChange) {
          onNetworkChange(networkKey);
        }
        
        // 重新檢查連接
        await checkWalletConnection();
      }
    } catch (error) {
      console.error('Error switching network:', error);
      alert('Failed to switch network: ' + error.message);
    }
  };

  const getNetworkStatus = () => {
    if (!isConnected) return 'Not Connected';
    
    const expectedChainId = NETWORKS[currentNetwork].chainId;
    if (walletChainId === expectedChainId) {
      return 'Connected';
    } else {
      return 'Wrong Network';
    }
  };

  const getStatusColor = () => {
    const status = getNetworkStatus();
    switch (status) {
      case 'Connected':
        return 'text-green-400';
      case 'Wrong Network':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  return (
    <div className="bg-[#02080d] border border-[#1a2a3a] rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#d7dee4] font-semibold">Network Configuration</h3>
        <div className={`text-sm font-medium ${getStatusColor()}`}>
          {getNetworkStatus()}
        </div>
      </div>
      
      <div className="space-y-3">
        {Object.entries(NETWORKS).map(([key, network]) => (
          <div
            key={key}
            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
              currentNetwork === key
                ? 'bg-[#00b3e6]/10 border-[#00b3e6]/30'
                : 'bg-[#0a1419] border-[#1a2a3a] hover:bg-[#0f1a24]'
            }`}
            onClick={() => switchNetwork(key)}
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                currentNetwork === key ? 'bg-[#00b3e6]' : 'bg-[#4a5568]'
              }`} />
              <div>
                <div className="text-[#d7dee4] font-medium">{network.name}</div>
                <div className="text-[#91a4b6] text-sm">Chain ID: {network.chainId}</div>
              </div>
            </div>
            
            <div className="text-right">
              {currentNetwork === key && (
                <div className="text-[#00b3e6] text-sm font-medium">Active</div>
              )}
              {walletChainId === network.chainId && (
                <div className="text-green-400 text-sm">Connected</div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-[#0a1419] rounded-lg">
        <div className="text-[#91a4b6] text-sm mb-2">Current Configuration:</div>
        <div className="text-[#d7dee4] text-sm">
          Network: {NETWORKS[currentNetwork].name}
        </div>
        <div className="text-[#d7dee4] text-sm">
          Chain ID: {NETWORKS[currentNetwork].chainId}
        </div>
        {NETWORKS[currentNetwork].explorer && (
          <div className="text-[#d7dee4] text-sm">
            Explorer: {NETWORKS[currentNetwork].explorer}
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkSwitcher; 