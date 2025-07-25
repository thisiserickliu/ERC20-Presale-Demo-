const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 測試合約連接和數據...");
  
  try {
    // 獲取合約實例
    const presaleAddress = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";
    const presale = await ethers.getContractAt("Presale", presaleAddress);
    
    console.log("\n📋 合約地址:");
    console.log("Presale:", presaleAddress);
    
    // 測試基本連接
    console.log("\n🔗 測試基本連接:");
    const owner = await presale.owner();
    console.log("Owner:", owner);
    
    // 獲取預售信息
    console.log("\n📊 預售信息:");
    const presaleInfo = await presale.getPresaleInfo();
    console.log("Token Price:", ethers.formatUnits(presaleInfo[0], 6), "USDT");
    console.log("Min Purchase:", ethers.formatUnits(presaleInfo[1], 18), "MTK");
    console.log("Max Purchase:", ethers.formatUnits(presaleInfo[2], 18), "MTK");
    console.log("Total for Sale:", ethers.formatUnits(presaleInfo[3], 18), "MTK");
    console.log("Tokens Sold:", ethers.formatUnits(presaleInfo[4], 18), "MTK");
    console.log("Total Raised:", ethers.formatUnits(presaleInfo[5], 6), "USDT");
    console.log("Presale Start:", new Date(Number(presaleInfo[6]) * 1000).toLocaleString());
    console.log("Presale End:", new Date(Number(presaleInfo[7]) * 1000).toLocaleString());
    console.log("Presale Finalized:", presaleInfo[8]);
    console.log("Whitelist Enabled:", presaleInfo[9]);
    
    // 測試用戶信息
    console.log("\n👤 測試用戶信息:");
    const [deployer] = await ethers.getSigners();
    const userInfo = await presale.getUserInfo(deployer.address);
    console.log("User:", deployer.address);
    console.log("Purchased:", ethers.formatUnits(userInfo[0], 18), "MTK");
    console.log("Whitelisted:", userInfo[1]);
    
    // 檢查代幣餘額
    console.log("\n💰 檢查代幣餘額:");
    const tokenAddress = await presale.token();
    const usdtAddress = await presale.paymentToken();
    
    console.log("Token Address:", tokenAddress);
    console.log("USDT Address:", usdtAddress);
    
    const token = await ethers.getContractAt("MyToken", tokenAddress);
    const usdt = await ethers.getContractAt("MockUSDT", usdtAddress);
    
    const tokenBalance = await token.balanceOf(deployer.address);
    const usdtBalance = await usdt.balanceOf(deployer.address);
    
    console.log("Token Balance:", ethers.formatUnits(tokenBalance, 18), "MTK");
    console.log("USDT Balance:", ethers.formatUnits(usdtBalance, 6), "USDT");
    
    // 檢查預售合約餘額
    console.log("\n🏦 預售合約餘額:");
    const presaleTokenBalance = await token.balanceOf(presaleAddress);
    const presaleUsdtBalance = await usdt.balanceOf(presaleAddress);
    
    console.log("Presale Token Balance:", ethers.formatUnits(presaleTokenBalance, 18), "MTK");
    console.log("Presale USDT Balance:", ethers.formatUnits(presaleUsdtBalance, 6), "USDT");
    
    console.log("\n✅ 合約連接測試完成！");
    console.log("==================================");
    console.log("所有數據都正常，前端應該能夠連接");
    console.log("請確保 MetaMask 連接到 Hardhat Local 網絡");
    console.log("Chain ID: 31337");
    console.log("RPC URL: http://127.0.0.1:8545");
    
  } catch (error) {
    console.error("❌ 測試失敗:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 