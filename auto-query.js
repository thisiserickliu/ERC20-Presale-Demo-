const { ethers } = require("hardhat");

async function autoQuery() {
  console.log("🔍 開始自動查詢預售 DApp 狀態...\n");

  // 合約地址
  const PRESALE_ADDRESS = '0x09635F643e140090A9A8Dcd712eD6285858ceBef';
  const TOKEN_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
  const USDT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

  // 獲取合約實例
  const presale = await ethers.getContractAt("Presale", PRESALE_ADDRESS);
  const myToken = await ethers.getContractAt("MyToken", TOKEN_ADDRESS);
  const usdt = await ethers.getContractAt("MockUSDT", USDT_ADDRESS);

  // 獲取用戶地址（第一個帳號）
  const [user] = await ethers.getSigners();
  const userAddress = user.address;

  console.log("👤 用戶地址:", userAddress);
  console.log("📋 合約地址:");
  console.log("  - Presale:", PRESALE_ADDRESS);
  console.log("  - MyToken:", TOKEN_ADDRESS);
  console.log("  - USDT:", USDT_ADDRESS);
  console.log("");

  try {
    // 1. 查詢預售合約狀態
    console.log("📊 1. 預售合約狀態 (getPresaleInfo):");
    const presaleInfo = await presale.getPresaleInfo();
    console.log("  - Token Price:", ethers.formatUnits(presaleInfo[0], 6), "USDT");
    console.log("  - Min Purchase:", ethers.formatUnits(presaleInfo[1], 18), "MTK");
    console.log("  - Max Purchase:", ethers.formatUnits(presaleInfo[2], 18), "MTK");
    console.log("  - Total For Sale:", ethers.formatUnits(presaleInfo[3], 18), "MTK");
    console.log("  - Tokens Sold:", ethers.formatUnits(presaleInfo[4], 18), "MTK");
    console.log("  - Total Raised:", ethers.formatUnits(presaleInfo[5], 6), "USDT");
    console.log("  - Presale Start:", new Date(Number(presaleInfo[6]) * 1000).toLocaleString());
    console.log("  - Presale End:", new Date(Number(presaleInfo[7]) * 1000).toLocaleString());
    console.log("  - Presale Finalized:", presaleInfo[8]);
    console.log("  - Whitelist Enabled:", presaleInfo[9]);
    console.log("");

    // 2. 查詢預售合約持有的 MyToken 餘額
    console.log("💰 2. 預售合約 MyToken 餘額:");
    const presaleTokenBalance = await myToken.balanceOf(PRESALE_ADDRESS);
    console.log("  - Presale 合約持有:", ethers.formatUnits(presaleTokenBalance, 18), "MTK");
    console.log("");

    // 3. 查詢用戶 USDT 餘額與授權
    console.log("💵 3. 用戶 USDT 狀態:");
    const userUsdtBalance = await usdt.balanceOf(userAddress);
    const userUsdtAllowance = await usdt.allowance(userAddress, PRESALE_ADDRESS);
    console.log("  - 用戶 USDT 餘額:", ethers.formatUnits(userUsdtBalance, 6), "USDT");
    console.log("  - 對 Presale 授權額度:", ethers.formatUnits(userUsdtAllowance, 6), "USDT");
    console.log("");

    // 4. 查詢用戶購買資訊
    console.log("🛒 4. 用戶購買資訊:");
    const userInfo = await presale.getUserInfo(userAddress);
    console.log("  - 已購買數量:", ethers.formatUnits(userInfo[0], 18), "MTK");
    console.log("  - 是否在白名單:", userInfo[1]);
    console.log("");

    // 5. 查詢用戶 MyToken 餘額
    console.log("🎯 5. 用戶 MyToken 餘額:");
    const userTokenBalance = await myToken.balanceOf(userAddress);
    console.log("  - 用戶持有:", ethers.formatUnits(userTokenBalance, 18), "MTK");
    console.log("");

    // 6. 預售狀態判斷
    console.log("📈 6. 預售狀態分析:");
    const now = Math.floor(Date.now() / 1000);
    const isActive = !presaleInfo[8] && now >= presaleInfo[6] && now <= presaleInfo[7];
    const progress = (Number(presaleInfo[4]) / Number(presaleInfo[3])) * 100;
    
    console.log("  - 預售是否啟動:", isActive ? "✅ 是" : "❌ 否");
    console.log("  - 進度:", progress.toFixed(2) + "%");
    console.log("  - 剩餘可售:", ethers.formatUnits(presaleInfo[3] - presaleInfo[4], 18), "MTK");
    
    if (presaleInfo[9]) {
      console.log("  - 白名單狀態:", userInfo[1] ? "✅ 已加入" : "❌ 未加入");
    }
    console.log("");

    // 7. 購買能力檢查
    console.log("🔍 7. 購買能力檢查:");
    const minPurchase = Number(ethers.formatUnits(presaleInfo[1], 18));
    const maxPurchase = Number(ethers.formatUnits(presaleInfo[2], 18));
    const userPurchased = Number(ethers.formatUnits(userInfo[0], 18));
    const remainingPurchase = maxPurchase - userPurchased;
    const userUsdtBalanceNum = Number(ethers.formatUnits(userUsdtBalance, 6));
    const tokenPriceNum = Number(ethers.formatUnits(presaleInfo[0], 6));
    
    console.log("  - 最小購買量:", minPurchase, "MTK");
    console.log("  - 最大購買量:", maxPurchase, "MTK");
    console.log("  - 已購買:", userPurchased, "MTK");
    console.log("  - 剩餘可購買:", remainingPurchase, "MTK");
    console.log("  - 當前 Token 價格:", tokenPriceNum, "USDT");
    console.log("  - 最小購買所需 USDT:", (minPurchase * tokenPriceNum).toFixed(2), "USDT");
    console.log("  - 最大購買所需 USDT:", (remainingPurchase * tokenPriceNum).toFixed(2), "USDT");
    console.log("  - USDT 餘額是否足夠:", userUsdtBalanceNum >= (minPurchase * tokenPriceNum) ? "✅ 是" : "❌ 否");
    console.log("  - 授權額度是否足夠:", Number(ethers.formatUnits(userUsdtAllowance, 6)) >= (minPurchase * tokenPriceNum) ? "✅ 是" : "❌ 否");

  } catch (error) {
    console.error("❌ 查詢過程中發生錯誤:", error.message);
  }
}

// 執行查詢
autoQuery()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 