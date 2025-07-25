const { ethers } = require("hardhat");

async function main() {
  console.log("🔓 啟用白名單功能...");
  
  try {
    const presaleAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const presale = await ethers.getContractAt("Presale", presaleAddress);
    
    // 啟用白名單
    const tx = await presale.setWhitelistEnabled(true);
    await tx.wait();
    
    console.log("✅ 白名單功能已啟用！");
    
    // 驗證白名單狀態
    const whitelistEnabled = await presale.whitelistEnabled();
    console.log("白名單狀態:", whitelistEnabled ? "已啟用" : "未啟用");
    
  } catch (error) {
    console.error("❌ 啟用白名單失敗:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 