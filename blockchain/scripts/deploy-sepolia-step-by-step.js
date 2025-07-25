const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Step-by-step deployment to Sepolia testnet...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");
  
  // 檢查環境變數
  if (!process.env.PRIVATE_KEY) {
    throw new Error("❌ PRIVATE_KEY not found in environment variables");
  }
  
  if (!process.env.SEPOLIA_RPC_URL) {
    throw new Error("❌ SEPOLIA_RPC_URL not found in environment variables");
  }
  
  try {
    // 獲取當前 gas 價格並設置較高的價格
    const gasPrice = await ethers.provider.getFeeData();
    const customGasPrice = gasPrice.gasPrice * 150n / 100n; // 增加 50%
    console.log("Using gas price:", ethers.formatUnits(customGasPrice, "gwei"), "gwei");
    
    // 只部署 Mock USDT
    console.log("\n1. Deploying Mock USDT to Sepolia...");
    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    const mockUSDT = await MockUSDT.deploy({
      gasPrice: customGasPrice,
      gasLimit: 2000000
    });
    
    console.log("⏳ Waiting for MockUSDT deployment...");
    await mockUSDT.waitForDeployment();
    const mockUSDTAddress = await mockUSDT.getAddress();
    console.log("✅ MockUSDT deployed to:", mockUSDTAddress);
    
    console.log("\n🎉 Step 1 completed!");
    console.log("MockUSDT address:", mockUSDTAddress);
    console.log("\nTo continue with next step, run:");
    console.log("npx hardhat run scripts/deploy-sepolia-step2.js --network sepolia");
    
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    console.error("Error details:", error.message);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 