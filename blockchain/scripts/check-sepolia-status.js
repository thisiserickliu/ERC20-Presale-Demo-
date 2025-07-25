const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Checking Sepolia network status...");
  
  try {
    // 檢查網絡連接
    const network = await ethers.provider.getNetwork();
    console.log("Network:", network.name);
    console.log("Chain ID:", network.chainId);
    
    // 獲取最新區塊
    const latestBlock = await ethers.provider.getBlockNumber();
    console.log("Latest block:", latestBlock);
    
    // 獲取 gas 價格
    const gasPrice = await ethers.provider.getFeeData();
    console.log("Current gas price:", ethers.formatUnits(gasPrice.gasPrice, "gwei"), "gwei");
    
    // 獲取區塊時間
    const block = await ethers.provider.getBlock(latestBlock);
    const blockTime = new Date(block.timestamp * 1000);
    console.log("Latest block time:", blockTime.toLocaleString());
    
    // 檢查餘額
    const [deployer] = await ethers.getSigners();
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Deployer balance:", ethers.formatEther(balance), "ETH");
    
    // 估算部署成本
    const estimatedGas = 8000000; // 預估總 gas 使用量
    const estimatedCost = gasPrice.gasPrice * BigInt(estimatedGas);
    console.log("Estimated deployment cost:", ethers.formatEther(estimatedCost), "ETH");
    
    console.log("\n📊 Network Status Summary:");
    if (gasPrice.gasPrice < ethers.parseUnits("20", "gwei")) {
      console.log("✅ Gas price is low - good for deployment");
    } else if (gasPrice.gasPrice < ethers.parseUnits("50", "gwei")) {
      console.log("⚠️  Gas price is moderate - deployment should work");
    } else {
      console.log("❌ Gas price is high - consider waiting or using higher gas");
    }
    
    if (balance > estimatedCost) {
      console.log("✅ Sufficient balance for deployment");
    } else {
      console.log("❌ Insufficient balance for deployment");
    }
    
  } catch (error) {
    console.error("❌ Error checking network status:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 