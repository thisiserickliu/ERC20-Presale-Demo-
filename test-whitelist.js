const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const [deployer, user1, user2, user3] = await ethers.getSigners();
  
  console.log("🧪 測試白名單管理功能");
  console.log("================================");
  
  // 合約地址
  const PRESALE_ADDRESS = '0x09635F643e140090A9A8Dcd712eD6285858ceBef';
  
  // 獲取合約實例
  const presale = await ethers.getContractAt("Presale", PRESALE_ADDRESS);
  
  console.log("📋 Presale 合約地址:", PRESALE_ADDRESS);
  console.log("👤 部署者地址:", deployer.address);
  console.log("👤 測試用戶1:", user1.address);
  console.log("👤 測試用戶2:", user2.address);
  console.log("👤 測試用戶3:", user3.address);
  
  // 1. 檢查當前白名單狀態
  console.log("\n1️⃣ 檢查當前白名單狀態");
  const whitelistEnabled = await presale.whitelistEnabled();
  console.log("   - 白名單啟用狀態:", whitelistEnabled);
  
  // 2. 檢查用戶白名單狀態
  console.log("\n2️⃣ 檢查用戶白名單狀態");
  const user1Whitelisted = await presale.whitelist(user1.address);
  const user2Whitelisted = await presale.whitelist(user2.address);
  const user3Whitelisted = await presale.whitelist(user3.address);
  
  console.log("   - 用戶1 白名單狀態:", user1Whitelisted);
  console.log("   - 用戶2 白名單狀態:", user2Whitelisted);
  console.log("   - 用戶3 白名單狀態:", user3Whitelisted);
  
  // 3. 新增用戶到白名單
  console.log("\n3️⃣ 新增用戶到白名單");
  const addresses = [user1.address, user2.address];
  const statuses = [true, true];
  
  const tx1 = await presale.setWhitelist(addresses, statuses);
  await tx1.wait();
  console.log("   ✅ 已新增用戶1和用戶2到白名單");
  
  // 4. 再次檢查白名單狀態
  console.log("\n4️⃣ 再次檢查白名單狀態");
  const user1WhitelistedAfter = await presale.whitelist(user1.address);
  const user2WhitelistedAfter = await presale.whitelist(user2.address);
  
  console.log("   - 用戶1 白名單狀態:", user1WhitelistedAfter);
  console.log("   - 用戶2 白名單狀態:", user2WhitelistedAfter);
  
  // 5. 移除用戶從白名單
  console.log("\n5️⃣ 移除用戶從白名單");
  const removeAddresses = [user1.address];
  const removeStatuses = [false];
  
  const tx2 = await presale.setWhitelist(removeAddresses, removeStatuses);
  await tx2.wait();
  console.log("   ✅ 已從白名單移除用戶1");
  
  // 6. 最終檢查
  console.log("\n6️⃣ 最終檢查");
  const user1Final = await presale.whitelist(user1.address);
  const user2Final = await presale.whitelist(user2.address);
  
  console.log("   - 用戶1 最終狀態:", user1Final);
  console.log("   - 用戶2 最終狀態:", user2Final);
  
  // 7. 測試白名單開關
  console.log("\n7️⃣ 測試白名單開關");
  const currentEnabled = await presale.whitelistEnabled();
  console.log("   - 當前白名單狀態:", currentEnabled);
  
  if (!currentEnabled) {
    console.log("   - 啟用白名單...");
    const tx3 = await presale.setWhitelistEnabled(true);
    await tx3.wait();
    console.log("   ✅ 白名單已啟用");
  } else {
    console.log("   - 停用白名單...");
    const tx3 = await presale.setWhitelistEnabled(false);
    await tx3.wait();
    console.log("   ✅ 白名單已停用");
  }
  
  const finalEnabled = await presale.whitelistEnabled();
  console.log("   - 最終白名單狀態:", finalEnabled);
  
  console.log("\n🎉 白名單管理測試完成！");
  console.log("================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 