# Sepolia 測試網部署指南

## 🚀 部署到 Sepolia 測試網

### 📋 前置要求

1. **MetaMask 錢包**：確保有 Sepolia 測試網的 ETH
2. **Infura 或 Alchemy 賬戶**：獲取 Sepolia RPC URL
3. **Etherscan API Key**：用於合約驗證

### 🔧 環境設置

1. **複製環境變數文件**：
   ```bash
   cd blockchain
   cp env.example .env
   ```

2. **編輯 .env 文件**：
   ```bash
   # 網絡 URLs
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
   
   # 私鑰 (用於部署)
   PRIVATE_KEY=your_private_key_here
   
   # API Keys
   ETHERSCAN_API_KEY=your_etherscan_api_key_here
   
   # 可選：Gas 報告
   REPORT_GAS=true
   ```

### 💰 獲取 Sepolia ETH

1. **Sepolia Faucet**：
   - https://sepoliafaucet.com/
   - https://faucet.sepolia.dev/
   - https://sepolia-faucet.pk910.de/

2. **需要至少 0.1 ETH** 用於部署和測試

### 🚀 部署步驟

1. **編譯合約**：
   ```bash
   cd blockchain
   npx hardhat compile
   ```

2. **部署到 Sepolia**：
   ```bash
   npx hardhat run scripts/deploy-sepolia.js --network sepolia
   ```

3. **記錄合約地址**：
   部署完成後，會輸出類似以下信息：
   ```
   MockUSDT: 0x1234...
   MyToken: 0x5678...
   Presale: 0x9abc...
   ```

### 🔄 更新前端配置

1. **更新 constants.js**：
   ```javascript
   // 在 frontend/src/constants.js 中
   export const SEPOLIA_CONFIG = {
     MYTOKEN_ADDRESS: '0x5678...', // 實際部署的地址
     USDT_ADDRESS: '0x1234...',    // 實際部署的地址
     PRESALE_ADDRESS: '0x9abc...'  // 實際部署的地址
   };
   
   // 切換到 Sepolia
   export const CURRENT_NETWORK = 'SEPOLIA';
   ```

2. **重新啟動前端**：
   ```bash
   cd frontend
   npm start
   ```

### 🧪 測試部署

1. **測試合約功能**：
   ```bash
   cd blockchain
   npx hardhat run scripts/test-sepolia.js --network sepolia
   ```

2. **設置環境變數**（用於測試）：
   ```bash
   export SEPOLIA_PRESALE_ADDRESS=0x9abc...
   export SEPOLIA_TOKEN_ADDRESS=0x5678...
   export SEPOLIA_USDT_ADDRESS=0x1234...
   ```

### 🔍 驗證合約

1. **在 Etherscan 上驗證**：
   - 訪問 https://sepolia.etherscan.io/
   - 搜索合約地址
   - 點擊 "Contract" 標籤
   - 點擊 "Verify and Publish"

2. **使用 Hardhat 自動驗證**：
   ```bash
   npx hardhat verify --network sepolia 0x5678... "MyToken" "MTK"
   npx hardhat verify --network sepolia 0x1234... "MockUSDT" "USDT"
   npx hardhat verify --network sepolia 0x9abc... "0x5678..." "0x1234..." "100000" "100000000000000000000" "10000000000000000000000" "500000000000000000000000" "1234567890" "1234567890"
   ```

### 🌐 前端測試

1. **連接 MetaMask**：
   - 確保連接到 Sepolia 測試網 (Chain ID: 11155111)
   - 確保有 Sepolia ETH

2. **測試功能**：
   - 連接錢包
   - 查看預售數據
   - 測試購買功能
   - 測試白名單功能

### 📊 網絡信息

- **網絡名稱**：Sepolia Testnet
- **Chain ID**：11155111
- **RPC URL**：https://sepolia.infura.io/v3/YOUR_PROJECT_ID
- **區塊瀏覽器**：https://sepolia.etherscan.io/
- **貨幣符號**：ETH

### 🔧 故障排除

#### 問題 1: "Insufficient funds"
**解決方案**：
- 從 Sepolia Faucet 獲取更多 ETH
- 檢查私鑰是否正確

#### 問題 2: "Network not found"
**解決方案**：
- 確保 MetaMask 連接到 Sepolia 測試網
- 手動添加網絡：
  - 網絡名稱：Sepolia Testnet
  - RPC URL：https://sepolia.infura.io/v3/YOUR_PROJECT_ID
  - Chain ID：11155111
  - 貨幣符號：ETH

#### 問題 3: "Contract verification failed"
**解決方案**：
- 檢查合約地址是否正確
- 確保所有參數都正確
- 手動在 Etherscan 上驗證

### 📞 支持

如果遇到問題：
1. 檢查 Hardhat 部署日誌
2. 檢查 Etherscan 上的交易狀態
3. 確認環境變數設置正確
4. 確認網絡連接正常

### 🔄 重新部署

如果需要重新部署：
1. 更新 .env 文件中的私鑰
2. 確保有足夠的 Sepolia ETH
3. 運行部署腳本
4. 更新前端配置
5. 重新測試功能 