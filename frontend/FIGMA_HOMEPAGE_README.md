# Figma 首頁整合說明

## 概述
已成功將 Figma Make 生成的設計整合到您的 ERC20 預售 DApp 中，創建了一個現代化、響應式的首頁。

## 新功能

### 1. 現代化設計
- 基於 Figma Make 生成的設計
- 深色主題配色方案 (#02080d, #020b0d)
- 響應式設計，支援桌面和移動設備
- 流暢的動畫和過渡效果

### 2. 導航功能
- **桌面導航**：WHITEPAPER、TOKENOMICS、ROADMAP、FAQ
- **移動端漢堡菜單**：適配小屏幕設備
- **錢包連接狀態**：顯示連接狀態和連接/斷開按鈕

### 3. 主要區塊
- **Hero 區塊**：歡迎標題和主視覺圖片
- **CTA 區塊**：錢包連接按鈕
- **FAQ 區塊**：可展開的常見問題解答

### 4. 錢包整合
- MetaMask 錢包連接
- 錢包狀態顯示
- 連接/斷開功能

## 路由結構

```
/           - Figma 首頁 (FigmaHomePage)
/roadmap    - 項目路線圖
```

## 組件結構

### FigmaHomePage.js
主要首頁組件，包含：
- NavigationLink - 導航鏈接組件
- MobileMenu - 移動端菜單組件
- FAQSection - FAQ 區塊組件

### 樣式特點
- 使用 Tailwind CSS
- 自定義顏色變量
- 響應式斷點設計
- 流暢的過渡動畫

## 使用方法

1. **啟動開發服務器**：
   ```bash
   cd frontend
   npm start
   ```

2. **訪問首頁**：
   打開瀏覽器訪問 `http://localhost:3000`

3. **功能測試**：
   - 點擊 "CONNECT WALLET" 連接 MetaMask
   - 測試移動端漢堡菜單
   - 展開/收合 FAQ 項目

## 技術細節

### 依賴項
- React 18.2.0
- React Router DOM 6.30.1
- Ethers 5.7.2
- Tailwind CSS 3.4.1

### 文件結構
```
frontend/src/
├── components/
│   └── FigmaHomePage.js    # 首頁組件
├── assets/
│   └── digital-interface.png  # 主視覺圖片
├── constants.js            # 常量文件（已清理）
└── App.js                  # 主應用組件
```

## 自定義選項

### 修改顏色主題
在 `FigmaHomePage.js` 中修改以下顏色變量：
- 背景色：`#02080d`, `#020b0d`
- 主要色：`#00b3e6`
- 文字色：`#d7dee4`

### 修改 FAQ 內容
在 `FigmaHomePage.js` 的 `faqData` 數組中修改問題和答案。

### 修改導航鏈接
在導航區塊中修改 `NavigationLink` 組件的 `href` 屬性。

## 注意事項

1. 確保 MetaMask 已安裝並解鎖
2. 錢包連接功能需要用戶授權
3. 已移除所有預售相關功能，現在只是一個展示頁面

## 未來改進

- 添加更多動畫效果
- 整合更多錢包選項
- 添加多語言支持
- 優化移動端體驗
- 添加深色/淺色主題切換 