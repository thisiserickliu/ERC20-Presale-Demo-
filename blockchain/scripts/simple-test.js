const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 簡單測試合約功能...");
  
  try {
    // 獲取合約實例
    const presaleAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const presale = await ethers.getContractAt("Presale", presaleAddress);
    
    console.log("\n📋 合約地址:");
    console.log("Presale:", presaleAddress);
    
    // 測試基本連接 - 使用簡單的 getter
    console.log("\n🔗 測試基本連接:");
    try {
      const tokenAddress = await presale.token();
      console.log("✅ Token Address:", tokenAddress);
      
      const paymentTokenAddress = await presale.paymentToken();
      console.log("✅ Payment Token Address:", paymentTokenAddress);
      
      const owner = await presale.owner();
      console.log("✅ Owner:", owner);
    } catch (error) {
      console.log("❌ 基本連接失敗:", error.message);
      return;
    }
    
    // 測試預售信息
    console.log("\n📊 測試預售信息:");
    try {
      const presaleInfo = await presale.getPresaleInfo();
      console.log("✅ Token Price:", ethers.formatUnits(presaleInfo[0], 6), "USDT");
      console.log("✅ Min Purchase:", ethers.formatUnits(presaleInfo[1], 18), "MTK");
      console.log("✅ Max Purchase:", ethers.formatUnits(presaleInfo[2], 18), "MTK");
      console.log("✅ Total for Sale:", ethers.formatUnits(presaleInfo[3], 18), "MTK");
      console.log("✅ Tokens Sold:", ethers.formatUnits(presaleInfo[4], 18), "MTK");
      console.log("✅ Total Raised:", ethers.formatUnits(presaleInfo[5], 6), "USDT");
      console.log("✅ Presale Start:", new Date(presaleInfo[6] * 1000).toLocaleString());
      console.log("✅ Presale End:", new Date(presaleInfo[7] * 1000).toLocaleString());
      console.log("✅ Presale Finalized:", presaleInfo[8]);
      console.log("✅ Whitelist Enabled:", presaleInfo[9]);
    } catch (error) {
      console.log("❌ 預售信息獲取失敗:", error.message);
    }
    
    // 測試用戶信息
    console.log("\n👤 測試用戶信息:");
    try {
      const [deployer] = await ethers.getSigners();
      const userInfo = await presale.getUserInfo(deployer.address);
      console.log("✅ User:", deployer.address);
      console.log("✅ Purchased:", ethers.formatUnits(userInfo[0], 18), "MTK");
      console.log("✅ Whitelisted:", userInfo[1]);
    } catch (error) {
      console.log("❌ 用戶信息獲取失敗:", error.message);
    }
    
    console.log("\n✅ 簡單測試完成！");
    console.log("==================================");
    console.log("如果基本連接成功，前端應該能夠正常工作");
    console.log("請確保 MetaMask 連接到 Hardhat Local 網絡");
    console.log("Chain ID: 31337");
    console.log("RPC URL: http://127.0.0.1:8545");
    
  } catch (error) {
    console.error("❌ 測試失敗:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 