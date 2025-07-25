#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 啟動本地開發環境...');
console.log('================================');

// 檢查必要的目錄是否存在
const blockchainDir = path.join(__dirname, 'blockchain');
const frontendDir = path.join(__dirname, 'frontend');

if (!fs.existsSync(blockchainDir)) {
  console.error('❌ blockchain 目錄不存在');
  process.exit(1);
}

if (!fs.existsSync(frontendDir)) {
  console.error('❌ frontend 目錄不存在');
  process.exit(1);
}

// 檢查 Hardhat 節點是否已經運行
async function checkHardhatNode() {
  try {
    const response = await fetch('http://127.0.0.1:8545', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.result) {
        return true;
      }
    }
  } catch (error) {
    // 節點未運行
  }
  return false;
}

async function startDevelopment() {
  console.log('1️⃣ 檢查 Hardhat 節點狀態...');
  
  const isNodeRunning = await checkHardhatNode();
  
  if (!isNodeRunning) {
    console.log('⚠️  Hardhat 節點未運行，正在啟動...');
    console.log('💡 請在新的終端窗口中運行: cd blockchain && npx hardhat node');
    console.log('   然後重新運行此腳本');
    console.log('');
    console.log('🔧 或者您可以手動執行以下步驟:');
    console.log('   1. cd blockchain');
    console.log('   2. npx hardhat node (保持運行)');
    console.log('   3. 在新的終端: npx hardhat run scripts/quick-start.js --network localhost');
    console.log('   4. cd frontend && npm start');
    process.exit(0);
  } else {
    console.log('✅ Hardhat 節點正在運行');
  }
  
  console.log('');
  console.log('2️⃣ 檢查合約是否已部署...');
  
  // 檢查合約是否已部署（簡單檢查）
  try {
    const response = await fetch('http://127.0.0.1:8545', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getCode',
        params: ['0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0', 'latest'],
        id: 1
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.result && data.result !== '0x') {
        console.log('✅ 預售合約已部署');
      } else {
        console.log('⚠️  合約未部署，正在部署...');
        console.log('💡 請在新的終端窗口中運行:');
        console.log('   cd blockchain && npx hardhat run scripts/quick-start.js --network localhost');
        process.exit(0);
      }
    }
  } catch (error) {
    console.log('⚠️  無法檢查合約狀態');
  }
  
  console.log('');
  console.log('3️⃣ 啟動前端應用...');
  
  // 啟動前端
  const frontendProcess = spawn('npm', ['start'], {
    cwd: frontendDir,
    stdio: 'inherit',
    shell: true
  });
  
  frontendProcess.on('error', (error) => {
    console.error('❌ 啟動前端失敗:', error.message);
    process.exit(1);
  });
  
  frontendProcess.on('close', (code) => {
    console.log(`前端應用已關閉，退出碼: ${code}`);
    process.exit(code);
  });
  
  console.log('✅ 前端應用正在啟動...');
  console.log('🌐 請在瀏覽器中打開: http://localhost:3000');
  console.log('');
  console.log('📋 使用說明:');
  console.log('   1. 確保 MetaMask 已安裝並解鎖');
  console.log('   2. 在 MetaMask 中添加本地網絡:');
  console.log('      - 網絡名稱: Hardhat Local');
  console.log('      - RPC URL: http://127.0.0.1:8545');
  console.log('      - Chain ID: 1337');
  console.log('   3. 連接錢包並測試功能');
  console.log('');
  console.log('🔧 測試帳戶 (在 MetaMask 中導入私鑰):');
  console.log('   帳戶 1: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
  console.log('   帳戶 2: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
  console.log('   帳戶 3: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC');
}

// 檢查 fetch 是否可用（Node.js 18+）
if (typeof fetch === 'undefined') {
  console.error('❌ 需要 Node.js 18+ 或安裝 node-fetch');
  process.exit(1);
}

startDevelopment().catch(console.error); 