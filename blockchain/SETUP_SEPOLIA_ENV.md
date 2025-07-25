# Sepolia 部署環境設置指南

## 1. 獲取 Sepolia 測試網 ETH

### 方法一：Sepolia Faucet
- 訪問 https://sepoliafaucet.com/
- 使用你的 GitHub 帳戶登入
- 輸入你的錢包地址
- 等待 24 小時後可以再次申請

### 方法二：Alchemy Faucet
- 訪問 https://sepoliafaucet.com/
- 使用 Alchemy 帳戶
- 每天可以申請 0.5 ETH

### 方法三：Infura Faucet
- 訪問 https://www.infura.io/faucet/sepolia
- 使用 Infura 帳戶
- 每天可以申請 0.5 ETH

## 2. 獲取 RPC URL

### Infura
1. 訪問 https://infura.io/
2. 註冊帳戶並創建項目
3. 複製 Sepolia 的 RPC URL
4. 格式：`https://sepolia.infura.io/v3/YOUR_PROJECT_ID`

### Alchemy
1. 訪問 https://www.alchemy.com/
2. 註冊帳戶並創建項目
3. 複製 Sepolia 的 RPC URL
4. 格式：`https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY`

## 3. 獲取 Etherscan API Key（可選）

1. 訪問 https://etherscan.io/
2. 註冊帳戶
3. 進入 API-KEYs 頁面
4. 創建新的 API Key

## 4. 設置環境變數

1. 複製 `.env.example` 到 `.env`：
```bash
cp env.example .env
```

2. 編輯 `.env` 文件：
```env
# Network URLs
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
# 或者
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# Private Key (從 MetaMask 導出)
PRIVATE_KEY=your_private_key_here

# API Keys
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Optional: Gas reporting
REPORT_GAS=true
```

## 5. 獲取私鑰

### 從 MetaMask 導出私鑰
1. 打開 MetaMask
2. 點擊帳戶圖標
3. 選擇 "Account details"
4. 點擊 "Export Private Key"
5. 輸入密碼
6. 複製私鑰（不要分享給任何人！）

## 6. 驗證設置

運行以下命令檢查環境變數：
```bash
node validate-env.js
```

## 7. 部署到 Sepolia

設置完成後，運行：
```bash
npx hardhat run scripts/deploy-sepolia.js --network sepolia
```

## 注意事項

⚠️ **安全警告**：
- 永遠不要分享你的私鑰
- 不要在 GitHub 上提交 `.env` 文件
- 確保 `.env` 在 `.gitignore` 中

💰 **費用**：
- Sepolia 部署需要一些 ETH 作為 gas 費用
- 建議至少準備 0.1 ETH

🔗 **網絡**：
- 確保 MetaMask 連接到 Sepolia 測試網
- Chain ID: 11155111 