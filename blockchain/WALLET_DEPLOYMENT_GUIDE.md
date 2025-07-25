# 通過錢包部署 Sepolia 指南

## 🎯 為什麼選擇錢包部署？

### ✅ 優點
- **無需私鑰文件**：更安全
- **直觀的界面**：通過 MetaMask 操作
- **即時確認**：可以看到交易狀態
- **用戶友好**：適合不熟悉命令行的用戶

### ❌ 缺點
- 需要手動操作
- 無法自動化
- 每次部署都需要手動確認

## 🚀 部署步驟

### 1. 準備 Sepolia ETH

1. **獲取 Sepolia ETH**：
   - https://sepoliafaucet.com/
   - https://faucet.sepolia.dev/
   - 需要至少 0.1 ETH

### 2. 編譯合約

```bash
cd blockchain
npx hardhat compile
```

### 3. 使用 Remix IDE 部署

#### 方法一：使用 Remix IDE（推薦）

1. **訪問 Remix IDE**：
   - https://remix.ethereum.org/

2. **連接 MetaMask**：
   - 點擊 "Connect to MetaMask"
   - 確保連接到 Sepolia 測試網

3. **上傳合約文件**：
   - 將 `blockchain/contracts/` 下的文件上傳到 Remix
   - MockUSDT.sol
   - MyToken.sol
   - Presale.sol

4. **部署合約**：
   - 選擇合約
   - 填入構造函數參數
   - 點擊 "Deploy"
   - 在 MetaMask 中確認交易

#### 方法二：使用 Hardhat 控制台

```bash
cd blockchain
npx hardhat console --network sepolia
```

然後在控制台中手動部署：

```javascript
// 部署 Mock USDT
const MockUSDT = await ethers.getContractFactory("MockUSDT");
const mockUSDT = await MockUSDT.deploy();
await mockUSDT.waitForDeployment();
console.log("MockUSDT deployed to:", await mockUSDT.getAddress());

// 部署 MyToken
const MyToken = await ethers.getContractFactory("MyToken");
const myToken = await MyToken.deploy();
await myToken.waitForDeployment();
console.log("MyToken deployed to:", await myToken.getAddress());

// 部署 Presale
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
console.log("Presale deployed to:", await presale.getAddress());
```

### 4. 記錄合約地址

部署完成後，記錄所有合約地址：

```
MockUSDT: 0x...
MyToken: 0x...
Presale: 0x...
```

### 5. 初始化合約

部署後需要執行一些初始化操作：

```javascript
// 轉移代幣到預售合約
const tokensForSale = ethers.parseUnits("500000", 18);
const transferTx = await myToken.transfer(await presale.getAddress(), tokensForSale);
await transferTx.wait();
console.log("✅ Transferred 500,000 tokens to presale contract");

// 給部署者一些 USDT
const usdtAmount = ethers.parseUnits("1000", 6);
const usdtTx = await mockUSDT.transfer(await ethers.getSigner().getAddress(), usdtAmount);
await usdtTx.wait();
console.log("✅ Transferred 1000 USDT to deployer");
```

### 6. 更新前端配置

在 `frontend/src/constants.js` 中：

```javascript
// 切換到 Sepolia
export const CURRENT_NETWORK = 'SEPOLIA';

// 更新為實際部署的地址
export const SEPOLIA_CONFIG = {
  MYTOKEN_ADDRESS: '0x...', // 實際部署的地址
  USDT_ADDRESS: '0x...',    // 實際部署的地址
  PRESALE_ADDRESS: '0x...'  // 實際部署的地址
};
```

## 🔧 使用 Remix IDE 的詳細步驟

### 1. 設置 Remix

1. **打開 Remix IDE**：https://remix.ethereum.org/
2. **切換到 Sepolia**：
   - 點擊 "Deploy & Run Transactions"
   - 在 "Environment" 中選擇 "Injected Provider - MetaMask"
   - 確保 MetaMask 連接到 Sepolia

### 2. 上傳合約

1. **創建文件夾**：
   - 在 Remix 中創建 `contracts` 文件夾
   - 上傳所有 .sol 文件

### 3. 編譯合約

1. **編譯 MockUSDT**：
   - 選擇 MockUSDT.sol
   - 點擊 "Compile MockUSDT.sol"
   - 確保編譯成功

2. **編譯 MyToken**：
   - 選擇 MyToken.sol
   - 點擊 "Compile MyToken.sol"

3. **編譯 Presale**：
   - 選擇 Presale.sol
   - 點擊 "Compile Presale.sol"

### 4. 部署合約

1. **部署 MockUSDT**：
   - 在 "Deploy" 部分選擇 "MockUSDT"
   - 點擊 "Deploy"
   - 在 MetaMask 中確認交易

2. **部署 MyToken**：
   - 選擇 "MyToken"
   - 點擊 "Deploy"
   - 確認交易

3. **部署 Presale**：
   - 選擇 "Presale"
   - 填入構造函數參數
   - 點擊 "Deploy"
   - 確認交易

## 📊 網絡信息

- **網絡名稱**：Sepolia Testnet
- **Chain ID**：11155111
- **RPC URL**：https://sepolia.infura.io/v3/YOUR_PROJECT_ID
- **區塊瀏覽器**：https://sepolia.etherscan.io/

## 🔍 驗證合約

部署完成後，可以在 Etherscan 上驗證合約：

1. **訪問 Etherscan**：https://sepolia.etherscan.io/
2. **搜索合約地址**
3. **點擊 "Contract" 標籤**
4. **點擊 "Verify and Publish"**

## 💡 建議

1. **使用 Remix IDE**：最簡單的方式
2. **先在本地測試**：確保合約功能正常
3. **記錄所有地址**：部署後立即記錄
4. **測試所有功能**：部署後全面測試

這樣您就可以通過錢包直接部署，無需處理私鑰文件！ 