const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 檢查合約連接問題");
  console.log("================================");
  
  try {
    // 合約地址
    const PRESALE_ADDRESS = '0x610178dA211FEF7D417bC0e6FeD39F05609AD788';
    
    console.log("\n📋 合約地址:", PRESALE_ADDRESS);
    
    // 獲取合約實例
    console.log("\n1️⃣ 嘗試獲取合約實例...");
    const presale = await ethers.getContractAt("Presale", PRESALE_ADDRESS);
    console.log("✅ 合約實例創建成功");
    
    // 檢查合約是否可調用
    console.log("\n2️⃣ 檢查合約是否可調用...");
    try {
      const owner = await presale.owner();
      console.log("✅ 合約可調用，Owner:", owner);
    } catch (error) {
      console.log("❌ 合約調用失敗:", error.message);
      return;
    }
    
    // 檢查白名單功能
    console.log("\n3️⃣ 檢查白名單功能...");
    try {
      const whitelistEnabled = await presale.whitelistEnabled();
      console.log("✅ 白名單功能檢查成功:", whitelistEnabled);
    } catch (error) {
      console.log("❌ 白名單功能檢查失敗:", error.message);
    }
    
    // 檢查預售信息
    console.log("\n4️⃣ 檢查預售信息...");
    try {
      const presaleInfo = await presale.getPresaleInfo();
      console.log("✅ 預售信息獲取成功");
      console.log("   - Token Price:", ethers.formatEther(presaleInfo[0]), "USDT");
      console.log("   - Min Purchase:", ethers.formatEther(presaleInfo[1]), "USDT");
      console.log("   - Max Purchase:", ethers.formatEther(presaleInfo[2]), "USDT");
      console.log("   - Total Tokens:", ethers.formatEther(presaleInfo[3]));
      console.log("   - Tokens Sold:", ethers.formatEther(presaleInfo[4]));
      console.log("   - Total Raised:", ethers.formatEther(presaleInfo[5]), "USDT");
      console.log("   - Presale Start:", new Date(Number(presaleInfo[6]) * 1000).toLocaleString());
      console.log("   - Presale End:", new Date(Number(presaleInfo[7]) * 1000).toLocaleString());
      console.log("   - Presale Finalized:", presaleInfo[8]);
      console.log("   - Whitelist Enabled:", presaleInfo[9]);
    } catch (error) {
      console.log("❌ 預售信息獲取失敗:", error.message);
    }
    
    console.log("\n🎯 診斷結果:");
    console.log("如果所有檢查都通過，合約連接正常");
    console.log("如果出現錯誤，請檢查:");
    console.log("1. Hardhat 節點是否運行");
    console.log("2. 合約地址是否正確");
    console.log("3. 合約是否已部署");
    
  } catch (error) {
    console.error("❌ 測試失敗:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 