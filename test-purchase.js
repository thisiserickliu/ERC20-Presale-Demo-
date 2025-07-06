const { ethers } = require("hardhat");

async function testPurchase() {
  console.log("🧪 測試完整購買流程...\n");

  const PRESALE_ADDRESS = '0x09635F643e140090A9A8Dcd712eD6285858ceBef';
  const TOKEN_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
  const USDT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

  // 獲取合約實例
  const presale = await ethers.getContractAt("Presale", PRESALE_ADDRESS);
  const myToken = await ethers.getContractAt("MyToken", TOKEN_ADDRESS);
  const usdt = await ethers.getContractAt("MockUSDT", USDT_ADDRESS);
  const [user] = await ethers.getSigners();

  try {
    console.log("👤 用戶地址:", user.address);
    
    // 1. 查詢當前狀態
    console.log("\n📊 購買前狀態:");
    const userUsdtBalance = await usdt.balanceOf(user.address);
    const userUsdtAllowance = await usdt.allowance(user.address, PRESALE_ADDRESS);
    const userTokenBalance = await myToken.balanceOf(user.address);
    
    console.log("  - 用戶 USDT 餘額:", ethers.formatUnits(userUsdtBalance, 6), "USDT");
    console.log("  - 對 Presale 授權額度:", ethers.formatUnits(userUsdtAllowance, 6), "USDT");
    console.log("  - 用戶 Token 餘額:", ethers.formatUnits(userTokenBalance, 18), "MTK");

    // 2. 計算購買 100 Token 需要的 USDT
    const tokenAmount = ethers.parseUnits("100", 18); // 100 MTK
    const presaleInfo = await presale.getPresaleInfo();
    const tokenPrice = presaleInfo[0]; // BigInt
    const usdtCost = tokenAmount * tokenPrice / ethers.parseUnits("1", 18);
    
    console.log("\n💰 購買計算:");
    console.log("  - 購買數量:", ethers.formatUnits(tokenAmount, 18), "MTK");
    console.log("  - Token 價格:", ethers.formatUnits(tokenPrice, 6), "USDT");
    console.log("  - 需要 USDT:", ethers.formatUnits(usdtCost, 6), "USDT");

    // 3. 檢查是否需要 approve
    if (userUsdtAllowance < usdtCost) {
      console.log("\n🔐 需要 approve USDT...");
      const approveTx = await usdt.approve(PRESALE_ADDRESS, usdtCost);
      await approveTx.wait();
      console.log("✅ Approve 完成！交易 Hash:", approveTx.hash);
      
      // 再次檢查 allowance
      const newAllowance = await usdt.allowance(user.address, PRESALE_ADDRESS);
      console.log("  - 新的授權額度:", ethers.formatUnits(newAllowance, 6), "USDT");
    } else {
      console.log("\n✅ USDT 授權額度已足夠");
    }

    // 4. 執行購買
    console.log("\n🛒 執行購買...");
    const buyTx = await presale.buyTokens(tokenAmount);
    await buyTx.wait();
    console.log("✅ 購買完成！交易 Hash:", buyTx.hash);

    // 5. 查詢購買後狀態
    console.log("\n📊 購買後狀態:");
    const newUserUsdtBalance = await usdt.balanceOf(user.address);
    const newUserTokenBalance = await myToken.balanceOf(user.address);
    const newPresaleInfo = await presale.getPresaleInfo();
    
    console.log("  - 用戶 USDT 餘額:", ethers.formatUnits(newUserUsdtBalance, 6), "USDT");
    console.log("  - 用戶 Token 餘額:", ethers.formatUnits(newUserTokenBalance, 18), "MTK");
    console.log("  - 預售已售出:", ethers.formatUnits(newPresaleInfo[4], 18), "MTK");
    console.log("  - 預售總籌集:", ethers.formatUnits(newPresaleInfo[5], 6), "USDT");

    console.log("\n🎉 測試成功！");

  } catch (error) {
    console.error("❌ 測試失敗:", error.message);
    
    // 如果是 revert，提供更多診斷資訊
    if (error.message.includes("execution reverted")) {
      console.log("\n🔍 診斷資訊:");
      console.log("請檢查以下條件:");
      console.log("1. 購買數量是否在 minPurchase(100) 和 maxPurchase(10000) 之間");
      console.log("2. 用戶 USDT 餘額是否足夠");
      console.log("3. USDT allowance 是否足夠");
      console.log("4. Presale 合約是否有足夠 Token");
      console.log("5. 預售是否在活動期間");
    }
  }
}

// 執行測試
testPurchase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 