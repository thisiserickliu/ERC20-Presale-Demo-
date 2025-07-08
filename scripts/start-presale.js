const { ethers } = require("hardhat");

async function main() {
  const presaleAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
  const [owner] = await ethers.getSigners();

  const Presale = await ethers.getContractFactory("Presale");
  const presale = Presale.attach(presaleAddress);

  // 設定預售時間：現在開始，持續 7 天
  const now = Math.floor(Date.now() / 1000);
  const startTime = now + 60; // 1 分鐘後開始
  const endTime = now + (7 * 24 * 60 * 60); // 7 天後結束

  console.log("正在啟動預售...");
  console.log(`開始時間: ${new Date(startTime * 1000).toLocaleString()}`);
  console.log(`結束時間: ${new Date(endTime * 1000).toLocaleString()}`);
  
  const tx = await presale.connect(owner).startPresale(startTime, endTime);
  await tx.wait();

  console.log("✅ 預售已啟動！");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 