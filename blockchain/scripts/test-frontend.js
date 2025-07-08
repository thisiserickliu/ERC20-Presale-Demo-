const hre = require("hardhat");

async function main() {
  console.log("🧪 Testing Frontend-like Operations...");

  // Get the deployed contract addresses
  const presaleAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const tokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const usdtAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  try {
    // Get signer (this simulates the connected wallet)
    const [signer] = await hre.ethers.getSigners();
    console.log("👤 Connected Account:", signer.address);

    // Get contract instances with signer
    const presale = await hre.ethers.getContractAt("Presale", presaleAddress, signer);
    const token = await hre.ethers.getContractAt("MyToken", tokenAddress, signer);
    const usdt = await hre.ethers.getContractAt("MockUSDT", usdtAddress, signer);

    console.log("✅ Contracts loaded with signer");

    // Test 1: Get presale info (like frontend does)
    console.log("\n📊 Testing: Get Presale Info");
    const presaleInfo = await presale.getPresaleInfo();
    console.log("✅ Presale info retrieved successfully");
    console.log("  - Token Price:", hre.ethers.formatEther(presaleInfo[0]), "USDT");
    console.log("  - Min Purchase:", hre.ethers.formatEther(presaleInfo[1]), "tokens");
    console.log("  - Max Purchase:", hre.ethers.formatEther(presaleInfo[2]), "tokens");
    console.log("  - Total for Sale:", hre.ethers.formatEther(presaleInfo[3]), "tokens");
    console.log("  - Tokens Sold:", hre.ethers.formatEther(presaleInfo[4]), "tokens");
    console.log("  - Total Raised:", hre.ethers.formatEther(presaleInfo[5]), "USDT");

    // Test 2: Check user's USDT balance
    console.log("\n💰 Testing: Check USDT Balance");
    const usdtBalance = await usdt.balanceOf(signer.address);
    console.log("✅ USDT Balance:", hre.ethers.formatUnits(usdtBalance, 6), "USDT");

    // Test 3: Check user's token balance
    console.log("\n🪙 Testing: Check Token Balance");
    const tokenBalance = await token.balanceOf(signer.address);
    console.log("✅ Token Balance:", hre.ethers.formatEther(tokenBalance), "MTK");

    // Test 4: Simulate token purchase (small amount for testing)
    console.log("\n🛒 Testing: Token Purchase");
    const purchaseAmount = hre.ethers.parseEther("100"); // 100 tokens
    const tokenPrice = presaleInfo[0];
    const usdtCost = purchaseAmount * tokenPrice / hre.ethers.parseEther("1");
    
    console.log("  - Purchase Amount: 100 tokens");
    console.log("  - USDT Cost:", hre.ethers.formatUnits(usdtCost, 6), "USDT");

    // Approve USDT spending
    console.log("  - Approving USDT spending...");
    const approveTx = await usdt.approve(presaleAddress, usdtCost);
    await approveTx.wait();
    console.log("  ✅ USDT approval successful");

    // Purchase tokens
    console.log("  - Purchasing tokens...");
    const purchaseTx = await presale.buyTokens(purchaseAmount);
    await purchaseTx.wait();
    console.log("  ✅ Token purchase successful!");

    // Check updated balances
    const newTokenBalance = await token.balanceOf(signer.address);
    const newUsdtBalance = await usdt.balanceOf(signer.address);
    console.log("  - New Token Balance:", hre.ethers.formatEther(newTokenBalance), "MTK");
    console.log("  - New USDT Balance:", hre.ethers.formatUnits(newUsdtBalance, 6), "USDT");

    console.log("\n🎉 All frontend operations tested successfully!");
    console.log("💡 This means your contracts are working correctly.");
    console.log("🔧 The issue is likely with MetaMask connection or network settings.");

  } catch (error) {
    console.error("❌ Error during testing:", error.message);
    console.log("💡 This will help identify the specific issue.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 