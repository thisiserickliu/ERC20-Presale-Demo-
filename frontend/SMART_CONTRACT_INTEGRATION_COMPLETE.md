# 智能合約整合完成

## 🎉 整合完成

已成功將 blockchain 資料夾中的智能合約整合到新的 UI 中！現在前端數據完全以智能合約為主。

## 📋 整合的智能合約

### 1. **MyToken.sol** - 代幣合約
- **地址**: `0x93F1197a002391D8CD4fC290E7c183720946e8dc`
- **功能**: ERC20 代幣，包含稅收機制
- **總供應量**: 100,000,000 MTK
- **初始流通**: 40,000,000 MTK

### 2. **MockUSDT.sol** - 支付代幣
- **地址**: `0x76DFC5C47141212674131Bbe919DD2C8487d46e5`
- **功能**: 模擬 USDT，6位小數
- **用途**: 預售支付代幣

### 3. **Presale.sol** - 預售合約
- **地址**: `0x89c9104A7B1E4eDB892e7931ab3a399e659F1273`
- **功能**: 完整的預售管理系統

## 🔧 整合的功能

### ✅ 智能合約連接
- MetaMask 錢包連接
- 合約實例初始化
- 實時數據讀取

### ✅ 預售數據顯示
- **籌資進度**: 從智能合約讀取實際籌資金額
- **代幣銷售**: 實際銷售的代幣數量
- **價格信息**: 當前代幣價格
- **時間限制**: 預售開始和結束時間
- **購買限制**: 最小/最大購買數量

### ✅ 用戶功能
- **錢包餘額**: 實時 USDT 和 MTK 餘額
- **購買記錄**: 用戶在預售中的購買數量
- **白名單狀態**: 白名單申請和狀態檢查

### ✅ 交易功能
- **USDT 批准**: 智能合約交互
- **代幣購買**: 實際購買功能
- **白名單申請**: 申請加入白名單

## 📊 數據來源

### 預售數據 (來自 Presale.sol)
```javascript
const presaleData = {
  totalRaised: "0",           // 實際籌資金額 (USDT)
  totalTarget: "50000",       // 目標金額 (50,000 USDT)
  tokensSold: "0",            // 已售代幣數量
  totalTokens: "500000",      // 總銷售代幣 (500,000 MTK)
  currentPrice: "0.1",        // 當前價格 (0.1 USDT/MTK)
  minPurchase: "100",         // 最小購買 (100 MTK)
  maxPurchase: "10000",       // 最大購買 (10,000 MTK)
  presaleStart: 0,            // 預售開始時間
  presaleEnd: 0,              // 預售結束時間
  presaleFinalized: false,    // 是否已結束
  whitelistEnabled: false     // 是否需要白名單
};
```

### 用戶數據 (來自多個合約)
```javascript
const userData = {
  usdtBalance: "0",           // USDT 餘額
  mtokenBalance: "0",         // MTK 餘額
  purchased: "0",             // 預售購買數量
  whitelisted: false          // 白名單狀態
};
```

## 🚀 主要功能實現

### 1. **錢包連接**
```javascript
const connectWallet = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);
  // 初始化合約實例
  // 加載預售和用戶數據
};
```

### 2. **數據加載**
```javascript
const loadPresaleData = async (presaleContract) => {
  const info = await presaleContract.getPresaleInfo();
  // 格式化並設置預售數據
};

const loadUserData = async (contracts, address) => {
  const [usdtBalance, mtokenBalance, userInfo] = await Promise.all([
    contracts.usdt.balanceOf(address),
    contracts.mytoken.balanceOf(address),
    contracts.presale.getUserInfo(address)
  ]);
  // 設置用戶數據
};
```

### 3. **代幣購買**
```javascript
const purchaseTokens = async () => {
  const amount = ethers.utils.parseUnits(purchaseAmount, 18);
  const tx = await presaleContract.buyTokens(amount);
  await tx.wait();
  // 重新加載數據
};
```

### 4. **USDT 批准**
```javascript
const approveUSDT = async () => {
  const cost = amount.mul(price).div(ethers.utils.parseEther("1"));
  const tx = await usdtContract.approve(PRESALE_ADDRESS, cost);
  await tx.wait();
};
```

## 🎯 智能合約配置

### 部署參數
- **代幣價格**: 0.1 USDT per MTK
- **最小購買**: 100 MTK
- **最大購買**: 10,000 MTK
- **總銷售**: 500,000 MTK
- **目標金額**: 50,000 USDT
- **預售期間**: 9999 天 (測試用)

### 合約地址
```javascript
export const MYTOKEN_ADDRESS = '0x93F1197a002391D8CD4fC290E7c183720946e8dc';
export const USDT_ADDRESS = '0x76DFC5C47141212674131Bbe919DD2C8487d46e5';
export const PRESALE_ADDRESS = '0x89c9104A7B1E4eDB892e7931ab3a399e659F1273';
```

## 🔄 實時更新

### 自動刷新
- **倒計時器**: 每秒更新預售結束倒計時
- **進度條**: 實時顯示籌資和代幣銷售進度
- **狀態檢查**: 預售活動狀態檢查

### 交易後更新
- **購買後**: 自動重新加載預售和用戶數據
- **批准後**: 更新用戶餘額
- **白名單申請**: 更新白名單狀態

## 🛡️ 安全功能

### 錯誤處理
- **網絡錯誤**: 顯示具體錯誤信息
- **交易失敗**: 詳細的錯誤提示
- **合約錯誤**: 智能合約錯誤處理

### 狀態驗證
- **預售狀態**: 檢查預售是否活躍
- **白名單**: 驗證白名單要求
- **餘額檢查**: 確保足夠的 USDT 餘額

## 📱 用戶體驗

### 加載狀態
- **連接中**: "CONNECTING..."
- **批准中**: "APPROVING..."
- **購買中**: "PURCHASING..."
- **申請中**: "APPLYING..."

### 狀態指示
- **預售狀態**: Active/Inactive
- **白名單**: Whitelisted/Not Whitelisted
- **連接狀態**: Connected/Disconnected

## 🎨 UI 適配

### 數據格式化
- **數字格式化**: 使用 `toLocaleString()` 和 `toFixed()`
- **進度計算**: 實時計算百分比
- **時間顯示**: 天、時、分、秒倒計時

### 響應式設計
- **桌面端**: 完整功能顯示
- **移動端**: 優化的觸控界面
- **狀態適配**: 根據數據狀態調整 UI

## ✅ 測試清單

- [x] 智能合約連接
- [x] 預售數據讀取
- [x] 用戶數據加載
- [x] 錢包連接功能
- [x] USDT 批准功能
- [x] 代幣購買功能
- [x] 白名單申請功能
- [x] 實時倒計時
- [x] 進度條更新
- [x] 錯誤處理
- [x] 響應式設計

## 🔮 下一步

1. **測試網絡**: 在 Sepolia 測試網部署
2. **真實 USDT**: 使用真實的 USDT 合約
3. **事件監聽**: 添加交易事件監聽
4. **多錢包支持**: 支持更多錢包類型
5. **管理功能**: 添加管理員功能

您的預售儀表板現在完全與智能合約整合，所有數據都來自區塊鏈！🎉✨ 