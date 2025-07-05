const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy Mock USDT first
  const MockUSDT = await hre.ethers.getContractFactory("MockUSDT");
  const mockUSDT = await MockUSDT.deploy();
  await mockUSDT.waitForDeployment();
  console.log("MockUSDT deployed to:", await mockUSDT.getAddress());

  // Deploy MyToken
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy("MyToken", "MTK", 1000000); // 1M tokens
  await myToken.waitForDeployment();
  console.log("MyToken deployed to:", await myToken.getAddress());

  // Deploy Presale
  const currentTime = Math.floor(Date.now() / 1000);
  const presaleStart = currentTime + 60; // Start in 1 minute
  const presaleEnd = currentTime + 86400 * 30; // End in 30 days

  const Presale = await hre.ethers.getContractFactory("Presale");
  const presale = await Presale.deploy(
    await myToken.getAddress(),
    await mockUSDT.getAddress(),
    ethers.parseUnits("0.1", 6), // 0.1 USDT per token
    ethers.parseUnits("100", 18), // Min purchase: 100 tokens
    ethers.parseUnits("10000", 18), // Max purchase: 10,000 tokens
    ethers.parseUnits("500000", 18), // 500K tokens for sale
    presaleStart,
    presaleEnd
  );
  await presale.waitForDeployment();
  console.log("Presale deployed to:", await presale.getAddress());

  // Transfer tokens to presale contract
  const tokensForSale = ethers.parseUnits("500000", 18);
  await myToken.transfer(await presale.getAddress(), tokensForSale);
  console.log("Transferred 500,000 tokens to presale contract");

  // Mint some USDT to deployer for testing
  const usdtAmount = ethers.parseUnits("10000", 6); // 10K USDT
  await mockUSDT.mint(deployer.address, usdtAmount);
  console.log("Minted 10,000 USDT to deployer");

  console.log("\nDeployment Summary:");
  console.log("===================");
  console.log("MockUSDT:", await mockUSDT.getAddress());
  console.log("MyToken:", await myToken.getAddress());
  console.log("Presale:", await presale.getAddress());
  console.log("Presale Start:", new Date(presaleStart * 1000).toLocaleString());
  console.log("Presale End:", new Date(presaleEnd * 1000).toLocaleString());
  console.log("Token Price: 0.1 USDT per token");
  console.log("Min Purchase: 100 tokens");
  console.log("Max Purchase: 10,000 tokens");
  console.log("Total for Sale: 500,000 tokens");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 