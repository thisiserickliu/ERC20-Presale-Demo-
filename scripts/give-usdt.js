const { ethers } = require("hardhat");

async function main() {
  const usdtAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
  const userAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Account #0
  
  const [owner] = await ethers.getSigners();
  
  const USDT = await ethers.getContractFactory("MockUSDT");
  const usdt = USDT.attach(usdtAddress);
  
  console.log("Giving USDT to user...");
  console.log("User address:", userAddress);
  
  // 給用戶轉 1000 USDT
  const amount = ethers.parseUnits("1000", 6); // USDT 有 6 位小數
  const tx = await usdt.connect(owner).transfer(userAddress, amount);
  await tx.wait();
  
  console.log("✅ Successfully transferred 1000 USDT to user!");
  
  // 檢查餘額
  const balance = await usdt.balanceOf(userAddress);
  console.log("User USDT balance:", ethers.formatUnits(balance, 6), "USDT");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 