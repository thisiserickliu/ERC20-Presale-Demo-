# 預售頁面設置說明

## 📁 文件位置

您的 Figma 預售頁面代碼應該放在以下位置：

### 主要組件文件
```
frontend/src/components/PresalePage.js
```

### 資源文件
```
frontend/src/assets/
├── digital-interface.png (已有)
└── [您的 Figma 圖片資源]
```

### 樣式文件（如果需要）
```
frontend/src/styles/
└── presale.css (如果需要額外的樣式)
```

## 🔧 設置步驟

### 1. 替換 PresalePage.js 內容
將您的 Figma 生成的代碼替換 `frontend/src/components/PresalePage.js` 中的內容。

### 2. 添加圖片資源
將 Figma 生成的圖片文件放在 `frontend/src/assets/` 目錄中。

### 3. 更新導入路徑
確保您的代碼中的圖片導入路徑正確：
```javascript
import heroImg from '../assets/your-figma-image.png';
```

### 4. 添加樣式（如果需要）
如果您的 Figma 代碼需要額外的 CSS 樣式，可以：
- 在 `PresalePage.js` 中使用 Tailwind CSS 類
- 創建 `frontend/src/styles/presale.css` 文件
- 在 `PresalePage.js` 中導入樣式文件

## 🎯 當前路由設置

- **首頁**: `/` - FigmaHomePage
- **路線圖**: `/roadmap` - Roadmap 頁面
- **預售頁面**: `/presale` - PresalePage (您的 Figma 代碼)

## 📱 導航功能

- 點擊首頁導航欄中的 "PRESALE" 按鈕會導航到 `/presale` 頁面
- 移動端漢堡菜單中的 "PRESALE" 也會導航到預售頁面

## 🚀 測試

1. 將您的 Figma 代碼放入 `PresalePage.js`
2. 啟動開發服務器：
   ```bash
   cd frontend
   npm start
   ```
3. 訪問 `http://localhost:3000/presale` 查看預售頁面

## 💡 提示

- 確保您的 Figma 代碼使用 React 語法
- 如果使用 TypeScript，可以將文件重命名為 `PresalePage.tsx`
- 保持與現有設計風格一致（深色主題 #02080d）
- 如果需要錢包連接功能，可以參考 `FigmaHomePage.js` 中的實現 