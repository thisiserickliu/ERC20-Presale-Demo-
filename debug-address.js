const { ethers } = require("hardhat");

async function debugAddress() {
  console.log("🔍 檢查合約地址大小寫問題...\n");

  const PRESALE_ADDRESS = '0x09635F643e140090A9A8Dcd712eD6285858ceBef';
  const PRESALE_ADDRESS_LOWER = PRESALE_ADDRESS.toLowerCase();
  const USDT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

  const usdt = await ethers.getContractAt("MockUSDT", USDT_ADDRESS);
  const [user] = await ethers.getSigners();

  try {
    console.log("👤 用戶地址:", user.address);
    console.log("📋 Presale 地址 (原始):", PRESALE_ADDRESS);
    console.log("📋 Presale 地址 (小寫):", PRESALE_ADDRESS_LOWER);
    console.log("");

    // 檢查不同地址格式的 allowance
    console.log("🔐 檢查不同地址格式的 Allowance:");
    
    const allowance1 = await usdt.allowance(user.address, PRESALE_ADDRESS);
    console.log("  - 原始地址 allowance:", ethers.formatUnits(allowance1, 6), "USDT");
    
    const allowance2 = await usdt.allowance(user.address, PRESALE_ADDRESS_LOWER);
    console.log("  - 小寫地址 allowance:", ethers.formatUnits(allowance2, 6), "USDT");
    
    // 檢查 checksum 地址
    const checksumAddress = ethers.getAddress(PRESALE_ADDRESS);
    console.log("📋 Presale 地址 (checksum):", checksumAddress);
    const allowance3 = await usdt.allowance(user.address, checksumAddress);
    console.log("  - checksum 地址 allowance:", ethers.formatUnits(allowance3, 6), "USDT");
    console.log("");

    // 檢查哪個地址有 allowance
    if (allowance1 > 0n) {
      console.log("✅ 原始地址有 allowance");
    } else if (allowance2 > 0n) {
      console.log("✅ 小寫地址有 allowance");
    } else if (allowance3 > 0n) {
      console.log("✅ checksum 地址有 allowance");
    } else {
      console.log("❌ 所有地址格式都沒有 allowance");
    }

    // 檢查前端使用的地址格式
    console.log("\n🔍 檢查前端使用的地址格式:");
    console.log("  - constants.js 中的地址:", PRESALE_ADDRESS);
    console.log("  - 前端是否正確使用這個地址？");

  } catch (error) {
    console.error("❌ 檢查過程中發生錯誤:", error.message);
  }
}

// 執行檢查
debugAddress()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 