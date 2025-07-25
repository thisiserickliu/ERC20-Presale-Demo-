const { ethers } = require("hardhat");

async function main() {
  console.log("Setting up local environment...");
  
  // 獲取部署者賬戶
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  try {
    // 部署 Mock USDT
    console.log("\n1. Deploying Mock USDT...");
    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    const mockUSDT = await MockUSDT.deploy();
    await mockUSDT.waitForDeployment();
    const mockUSDTAddress = await mockUSDT.getAddress();
    console.log("MockUSDT deployed to:", mockUSDTAddress);
    
    // 部署 MyToken
    console.log("\n2. Deploying MyToken...");
    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy();
    await myToken.waitForDeployment();
    const myTokenAddress = await myToken.getAddress();
    console.log("MyToken deployed to:", myTokenAddress);
    
    // 部署 Presale
    console.log("\n3. Deploying Presale...");
    const currentTime = Math.floor(Date.now() / 1000);
    const presaleStart = currentTime + 60; // 1分鐘後開始
    const presaleEnd = currentTime + 9999 * 24 * 60 * 60; // 9999天後結束
    
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
    console.log("Presale deployed to:", presaleAddress);
    
    // 轉移代幣到預售合約
    console.log("\n4. Transferring tokens to presale contract...");
    const tokensForSale = ethers.parseUnits("500000", 18);
    const transferTx = await myToken.transfer(presaleAddress, tokensForSale);
    await transferTx.wait();
    console.log("✅ Transferred 500,000 tokens to presale contract");
    
    // 給用戶一些 USDT
    console.log("\n5. Giving USDT to user...");
    const usdtAmount = ethers.parseUnits("1000", 6);
    const usdtTx = await mockUSDT.transfer(deployer.address, usdtAmount);
    await usdtTx.wait();
    console.log("✅ Transferred 1000 USDT to user");
    
    // 測試合約
    console.log("\n6. Testing contracts...");
    
    // 測試 USDT
    const usdtName = await mockUSDT.name();
    const usdtSymbol = await mockUSDT.symbol();
    const usdtBalance = await mockUSDT.balanceOf(deployer.address);
    console.log("✅ USDT:", usdtName, "(", usdtSymbol, ")");
    console.log("   Balance:", ethers.formatUnits(usdtBalance, 6), "USDT");
    
    // 測試 MyToken
    const tokenName = await myToken.name();
    const tokenSymbol = await myToken.symbol();
    const tokenBalance = await myToken.balanceOf(deployer.address);
    console.log("✅ MyToken:", tokenName, "(", tokenSymbol, ")");
    console.log("   Balance:", ethers.formatUnits(tokenBalance, 18), "MTK");
    
    // 測試 Presale
    const tokenPrice = await presale.tokenPrice();
    const minPurchase = await presale.minPurchase();
    const maxPurchase = await presale.maxPurchase();
    const totalTokensForSale = await presale.totalTokensForSale();
    const tokensSold = await presale.tokensSold();
    const totalRaised = await presale.totalRaised();
    const presaleStartTime = await presale.presaleStart();
    const presaleEndTime = await presale.presaleEnd();
    const presaleFinalized = await presale.presaleFinalized();
    const whitelistEnabled = await presale.whitelistEnabled();
    
    console.log("✅ Presale Contract:");
    console.log("   Token Price:", ethers.formatUnits(tokenPrice, 6), "USDT");
    console.log("   Min Purchase:", ethers.formatUnits(minPurchase, 18), "tokens");
    console.log("   Max Purchase:", ethers.formatUnits(maxPurchase, 18), "tokens");
    console.log("   Total for Sale:", ethers.formatUnits(totalTokensForSale, 18), "tokens");
    console.log("   Tokens Sold:", ethers.formatUnits(tokensSold, 18), "tokens");
    console.log("   Total Raised:", ethers.formatUnits(totalRaised, 6), "USDT");
    console.log("   Start Time:", new Date(Number(presaleStartTime) * 1000).toLocaleString());
    console.log("   End Time:", new Date(Number(presaleEndTime) * 1000).toLocaleString());
    console.log("   Finalized:", presaleFinalized);
    console.log("   Whitelist Enabled:", whitelistEnabled);
    
    // 輸出合約地址
    console.log("\n📋 Contract Addresses:");
    console.log("===================");
    console.log("MockUSDT:", mockUSDTAddress);
    console.log("MyToken:", myTokenAddress);
    console.log("Presale:", presaleAddress);
    console.log("===================");
    
    console.log("\n🎉 Local environment setup complete!");
    console.log("You can now update your frontend constants.js with these addresses.");
    
  } catch (error) {
    console.error("❌ Error setting up local environment:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 