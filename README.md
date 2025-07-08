# ERC20 Token Presale Demo

這是一個完整的 ERC20 代幣預售平台，包含智能合約、前端界面和白名單管理系統。

## 功能特色

### 智能合約
- **MyToken**: ERC20 代幣合約
- **MockUSDT**: 模擬 USDT 穩定幣
- **Presale**: 預售合約，支援白名單和購買限制

### 前端功能
- 🎨 現代化 UI/UX 設計
- 🔗 MetaMask 錢包連接
- 📊 即時預售統計
- ⏰ 倒數計時器
- 👥 白名單管理系統
- 💰 代幣購買界面
- 📈 用戶資訊面板
- 📝 交易歷史記錄

### 白名單系統
- 批次新增/移除地址
- CSV 匯入/匯出
- 白名單啟用/停用
- 即時狀態查詢

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 啟動本地區塊鏈

```bash
npx hardhat node
```

### 3. 部署智能合約

```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 4. 啟動前端開發伺服器

```bash
npm run dev
```

### 5. 連接 MetaMask

1. 打開 MetaMask
2. 新增網路：
   - 網路名稱: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - 貨幣符號: ETH

3. 匯入測試帳號（使用 Hardhat 提供的私鑰）

## 專案結構

```
ERC20-Presale-Demo-/
├── app/                    # Next.js 前端應用
│   ├── components/         # React 元件
│   │   ├── PresaleInfo.tsx    # 預售資訊顯示
│   │   ├── PresaleStats.tsx   # 預售統計
│   │   ├── TokenPurchase.tsx  # 代幣購買
│   │   └── WhitelistManager.tsx # 白名單管理
│   ├── constants.ts        # 合約地址和配置
│   ├── globals.css         # 全域樣式
│   ├── layout.tsx          # 應用布局
│   ├── page.tsx            # 主頁面
│   └── providers.tsx       # Wagmi/RainbowKit 配置
├── contracts/              # 智能合約
│   ├── MyToken.sol         # ERC20 代幣合約
│   ├── MockUSDT.sol        # 模擬 USDT 合約
│   └── Presale.sol         # 預售合約
├── scripts/                # 部署腳本
│   └── deploy.js           # 合約部署腳本
└── test/                   # 測試檔案
    └── Presale.test.js     # 預售合約測試
```

## 合約功能

### Presale 合約

#### 主要功能
- `purchaseTokens(uint256 amount)`: 購買代幣
- `getPresaleInfo()`: 獲取預售資訊
- `getUserInfo(address user)`: 獲取用戶資訊
- `setWhitelist(address[] users, bool[] statuses)`: 設定白名單
- `setWhitelistEnabled(bool enabled)`: 啟用/停用白名單

#### 預售參數
- 代幣價格: 0.1 USDT
- 最小購買: 100 代幣
- 最大購買: 10,000 代幣
- 預售總量: 500,000 代幣
- 預售期間: 30 天

### MyToken 合約
- 標準 ERC20 代幣
- 總供應量: 1,000,000 代幣
- 預售分配: 500,000 代幣 (50%)

## 前端使用指南

### 1. 連接錢包
點擊右上角的 "Connect Wallet" 按鈕連接 MetaMask。

### 2. 查看預售資訊
- 預售統計顯示當前進度和狀態
- 預售資訊頁面包含詳細的購買限制和重要說明

### 3. 購買代幣
1. 確保錢包中有足夠的 USDT
2. 輸入要購買的代幣數量
3. 首次購買需要授權 USDT
4. 確認交易並等待完成

### 4. 管理白名單（僅合約擁有者）
1. 使用合約擁有者錢包連接
2. 在白名單管理器中新增或移除地址
3. 可以批次操作或使用 CSV 匯入

## 開發指南

### 新增功能
1. 在 `contracts/` 目錄中新增或修改智能合約
2. 在 `app/components/` 中新增 React 元件
3. 更新 `app/constants.ts` 中的合約地址

### 測試
```bash
npx hardhat test
```

### 部署到測試網
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## 注意事項

1. **本地開發**: 每次重啟 Hardhat 節點後需要重新部署合約
2. **合約地址**: 部署後記得更新 `app/constants.ts` 中的地址
3. **白名單**: 只有合約擁有者可以管理白名單
4. **Gas 費用**: 所有交易都需要支付 Gas 費用
5. **測試代幣**: 使用 Hardhat 提供的測試帳號進行測試

## 技術棧

- **區塊鏈**: Ethereum (Hardhat)
- **智能合約**: Solidity
- **前端**: Next.js 13, React 18, TypeScript
- **錢包連接**: RainbowKit, Wagmi
- **樣式**: Tailwind CSS
- **狀態管理**: React Hooks
- **通知**: React Hot Toast

## 授權

MIT License

## 支援

如有問題或建議，請開立 Issue 或 Pull Request。 
