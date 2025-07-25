# 前端故障排除指南

## 🚨 當前問題
1. 前端顯示 "Please connect to Hardhat Local (Chain ID: 31337)" 錯誤
2. 所有合約數據顯示為 0
3. 白名單無法自動申請

## ✅ 後端狀態確認
- Hardhat 節點正在運行 (端口 8545)
- 合約已部署並初始化
- 預售狀態：活躍
- 白名單：已啟用
- 測試用戶有 1000 USDT

## 🔧 解決步驟

### 1. 清除瀏覽器緩存
```
1. 打開瀏覽器開發者工具 (F12)
2. 右鍵點擊刷新按鈕
3. 選擇 "清空緩存並硬性重新載入" (Ctrl+Shift+R)
```

### 2. 檢查 MetaMask 網絡設置
```
1. 打開 MetaMask
2. 點擊網絡選擇器
3. 確保連接到 "Hardhat Local" 網絡
4. 網絡設置：
   - 網絡名稱: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 1337
   - 貨幣符號: ETH
```

### 3. 使用測試頁面驗證連接
```
1. 訪問: http://localhost:3000/test
2. 點擊 "測試連接" 按鈕
3. 檢查是否顯示正確的合約數據
```

### 4. 重新啟動前端
```bash
# 停止前端
pkill -f "npm start"

# 重新啟動
cd frontend
npm start
```

### 5. 檢查瀏覽器控制台錯誤
```
1. 打開開發者工具 (F12)
2. 查看 Console 標籤
3. 檢查是否有 JavaScript 錯誤
4. 查看 Network 標籤中的請求狀態
```

## 🎯 預期結果

### 成功連接後應該看到：
- ✅ 不再顯示網絡錯誤
- ✅ 預售進度顯示正確數據
- ✅ 錢包餘額顯示 1000 USDT
- ✅ 白名單狀態顯示 "Not Whitelisted"
- ✅ 可以點擊 "Apply" 申請白名單
- ✅ 可以輸入數量購買代幣

### 合約數據應該顯示：
- Token Price: 0.1 USDT
- Min Purchase: 100 MTK
- Max Purchase: 10,000 MTK
- Total for Sale: 500,000 MTK
- Tokens Sold: 0 MTK
- Total Raised: 0 USDT
- Presale Status: Active
- Whitelist: Enabled

## 🆘 如果問題仍然存在

### 檢查 1: 網絡連接
```bash
# 檢查 Hardhat 節點
lsof -i :8545

# 檢查前端
lsof -i :3000
```

### 檢查 2: 合約地址
確保 `frontend/src/constants.js` 中的地址正確：
```javascript
export const LOCAL_CONFIG = {
  MYTOKEN_ADDRESS: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  USDT_ADDRESS: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  PRESALE_ADDRESS: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
};
```

### 檢查 3: Chain ID
確保 `frontend/src/constants.js` 中的 Chain ID 正確：
```javascript
export const NETWORKS = {
  LOCAL: {
    name: 'Hardhat Local',
    chainId: 1337,  // 不是 31337
    rpcUrl: 'http://127.0.0.1:8545',
    explorer: null
  }
};
```

## 📞 需要幫助？

如果按照以上步驟仍然無法解決問題，請：

1. 訪問 http://localhost:3000/test 並截圖結果
2. 打開瀏覽器控制台並截圖錯誤信息
3. 提供 MetaMask 網絡設置截圖
4. 運行 `npx hardhat run scripts/test-presale-status.js --network localhost` 並提供輸出

## 🔄 完整重置流程

如果所有方法都失敗，可以嘗試完整重置：

```bash
# 1. 停止所有服務
pkill -f "hardhat node"
pkill -f "npm start"

# 2. 重新啟動 Hardhat 節點
cd blockchain
npx hardhat node &

# 3. 重新部署合約
sleep 5
npx hardhat run scripts/deploy.js --network localhost
npx hardhat run scripts/start-presale.js --network localhost
npx hardhat run scripts/enable-whitelist.js --network localhost
npx hardhat run scripts/give-usdt.js --network localhost

# 4. 重新啟動前端
cd ../frontend
npm start
``` 