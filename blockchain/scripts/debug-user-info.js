const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 調試用戶信息");
  console.log("================================");

  try {
    const targetAddress = "0x3f2091d5671fdbe5655b5b184a24ba4988d9d6e1";
    console.log("目標地址:", targetAddress);
    
    const PRESALE_ADDRESS = '0x09635F643e140090A9A8Dcd712eD6285858ceBef';
    const USDT_ADDRESS = '0x4A679253410272dd5232B3Ff7cF5dbB88f295319';
    const MYTOKEN_ADDRESS = '0x7a2088a1bFc9d81c55368AE168C2C02570cB814F';
    
    // 獲取合約實例
    const presale = await ethers.getContractAt("Presale", PRESALE_ADDRESS);
    const usdt = await ethers.getContractAt("MockUSDT", USDT_ADDRESS);
    const mytoken = await ethers.getContractAt("MyToken", MYTOKEN_ADDRESS);
    
    console.log("\n📊 檢查用戶信息...");
    
    // 檢查 getUserInfo 返回值
    console.log("1. 調用 getUserInfo...");
    const userInfo = await presale.getUserInfo(targetAddress);
    console.log("getUserInfo 返回值:", userInfo);
    console.log("userInfo 類型:", typeof userInfo);
    console.log("userInfo 是否為 BigNumber:", userInfo._isBigNumber);
    console.log("userInfo 值:", userInfo.toString());
    
    // 檢查 USDT 餘額
    console.log("\n2. 檢查 USDT 餘額...");
    const usdtBalance = await usdt.balanceOf(targetAddress);
    console.log("USDT 餘額:", usdtBalance.toString());
    console.log("USDT 餘額格式化:", ethers.formatUnits(usdtBalance, 6));
    
    // 檢查 MyToken 餘額
    console.log("\n3. 檢查 MyToken 餘額...");
    const mtokenBalance = await mytoken.balanceOf(targetAddress);
    console.log("MyToken 餘額:", mtokenBalance.toString());
    console.log("MyToken 餘額格式化:", ethers.formatEther(mtokenBalance));
    
    // 模擬前端格式化
    console.log("\n4. 模擬前端格式化...");
    try {
      const userData = {
        purchased: ethers.utils.formatEther(userInfo), // 直接使用 userInfo，不是 userInfo[0]
        usdtBalance: ethers.utils.formatUnits(usdtBalance, 6),
        mtokenBalance: ethers.utils.formatEther(mtokenBalance)
      };
      
      console.log("✅ 格式化成功:");
      console.log("用戶數據:", userData);
      
    } catch (error) {
      console.log("❌ 格式化失敗:", error.message);
    }
    
    console.log("\n🎉 調試完成！");

  } catch (error) {
    console.error("❌ 調試失敗:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 