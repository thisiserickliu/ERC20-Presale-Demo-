const { ethers } = require("hardhat");

async function main() {
  const presaleAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
  const usdtAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
  const tokenAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
  
  const [owner, user] = await ethers.getSigners();

  const Presale = await ethers.getContractFactory("Presale");
  const presale = Presale.attach(presaleAddress);
  
  const USDT = await ethers.getContractFactory("MockUSDT");
  const usdt = USDT.attach(usdtAddress);

  console.log("=== Presale Status Check ===");
  
  // 檢查預售資訊
  const presaleInfo = await presale.getPresaleInfo();
  console.log("Presale Info:");
  console.log("- Token Price:", ethers.formatUnits(presaleInfo[0], 6), "USDT");
  console.log("- Min Purchase:", ethers.formatUnits(presaleInfo[1], 18), "tokens");
  console.log("- Max Purchase:", ethers.formatUnits(presaleInfo[2], 18), "tokens");
  console.log("- Total For Sale:", ethers.formatUnits(presaleInfo[3], 18), "tokens");
  console.log("- Tokens Sold:", ethers.formatUnits(presaleInfo[4], 18), "tokens");
  console.log("- Total Raised:", ethers.formatUnits(presaleInfo[5], 6), "USDT");
  console.log("- Start Time:", new Date(Number(presaleInfo[6]) * 1000).toLocaleString());
  console.log("- End Time:", new Date(Number(presaleInfo[7]) * 1000).toLocaleString());
  console.log("- Finalized:", presaleInfo[8]);
  console.log("- Whitelist Enabled:", presaleInfo[9]);
  
  // 檢查當前時間
  const currentTime = Math.floor(Date.now() / 1000);
  console.log("\nCurrent Time:", new Date(currentTime * 1000).toLocaleString());
  
  // 檢查預售狀態
  const isActive = currentTime >= Number(presaleInfo[6]) && currentTime <= Number(presaleInfo[7]);
  console.log("Presale Active:", isActive);
  
  // 檢查用戶餘額
  const userBalance = await usdt.balanceOf(user.address);
  console.log("\nUser USDT Balance:", ethers.formatUnits(userBalance, 6));
  
  // 檢查用戶白名單狀態
  const userInfo = await presale.getUserInfo(user.address);
  console.log("User Whitelisted:", userInfo[1]);
  
  // 檢查用戶已購買數量
  console.log("User Purchased:", ethers.formatUnits(userInfo[0], 18), "tokens");
  
  // 檢查 owner 餘額
  const ownerBalance = await usdt.balanceOf(owner.address);
  console.log("\nOwner USDT Balance:", ethers.formatUnits(ownerBalance, 6));
  
  // 如果白名單啟用，將用戶加入白名單
  if (presaleInfo[9] && !userInfo[1]) {
    console.log("\nAdding user to whitelist...");
    const tx = await presale.connect(owner).setWhitelist([user.address], [true]);
    await tx.wait();
    console.log("User added to whitelist!");
  }
  
  // 給用戶一些 USDT 如果餘額不足
  if (userBalance < ethers.parseUnits("1000", 6)) {
    console.log("\nTransferring USDT to user...");
    const tx = await usdt.connect(owner).transfer(user.address, ethers.parseUnits("1000", 6));
    await tx.wait();
    console.log("USDT transferred to user!");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 