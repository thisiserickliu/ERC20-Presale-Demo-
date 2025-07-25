# 智能合約整合設置說明

## 🚨 錯誤修復指南

如果您看到 "Failed to load user data" 錯誤，請按照以下步驟操作：

## 📋 設置步驟

### 1. 啟動本地 Hardhat 節點

在 `blockchain` 目錄中運行：

```bash
cd blockchain
npx hardhat node
```

這會啟動一個本地區塊鏈節點在 `http://127.0.0.1:8545`

### 2. 部署智能合約

在新的終端窗口中，在 `blockchain` 目錄中運行：

```bash
cd blockchain
npx hardhat run scripts/deploy.js
```

您應該看到類似以下的輸出：
```
MockUSDT deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
MyToken deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
Presale deployed to: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

### 3. 更新前端合約地址

確保 `frontend/src/constants.js` 中的地址與部署輸出匹配：

```javascript
export const MYTOKEN_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
export const USDT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
export const PRESALE_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
```

### 4. 啟動前端應用

在 `frontend` 目錄中運行：

```bash
cd frontend
npm start
```

### 5. 連接 MetaMask

1. 打開瀏覽器，訪問 `http://localhost:3000/presale`
2. 點擊 "CONNECT WALLET" 按鈕
3. 如果出現網絡錯誤，點擊 "Switch Network" 按鈕
4. MetaMask 會提示添加 Hardhat Network，點擊 "Approve"

### 6. 測試功能

- **查看預售數據**：應該顯示實際的籌資進度和代幣銷售
- **查看錢包餘額**：應該顯示 USDT 和 MTK 餘額
- **測試購買功能**：輸入代幣數量並嘗試購買

## 🔧 故障排除

### 問題 1: "Failed to load user data"
**解決方案**：
- 確保 Hardhat 節點正在運行
- 確保合約已正確部署
- 確保前端使用正確的合約地址
- 確保 MetaMask 連接到正確的網絡 (Chain ID: 31337)

### 問題 2: "Network not found"
**解決方案**：
- 點擊 "Switch Network" 按鈕
- 手動在 MetaMask 中添加網絡：
  - 網絡名稱：Hardhat Network
  - RPC URL：http://127.0.0.1:8545
  - Chain ID：31337
  - 貨幣符號：ETH

### 問題 3: "Contract call failed"
**解決方案**：
- 重新部署合約
- 檢查合約地址是否正確
- 確保 Hardhat 節點正在運行

### 問題 4: "Insufficient balance"
**解決方案**：
- 運行以下腳本給用戶轉移 USDT：
```bash
cd blockchain
npx hardhat run scripts/give-usdt.js
```

## 📊 預期結果

成功設置後，您應該看到：

- ✅ 預售進度顯示實際數據
- ✅ 錢包餘額顯示正確的 USDT 和 MTK 數量
- ✅ 倒計時器正常運行
- ✅ 購買功能正常工作
- ✅ 白名單功能正常

## 🎯 測試數據

部署後的預售配置：
- **代幣價格**：0.1 USDT per MTK
- **最小購買**：100 MTK
- **最大購買**：10,000 MTK
- **總銷售**：500,000 MTK
- **目標金額**：50,000 USDT
- **預售期間**：9999 天（測試用）

## 🔄 重新部署

如果需要重新部署合約：

1. 停止 Hardhat 節點 (Ctrl+C)
2. 重新啟動：`npx hardhat node`
3. 重新部署：`npx hardhat run scripts/deploy.js`
4. 更新前端地址
5. 重新連接錢包

## 📞 支持

如果仍然遇到問題，請檢查：
1. 瀏覽器控制台的錯誤信息
2. Hardhat 節點的日誌
3. MetaMask 的網絡設置
4. 合約部署的輸出信息 