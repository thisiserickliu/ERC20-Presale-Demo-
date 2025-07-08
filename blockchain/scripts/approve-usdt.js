// scripts/approve-usdt.js
async function main() {
  const [owner] = await ethers.getSigners();
  const usdt = await ethers.getContractAt("MockUSDT", "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707");
  const tx = await usdt.approve("0xa513E6E4b8f2a923D98304ec87F64353C4D5C853", "100000000"); // 100 USDT
  await tx.wait();
  console.log("Approve success!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 