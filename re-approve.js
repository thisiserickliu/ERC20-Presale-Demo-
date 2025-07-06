const { ethers } = require("hardhat");

async function reApprove() {
  console.log("🔄 重新 Approve USDT...\n");

  const PRESALE_ADDRESS = '0x09635F643e140090A9A8Dcd712eD6285858ceBef';
  const USDT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

  const usdt = await ethers.getContractAt("MockUSDT", USDT_ADDRESS);
  const [user] = await ethers.getSigners();

  try {
    console.log("👤 用戶地址:", user.address);
    console.log("📋 Presale 合約地址:", PRESALE_ADDRESS);
    console.log("");

    // 1. 檢查當前 allowance
    const currentAllowance = await usdt.allowance(user.address, PRESALE_ADDRESS);
    console.log("🔐 當前 Allowance:", ethers.formatUnits(currentAllowance, 6), "USDT");
    console.log("🔐 當前 Allowance (raw):", currentAllowance.toString());

    // 2. 計算需要的 allowance（購買 1000 MTK 的最大需求）
    const maxTokenAmount = ethers.parseUnits("1000", 18); // 1000 MTK
    const presale = await ethers.getContractAt("Presale", PRESALE_ADDRESS);
    const presaleInfo = await presale.getPresaleInfo();
    const tokenPrice = presaleInfo[0];
    const maxUsdtCost = maxTokenAmount * tokenPrice / ethers.parseUnits("1", 18);
    
    console.log("\n💰 最大購買需求:");
    console.log("  - 最大購買數量:", ethers.formatUnits(maxTokenAmount, 18), "MTK");
    console.log("  - Token 價格:", ethers.formatUnits(tokenPrice, 6), "USDT");
    console.log("  - 最大需要 USDT:", ethers.formatUnits(maxUsdtCost, 6), "USDT");
    console.log("  - 最大需要 USDT (raw):", maxUsdtCost.toString());

    // 3. 設定足夠的 allowance（比最大需求多一點）
    const approveAmount = maxUsdtCost + ethers.parseUnits("10", 6); // 多 10 USDT 安全邊際
    console.log("\n🔄 設定 Allowance:", ethers.formatUnits(approveAmount, 6), "USDT");

    // 4. 執行 approve
    const approveTx = await usdt.approve(PRESALE_ADDRESS, approveAmount);
    console.log("📝 Approve 交易已發送，等待確認...");
    const receipt = await approveTx.wait();
    console.log("✅ Approve 完成！");
    console.log("  - 交易 Hash:", approveTx.hash);
    console.log("  - Gas 使用:", receipt.gasUsed.toString());

    // 5. 驗證新的 allowance
    const newAllowance = await usdt.allowance(user.address, PRESALE_ADDRESS);
    console.log("\n🔐 新的 Allowance:", ethers.formatUnits(newAllowance, 6), "USDT");
    console.log("🔐 新的 Allowance (raw):", newAllowance.toString());

    if (newAllowance >= maxUsdtCost) {
      console.log("✅ Allowance 設定成功，足夠最大購買需求");
    } else {
      console.log("❌ Allowance 設定失敗，仍然不足");
    }

  } catch (error) {
    console.error("❌ Approve 過程中發生錯誤:", error.message);
  }
}

// 執行 approve
reApprove()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 