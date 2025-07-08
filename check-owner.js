const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 檢查合約擁有者");
  console.log("================================");
  
  // 合約地址
  const PRESALE_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
  
  // 獲取當前帳號
  const [deployer] = await ethers.getSigners();
  console.log("👤 當前部署者地址:", deployer.address);
  
  // 獲取合約實例
  const presale = await ethers.getContractAt("Presale", PRESALE_ADDRESS);
  
  // 檢查合約擁有者
  const owner = await presale.owner();
  console.log("👑 合約擁有者地址:", owner);
  
  // 檢查是否為擁有者
  const isOwner = owner.toLowerCase() === deployer.address.toLowerCase();
  console.log("✅ 是否為擁有者:", isOwner);
  
  // 檢查白名單狀態
  const whitelistEnabled = await presale.whitelistEnabled();
  console.log("📋 白名單啟用狀態:", whitelistEnabled);
  
  // 檢查當前用戶的白名單狀態
  const userWhitelisted = await presale.whitelist(deployer.address);
  console.log("👤 當前用戶白名單狀態:", userWhitelisted);
  
  console.log("\n📝 說明：");
  console.log("================================");
  console.log("1. 合約擁有者是在部署合約時自動設定的");
  console.log("2. 只有擁有者可以管理白名單");
  console.log("3. 如果你不是擁有者，需要：");
  console.log("   - 使用擁有者地址連接錢包，或");
  console.log("   - 重新部署合約（使用你的地址）");
  
  if (!isOwner) {
    console.log("\n⚠️  注意：你不是合約擁有者！");
    console.log("要成為擁有者，你需要：");
    console.log("1. 使用擁有者地址連接錢包");
    console.log("2. 或者重新部署合約");
  } else {
    console.log("\n🎉 你是合約擁有者！可以管理白名單。");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 