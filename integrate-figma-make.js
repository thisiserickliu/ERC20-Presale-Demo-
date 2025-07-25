#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎨 Figma Make 檔案整合工具');
console.log('========================');

// 檢查目標資料夾是否存在
const targetDir = './frontend/src/figma-make-components';
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log('✅ 建立目標資料夾:', targetDir);
}

console.log('\n📁 請將 Figma Make 下載的檔案複製到以下路徑：');
console.log('📍', path.resolve(targetDir));
console.log('\n📋 整合步驟：');
console.log('1. 下載 Figma Make 的所有檔案');
console.log('2. 將檔案複製到上述路徑');
console.log('3. 在 Cursor 中重新整理檔案總管');
console.log('4. 檢查並調整 import 路徑');
console.log('5. 安裝必要的依賴套件');
console.log('6. 更新 App.js 使用新元件');

console.log('\n🔧 完成後，我可以協助你：');
console.log('- 調整檔案路徑');
console.log('- 安裝缺少的依賴');
console.log('- 整合到現有專案');
console.log('- 修正相容性問題'); 