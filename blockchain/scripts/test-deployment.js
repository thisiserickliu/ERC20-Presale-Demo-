const { ethers } = require("hardhat");

async function main() {
  console.log("Testing contract deployment...");
  
  const presaleAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const tokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const usdtAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  try {
    // 獲取合約實例
    const presale = await ethers.getContractAt("Presale", presaleAddress);
    const token = await ethers.getContractAt("MyToken", tokenAddress);
    const usdt = await ethers.getContractAt("MockUSDT", usdtAddress);
    
    console.log("✅ Contracts loaded successfully");
    
    // 測試預售信息
    const presaleInfo = await presale.getPresaleInfo();
    console.log("✅ Presale info:");
    console.log("  - Token Price:", ethers.formatUnits(presaleInfo[0], 6), "USDT");
    console.log("  - Min Purchase:", ethers.formatUnits(presaleInfo[1], 18), "tokens");
    console.log("  - Max Purchase:", ethers.formatUnits(presaleInfo[2], 18), "tokens");
    console.log("  - Total for Sale:", ethers.formatUnits(presaleInfo[3], 18), "tokens");
    console.log("  - Tokens Sold:", ethers.formatUnits(presaleInfo[4], 18), "tokens");
    console.log("  - Total Raised:", ethers.formatUnits(presaleInfo[5], 6), "USDT");
    console.log("  - Start Time:", new Date(Number(presaleInfo[6]) * 1000).toLocaleString());
    console.log("  - End Time:", new Date(Number(presaleInfo[7]) * 1000).toLocaleString());
    console.log("  - Finalized:", presaleInfo[8]);
    console.log("  - Whitelist Enabled:", presaleInfo[9]);
    
    // 測試代幣信息
    const tokenName = await token.name();
    const tokenSymbol = await token.symbol();
    const tokenSupply = await token.totalSupply();
    console.log("✅ Token info:");
    console.log("  - Name:", tokenName);
    console.log("  - Symbol:", tokenSymbol);
    console.log("  - Total Supply:", ethers.formatUnits(tokenSupply, 18), "tokens");
    
    // 測試 USDT 信息
    const usdtName = await usdt.name();
    const usdtSymbol = await usdt.symbol();
    const usdtDecimals = await usdt.decimals();
    console.log("✅ USDT info:");
    console.log("  - Name:", usdtName);
    console.log("  - Symbol:", usdtSymbol);
    console.log("  - Decimals:", usdtDecimals);
    
    // 檢查用戶餘額
    const [user] = await ethers.getSigners();
    const userUsdtBalance = await usdt.balanceOf(user.address);
    const userTokenBalance = await token.balanceOf(user.address);
    console.log("✅ User balances:");
    console.log("  - USDT Balance:", ethers.formatUnits(userUsdtBalance, 6), "USDT");
    console.log("  - Token Balance:", ethers.formatUnits(userTokenBalance, 18), "MTK");
    
    // 檢查用戶預售信息
    const userInfo = await presale.getUserInfo(user.address);
    console.log("✅ User presale info:");
    console.log("  - Purchased:", ethers.formatUnits(userInfo[0], 18), "tokens");
    console.log("  - Whitelisted:", userInfo[1]);
    
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