const hre = require("hardhat");

async function main() {
  console.log("Testing contracts on localhost...");

  // Get the deployed contract addresses
  const presaleAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const tokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const usdtAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  try {
    // Get contract instances
    const presale = await hre.ethers.getContractAt("Presale", presaleAddress);
    const token = await hre.ethers.getContractAt("MyToken", tokenAddress);
    const usdt = await hre.ethers.getContractAt("MockUSDT", usdtAddress);

    console.log("✅ Contracts loaded successfully");

    // Test presale info
    const presaleInfo = await presale.getPresaleInfo();
    console.log("✅ Presale info retrieved:");
    console.log("  - Token Price:", hre.ethers.formatEther(presaleInfo[0]), "USDT");
    console.log("  - Min Purchase:", hre.ethers.formatEther(presaleInfo[1]), "tokens");
    console.log("  - Max Purchase:", hre.ethers.formatEther(presaleInfo[2]), "tokens");
    console.log("  - Total for Sale:", hre.ethers.formatEther(presaleInfo[3]), "tokens");
    console.log("  - Tokens Sold:", hre.ethers.formatEther(presaleInfo[4]), "tokens");
    console.log("  - Total Raised:", hre.ethers.formatEther(presaleInfo[5]), "USDT");

    // Test token info
    const tokenName = await token.name();
    const tokenSymbol = await token.symbol();
    const tokenSupply = await token.totalSupply();
    console.log("✅ Token info:");
    console.log("  - Name:", tokenName);
    console.log("  - Symbol:", tokenSymbol);
    console.log("  - Total Supply:", hre.ethers.formatEther(tokenSupply), "tokens");

    // Test USDT info
    const usdtName = await usdt.name();
    const usdtSymbol = await usdt.symbol();
    console.log("✅ USDT info:");
    console.log("  - Name:", usdtName);
    console.log("  - Symbol:", usdtSymbol);

    console.log("\n🎉 All contracts are working correctly!");

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