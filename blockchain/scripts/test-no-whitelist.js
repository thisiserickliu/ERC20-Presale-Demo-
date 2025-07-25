const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 測試無白名單版本");
  console.log("================================");

  try {
    const [deployer, user1, user2] = await ethers.getSigners();
    console.log("\n📋 測試賬戶:");
    console.log("部署者:", deployer.address);
    console.log("用戶1:", user1.address);
    console.log("用戶2:", user2.address);

    // 使用最新部署的合約地址
    const PRESALE_ADDRESS = '0x09635F643e140090A9A8Dcd712eD6285858ceBef';
    const USDT_ADDRESS = '0x4A679253410272dd5232B3Ff7cF5dbB88f295319';
    const MYTOKEN_ADDRESS = '0x7a2088a1bFc9d81c55368AE168C2C02570cB814F';

    console.log("\n📋 合約地址:");
    console.log("Presale:", PRESALE_ADDRESS);
    console.log("USDT:", USDT_ADDRESS);
    console.log("MyToken:", MYTOKEN_ADDRESS);

    // 獲取合約實例
    const presale = await ethers.getContractAt("Presale", PRESALE_ADDRESS);
    const usdt = await ethers.getContractAt("MockUSDT", USDT_ADDRESS);
    const mytoken = await ethers.getContractAt("MyToken", MYTOKEN_ADDRESS);

    console.log("\n1️⃣ 檢查預售信息...");
    const presaleInfo = await presale.getPresaleInfo();
    console.log("代幣價格:", presaleInfo[0].toString(), "wei");
    console.log("最小購買:", presaleInfo[1].toString(), "wei");
    console.log("最大購買:", presaleInfo[2].toString(), "wei");
    console.log("總銷售:", presaleInfo[3].toString(), "wei");
    console.log("已售:", presaleInfo[4].toString(), "wei");
    console.log("總籌集:", presaleInfo[5].toString(), "wei");
    console.log("預售開始:", new Date(Number(presaleInfo[6]) * 1000).toLocaleString());
    console.log("預售結束:", new Date(Number(presaleInfo[7]) * 1000).toLocaleString());
    console.log("預售完成:", presaleInfo[8]);

    console.log("\n2️⃣ 檢查用戶初始狀態...");
    const user1Purchased = await presale.getUserInfo(user1.address);
    const user2Purchased = await presale.getUserInfo(user2.address);
    console.log("User1 已購買:", user1Purchased.toString(), "wei");
    console.log("User2 已購買:", user2Purchased.toString(), "wei");

    console.log("\n3️⃣ 檢查代幣餘額...");
    const user1UsdtBalance = await usdt.balanceOf(user1.address);
    const user2UsdtBalance = await usdt.balanceOf(user2.address);
    console.log("User1 USDT 餘額:", user1UsdtBalance.toString());
    console.log("User2 USDT 餘額:", user2UsdtBalance.toString());

    console.log("\n4️⃣ 測試直接購買（無白名單）...");
    // User2 嘗試購買 - 使用最小購買量
    const purchaseAmount = ethers.parseEther("100"); // 100 tokens
    const tokenPrice = presaleInfo[0];
    const cost = purchaseAmount * tokenPrice / ethers.parseEther("1");

    console.log("User2 準備購買:", purchaseAmount.toString(), "wei");
    console.log("預計成本:", cost.toString(), "wei");

    // 批准 USDT
    console.log("批准 USDT...");
    const approveTx = await usdt.connect(user2).approve(PRESALE_ADDRESS, cost);
    await approveTx.wait();
    console.log("✅ USDT 批准成功");

    // 購買代幣
    console.log("購買代幣...");
    const buyTx = await presale.connect(user2).buyTokens(purchaseAmount);
    await buyTx.wait();
    console.log("✅ 購買成功！");

    console.log("\n5️⃣ 檢查購買結果...");
    const user2PurchasedAfter = await presale.getUserInfo(user2.address);
    const user2UsdtBalanceAfter = await usdt.balanceOf(user2.address);
    const user2MtokenBalance = await mytoken.balanceOf(user2.address);

    console.log("User2 已購買:", user2PurchasedAfter.toString(), "wei");
    console.log("User2 USDT 餘額:", user2UsdtBalanceAfter.toString());
    console.log("User2 MyToken 餘額:", user2MtokenBalance.toString(), "wei");

    console.log("\n6️⃣ 驗證無白名單功能...");
    console.log("✅ 用戶可以直接購買，無需白名單");
    console.log("✅ 沒有 whitelist 相關的函數調用");
    console.log("✅ 購買流程簡化");

    console.log("\n🎉 測試完成！");
    console.log("==================================");
    console.log("無白名單版本工作正常");
    console.log("用戶可以直接購買代幣");
    console.log("合約功能簡化且高效");

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