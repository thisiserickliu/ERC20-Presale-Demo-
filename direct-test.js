const { ethers } = require("hardhat");

async function directTest() {
  console.log("🧪 直接測試購買流程...\n");

  const PRESALE_ADDRESS = '0x09635F643e140090A9A8Dcd712eD6285858ceBef';
  const USDT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

  const presale = await ethers.getContractAt("Presale", PRESALE_ADDRESS);
  const usdt = await ethers.getContractAt("MockUSDT", USDT_ADDRESS);
  const [user] = await ethers.getSigners();

  try {
    console.log("👤 用戶地址:", user.address);
    console.log("");

    // 1. 檢查 allowance
    const allowance = await usdt.allowance(user.address, PRESALE_ADDRESS);
    console.log("🔐 當前 Allowance:", ethers.formatUnits(allowance, 6), "USDT");
    console.log("🔐 當前 Allowance (raw):", allowance.toString());

    // 2. 計算購買 100 MTK 需要的 USDT
    const tokenAmount = ethers.parseUnits("100", 18);
    const presaleInfo = await presale.getPresaleInfo();
    const tokenPrice = presaleInfo[0];
    const usdtCost = tokenAmount * tokenPrice / ethers.parseUnits("1", 18);
    
    console.log("\n💰 購買計算:");
    console.log("  - 購買數量:", ethers.formatUnits(tokenAmount, 18), "MTK");
    console.log("  - Token 價格:", ethers.formatUnits(tokenPrice, 6), "USDT");
    console.log("  - 需要 USDT:", ethers.formatUnits(usdtCost, 6), "USDT");
    console.log("  - 需要 USDT (raw):", usdtCost.toString());

    // 3. 檢查 allowance 是否足夠
    console.log("\n🔍 Allowance 檢查:");
    console.log("  - Allowance >= 需要 USDT:", allowance >= usdtCost);
    console.log("  - Allowance:", allowance.toString());
    console.log("  - 需要:", usdtCost.toString());

    if (allowance < usdtCost) {
      console.log("❌ Allowance 不足，需要 approve");
      return;
    }

    // 4. 檢查其他購買條件
    console.log("\n🔍 其他購買條件檢查:");
    const minPurchase = presaleInfo[1];
    const maxPurchase = presaleInfo[2];
    const totalForSale = presaleInfo[3];
    const tokensSold = presaleInfo[4];
    
    console.log("  - 購買數量 >= minPurchase:", tokenAmount >= minPurchase);
    console.log("  - 購買數量 <= maxPurchase:", tokenAmount <= maxPurchase);
    console.log("  - tokensSold + 購買數量 <= totalForSale:", tokensSold + tokenAmount <= totalForSale);
    
    // 檢查用戶已購買數量
    const userInfo = await presale.getUserInfo(user.address);
    const userPurchased = userInfo[0];
    console.log("  - 用戶已購買:", ethers.formatUnits(userPurchased, 18), "MTK");
    console.log("  - 用戶已購買 + 本次購買 <= maxPurchase:", userPurchased + tokenAmount <= maxPurchase);

    // 5. 檢查預售狀態
    console.log("\n🔍 預售狀態檢查:");
    const now = Math.floor(Date.now() / 1000);
    const presaleStart = presaleInfo[6];
    const presaleEnd = presaleInfo[7];
    const presaleFinalized = presaleInfo[8];
    const whitelistEnabled = presaleInfo[9];
    
    console.log("  - 當前時間:", now);
    console.log("  - 預售開始:", presaleStart);
    console.log("  - 預售結束:", presaleEnd);
    console.log("  - 現在 >= 開始:", now >= presaleStart);
    console.log("  - 現在 <= 結束:", now <= presaleEnd);
    console.log("  - 未結束:", !presaleFinalized);
    console.log("  - 白名單關閉:", !whitelistEnabled);

    // 6. 嘗試購買
    console.log("\n🛒 嘗試購買...");
    try {
      const tx = await presale.buyTokens(tokenAmount);
      console.log("✅ 交易已發送，等待確認...");
      const receipt = await tx.wait();
      console.log("✅ 購買成功！交易 Hash:", tx.hash);
      console.log("✅ Gas 使用:", receipt.gasUsed.toString());
    } catch (error) {
      console.error("❌ 購買失敗:", error.message);
      
      // 如果是 revert，嘗試解析錯誤
      if (error.message.includes("execution reverted")) {
        console.log("\n🔍 嘗試解析 revert 原因...");
        console.log("可能的問題:");
        console.log("1. Allowance 不足");
        console.log("2. 購買數量超出限制");
        console.log("3. 預售未啟動或已結束");
        console.log("4. 白名單限制");
        console.log("5. 合約餘額不足");
      }
    }

  } catch (error) {
    console.error("❌ 測試過程中發生錯誤:", error.message);
  }
}

// 執行測試
directTest()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 