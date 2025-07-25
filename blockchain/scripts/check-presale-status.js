const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 檢查預售狀態");
  console.log("================================");

  try {
    const PRESALE_ADDRESS = '0x09635F643e140090A9A8Dcd712eD6285858ceBef';
    const presale = await ethers.getContractAt("Presale", PRESALE_ADDRESS);

    // 獲取預售信息
    const presaleInfo = await presale.getPresaleInfo();
    const currentTime = Math.floor(Date.now() / 1000);
    
    console.log("\n📅 時間信息:");
    console.log("當前時間:", new Date(currentTime * 1000).toLocaleString());
    console.log("預售開始:", new Date(Number(presaleInfo[6]) * 1000).toLocaleString());
    console.log("預售結束:", new Date(Number(presaleInfo[7]) * 1000).toLocaleString());
    
    console.log("\n⏰ 時間比較:");
    console.log("當前時間戳:", currentTime);
    console.log("預售開始時間戳:", presaleInfo[6].toString());
    console.log("預售結束時間戳:", presaleInfo[7].toString());
    
    console.log("\n📊 預售狀態:");
    const hasStarted = currentTime >= Number(presaleInfo[6]);
    const hasEnded = currentTime > Number(presaleInfo[7]);
    const isFinalized = presaleInfo[8];
    
    console.log("預售已開始:", hasStarted ? "✅ 是" : "❌ 否");
    console.log("預售已結束:", hasEnded ? "✅ 是" : "❌ 否");
    console.log("預售已完成:", isFinalized ? "✅ 是" : "❌ 否");
    
    if (hasStarted && !hasEnded && !isFinalized) {
      console.log("\n🎉 預售狀態: ACTIVE");
    } else if (!hasStarted) {
      console.log("\n⏳ 預售狀態: NOT STARTED");
      const timeUntilStart = Number(presaleInfo[6]) - currentTime;
      console.log("距離開始還有:", Math.floor(timeUntilStart / 60), "分鐘");
    } else if (hasEnded) {
      console.log("\n🔚 預售狀態: ENDED");
    } else if (isFinalized) {
      console.log("\n✅ 預售狀態: FINALIZED");
    }
    
    console.log("\n📈 預售數據:");
    console.log("代幣價格:", presaleInfo[0].toString(), "wei");
    console.log("最小購買:", presaleInfo[1].toString(), "wei");
    console.log("最大購買:", presaleInfo[2].toString(), "wei");
    console.log("總銷售:", presaleInfo[3].toString(), "wei");
    console.log("已售:", presaleInfo[4].toString(), "wei");
    console.log("總籌集:", presaleInfo[5].toString(), "wei");

  } catch (error) {
    console.error("❌ 檢查失敗:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 