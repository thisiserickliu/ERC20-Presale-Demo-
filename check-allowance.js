const { ethers } = require("hardhat");

async function checkAllowance() {
  console.log("🔍 詳細檢查 USDT Allowance...\n");

  const PRESALE_ADDRESS = '0x09635F643e140090A9A8Dcd712eD6285858ceBef';
  const USDT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

  const usdt = await ethers.getContractAt("MockUSDT", USDT_ADDRESS);
  const [user] = await ethers.getSigners();

  try {
    console.log("👤 用戶地址:", user.address);
    console.log("📋 Presale 合約地址:", PRESALE_ADDRESS);
    console.log("💵 USDT 合約地址:", USDT_ADDRESS);
    console.log("");

    // 檢查用戶 USDT 餘額
    const userBalance = await usdt.balanceOf(user.address);
    console.log("💰 用戶 USDT 餘額:", ethers.formatUnits(userBalance, 6), "USDT");
    console.log("💰 用戶 USDT 餘額 (raw):", userBalance.toString());
    console.log("");

    // 檢查 allowance
    const allowance = await usdt.allowance(user.address, PRESALE_ADDRESS);
    console.log("🔐 對 Presale 的 Allowance:", ethers.formatUnits(allowance, 6), "USDT");
    console.log("🔐 對 Presale 的 Allowance (raw):", allowance.toString());
    console.log("");

    // 檢查是否為 0
    if (allowance === 0n) {
      console.log("❌ Allowance 為 0，需要重新 approve");
      
      // 計算需要的 allowance（購買 100 MTK）
      const tokenAmount = ethers.parseUnits("100", 18);
      const presale = await ethers.getContractAt("Presale", PRESALE_ADDRESS);
      const presaleInfo = await presale.getPresaleInfo();
      const tokenPrice = presaleInfo[0];
      const usdtCost = tokenAmount * tokenPrice / ethers.parseUnits("1", 18);
      
      console.log("💡 購買 100 MTK 需要 USDT:", ethers.formatUnits(usdtCost, 6), "USDT");
      console.log("💡 建議 approve 金額:", ethers.formatUnits(usdtCost * 2n, 6), "USDT (2倍安全邊際)");
      
      // 執行 approve
      console.log("\n🔄 執行 approve...");
      const approveAmount = usdtCost * 2n; // 20 USDT
      const approveTx = await usdt.approve(PRESALE_ADDRESS, approveAmount);
      await approveTx.wait();
      console.log("✅ Approve 完成！交易 Hash:", approveTx.hash);
      
      // 再次檢查 allowance
      const newAllowance = await usdt.allowance(user.address, PRESALE_ADDRESS);
      console.log("🔐 新的 Allowance:", ethers.formatUnits(newAllowance, 6), "USDT");
      console.log("🔐 新的 Allowance (raw):", newAllowance.toString());
      
    } else {
      console.log("✅ Allowance 已存在");
    }

  } catch (error) {
    console.error("❌ 檢查過程中發生錯誤:", error.message);
  }
}

// 執行檢查
checkAllowance()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 