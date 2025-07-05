# ERC20 Token Presale Demo

A complete ERC20 token presale platform with modern React frontend and secure smart contracts.

## Features

### Smart Contracts
- **MyToken**: Standard ERC20 token with minting and burning capabilities
- **Presale**: Secure presale contract with whitelist support
- **MockUSDT**: Test USDT token for development

### Frontend
- Modern React.js application with Create React App
- Tailwind CSS for styling
- MetaMask wallet integration
- Real-time presale statistics
- Interactive token purchase interface
- Responsive design

### Key Features
- ✅ Secure smart contracts with OpenZeppelin
- ✅ Whitelist functionality
- ✅ Purchase limits (min/max)
- ✅ Real-time progress tracking
- ✅ Modern UI/UX
- ✅ Wallet integration
- ✅ Comprehensive testing
- ✅ Gas optimization

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask or other Web3 wallet

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd erc20-presale-demo
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp env.example .env
# Edit .env with your configuration
```

4. **Compile smart contracts**
```bash
npm run compile
```

5. **Run tests**
```bash
npm test
```

6. **Deploy contracts (local)**
```bash
npx hardhat node
npm run deploy
```

7. **Start frontend**
```bash
npm start
```

## Smart Contracts

### MyToken.sol
Standard ERC20 token with additional features:
- Minting (owner only)
- Burning (anyone)
- Configurable name, symbol, and initial supply

### Presale.sol
Secure presale contract with:
- Token price in USDT
- Purchase limits
- Whitelist support
- Time-based presale period
- Automatic token distribution
- Fund withdrawal functionality

### MockUSDT.sol
Test USDT token for development with 6 decimals.

## Frontend Components

### Main Features
- **PresaleStats**: Real-time statistics and progress
- **TokenPurchase**: Interactive purchase form
- **PresaleInfo**: Detailed presale information
- **Wallet Integration**: Seamless wallet connection

### Technologies Used
- React.js with Create React App
- JavaScript
- Tailwind CSS
- Ethers.js for Ethereum interactions
- MetaMask for wallet connection
- Native date formatting

## Configuration

### Environment Variables
```bash
# Network URLs
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
MAINNET_URL=https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Private Key (for deployment)
PRIVATE_KEY=your_private_key_here

# API Keys
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

### Contract Addresses
Update the contract addresses in `src/App.js`:
```javascript
const PRESALE_ADDRESS = '0x...' // Your presale contract address
const TOKEN_ADDRESS = '0x...' // Your token contract address
const USDT_ADDRESS = '0x...' // Your USDT contract address
```

## Deployment

### Local Development
```bash
# Start local blockchain
npx hardhat node

# Deploy contracts
npm run deploy
```

### Testnet Deployment
```bash
# Deploy to Sepolia
npm run deploy:testnet
```

### Mainnet Deployment
```bash
# Deploy to mainnet
npm run deploy:mainnet
```

## Testing

Run the test suite:
```bash
npm test
```

Test coverage:
```bash
npx hardhat coverage
```

## Security Features

- Reentrancy protection
- Access control with OpenZeppelin
- Input validation
- Safe math operations
- Emergency pause functionality
- Whitelist support

## Gas Optimization

- Solidity optimizer enabled
- Efficient data structures
- Minimal storage operations
- Batch operations for whitelist

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the test files for examples

## Roadmap

- [ ] Multi-stage presale
- [ ] Vesting schedules
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Multi-chain support
- [ ] Advanced admin panel 
