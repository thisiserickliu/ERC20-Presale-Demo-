# 本地開發指南 - 無需私鑰

## 🎯 為什麼選擇本地開發？

### ✅ 優點
- **無需私鑰**：Hardhat 自動提供測試賬戶
- **無需真實 ETH**：完全免費
- **快速部署**：秒級部署和測試
- **安全**：不會影響真實資金
- **完全控制**：可以重置、回滾、修改

### ❌ 缺點
- 只能在本地測試
- 無法與其他用戶共享
- 無法在真實網絡上驗證

## 🚀 本地開發步驟

### 1. 啟動本地節點

```bash
cd blockchain
npx hardhat node
```

這會啟動一個本地區塊鏈，並顯示 20 個測試賬戶和私鑰。

### 2. 部署合約

在新的終端窗口中：

```bash
cd blockchain
npx hardhat run scripts/deploy.js
```

### 3. 啟動前端

```bash
cd frontend
npm start
```

### 4. 連接 MetaMask

1. **添加本地網絡**：
   - 網絡名稱：Hardhat Local
   - RPC URL：http://127.0.0.1:8545
   - Chain ID：31337
   - 貨幣符號：ETH

2. **導入測試賬戶**：
   - 複製 Hardhat 節點輸出的私鑰
   - 在 MetaMask 中導入賬戶

## 🔧 本地開發配置

### 前端配置 (frontend/src/constants.js)

```javascript
// 使用本地配置
export const CURRENT_NETWORK = 'LOCAL';

export const LOCAL_CONFIG = {
  MYTOKEN_ADDRESS: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  USDT_ADDRESS: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  PRESALE_ADDRESS: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
};
```

### 測試腳本

```bash
# 測試合約功能
npx hardhat run scripts/test-deployment.js

# 給用戶轉移 USDT
npx hardhat run scripts/give-usdt.js

# 檢查預售狀態
npx hardhat run scripts/check-presale-status.js
```

## 🎮 測試功能

### 1. 基本功能測試
- 連接錢包
- 查看預售數據
- 查看錢包餘額
- 測試購買功能

### 2. 高級功能測試
- 白名單功能
- 預售時間控制
- 價格更新
- 資金提取

## 🔄 重置環境

如果需要重新開始：

```bash
# 停止 Hardhat 節點 (Ctrl+C)
# 重新啟動
npx hardhat node

# 重新部署
npx hardhat run scripts/deploy.js
```

## 📊 本地開發優勢

1. **即時反饋**：修改代碼後立即測試
2. **完全控制**：可以模擬任何場景
3. **無成本**：不需要真實 ETH
4. **安全性**：不會影響真實資金
5. **快速迭代**：開發效率高

## 🎯 何時需要 Sepolia？

只有在以下情況才需要部署到 Sepolia：

1. **與其他用戶共享測試**
2. **在真實網絡環境測試**
3. **準備主網部署前的驗證**
4. **與其他智能合約集成測試**

## 💡 建議

對於開發和測試，建議：

1. **主要使用本地開發**：快速、安全、免費
2. **偶爾使用 Sepolia**：驗證真實網絡行為
3. **最終部署到主網**：正式發布

這樣既保證了開發效率，又確保了安全性！ 