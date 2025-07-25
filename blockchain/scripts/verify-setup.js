const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 驗證系統設置...");
  
  try {
    // 檢查網絡連接
    console.log("\n1️⃣ 檢查網絡連接...");
    const provider = ethers.provider;
    const network = await provider.getNetwork();
    console.log("✅ 連接到網絡:", network.name, "(Chain ID:", network.chainId, ")");
    
    // 檢查賬戶
    console.log("\n2️⃣ 檢查賬戶...");
    const [deployer] = await ethers.getSigners();
    const balance = await provider.getBalance(deployer.address);
    console.log("✅ 部署者地址:", deployer.address);
    console.log("✅ ETH 餘額:", ethers.formatEther(balance), "ETH");
    
    // 檢查合約地址
    console.log("\n3️⃣ 檢查合約地址...");
    const presaleAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const tokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const usdtAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    
    console.log("✅ Presale:", presaleAddress);
    console.log("✅ MyToken:", tokenAddress);
    console.log("✅ MockUSDT:", usdtAddress);
    
    // 檢查合約代碼是否存在
    console.log("\n4️⃣ 檢查合約代碼...");
    const presaleCode = await provider.getCode(presaleAddress);
    const tokenCode = await provider.getCode(tokenAddress);
    const usdtCode = await provider.getCode(usdtAddress);
    
    if (presaleCode !== "0x") {
      console.log("✅ Presale 合約已部署");
    } else {
      console.log("❌ Presale 合約未部署");
    }
    
    if (tokenCode !== "0x") {
      console.log("✅ MyToken 合約已部署");
    } else {
      console.log("❌ MyToken 合約未部署");
    }
    
    if (usdtCode !== "0x") {
      console.log("✅ MockUSDT 合約已部署");
    } else {
      console.log("❌ MockUSDT 合約未部署");
    }
    
    // 測試基本合約調用
    console.log("\n5️⃣ 測試合約調用...");
    try {
      const presale = await ethers.getContractAt("Presale", presaleAddress);
      const tokenPrice = await presale.tokenPrice();
      console.log("✅ Token Price:", ethers.formatUnits(tokenPrice, 6), "USDT");
      
      const presaleInfo = await presale.getPresaleInfo();
      console.log("✅ Total Raised:", ethers.formatUnits(presaleInfo[5], 6), "USDT");
      console.log("✅ Tokens Sold:", ethers.formatUnits(presaleInfo[4], 18), "MTK");
      
    } catch (error) {
      console.log("❌ 合約調用失敗:", error.message);
    }
    
    // 檢查 USDT 餘額
    console.log("\n6️⃣ 檢查 USDT 餘額...");
    try {
      const usdt = await ethers.getContractAt("MockUSDT", usdtAddress);
      const usdtBalance = await usdt.balanceOf(deployer.address);
      console.log("✅ USDT 餘額:", ethers.formatUnits(usdtBalance, 6), "USDT");
    } catch (error) {
      console.log("❌ USDT 餘額檢查失敗:", error.message);
    }
    
    console.log("\n🎉 系統設置驗證完成！");
    console.log("==================================");
    console.log("📋 下一步操作：");
    console.log("1. 在 MetaMask 中添加 Hardhat Local 網絡");
    console.log("   - RPC URL: http://127.0.0.1:8545");
    console.log("   - Chain ID: 31337");
    console.log("2. 導入測試私鑰: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");
    console.log("3. 訪問 http://localhost:3000/presale");
    console.log("4. 點擊 'Connect Wallet' 連接錢包");
    
  } catch (error) {
    console.error("❌ 驗證失敗:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 