# ERC20 Presale Demo

A full-stack DApp demo for ERC20 token presale, built with React.js and Hardhat.

## Features
- Connect wallet (MetaMask)
- USDT-based presale
- Real-time stats and purchase
- Whitelist management
- Responsive, modern UI

## Quick Start

```bash
git clone https://github.com/yourname/erc20-presale-demo.git
cd erc20-presale-demo
npm install
```

### Local Development

1. Start Hardhat node:
```bash
npx hardhat node
   ```
2. Deploy contracts:
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
```
3. Start frontend:
```bash
npm start
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your settings.

### Tech Stack

- React.js (CRA)
- ethers.js
- Hardhat
- Tailwind CSS

### License

MIT 
