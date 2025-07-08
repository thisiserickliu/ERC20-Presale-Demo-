# ERC20 预售平台示例

一个完整的 ERC20 预售 DApp 示例，采用 React.js 与 Hardhat 开发。

## 主要功能
- 连接钱包（MetaMask）
- USDT 参与预售
- 实时统计与购买
- 白名单管理
- 响应式现代化 UI

## 快速开始

```bash
git clone https://github.com/你的账号/erc20-presale-demo.git
cd erc20-presale-demo
npm install
```

### 本地开发

1. 启动 Hardhat 节点：
   ```bash
   npx hardhat node
   ```
2. 部署合约：
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```
3. 启动前端：
   ```bash
   npm start
   ```

### 环境变量

请复制 `.env.example` 为 `.env` 并填写对应设置。

### 技术栈

- React.js（CRA）
- ethers.js
- Hardhat
- Tailwind CSS

### 授权条款

MIT 