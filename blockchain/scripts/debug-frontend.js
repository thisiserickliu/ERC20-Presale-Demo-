const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 詳細調試前端問題");
  console.log("================================");

  try {
    const PRESALE_ADDRESS = '0x09635F643e140090A9A8Dcd712eD6285858ceBef';
    const USDT_ADDRESS = '0x4A679253410272dd5232B3Ff7cF5dbB88f295319';
    const MYTOKEN_ADDRESS = '0x7a2088a1bFc9d81c55368AE168C2C02570cB814F';

    console.log("\n📋 合約地址檢查:");
    console.log("Presale:", PRESALE_ADDRESS);
    console.log("USDT:", USDT_ADDRESS);
    console.log("MyToken:", MYTOKEN_ADDRESS);

    // 測試不同的 provider 方式
    console.log("\n🔌 測試 Provider 連接...");
    
    // 方式1: JsonRpcProvider
    try {
      const provider1 = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      console.log("✅ JsonRpcProvider 連接成功");
      
      // 測試網絡
      const network1 = await provider1.getNetwork();
      console.log("   - 網絡:", network1.name, "Chain ID:", network1.chainId);
      
      // 測試區塊
      const blockNumber1 = await provider1.getBlockNumber();
      console.log("   - 當前區塊:", blockNumber1);
      
    } catch (error) {
      console.log("❌ JsonRpcProvider 失敗:", error.message);
    }

    // 方式2: Hardhat 內建 provider
    try {
      const [deployer] = await ethers.getSigners();
      const provider2 = deployer.provider;
      console.log("✅ Hardhat Provider 連接成功");
      
      const network2 = await provider2.getNetwork();
      console.log("   - 網絡:", network2.name, "Chain ID:", network2.chainId);
      
      const blockNumber2 = await provider2.getBlockNumber();
      console.log("   - 當前區塊:", blockNumber2);
      
    } catch (error) {
      console.log("❌ Hardhat Provider 失敗:", error.message);
    }

    // 測試合約調用
    console.log("\n📊 測試合約調用...");
    
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    
    // 測試 Presale 合約
    console.log("\n1. 測試 Presale 合約...");
    const presale = new ethers.Contract(PRESALE_ADDRESS, [
      "function getPresaleInfo() external view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, bool)",
      "function getUserInfo(address user) external view returns (uint256)"
    ], provider);

    try {
      const presaleInfo = await presale.getPresaleInfo();
      console.log("✅ getPresaleInfo 成功");
      console.log("   - 代幣價格:", presaleInfo[0].toString());
      console.log("   - 最小購買:", presaleInfo[1].toString());
      console.log("   - 最大購買:", presaleInfo[2].toString());
      console.log("   - 總銷售:", presaleInfo[3].toString());
      console.log("   - 已售:", presaleInfo[4].toString());
      console.log("   - 總籌集:", presaleInfo[5].toString());
      console.log("   - 預售開始:", new Date(Number(presaleInfo[6]) * 1000).toLocaleString());
      console.log("   - 預售結束:", new Date(Number(presaleInfo[7]) * 1000).toLocaleString());
      console.log("   - 預售完成:", presaleInfo[8]);
    } catch (error) {
      console.log("❌ getPresaleInfo 失敗:", error.message);
    }

    // 測試 USDT 合約
    console.log("\n2. 測試 USDT 合約...");
    const usdt = new ethers.Contract(USDT_ADDRESS, [
      "function balanceOf(address account) public view returns (uint256)",
      "function decimals() public pure returns (uint8)"
    ], provider);

    try {
      const testAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
      const usdtBalance = await usdt.balanceOf(testAddress);
      const usdtDecimals = await usdt.decimals();
      console.log("✅ USDT 合約調用成功");
      console.log("   - 測試地址餘額:", usdtBalance.toString());
      console.log("   - USDT 小數位:", usdtDecimals);
    } catch (error) {
      console.log("❌ USDT 合約調用失敗:", error.message);
    }

    // 測試 MyToken 合約
    console.log("\n3. 測試 MyToken 合約...");
    const mytoken = new ethers.Contract(MYTOKEN_ADDRESS, [
      "function balanceOf(address account) public view returns (uint256)",
      "function decimals() public pure returns (uint8)"
    ], provider);

    try {
      const testAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
      const mtokenBalance = await mytoken.balanceOf(testAddress);
      const mtokenDecimals = await mytoken.decimals();
      console.log("✅ MyToken 合約調用成功");
      console.log("   - 測試地址餘額:", mtokenBalance.toString());
      console.log("   - MyToken 小數位:", mtokenDecimals);
    } catch (error) {
      console.log("❌ MyToken 合約調用失敗:", error.message);
    }

    // 測試前端格式化的數據
    console.log("\n4. 測試前端數據格式化...");
    try {
      const presaleInfo = await presale.getPresaleInfo();
      const testAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
      const userInfo = await presale.getUserInfo(testAddress);
      const usdtBalance = await usdt.balanceOf(testAddress);
      const mtokenBalance = await mytoken.balanceOf(testAddress);

      // 模擬前端格式化
      const presaleData = {
        totalRaised: ethers.formatUnits(presaleInfo[5], 6), // USDT 6 decimals
        totalTarget: ethers.formatUnits(presaleInfo[5], 6), // 使用總籌集作為目標
        tokensSold: ethers.formatEther(presaleInfo[4]), // MyToken 18 decimals
        totalTokens: ethers.formatEther(presaleInfo[3]), // MyToken 18 decimals
        currentPrice: ethers.formatUnits(presaleInfo[0], 6), // USDT 6 decimals
        minPurchase: ethers.formatEther(presaleInfo[1]), // MyToken 18 decimals
        maxPurchase: ethers.formatEther(presaleInfo[2]), // MyToken 18 decimals
        presaleStart: new Date(Number(presaleInfo[6]) * 1000),
        presaleEnd: new Date(Number(presaleInfo[7]) * 1000),
        presaleFinalized: presaleInfo[8]
      };

      const userData = {
        purchased: ethers.formatEther(userInfo[0]), // MyToken 18 decimals
        usdtBalance: ethers.formatUnits(usdtBalance, 6), // USDT 6 decimals
        mtokenBalance: ethers.formatEther(mtokenBalance) // MyToken 18 decimals
      };

      console.log("✅ 前端數據格式化成功");
      console.log("預售數據:", presaleData);
      console.log("用戶數據:", userData);

      // 檢查預售狀態
      const currentTime = Math.floor(Date.now() / 1000);
      const hasStarted = currentTime >= Number(presaleInfo[6]);
      const hasEnded = currentTime > Number(presaleInfo[7]);
      const isFinalized = presaleInfo[8];
      
      console.log("\n預售狀態檢查:");
      console.log("   - 當前時間:", new Date(currentTime * 1000).toLocaleString());
      console.log("   - 預售已開始:", hasStarted ? "✅ 是" : "❌ 否");
      console.log("   - 預售已結束:", hasEnded ? "✅ 是" : "❌ 否");
      console.log("   - 預售已完成:", isFinalized ? "✅ 是" : "❌ 否");
      
      if (hasStarted && !hasEnded && !isFinalized) {
        console.log("   - 預售狀態: ACTIVE");
      } else if (!hasStarted) {
        console.log("   - 預售狀態: NOT STARTED");
      } else if (hasEnded) {
        console.log("   - 預售狀態: ENDED");
      } else if (isFinalized) {
        console.log("   - 預售狀態: FINALIZED");
      }

    } catch (error) {
      console.log("❌ 前端數據格式化失敗:", error.message);
    }

    console.log("\n🎉 調試完成！");
    console.log("如果所有測試都通過，前端應該能正常工作");

  } catch (error) {
    console.error("❌ 調試失敗:", error.message);
    console.error("錯誤詳情:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 