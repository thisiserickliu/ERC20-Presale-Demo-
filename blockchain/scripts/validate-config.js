const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🔍 Validating Sepolia configuration...");
  
  // 檢查環境變數
  const requiredVars = [
    'PRIVATE_KEY',
    'SEPOLIA_RPC_URL'
  ];
  
  const missingVars = [];
  
  for (const varName of requiredVars) {
    if (!process.env[varName] || process.env[varName].includes('YOUR_') || process.env[varName].includes('your_')) {
      missingVars.push(varName);
    }
  }
  
  if (missingVars.length > 0) {
    console.log("❌ Missing or invalid environment variables:");
    missingVars.forEach(varName => {
      console.log(`   - ${varName}: ${process.env[varName] || 'NOT SET'}`);
    });
    console.log("\n📋 Please update your .env file with real values.");
    return;
  }
  
  // 驗證私鑰格式
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey.startsWith('0x') || privateKey.length !== 66) {
    console.log("❌ Invalid private key format:");
    console.log(`   Expected: 0x + 64 hex characters`);
    console.log(`   Got: ${privateKey}`);
    console.log(`   Length: ${privateKey.length}`);
    return;
  }
  
  // 驗證私鑰是否為有效的十六進制
  try {
    new ethers.Wallet(privateKey);
    console.log("✅ Private key format is valid");
  } catch (error) {
    console.log("❌ Invalid private key:", error.message);
    return;
  }
  
  // 驗證 RPC URL
  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  if (!rpcUrl.includes('infura.io') && !rpcUrl.includes('alchemy.com')) {
    console.log("⚠️  RPC URL doesn't look like Infura or Alchemy");
    console.log(`   URL: ${rpcUrl}`);
  }
  
  // 測試網絡連接
  console.log("\n🌐 Testing network connection...");
  try {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const network = await provider.getNetwork();
    console.log("✅ Network connection successful");
    console.log(`   Network: ${network.name}`);
    console.log(`   Chain ID: ${network.chainId}`);
    
    if (network.chainId !== 11155111) {
      console.log("⚠️  Warning: Chain ID is not Sepolia (11155111)");
    }
    
  } catch (error) {
    console.log("❌ Network connection failed:", error.message);
    return;
  }
  
  // 檢查錢包餘額
  console.log("\n💰 Checking wallet balance...");
  try {
    const wallet = new ethers.Wallet(privateKey);
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const balance = await provider.getBalance(wallet.address);
    const balanceEth = ethers.utils.formatEther(balance);
    
    console.log(`   Address: ${wallet.address}`);
    console.log(`   Balance: ${balanceEth} ETH`);
    
    if (parseFloat(balanceEth) < 0.01) {
      console.log("⚠️  Warning: Low balance. You need at least 0.01 ETH for deployment.");
      console.log("   Get Sepolia ETH from: https://sepoliafaucet.com/");
    } else {
      console.log("✅ Sufficient balance for deployment");
    }
    
  } catch (error) {
    console.log("❌ Error checking balance:", error.message);
  }
  
  // 檢查可選配置
  console.log("\n🔧 Optional configuration:");
  
  if (process.env.ETHERSCAN_API_KEY && !process.env.ETHERSCAN_API_KEY.includes('YOUR_')) {
    console.log("✅ Etherscan API key is set");
  } else {
    console.log("⚠️  Etherscan API key not set (optional for verification)");
  }
  
  if (process.env.REPORT_GAS === 'true') {
    console.log("✅ Gas reporting is enabled");
  } else {
    console.log("ℹ️  Gas reporting is disabled");
  }
  
  console.log("\n🎉 Configuration validation complete!");
  console.log("You can now run: npx hardhat run scripts/deploy-sepolia.js --network sepolia");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 