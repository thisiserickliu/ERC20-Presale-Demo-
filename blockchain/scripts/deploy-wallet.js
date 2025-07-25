const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 通過錢包部署到 Sepolia 測試網...");
  console.log("請確保您的 MetaMask 已連接到 Sepolia 測試網");
  console.log("並有足夠的 Sepolia ETH");
  
  try {
    // 獲取部署者賬戶
    const [deployer] = await ethers.getSigners();
    console.log("\n📋 部署信息:");
    console.log("部署者地址:", deployer.address);
    console.log("部署者餘額:", ethers.formatEther(await deployer.getBalance()), "ETH");
    
    // 檢查餘額
    const balance = await deployer.getBalance();
    if (balance < ethers.parseEther("0.01")) {
      console.log("\n❌ 餘額不足！需要至少 0.01 ETH");
      console.log("請從以下水龍頭獲取 Sepolia ETH:");
      console.log("- https://sepoliafaucet.com/");
      console.log("- https://faucet.sepolia.dev/");
      return;
    }
    
    console.log("\n1️⃣ 部署 Mock USDT...");
    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    const mockUSDT = await MockUSDT.deploy();
    await mockUSDT.waitForDeployment();
    const mockUSDTAddress = await mockUSDT.getAddress();
    console.log("✅ MockUSDT 已部署到:", mockUSDTAddress);
    
    console.log("\n2️⃣ 部署 MyToken...");
    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy();
    await myToken.waitForDeployment();
    const myTokenAddress = await myToken.getAddress();
    console.log("✅ MyToken 已部署到:", myTokenAddress);
    
    console.log("\n3️⃣ 部署 Presale...");
    const currentTime = Math.floor(Date.now() / 1000);
    const presaleStart = currentTime + 300; // 5分鐘後開始
    const presaleEnd = currentTime + 30 * 24 * 60 * 60; // 30天後結束
    
    const Presale = await ethers.getContractFactory("Presale");
    const presale = await Presale.deploy(
      myTokenAddress,
      mockUSDTAddress,
      ethers.parseUnits("0.1", 6), // 0.1 USDT per token
      ethers.parseUnits("100", 18), // Min purchase: 100 tokens
      ethers.parseUnits("10000", 18), // Max purchase: 10,000 tokens
      ethers.parseUnits("500000", 18), // 500K tokens for sale
      presaleStart,
      presaleEnd
    );
    await presale.waitForDeployment();
    const presaleAddress = await presale.getAddress();
    console.log("✅ Presale 已部署到:", presaleAddress);
    
    console.log("\n4️⃣ 初始化合約...");
    
    // 轉移代幣到預售合約
    console.log("轉移代幣到預售合約...");
    const tokensForSale = ethers.parseUnits("500000", 18);
    const transferTx = await myToken.transfer(presaleAddress, tokensForSale);
    await transferTx.wait();
    console.log("✅ 已轉移 500,000 代幣到預售合約");
    
    // 給部署者一些 USDT
    console.log("給部署者轉移 USDT...");
    const usdtAmount = ethers.parseUnits("1000", 6);
    const usdtTx = await mockUSDT.transfer(deployer.address, usdtAmount);
    await usdtTx.wait();
    console.log("✅ 已轉移 1000 USDT 給部署者");
    
    // 輸出部署摘要
    console.log("\n🎉 部署完成！");
    console.log("==================================");
    console.log("網絡: Sepolia 測試網");
    console.log("Chain ID: 11155111");
    console.log("MockUSDT:", mockUSDTAddress);
    console.log("MyToken:", myTokenAddress);
    console.log("Presale:", presaleAddress);
    console.log("預售開始:", new Date(presaleStart * 1000).toLocaleString());
    console.log("預售結束:", new Date(presaleEnd * 1000).toLocaleString());
    console.log("代幣價格: 0.1 USDT per token");
    console.log("最小購買: 100 tokens");
    console.log("最大購買: 10,000 tokens");
    console.log("總銷售: 500,000 tokens");
    console.log("==================================");
    
    // 生成前端配置
    console.log("\n📋 前端配置 (frontend/src/constants.js):");
    console.log("```javascript");
    console.log("// 切換到 Sepolia");
    console.log("export const CURRENT_NETWORK = 'SEPOLIA';");
    console.log("");
    console.log("// 更新為實際部署的地址");
    console.log("export const SEPOLIA_CONFIG = {");
    console.log("  MYTOKEN_ADDRESS: '" + myTokenAddress + "',");
    console.log("  USDT_ADDRESS: '" + mockUSDTAddress + "',");
    console.log("  PRESALE_ADDRESS: '" + presaleAddress + "'");
    console.log("};");
    console.log("```");
    
    console.log("\n🔗 在 Etherscan 上查看:");
    console.log("Sepolia Etherscan: https://sepolia.etherscan.io/");
    console.log("MockUSDT:", `https://sepolia.etherscan.io/address/${mockUSDTAddress}`);
    console.log("MyToken:", `https://sepolia.etherscan.io/address/${myTokenAddress}`);
    console.log("Presale:", `https://sepolia.etherscan.io/address/${presaleAddress}`);
    
    console.log("\n🎯 下一步:");
    console.log("1. 更新前端配置");
    console.log("2. 重新啟動前端應用");
    console.log("3. 測試所有功能");
    
  } catch (error) {
    console.error("❌ 部署失敗:", error.message);
    console.log("\n💡 可能的解決方案:");
    console.log("- 確保 MetaMask 連接到 Sepolia 測試網");
    console.log("- 確保有足夠的 Sepolia ETH");
    console.log("- 檢查網絡連接");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 