const { ethers } = require("hardhat");

async function main() {
  console.log("💰 轉移 ETH 到指定地址");
  console.log("================================");
  
  const [deployer] = await ethers.getSigners();
  const targetAddress = "0x3f2091d5671fdbe5655b5b184a24ba4988d9d6e1";
  
  console.log("部署者:", deployer.address);
  console.log("目標地址:", targetAddress);
  
  // 檢查餘額
  const deployerBalance = await ethers.provider.getBalance(deployer.address);
  const targetBalance = await ethers.provider.getBalance(targetAddress);
  
  console.log("部署者 ETH 餘額:", ethers.formatEther(deployerBalance), "ETH");
  console.log("目標地址 ETH 餘額:", ethers.formatEther(targetBalance), "ETH");
  
  // 轉移 10 ETH
  const transferAmount = ethers.parseEther("10");
  console.log("轉移金額:", ethers.formatEther(transferAmount), "ETH");
  
  console.log("\n🔄 執行轉移...");
  const tx = await deployer.sendTransaction({
    to: targetAddress,
    value: transferAmount
  });
  
  await tx.wait();
  console.log("✅ 轉移成功！");
  console.log("交易哈希:", tx.hash);
  
  // 檢查轉移後餘額
  const newDeployerBalance = await ethers.provider.getBalance(deployer.address);
  const newTargetBalance = await ethers.provider.getBalance(targetAddress);
  
  console.log("\n📊 轉移後餘額:");
  console.log("部署者餘額:", ethers.formatEther(newDeployerBalance), "ETH");
  console.log("目標地址餘額:", ethers.formatEther(newTargetBalance), "ETH");
  
  console.log("\n🎉 完成！");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 轉移失敗:", error);
    process.exit(1);
  }); 