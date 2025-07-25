require("dotenv").config();

function validateEnvironment() {
  console.log("🔍 驗證環境變數...");
  console.log("================================");
  
  let isValid = true;
  
  // 檢查 PRIVATE_KEY
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey === "your_private_key_here") {
    console.log("❌ PRIVATE_KEY: 未設置或使用默認值");
    isValid = false;
  } else if (!privateKey.startsWith('0x') || privateKey.length !== 66) {
    console.log("❌ PRIVATE_KEY: 格式錯誤，應該是 0x + 64 位十六進制字符");
    isValid = false;
  } else {
    console.log("✅ PRIVATE_KEY: 格式正確");
  }
  
  // 檢查 SEPOLIA_RPC_URL
  const sepoliaRpcUrl = process.env.SEPOLIA_RPC_URL;
  if (!sepoliaRpcUrl || sepoliaRpcUrl === "https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID") {
    console.log("❌ SEPOLIA_RPC_URL: 未設置或使用默認值");
    isValid = false;
  } else if (!sepoliaRpcUrl.includes('sepolia')) {
    console.log("❌ SEPOLIA_RPC_URL: 不是 Sepolia 網絡 URL");
    isValid = false;
  } else {
    console.log("✅ SEPOLIA_RPC_URL: 已設置");
  }
  
  // 檢查 ETHERSCAN_API_KEY（可選）
  const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
  if (!etherscanApiKey || etherscanApiKey === "your_etherscan_api_key_here") {
    console.log("⚠️  ETHERSCAN_API_KEY: 未設置（可選，用於合約驗證）");
  } else {
    console.log("✅ ETHERSCAN_API_KEY: 已設置");
  }
  
  console.log("================================");
  
  if (isValid) {
    console.log("🎉 環境變數驗證通過！可以開始部署。");
    console.log("\n📋 下一步：");
    console.log("1. 確保錢包有 Sepolia ETH");
    console.log("2. 運行: npx hardhat run scripts/deploy-sepolia.js --network sepolia");
  } else {
    console.log("❌ 環境變數驗證失敗！請檢查 SETUP_SEPOLIA_ENV.md");
    console.log("\n📋 需要設置：");
    console.log("1. 從 MetaMask 導出私鑰");
    console.log("2. 獲取 Infura/Alchemy RPC URL");
    console.log("3. 編輯 .env 文件");
  }
  
  return isValid;
}

// 如果直接運行此腳本
if (require.main === module) {
  validateEnvironment();
}

module.exports = { validateEnvironment }; 