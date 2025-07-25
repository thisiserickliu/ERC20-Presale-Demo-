const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 部署合約 - 無白名單版本");
  console.log("================================================");
  
  try {
    // 獲取部署者賬戶
    const [deployer, user1, user2] = await ethers.getSigners();
    console.log("\n📋 部署信息:");
    console.log("部署者:", deployer.address);
    console.log("測試用戶1:", user1.address);
    console.log("測試用戶2:", user2.address);
    
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
    const presaleStart = currentTime + 10; // 10秒後開始
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
    const tokensForSale = ethers.parseUnits("500000", 18);
    const transferTx = await myToken.transfer(presaleAddress, tokensForSale);
    await transferTx.wait();
    console.log("✅ 已轉移 500,000 代幣到預售合約");
    
    // 給測試用戶一些 USDT
    const usdtAmount = ethers.parseUnits("1000", 6);
    const usdtTx1 = await mockUSDT.transfer(user1.address, usdtAmount);
    await usdtTx1.wait();
    const usdtTx2 = await mockUSDT.transfer(user2.address, usdtAmount);
    await usdtTx2.wait();
    console.log("✅ 已給測試用戶轉移 USDT");
    
    // 給部署者一些 USDT
    const deployerUsdtTx = await mockUSDT.transfer(deployer.address, usdtAmount);
    await deployerUsdtTx.wait();
    console.log("✅ 已給部署者轉移 USDT");
    
    console.log("\n5️⃣ 測試購買功能...");
    
    // User1 嘗試購買
    console.log("User1 嘗試購買代幣...");
    
    // 獲取預售信息
    const presaleInfo = await presale.getPresaleInfo();
    const minPurchase = presaleInfo[1]; // minPurchase
    
    // 批准 USDT
    const approveTx = await mockUSDT.connect(user1).approve(presaleAddress, usdtAmount);
    await approveTx.wait();
    console.log("✅ User1 USDT 批准成功");
    
    // 等待預售開始
    console.log("等待預售開始...");
    await new Promise(resolve => setTimeout(resolve, 15000)); // 等待15秒
    
    // 嘗試購買
    const buyTx = await presale.connect(user1).buyTokens(minPurchase);
    await buyTx.wait();
    console.log("✅ User1 購買成功");
    
    // 檢查購買結果
    const user1TokenBalance = await myToken.balanceOf(user1.address);
    const user1UsdtBalance = await mockUSDT.balanceOf(user1.address);
    console.log("User1 代幣餘額:", ethers.formatUnits(user1TokenBalance, 18));
    console.log("User1 USDT 餘額:", ethers.formatUnits(user1UsdtBalance, 6));
    
    console.log("\n🎉 部署完成！");
    console.log("==================================");
    console.log("網絡: 本地 Hardhat");
    console.log("Chain ID: 31337");
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
    console.log("// 使用本地配置");
    console.log("export const CURRENT_NETWORK = 'LOCAL';");
    console.log("");
    console.log("// 更新為實際部署的地址");
    console.log("export const LOCAL_CONFIG = {");
    console.log("  MYTOKEN_ADDRESS: '" + myTokenAddress + "',");
    console.log("  USDT_ADDRESS: '" + mockUSDTAddress + "',");
    console.log("  PRESALE_ADDRESS: '" + presaleAddress + "'");
    console.log("};");
    console.log("```");
    
    console.log("\n🎯 下一步:");
    console.log("1. 更新前端配置");
    console.log("2. 啟動前端: cd frontend && npm start");
    console.log("3. 連接 MetaMask 到本地網絡");
    console.log("4. 測試購買功能");
    
  } catch (error) {
    console.error("❌ 部署失敗:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 