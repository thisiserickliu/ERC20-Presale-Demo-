import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function TransactionHistory({ account, provider, presaleAddress, presaleABI }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // 載入交易歷史
  const loadTransactionHistory = async () => {
    if (!account || !provider) return;

    try {
      setLoading(true);
      const presale = new ethers.Contract(presaleAddress, presaleABI, provider);
      
      // 獲取區塊範圍（最近 10000 個區塊）
      const currentBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 10000);
      
      // 監聽 TokensPurchased 事件 - 修正過濾器語法
      const filter = {
        address: presaleAddress,
        topics: [
          ethers.id("TokensPurchased(address,uint256,uint256)"),
          ethers.zeroPadValue(account, 32) // 過濾特定用戶
        ]
      };
      
      const events = await provider.getLogs({
        ...filter,
        fromBlock: fromBlock,
        toBlock: currentBlock
      });
      
      const txHistory = await Promise.all(
        events.map(async (event) => {
          const block = await provider.getBlock(event.blockNumber);
          // 解析事件參數
          const decoded = ethers.AbiCoder.defaultAbiCoder().decode(
            ['address', 'uint256', 'uint256'],
            ethers.dataSlice(event.data, 0)
          );
          
          return {
            hash: event.transactionHash,
            amount: ethers.formatUnits(decoded[1], 18),
            cost: ethers.formatUnits(decoded[2], 6), // USDT 6 decimals
            timestamp: block.timestamp,
            blockNumber: event.blockNumber
          };
        })
      );
      
      // 按時間排序（最新的在前）
      txHistory.sort((a, b) => b.timestamp - a.timestamp);
      setTransactions(txHistory);
    } catch (error) {
      console.error('Error loading transaction history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactionHistory();
  }, [account, provider]);

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const shortenHash = (hash) => {
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  if (!account) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-medium mb-2">Please connect wallet</h3>
          <p className="text-gray-600">Connect your wallet to view transaction history</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Transaction History</h3>
        <button
          onClick={loadTransactionHistory}
          disabled={loading}
          className="btn-secondary text-sm px-3 py-1"
        >
          {loading ? 'Loading...' : '🔄 Refresh'}
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading transaction history...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-medium mb-2">No transaction records yet</h3>
          <p className="text-gray-600">Your token purchases will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✅</span>
                  <span className="font-medium">Purchase Successful</span>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(tx.timestamp)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-sm text-gray-600">Amount Purchased</div>
                  <div className="font-semibold text-blue-600">
                    {parseFloat(tx.amount).toLocaleString()} TOKEN
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Amount Paid</div>
                  <div className="font-semibold text-green-600">
                    {parseFloat(tx.cost).toLocaleString()} USDT
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <span>Block:</span>
                  <span className="font-mono">{tx.blockNumber}</span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(tx.hash);
                    alert('Transaction hash copied to clipboard');
                  }}
                  className="text-blue-600 hover:text-blue-800 font-mono"
                  title="Copy transaction hash"
                >
                  {shortenHash(tx.hash)}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {transactions.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Total {transactions.length} transaction records
        </div>
      )}
    </div>
  );
} 