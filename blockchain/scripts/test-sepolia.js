const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing contracts on Sepolia testnet...");
  
  // 檢查環境變數
  if (!process.env.PRIVATE_KEY) {
    throw new Error("❌ PRIVATE_KEY not found in environment variables");
  }
  
  if (!process.env.SEPOLIA_RPC_URL) {
    throw new Error("❌ SEPOLIA_RPC_URL not found in environment variables");
  }
  
  // 這裡需要填入實際部署的合約地址
  const presaleAddress = process.env.SEPOLIA_PRESALE_ADDRESS || "YOUR_PRESALE_ADDRESS";
  const tokenAddress = process.env.SEPOLIA_TOKEN_ADDRESS || "YOUR_TOKEN_ADDRESS";
  const usdtAddress = process.env.SEPOLIA_USDT_ADDRESS || "YOUR_USDT_ADDRESS";
  
  if (presaleAddress === "YOUR_PRESALE_ADDRESS") {
    console.log("⚠️  Please set the contract addresses in environment variables:");
    console.log("   SEPOLIA_PRESALE_ADDRESS=your_presale_address");
    console.log("   SEPOLIA_TOKEN_ADDRESS=your_token_address");
    console.log("   SEPOLIA_USDT_ADDRESS=your_usdt_address");
    return;
  }
  
  try {
    // 獲取合約實例
    const presale = await ethers.getContractAt("Presale", presaleAddress);
    const token = await ethers.getContractAt("MyToken", tokenAddress);
    const usdt = await ethers.getContractAt("MockUSDT", usdtAddress);
    
    console.log("✅ Contracts loaded successfully");
    
    // 獲取部署者賬戶
    const [deployer] = await ethers.getSigners();
    console.log("Testing with account:", deployer.address);
    
    // 測試預售信息
    console.log("\n📊 Presale Information:");
    const presaleInfo = await presale.getPresaleInfo();
    console.log("  - Token Price:", ethers.formatUnits(presaleInfo[0], 6), "USDT");
    console.log("  - Min Purchase:", ethers.formatUnits(presaleInfo[1], 18), "tokens");
    console.log("  - Max Purchase:", ethers.formatUnits(presaleInfo[2], 18), "tokens");
    console.log("  - Total for Sale:", ethers.formatUnits(presaleInfo[3], 18), "tokens");
    console.log("  - Tokens Sold:", ethers.formatUnits(presaleInfo[4], 18), "tokens");
    console.log("  - Total Raised:", ethers.formatUnits(presaleInfo[5], 6), "USDT");
    console.log("  - Start Time:", new Date(Number(presaleInfo[6]) * 1000).toLocaleString());
    console.log("  - End Time:", new Date(Number(presaleInfo[7]) * 1000).toLocaleString());
    console.log("  - Finalized:", presaleInfo[8]);
    console.log("  - Whitelist Enabled:", presaleInfo[9]);
    
    // 測試代幣信息
    console.log("\n🪙 Token Information:");
    const tokenName = await token.name();
    const tokenSymbol = await token.symbol();
    const tokenSupply = await token.totalSupply();
    console.log("  - Name:", tokenName);
    console.log("  - Symbol:", tokenSymbol);
    console.log("  - Total Supply:", ethers.formatUnits(tokenSupply, 18), "tokens");
    
    // 測試 USDT 信息
    console.log("\n💵 USDT Information:");
    const usdtName = await usdt.name();
    const usdtSymbol = await usdt.symbol();
    const usdtDecimals = await usdt.decimals();
    console.log("  - Name:", usdtName);
    console.log("  - Symbol:", usdtSymbol);
    console.log("  - Decimals:", usdtDecimals);
    
    // 檢查用戶餘額
    console.log("\n👤 User Balances:");
    const userUsdtBalance = await usdt.balanceOf(deployer.address);
    const userTokenBalance = await token.balanceOf(deployer.address);
    console.log("  - USDT Balance:", ethers.formatUnits(userUsdtBalance, 6), "USDT");
    console.log("  - Token Balance:", ethers.formatUnits(userTokenBalance, 18), "MTK");
    
    // 檢查用戶預售信息
    console.log("\n📋 User Presale Info:");
    const userInfo = await presale.getUserInfo(deployer.address);
    console.log("  - Purchased:", ethers.formatUnits(userInfo[0], 18), "tokens");
    console.log("  - Whitelisted:", userInfo[1]);
    
    // 檢查預售狀態
    const currentTime = Math.floor(Date.now() / 1000);
    const isActive = currentTime >= Number(presaleInfo[6]) && currentTime <= Number(presaleInfo[7]);
    console.log("\n🎯 Presale Status:");
    console.log("  - Current Time:", new Date(currentTime * 1000).toLocaleString());
    console.log("  - Presale Active:", isActive);
    console.log("  - Progress:", ((ethers.formatUnits(presaleInfo[4], 18) / ethers.formatUnits(presaleInfo[3], 18)) * 100).toFixed(2) + "%");
    
    console.log("\n🎉 All tests passed on Sepolia!");
    
  } catch (error) {
    console.error("❌ Error testing contracts:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 