# Netlify 部署指南

## 🚀 部署到 Netlify

### 方法一：通過 Netlify UI 部署（推薦）

1. **準備代碼**：
   - 確保所有更改已提交到 Git 倉庫
   - 確保 `netlify.toml` 和 `_redirects` 文件已創建

2. **登錄 Netlify**：
   - 訪問 https://app.netlify.com/
   - 使用 GitHub 帳戶登錄

3. **連接倉庫**：
   - 點擊 "New site from Git"
   - 選擇 GitHub
   - 選擇您的倉庫

4. **配置構建設置**：
   - **Base directory**: `frontend` (如果前端在子目錄中)
   - **Build command**: `npm run build`
   - **Publish directory**: `build`

5. **部署**：
   - 點擊 "Deploy site"
   - 等待構建完成

### 方法二：通過 Netlify CLI 部署

1. **安裝 Netlify CLI**：
   ```bash
   npm install -g netlify-cli
   ```

2. **登錄**：
   ```bash
   netlify login
   ```

3. **初始化項目**：
   ```bash
   cd frontend
   netlify init
   ```

4. **部署**：
   ```bash
   netlify deploy --prod
   ```

### 方法三：拖拽部署

1. **構建項目**：
   ```bash
   cd frontend
   npm run build
   ```

2. **拖拽部署**：
   - 訪問 https://app.netlify.com/
   - 將 `frontend/build` 文件夾拖拽到部署區域

## ⚙️ 環境變數設置

在 Netlify 中設置環境變數（如果需要）：

1. 進入站點設置
2. 點擊 "Environment variables"
3. 添加以下變數：
   ```
   REACT_APP_NETWORK=SEPOLIA
   REACT_APP_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/vTRr0ICPjUuFOwqBkrmKA
   ```

## 🔧 配置文件說明

### netlify.toml
- 設置構建命令和發布目錄
- 配置重定向規則
- 啟用資源優化

### _redirects
- 確保 React Router 正常工作
- 所有路由都重定向到 index.html

## 🌐 部署後的配置

### 自定義域名（可選）
1. 在 Netlify 中點擊 "Domain settings"
2. 添加自定義域名
3. 配置 DNS 記錄

### HTTPS 設置
- Netlify 自動提供免費的 SSL 證書
- 無需額外配置

## 📊 部署狀態檢查

部署完成後，檢查以下功能：

1. **錢包連接**：確保 MetaMask 能正常連接
2. **網絡切換**：確保能連接到 Sepolia 測試網
3. **合約交互**：測試預售功能
4. **響應式設計**：在不同設備上測試

## 🔗 您的 Sepolia 合約地址

- **MyToken**: `0x14A6f6d56226192102CB0b738C99D433B7129FC4`
- **MockUSDT**: `0x31F6F17F0069a207582d994C4b86c63262bd965e`
- **Presale**: `0x337E3dcb43A7688894aD93F3160519f67Fb72D3f`

## 🎯 部署完成後的 URL

部署成功後，您會得到一個類似這樣的 URL：
```
https://your-app-name.netlify.app
```

## 🚨 故障排除

### 構建失敗
- 檢查 Node.js 版本（建議使用 18.x）
- 確保所有依賴都已安裝
- 檢查 package.json 中的腳本

### 路由問題
- 確保 `_redirects` 文件存在
- 檢查 `netlify.toml` 中的重定向配置

### 錢包連接問題
- 確保 MetaMask 已安裝
- 檢查網絡配置是否正確
- 確保合約地址正確

## 📞 支持

如果遇到問題：
1. 檢查 Netlify 部署日誌
2. 確認所有配置文件正確
3. 測試本地構建是否成功 