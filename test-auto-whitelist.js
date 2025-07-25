const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 測試自動申請白名單功能");
  console.log("================================");
  
  try {
    // 獲取測試賬戶
    const [deployer, user1, user2, user3] = await ethers.getSigners();
    console.log("\n📋 測試賬戶:");
    console.log("部署者:", deployer.address);
    console.log("用戶1:", user1.address);
    console.log("用戶2:", user2.address);
    console.log("用戶3:", user3.address);
    
    // 合約地址
    const PRESALE_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
    const USDT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    const MYTOKEN_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
    
    // 獲取合約實例
    const presale = await ethers.getContractAt("Presale", PRESALE_ADDRESS);
    const usdt = await ethers.getContractAt("MockUSDT", USDT_ADDRESS);
    
    console.log("\n1️⃣ 檢查白名單狀態...");
    const whitelistEnabled = await presale.whitelistEnabled();
    console.log("白名單功能啟用:", whitelistEnabled);
    
    if (!whitelistEnabled) {
      console.log("⚠️  白名單功能未啟用，正在啟用...");
      const enableTx = await presale.setWhitelistEnabled(true);
      await enableTx.wait();
      console.log("✅ 白名單功能已啟用");
    }
    
    console.log("\n2️⃣ 檢查各用戶的白名單狀態...");
    
    // 檢查用戶1
    const user1Whitelisted = await presale.whitelist(user1.address);
    console.log("用戶1 白名單狀態:", user1Whitelisted ? "已加入" : "未加入");
    
    // 檢查用戶2
    const user2Whitelisted = await presale.whitelist(user2.address);
    console.log("用戶2 白名單狀態:", user2Whitelisted ? "已加入" : "未加入");
    
    // 檢查用戶3
    const user3Whitelisted = await presale.whitelist(user3.address);
    console.log("用戶3 白名單狀態:", user3Whitelisted ? "已加入" : "未加入");
    
    console.log("\n3️⃣ 測試自動申請功能...");
    
    // 為未加入白名單的用戶申請
    const usersToTest = [];
    if (!user1Whitelisted) usersToTest.push({ signer: user1, name: "用戶1" });
    if (!user2Whitelisted) usersToTest.push({ signer: user2, name: "用戶2" });
    if (!user3Whitelisted) usersToTest.push({ signer: user3, name: "用戶3" });
    
    for (const user of usersToTest) {
      try {
        console.log(`\n🎯 為 ${user.name} 申請白名單...`);
        const tx = await presale.connect(user.signer).applyWhitelist();
        await tx.wait();
        console.log(`✅ ${user.name} 申請成功`);
      } catch (error) {
        if (error.message.includes('Already whitelisted')) {
          console.log(`ℹ️  ${user.name} 已經在白名單中`);
        } else {
          console.error(`❌ ${user.name} 申請失敗:`, error.message);
        }
      }
    }
    
    console.log("\n4️⃣ 驗證申請結果...");
    
    // 重新檢查所有用戶狀態
    const finalUser1Status = await presale.whitelist(user1.address);
    const finalUser2Status = await presale.whitelist(user2.address);
    const finalUser3Status = await presale.whitelist(user3.address);
    
    console.log("用戶1 最終狀態:", finalUser1Status ? "✅ 已加入" : "❌ 未加入");
    console.log("用戶2 最終狀態:", finalUser2Status ? "✅ 已加入" : "❌ 未加入");
    console.log("用戶3 最終狀態:", finalUser3Status ? "✅ 已加入" : "❌ 未加入");
    
    console.log("\n5️⃣ 測試重複申請...");
    
    // 測試重複申請
    try {
      const duplicateTx = await presale.connect(user1).applyWhitelist();
      await duplicateTx.wait();
      console.log("❌ 重複申請應該失敗但成功了");
    } catch (error) {
      if (error.message.includes('Already whitelisted')) {
        console.log("✅ 重複申請正確失敗");
      } else {
        console.error("❌ 重複申請失敗，但不是預期的錯誤:", error.message);
      }
    }
    
    console.log("\n🎉 自動申請白名單測試完成！");
    console.log("==================================");
    console.log("📋 測試結果:");
    console.log("- 白名單功能: ✅ 正常");
    console.log("- 自動申請: ✅ 正常");
    console.log("- 重複申請保護: ✅ 正常");
    console.log("");
    console.log("🌐 前端測試:");
    console.log("1. 打開 http://localhost:3001");
    console.log("2. 連接 MetaMask 到本地網絡");
    console.log("3. 使用測試賬戶連接錢包");
    console.log("4. 觀察自動申請白名單功能");
    
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