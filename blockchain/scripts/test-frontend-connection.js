const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 測試前端連接");
  console.log("================================");

  try {
    const PRESALE_ADDRESS = '0x09635F643e140090A9A8Dcd712eD6285858ceBef';
    const USDT_ADDRESS = '0x4A679253410272dd5232B3Ff7cF5dbB88f295319';
    const MYTOKEN_ADDRESS = '0x7a2088a1bFc9d81c55368AE168C2C02570cB814F';

    // 使用 provider 而不是 signer 來模擬前端連接
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    
    console.log("✅ Provider 連接成功");

    // 獲取合約實例
    const presale = new ethers.Contract(PRESALE_ADDRESS, [
      "function getPresaleInfo() external view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, bool)",
      "function getUserInfo(address user) external view returns (uint256)"
    ], provider);

    const usdt = new ethers.Contract(USDT_ADDRESS, [
      "function balanceOf(address account) public view returns (uint256)",
      "function decimals() public pure returns (uint8)"
    ], provider);

    const mytoken = new ethers.Contract(MYTOKEN_ADDRESS, [
      "function balanceOf(address account) public view returns (uint256)",
      "function decimals() public pure returns (uint8)"
    ], provider);

    console.log("✅ 合約實例創建成功");

    // 測試地址（模擬前端用戶）
    const testAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

    console.log("\n📊 測試合約調用...");

    // 獲取預售信息
    console.log("1. 獲取預售信息...");
    const presaleInfo = await presale.getPresaleInfo();
    console.log("✅ 預售信息獲取成功");
    console.log("   - 代幣價格:", presaleInfo[0].toString());
    console.log("   - 最小購買:", presaleInfo[1].toString());
    console.log("   - 最大購買:", presaleInfo[2].toString());
    console.log("   - 總銷售:", presaleInfo[3].toString());
    console.log("   - 已售:", presaleInfo[4].toString());
    console.log("   - 總籌集:", presaleInfo[5].toString());
    console.log("   - 預售開始:", new Date(Number(presaleInfo[6]) * 1000).toLocaleString());
    console.log("   - 預售結束:", new Date(Number(presaleInfo[7]) * 1000).toLocaleString());
    console.log("   - 預售完成:", presaleInfo[8]);

    // 獲取用戶信息
    console.log("\n2. 獲取用戶信息...");
    const userInfo = await presale.getUserInfo(testAddress);
    console.log("✅ 用戶信息獲取成功");
    console.log("   - 已購買:", userInfo.toString());

    // 獲取用戶餘額
    console.log("\n3. 獲取用戶餘額...");
    const usdtBalance = await usdt.balanceOf(testAddress);
    const mtokenBalance = await mytoken.balanceOf(testAddress);
    console.log("✅ 餘額獲取成功");
    console.log("   - USDT 餘額:", usdtBalance.toString());
    console.log("   - MyToken 餘額:", mtokenBalance.toString());

    // 檢查預售狀態
    console.log("\n4. 檢查預售狀態...");
    const currentTime = Math.floor(Date.now() / 1000);
    const hasStarted = currentTime >= Number(presaleInfo[6]);
    const hasEnded = currentTime > Number(presaleInfo[7]);
    const isFinalized = presaleInfo[8];
    
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

    console.log("\n🎉 前端連接測試完成！");
    console.log("所有合約調用都成功，前端應該能正常工作");

  } catch (error) {
    console.error("❌ 測試失敗:", error.message);
    console.error("錯誤詳情:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 