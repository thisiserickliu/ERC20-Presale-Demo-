const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying contracts to Sepolia testnet...");
  
  // 獲取部署者賬戶
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
    // 部署 Mock USDT
    console.log("\n1. Deploying Mock USDT to Sepolia...");
    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    const mockUSDT = await MockUSDT.deploy();
    await mockUSDT.waitForDeployment();
    const mockUSDTAddress = await mockUSDT.getAddress();
    console.log("✅ MockUSDT deployed to:", mockUSDTAddress);
    
    // 等待幾個區塊確認
    await mockUSDT.deploymentTransaction().wait(3);
    
    // 部署 MyToken
    console.log("\n2. Deploying MyToken to Sepolia...");
    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy();
    await myToken.waitForDeployment();
    const myTokenAddress = await myToken.getAddress();
    console.log("✅ MyToken deployed to:", myTokenAddress);
    
    // 等待幾個區塊確認
    await myToken.deploymentTransaction().wait(3);
    
    // 部署 Presale
    console.log("\n3. Deploying Presale to Sepolia...");
    const currentTime = Math.floor(Date.now() / 1000);
    const presaleStart = currentTime + 300; // 5分鐘後開始
    const presaleEnd = currentTime + 30 * 24 * 60 * 60; // 30天後結束
    
    const Presale = await ethers.getContractFactory("Presale");
    const presale = await Presale.deploy(
      myTokenAddress,
      mockUSDTAddress,
      ethers.parseUnits("0.1", 6), // 0.1 USDT per token
      ethers.parseUnits("100", 18), // Min purchase: 100 tokens
      ethers.parseUnits("10000", 18), // Max purchase: 10,000 tokens
      ethers.parseUnits("500000", 18), // 500K tokens for sale
      presaleStart,
      presaleEnd
    );
    await presale.waitForDeployment();
    const presaleAddress = await presale.getAddress();
    console.log("✅ Presale deployed to:", presaleAddress);
    
    // 等待幾個區塊確認
    await presale.deploymentTransaction().wait(3);
    
    // 轉移代幣到預售合約
    console.log("\n4. Transferring tokens to presale contract...");
    const tokensForSale = ethers.parseUnits("500000", 18);
    const transferTx = await myToken.transfer(presaleAddress, tokensForSale);
    await transferTx.wait(3);
    console.log("✅ Transferred 500,000 tokens to presale contract");
    
    // 給部署者一些 USDT 用於測試
    console.log("\n5. Giving USDT to deployer for testing...");
    const usdtAmount = ethers.parseUnits("1000", 6);
    const usdtTx = await mockUSDT.transfer(deployer.address, usdtAmount);
    await usdtTx.wait(3);
    console.log("✅ Transferred 1000 USDT to deployer");
    
    // 輸出部署摘要
    console.log("\n🎉 Deployment Summary (Sepolia):");
    console.log("==================================");
    console.log("Network: Sepolia Testnet");
    console.log("Chain ID: 11155111");
    console.log("MockUSDT:", mockUSDTAddress);
    console.log("MyToken:", myTokenAddress);
    console.log("Presale:", presaleAddress);
    console.log("Presale Start:", new Date(presaleStart * 1000).toLocaleString());
    console.log("Presale End:", new Date(presaleEnd * 1000).toLocaleString());
    console.log("Token Price: 0.1 USDT per token");
    console.log("Min Purchase: 100 tokens");
    console.log("Max Purchase: 10,000 tokens");
    console.log("Total for Sale: 500,000 tokens");
    console.log("==================================");
    
    // 生成前端配置
    console.log("\n📋 Frontend Configuration (Sepolia):");
    console.log("Add this to your frontend/src/constants.js:");
    console.log("```javascript");
    console.log("// Sepolia Testnet Configuration");
    console.log("export const SEPOLIA_CONFIG = {");
    console.log("  MYTOKEN_ADDRESS: '" + myTokenAddress + "',");
    console.log("  USDT_ADDRESS: '" + mockUSDTAddress + "',");
    console.log("  PRESALE_ADDRESS: '" + presaleAddress + "',");
    console.log("  CHAIN_ID: 11155111,");
    console.log("  NETWORK_NAME: 'Sepolia Testnet'");
    console.log("};");
    console.log("```");
    
    console.log("\n🔗 View on Etherscan:");
    console.log("Sepolia Etherscan: https://sepolia.etherscan.io/");
    console.log("MockUSDT:", `https://sepolia.etherscan.io/address/${mockUSDTAddress}`);
    console.log("MyToken:", `https://sepolia.etherscan.io/address/${myTokenAddress}`);
    console.log("Presale:", `https://sepolia.etherscan.io/address/${presaleAddress}`);
    
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 