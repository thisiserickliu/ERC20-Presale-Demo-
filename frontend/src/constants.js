// 網絡配置
export const NETWORKS = {
  LOCAL: {
    name: 'Hardhat Local',
    chainId: 1337,
    rpcUrl: 'http://127.0.0.1:8545',
    explorer: null
  },
  SEPOLIA: {
    name: 'Sepolia Testnet',
    chainId: 11155111,
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/vTRr0ICPjUuFOwqBkrmKA',
    explorer: 'https://sepolia.etherscan.io'
  }
};

// 智能合約地址配置 - 本地 Hardhat 網絡
export const LOCAL_CONFIG = {
  MYTOKEN_ADDRESS: '0x7a2088a1bFc9d81c55368AE168C2C02570cB814F',
  USDT_ADDRESS: '0x4A679253410272dd5232B3Ff7cF5dbB88f295319',
  PRESALE_ADDRESS: '0x09635F643e140090A9A8Dcd712eD6285858ceBef'
};

// 智能合約地址配置 - Sepolia 測試網
export const SEPOLIA_CONFIG = {
  MYTOKEN_ADDRESS: '0x14A6f6d56226192102CB0b738C99D433B7129FC4',
  USDT_ADDRESS: '0x31F6F17F0069a207582d994C4b86c63262bd965e',
  PRESALE_ADDRESS: '0x337E3dcb43A7688894aD93F3160519f67Fb72D3f'
};

// 當前使用的配置（可以切換）
export const CURRENT_NETWORK = 'SEPOLIA'; // 切換到 Sepolia 測試網

// 根據當前網絡選擇配置
export const getCurrentConfig = () => {
  return CURRENT_NETWORK === 'SEPOLIA' ? SEPOLIA_CONFIG : LOCAL_CONFIG;
};

// 向後兼容的導出
export const MYTOKEN_ADDRESS = getCurrentConfig().MYTOKEN_ADDRESS;
export const USDT_ADDRESS = getCurrentConfig().USDT_ADDRESS;
export const PRESALE_ADDRESS = getCurrentConfig().PRESALE_ADDRESS;

// USDT ABI (只需要 approve 和 allowance 功能)
export const USDT_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)",
  "function balanceOf(address account) public view returns (uint256)",
  "function decimals() public pure returns (uint8)"
];

// MyToken ABI
export const MYTOKEN_ABI = [
  "function balanceOf(address account) public view returns (uint256)",
  "function transfer(address to, uint256 amount) public returns (bool)",
  "function decimals() public pure returns (uint8)"
];

// Presale ABI
export const PRESALE_ABI = [
  {"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"address","name":"_paymentToken","type":"address"},{"internalType":"uint256","name":"_tokenPrice","type":"uint256"},{"internalType":"uint256","name":"_minPurchase","type":"uint256"},{"internalType":"uint256","name":"_maxPurchase","type":"uint256"},{"internalType":"uint256","name":"_totalTokensForSale","type":"uint256"},{"internalType":"uint256","name":"_presaleStart","type":"uint256"},{"internalType":"uint256","name":"_presaleEnd","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"totalSold","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalRaised","type":"uint256"}],"name":"PresaleFinalized","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"cost","type":"uint256"}],"name":"TokensPurchased","type":"event"},
  {"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"buyTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"finalizePresale","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"getPresaleInfo","outputs":[{"internalType":"uint256","name":"_tokenPrice","type":"uint256"},{"internalType":"uint256","name":"_minPurchase","type":"uint256"},{"internalType":"uint256","name":"_maxPurchase","type":"uint256"},{"internalType":"uint256","name":"_totalTokensForSale","type":"uint256"},{"internalType":"uint256","name":"_tokensSold","type":"uint256"},{"internalType":"uint256","name":"_totalRaised","type":"uint256"},{"internalType":"uint256","name":"_presaleStart","type":"uint256"},{"internalType":"uint256","name":"_presaleEnd","type":"uint256"},{"internalType":"bool","name":"_presaleFinalized","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserInfo","outputs":[{"internalType":"uint256","name":"_purchased","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"maxPurchase","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"minPurchase","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"paymentToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"presaleEnd","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"presaleFinalized","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"presaleStart","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_start","type":"uint256"},{"internalType":"uint256","name":"_end","type":"uint256"}],"name":"startPresale","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"token","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"tokenPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"tokensSold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"totalRaised","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"totalTokensForSale","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_start","type":"uint256"},{"internalType":"uint256","name":"_end","type":"uint256"}],"name":"updatePresalePeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"updateTokenPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userPurchases","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"withdrawFunds","outputs":[],"stateMutability":"nonpayable","type":"function"}
]; 

