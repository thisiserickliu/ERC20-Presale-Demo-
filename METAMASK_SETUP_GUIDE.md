# MetaMask 設置指南 - Hardhat Local 網絡

## 🚀 快速設置步驟

### 1. 確保 Hardhat 節點正在運行
```bash
# 在 blockchain 目錄中運行
npx hardhat node
```

### 2. 在 MetaMask 中添加 Hardhat Local 網絡

#### 方法一：手動添加網絡
1. 打開 MetaMask
2. 點擊網絡選擇器（頂部顯示 "Ethereum Mainnet" 的地方）
3. 點擊 "Add network" → "Add network manually"
4. 填寫以下信息：
   - **Network Name**: `Hardhat Local`
   - **New RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `1337`
   - **Currency Symbol**: `ETH`
   - **Block Explorer URL**: 留空
5. 點擊 "Save"

#### 方法二：使用前端自動添加
1. 訪問 http://localhost:3000
2. 點擊 "PRESALE" 進入預售頁面
3. 點擊 "Connect Wallet"
4. 如果網絡不匹配，點擊 "Switch Network" 按鈕
5. MetaMask 會自動提示添加 Hardhat Local 網絡

### 3. 導入測試賬戶

#### 獲取測試私鑰
當 Hardhat 節點啟動時，會顯示測試賬戶的私鑰。通常第一個賬戶是：

**私鑰**: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
**地址**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`

#### 在 MetaMask 中導入
1. 在 MetaMask 中點擊賬戶圖標
2. 選擇 "Import account"
3. 選擇 "Private Key"
4. 輸入上面的私鑰
5. 點擊 "Import"

### 4. 驗證設置

#### 檢查網絡連接
- MetaMask 應該顯示 "Hardhat Local" 網絡
- 賬戶餘額應該顯示一些 ETH（測試幣）

#### 檢查前端連接
1. 訪問 http://localhost:3000/presale
2. 點擊 "Connect Wallet"
3. 應該成功連接，不再顯示網絡錯誤

## 🔧 故障排除

### 問題 1: "Please connect to Hardhat Local (Chain ID: 1337)"
**解決方案**:
1. 確保 Hardhat 節點正在運行
2. 在 MetaMask 中切換到 Hardhat Local 網絡
3. 刷新頁面 (Ctrl+F5)

### 問題 2: MetaMask 無法連接到 Hardhat 節點
**解決方案**:
1. 檢查 Hardhat 節點是否在端口 8545 運行
2. 確保防火牆沒有阻止連接
3. 嘗試使用 `http://localhost:8545` 而不是 `http://127.0.0.1:8545`

### 問題 3: 合約數據顯示為 0
**解決方案**:
1. 確保合約已重新部署
2. 檢查前端是否使用了正確的合約地址
3. 刷新頁面重新加載數據

### 問題 4: 交易失敗
**解決方案**:
1. 確保賬戶有足夠的 ETH 支付 gas 費
2. 檢查是否在白名單中（如果啟用）
3. 確保預售時間正確

## 📋 當前合約地址

```
MockUSDT: 0x5FbDB2315678afecb367f032d93F642f64180aa3
MyToken: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
Presale: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

## 🎯 測試步驟

1. **連接錢包**: 點擊 "Connect Wallet"
2. **查看餘額**: 檢查 USDT 和 MTK 餘額
3. **申請白名單**: 點擊 "Apply" 按鈕
4. **購買代幣**: 輸入數量並點擊購買
5. **查看交易歷史**: 檢查購買記錄

## 🆘 需要幫助？

如果仍然遇到問題：
1. 檢查瀏覽器控制台是否有錯誤信息
2. 確保所有服務都在運行
3. 嘗試重新啟動 Hardhat 節點和前端 