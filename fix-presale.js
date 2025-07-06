const { ethers } = require("hardhat");

async function fixPresale() {
  console.log("🔧 修復 Presale 合約 Token 餘額...\n");

  const PRESALE_ADDRESS = '0x09635F643e140090A9A8Dcd712eD6285858ceBef';
  const TOKEN_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

  // 獲取合約實例
  const myToken = await ethers.getContractAt("MyToken", TOKEN_ADDRESS);
  const [owner] = await ethers.getSigners();

  try {
    // 檢查 owner 的 Token 餘額
    const ownerBalance = await myToken.balanceOf(owner.address);
    console.log("👤 Owner Token 餘額:", ethers.formatUnits(ownerBalance, 18), "MTK");

    // 檢查 Presale 合約餘額
    const presaleBalance = await myToken.balanceOf(PRESALE_ADDRESS);
    console.log("📋 Presale 合約餘額:", ethers.formatUnits(presaleBalance, 18), "MTK");

    if (presaleBalance > 0n) {
      console.log("✅ Presale 合約已有足夠 Token，無需修復");
      return;
    }

    // 轉移 500,000 Token 到 Presale 合約
    const amountToTransfer = ethers.parseUnits("500000", 18);
    console.log("🔄 轉移", ethers.formatUnits(amountToTransfer, 18), "MTK 到 Presale 合約...");
    
    const tx = await myToken.transfer(PRESALE_ADDRESS, amountToTransfer);
    await tx.wait();
    
    console.log("✅ 轉移完成！交易 Hash:", tx.hash);
    
    // 再次檢查餘額
    const newPresaleBalance = await myToken.balanceOf(PRESALE_ADDRESS);
    console.log("📋 修復後 Presale 合約餘額:", ethers.formatUnits(newPresaleBalance, 18), "MTK");
    
  } catch (error) {
    console.error("❌ 修復過程中發生錯誤:", error.message);
  }
}

// 執行修復
fixPresale()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 