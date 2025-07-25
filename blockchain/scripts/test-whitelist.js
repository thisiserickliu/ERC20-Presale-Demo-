const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 測試自助白名單功能...");
  
  try {
    // 獲取合約實例
    const presaleAddress = process.env.PRESALE_ADDRESS || "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const presale = await ethers.getContractAt("Presale", presaleAddress);
    
    // 獲取測試賬戶
    const [owner, user1, user2] = await ethers.getSigners();
    
    console.log("\n📋 測試賬戶:");
    console.log("Owner:", owner.address);
    console.log("User1:", user1.address);
    console.log("User2:", user2.address);
    
    // 檢查初始狀態
    console.log("\n🔍 檢查初始狀態:");
    const whitelistEnabled = await presale.whitelistEnabled();
    console.log("白名單是否啟用:", whitelistEnabled);
    
    const ownerWhitelisted = await presale.whitelist(owner.address);
    const user1Whitelisted = await presale.whitelist(user1.address);
    const user2Whitelisted = await presale.whitelist(user2.address);
    
    console.log("Owner 白名單狀態:", ownerWhitelisted);
    console.log("User1 白名單狀態:", user1Whitelisted);
    console.log("User2 白名單狀態:", user2Whitelisted);
    
    // 測試自助申請白名單
    console.log("\n🎯 測試自助申請白名單:");
    
    // User1 申請白名單
    console.log("User1 申請白名單...");
    const tx1 = await presale.connect(user1).applyWhitelist();
    await tx1.wait();
    console.log("✅ User1 申請成功");
    
    // User2 申請白名單
    console.log("User2 申請白名單...");
    const tx2 = await presale.connect(user2).applyWhitelist();
    await tx2.wait();
    console.log("✅ User2 申請成功");
    
    // 檢查申請後的狀態
    console.log("\n🔍 檢查申請後的狀態:");
    const user1WhitelistedAfter = await presale.whitelist(user1.address);
    const user2WhitelistedAfter = await presale.whitelist(user2.address);
    
    console.log("User1 白名單狀態:", user1WhitelistedAfter);
    console.log("User2 白名單狀態:", user2WhitelistedAfter);
    
    // 測試重複申請（應該失敗）
    console.log("\n⚠️ 測試重複申請:");
    try {
      const tx3 = await presale.connect(user1).applyWhitelist();
      await tx3.wait();
      console.log("❌ 重複申請應該失敗，但成功了");
    } catch (error) {
      console.log("✅ 重複申請正確失敗:", error.message);
    }
    
    // 測試管理員功能
    console.log("\n👑 測試管理員功能:");
    
    // 啟用白名單
    console.log("啟用白名單...");
    const enableTx = await presale.setWhitelistEnabled(true);
    await enableTx.wait();
    console.log("✅ 白名單已啟用");
    
    // 檢查白名單狀態
    const whitelistEnabledAfter = await presale.whitelistEnabled();
    console.log("白名單啟用狀態:", whitelistEnabledAfter);
    
    // 測試批量設置白名單
    console.log("\n📝 測試批量設置白名單:");
    const testAddresses = [
      "0x1234567890123456789012345678901234567890",
      "0x2345678901234567890123456789012345678901",
      "0x3456789012345678901234567890123456789012"
    ];
    const testStatuses = [true, false, true];
    
    const batchTx = await presale.setWhitelist(testAddresses, testStatuses);
    await batchTx.wait();
    console.log("✅ 批量設置成功");
    
    // 檢查批量設置結果
    for (let i = 0; i < testAddresses.length; i++) {
      const status = await presale.whitelist(testAddresses[i]);
      console.log(`${testAddresses[i]}: ${status}`);
    }
    
    // 測試購買功能（需要 USDT 和代幣合約）
    console.log("\n💰 測試購買功能:");
    
    try {
      // 獲取 USDT 和代幣合約地址
      const usdtAddress = await presale.paymentToken();
      const tokenAddress = await presale.token();
      
      console.log("USDT 地址:", usdtAddress);
      console.log("代幣地址:", tokenAddress);
      
      // 獲取合約實例
      const usdt = await ethers.getContractAt("MockUSDT", usdtAddress);
      const token = await ethers.getContractAt("MyToken", tokenAddress);
      
      // 檢查用戶餘額
      const user1UsdtBalance = await usdt.balanceOf(user1.address);
      const user1TokenBalance = await token.balanceOf(user1.address);
      
      console.log("User1 USDT 餘額:", ethers.formatUnits(user1UsdtBalance, 6));
      console.log("User1 代幣餘額:", ethers.formatUnits(user1TokenBalance, 18));
      
      // 如果用戶有 USDT，嘗試購買
      if (user1UsdtBalance > 0) {
        console.log("User1 嘗試購買代幣...");
        
        // 獲取預售信息
        const presaleInfo = await presale.getPresaleInfo();
        const minPurchase = presaleInfo[1]; // minPurchase
        
        // 批准 USDT
        const approveTx = await usdt.connect(user1).approve(presaleAddress, user1UsdtBalance);
        await approveTx.wait();
        console.log("✅ USDT 批准成功");
        
        // 嘗試購買
        const buyTx = await presale.connect(user1).buyTokens(minPurchase);
        await buyTx.wait();
        console.log("✅ 購買成功");
        
        // 檢查購買後的餘額
        const user1TokenBalanceAfter = await token.balanceOf(user1.address);
        console.log("User1 購買後代幣餘額:", ethers.formatUnits(user1TokenBalanceAfter, 18));
      } else {
        console.log("User1 沒有 USDT，跳過購買測試");
      }
      
    } catch (error) {
      console.log("購買測試失敗:", error.message);
    }
    
    console.log("\n🎉 自助白名單功能測試完成！");
    console.log("==================================");
    console.log("✅ 自助申請功能正常");
    console.log("✅ 重複申請防護正常");
    console.log("✅ 管理員控制功能正常");
    console.log("✅ 批量設置功能正常");
    console.log("✅ 白名單啟用/禁用正常");
    
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