const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 測試預售狀態...");
  
  try {
    const presaleAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const presale = await ethers.getContractAt("Presale", presaleAddress);
    
    // 獲取預售信息
    const presaleInfo = await presale.getPresaleInfo();
    
    console.log("\n📊 預售信息:");
    console.log("Token Price:", ethers.formatUnits(presaleInfo[0], 6), "USDT");
    console.log("Min Purchase:", ethers.formatUnits(presaleInfo[1], 18), "MTK");
    console.log("Max Purchase:", ethers.formatUnits(presaleInfo[2], 18), "MTK");
    console.log("Total for Sale:", ethers.formatUnits(presaleInfo[3], 18), "MTK");
    console.log("Tokens Sold:", ethers.formatUnits(presaleInfo[4], 18), "MTK");
    console.log("Total Raised:", ethers.formatUnits(presaleInfo[5], 6), "USDT");
    console.log("Presale Start:", new Date(Number(presaleInfo[6]) * 1000).toLocaleString());
    console.log("Presale End:", new Date(Number(presaleInfo[7]) * 1000).toLocaleString());
    console.log("Presale Finalized:", presaleInfo[8]);
    console.log("Whitelist Enabled:", presaleInfo[9]);
    
    // 檢查預售是否活躍
    const now = Math.floor(Date.now() / 1000);
    const isActive = !presaleInfo[8] && now >= Number(presaleInfo[6]) && now <= Number(presaleInfo[7]);
    console.log("\n🎯 預售狀態:", isActive ? "活躍" : "非活躍");
    
    // 檢查測試用戶信息
    const [deployer] = await ethers.getSigners();
    const userInfo = await presale.getUserInfo(deployer.address);
    console.log("\n👤 用戶信息:");
    console.log("User:", deployer.address);
    console.log("Purchased:", ethers.formatUnits(userInfo[0], 18), "MTK");
    console.log("Whitelisted:", userInfo[1]);
    
    // 檢查 USDT 餘額
    const usdtAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const usdt = await ethers.getContractAt("MockUSDT", usdtAddress);
    const usdtBalance = await usdt.balanceOf(deployer.address);
    console.log("\n💰 USDT 餘額:", ethers.formatUnits(usdtBalance, 6), "USDT");
    
    console.log("\n✅ 測試完成！");
    console.log("==================================");
    console.log("如果預售狀態顯示為 '活躍'，前端應該能正常工作");
    console.log("如果白名單已啟用，用戶可以申請白名單");
    
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