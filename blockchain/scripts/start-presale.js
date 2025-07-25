const { ethers } = require("hardhat");
async function main() {
  console.log("正在啟動預售...");
  const presaleAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // Replace with your deployed Presale contract address
  const presale = await ethers.getContractAt("Presale", presaleAddress);
  const now = Math.floor(Date.now() / 1000);
  const presaleStart = now + 60; // 1分鐘後開始
  const presaleEnd = now + (7 * 24 * 60 * 60); // 7 days from now
  console.log("開始時間:", new Date(presaleStart * 1000).toLocaleString());
  console.log("結束時間:", new Date(presaleEnd * 1000).toLocaleString());
  const tx = await presale.startPresale(presaleStart, presaleEnd);
  await tx.wait();
  console.log("✅ 預售已啟動！");
}
main().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1); }); 