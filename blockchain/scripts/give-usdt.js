const { ethers } = require("hardhat");

async function main() {
  console.log("💰 轉移 USDT 到指定地址");
  console.log("================================");

  try {
    const [deployer] = await ethers.getSigners();
    console.log("部署者:", deployer.address);
    
    // 目標地址
    const targetAddress = "0x3f2091d5671fdbe5655b5b184a24ba4988d9d6e1";
    console.log("目標地址:", targetAddress);
    
    // USDT 合約地址
    const USDT_ADDRESS = '0x4A679253410272dd5232B3Ff7cF5dbB88f295319';
    
    // 獲取 USDT 合約實例
    const usdt = await ethers.getContractAt("MockUSDT", USDT_ADDRESS);
    console.log("USDT 合約地址:", USDT_ADDRESS);
    
    // 檢查部署者餘額
    const deployerBalance = await usdt.balanceOf(deployer.address);
    console.log("部署者 USDT 餘額:", ethers.formatUnits(deployerBalance, 6));
    
    // 檢查目標地址餘額
    const targetBalance = await usdt.balanceOf(targetAddress);
    console.log("目標地址 USDT 餘額:", ethers.formatUnits(targetBalance, 6));
    
    // 轉移 1000 USDT
    const transferAmount = ethers.parseUnits("1000", 6); // 1000 USDT
    console.log("轉移金額:", ethers.formatUnits(transferAmount, 6), "USDT");
    
    // 執行轉移
    console.log("\n🔄 執行轉移...");
    const tx = await usdt.transfer(targetAddress, transferAmount);
    await tx.wait();
    
    console.log("✅ 轉移成功！");
    console.log("交易哈希:", tx.hash);
    
    // 檢查轉移後的餘額
    const newDeployerBalance = await usdt.balanceOf(deployer.address);
    const newTargetBalance = await usdt.balanceOf(targetAddress);
    
    console.log("\n📊 轉移後餘額:");
    console.log("部署者餘額:", ethers.formatUnits(newDeployerBalance, 6), "USDT");
    console.log("目標地址餘額:", ethers.formatUnits(newTargetBalance, 6), "USDT");
    
    console.log("\n🎉 完成！");

  } catch (error) {
    console.error("❌ 轉移失敗:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 