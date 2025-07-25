import React, { useState } from 'react';
import { ethers } from 'ethers';
import { PRESALE_ADDRESS, PRESALE_ABI } from '../constants';

export default function SimpleTest() {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const testContract = async () => {
    try {
      setError('');
      setResult('Testing...');

      if (typeof window.ethereum === 'undefined') {
        setError('MetaMask not found');
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (accounts.length === 0) {
        setError('No accounts found');
        return;
      }

      console.log('Provider:', provider);
      console.log('Account:', accounts[0]);
      console.log('Presale address:', PRESALE_ADDRESS);

      // 測試基本網絡連接
      console.log('=== Basic Network Test ===');
      
      // 測試 1: 檢查網絡
      console.log('Test 1: Checking network...');
      try {
        const network = await provider.getNetwork();
        console.log('Network result:', network);
      } catch (networkError) {
        console.error('Network check failed:', networkError);
      }
      
      // 測試 2: 檢查賬戶
      console.log('Test 2: Checking accounts...');
      try {
        const accounts2 = await provider.listAccounts();
        console.log('Accounts result:', accounts2);
      } catch (accountsError) {
        console.error('Accounts check failed:', accountsError);
      }
      
      // 測試 3: 檢查區塊號
      console.log('Test 3: Checking block number...');
      try {
        const blockNumber = await provider.getBlockNumber();
        console.log('Block number result:', blockNumber);
      } catch (blockError) {
        console.error('Block number check failed:', blockError);
        console.error('Block error details:', {
          message: blockError.message,
          code: blockError.code,
          data: blockError.data
        });
      }
      
      // 測試 4: 檢查餘額
      console.log('Test 4: Checking balance...');
      try {
        const balance = await provider.getBalance(accounts[0]);
        console.log('Balance result:', ethers.utils.formatEther(balance), 'ETH');
      } catch (balanceError) {
        console.error('Balance check failed:', balanceError);
        console.error('Balance error details:', {
          message: balanceError.message,
          code: balanceError.code,
          data: balanceError.data
        });
      }
      
      // 測試 5: 檢查合約代碼
      console.log('Test 5: Checking contract code...');
      try {
        const code = await provider.getCode(PRESALE_ADDRESS);
        console.log('Contract code result:', code);
        console.log('Contract has code:', code !== '0x');
      } catch (codeError) {
        console.error('Contract code check failed:', codeError);
        console.error('Code error details:', {
          message: codeError.message,
          code: codeError.code,
          data: codeError.data
        });
      }
      
      // 測試 6: 直接測試合約調用
      console.log('Test 6: Direct contract call...');
      try {
        const contract = new ethers.Contract(PRESALE_ADDRESS, PRESALE_ABI, provider);
        console.log('Contract created successfully');
        
        const tokenPrice = await contract.tokenPrice();
        console.log('Token price result:', tokenPrice);
        console.log('Token price (formatted):', ethers.utils.formatUnits(tokenPrice, 6), 'USDT');
      } catch (contractError) {
        console.error('Contract call failed:', contractError);
        console.error('Contract error details:', {
          message: contractError.message,
          code: contractError.code,
          data: contractError.data
        });
      }

      setResult('Basic network test completed. Check console for details.');
    } catch (err) {
      console.error('Test failed:', err);
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        data: err.data,
        stack: err.stack
      });
      setError(`Error: ${err.message}`);
      setResult('');
    }
  };

  return (
    <div className="p-6 bg-[#02080d] text-white">
      <h1 className="text-2xl font-bold mb-4">Simple Contract Test</h1>
      
      <button 
        onClick={testContract}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mb-4"
      >
        Test Contract
      </button>

      {result && (
        <div className="mb-4 p-4 bg-green-800 rounded">
          <p className="text-green-200">{result}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-800 rounded">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      <div className="text-sm text-gray-400">
        <p>Presale Address: {PRESALE_ADDRESS}</p>
        <p>Check browser console for detailed logs</p>
      </div>
    </div>
  );
} 