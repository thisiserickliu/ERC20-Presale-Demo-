# 完整部署指南 - 包含自助白名單功能

## 🎯 項目功能概覽

### ✅ 已實現功能
- **智能合約**：MyToken、MockUSDT、Presale
- **前端界面**：美觀的預售儀表板
- **錢包連接**：MetaMask 集成
- **自助白名單**：用戶可自行申請加入白名單
- **代幣購買**：USDT 購買 MTK 代幣
- **多網絡支持**：本地開發 + Sepolia 測試網

### 🔧 自助白名單功能
- 用戶可以自行申請加入白名單
- 無需管理員手動添加
- 即時生效
- 防止重複申請

## 🚀 部署步驟

### 方法一：本地開發（推薦用於開發）

```bash
# 1. 啟動本地節點
cd blockchain
npx hardhat node

# 2. 部署合約（新終端）
cd blockchain
npx hardhat run scripts/deploy.js

# 3. 啟動前端
cd frontend
npm start
```

### 方法二：Sepolia 測試網（通過錢包）

```bash
# 1. 編譯合約
cd blockchain
npx hardhat compile

# 2. 通過錢包部署
npx hardhat console --network sepolia
```

在控制台中執行：
```javascript
// 部署合約
const MockUSDT = await ethers.getContractFactory("MockUSDT");
const mockUSDT = await MockUSDT.deploy();
await mockUSDT.waitForDeployment();

const MyToken = await ethers.getContractFactory("MyToken");
const myToken = await MyToken.deploy();
await myToken.waitForDeployment();

const currentTime = Math.floor(Date.now() / 1000);
const presaleStart = currentTime + 300; // 5分鐘後開始
const presaleEnd = currentTime + 30 * 24 * 60 * 60; // 30天後結束

const Presale = await ethers.getContractFactory("Presale");
const presale = await Presale.deploy(
  await myToken.getAddress(),
  await mockUSDT.getAddress(),
  ethers.parseUnits("0.1", 6), // 0.1 USDT per token
  ethers.parseUnits("100", 18), // Min purchase: 100 tokens
  ethers.parseUnits("10000", 18), // Max purchase: 10,000 tokens
  ethers.parseUnits("500000", 18), // 500K tokens for sale
  presaleStart,
  presaleEnd
);
await presale.waitForDeployment();

// 初始化
const tokensForSale = ethers.parseUnits("500000", 18);
await myToken.transfer(await presale.getAddress(), tokensForSale);

const usdtAmount = ethers.parseUnits("1000", 6);
await mockUSDT.transfer(await ethers.getSigner().getAddress(), usdtAmount);

console.log("部署完成！");
console.log("MockUSDT:", await mockUSDT.getAddress());
console.log("MyToken:", await myToken.getAddress());
console.log("Presale:", await presale.getAddress());
```

## 🔧 自助白名單功能詳解

### 智能合約功能

```solidity
// 用戶自助申請白名單
function applyWhitelist() external {
    require(!whitelist[msg.sender], "Already whitelisted");
    whitelist[msg.sender] = true;
    emit WhitelistUpdated(msg.sender, true);
}

// 管理員批量設置白名單（可選）
function setWhitelist(address[] calldata users, bool[] calldata statuses) external onlyOwner {
    require(users.length == statuses.length, "Arrays length mismatch");
    for (uint256 i = 0; i < users.length; i++) {
        whitelist[users[i]] = statuses[i];
        emit WhitelistUpdated(users[i], statuses[i]);
    }
}

// 啟用/禁用白名單
function setWhitelistEnabled(bool enabled) external onlyOwner {
    whitelistEnabled = enabled;
}
```

### 前端實現

```javascript
// 申請白名單
const applyWhitelist = async () => {
  try {
    setLoading(true);
    setError("");
    
    if (!presaleContract) return;
    
    const tx = await presaleContract.applyWhitelist();
    await tx.wait();
    
    alert('Whitelist application submitted successfully!');
    
    // 重新加載用戶數據
    await loadUserData({ presale: presaleContract, usdt: usdtContract, mytoken: mytokenContract }, walletAddress);
  } catch (error) {
    console.error('Error applying for whitelist:', error);
    setError('Failed to apply for whitelist');
  } finally {
    setLoading(false);
  }
};
```

### UI 界面

- **白名單狀態顯示**：顯示用戶是否已加入白名單
- **申請按鈕**：未加入白名單時顯示申請按鈕
- **即時更新**：申請成功後立即更新狀態
- **錯誤處理**：顯示申請失敗的原因

## 📊 測試自助白名單功能

### 1. 本地測試

```bash
# 啟動本地環境
cd blockchain
npx hardhat node

# 部署合約
npx hardhat run scripts/deploy.js

# 啟動前端
cd frontend
npm start
```

### 2. 測試步驟

1. **連接錢包**：使用 MetaMask 連接到本地網絡
2. **查看白名單狀態**：檢查是否已加入白名單
3. **申請白名單**：點擊 "Apply" 按鈕
4. **確認交易**：在 MetaMask 中確認交易
5. **檢查狀態**：確認白名單狀態已更新

### 3. 測試多個賬戶

```bash
# 使用不同賬戶測試
# 在 MetaMask 中切換賬戶
# 重複上述步驟
```

## 🔍 白名單功能驗證

### 檢查白名單狀態

```javascript
// 在 Hardhat 控制台中
const presale = await ethers.getContractAt("Presale", "PRESALE_ADDRESS");
const userAddress = "USER_ADDRESS";

// 檢查用戶是否在白名單中
const isWhitelisted = await presale.whitelist(userAddress);
console.log("Is whitelisted:", isWhitelisted);

// 檢查白名單是否啟用
const whitelistEnabled = await presale.whitelistEnabled();
console.log("Whitelist enabled:", whitelistEnabled);
```

### 測試購買功能

1. **未加入白名單時**：嘗試購買應該失敗
2. **加入白名單後**：購買應該成功
3. **禁用白名單時**：任何人都可以購買

## 🎯 部署配置

### 本地開發配置

```javascript
// frontend/src/constants.js
export const CURRENT_NETWORK = 'LOCAL';

export const LOCAL_CONFIG = {
  MYTOKEN_ADDRESS: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  USDT_ADDRESS: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  PRESALE_ADDRESS: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
};
```

### Sepolia 配置

```javascript
// 部署後更新
export const CURRENT_NETWORK = 'SEPOLIA';

export const SEPOLIA_CONFIG = {
  MYTOKEN_ADDRESS: '0x...', // 實際部署的地址
  USDT_ADDRESS: '0x...',    // 實際部署的地址
  PRESALE_ADDRESS: '0x...'  // 實際部署的地址
};
```

## 🔧 故障排除

### 白名單相關問題

1. **無法申請白名單**：
   - 檢查是否已經在白名單中
   - 檢查網絡連接
   - 檢查合約地址是否正確

2. **申請成功但狀態未更新**：
   - 刷新頁面
   - 重新連接錢包
   - 檢查交易是否成功

3. **購買時提示未在白名單中**：
   - 確認已成功申請白名單
   - 檢查白名單是否啟用
   - 重新加載用戶數據

## 💡 最佳實踐

1. **開發階段**：使用本地開發環境
2. **測試階段**：使用 Sepolia 測試網
3. **生產階段**：部署到主網
4. **白名單管理**：使用自助申請，減少管理負擔
5. **用戶體驗**：提供清晰的狀態提示和錯誤信息

## 🎉 功能特色

- ✅ **自助白名單**：用戶可自行申請
- ✅ **即時生效**：申請成功後立即可用
- ✅ **防重複**：防止重複申請
- ✅ **管理員控制**：可啟用/禁用白名單
- ✅ **批量管理**：管理員可批量設置
- ✅ **用戶友好**：清晰的 UI 和狀態提示

現在您的預售項目已經具備完整的自助白名單功能，用戶可以輕鬆申請加入白名單並參與預售！🎨✨ 