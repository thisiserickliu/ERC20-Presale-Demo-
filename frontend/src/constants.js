export const MYTOKEN_ADDRESS = '0x93F1197a002391D8CD4fC290E7c183720946e8dc';
export const USDT_ADDRESS = '0x76DFC5C47141212674131Bbe919DD2C8487d46e5';
export const PRESALE_ADDRESS = '0x89c9104A7B1E4eDB892e7931ab3a399e659F1273';

export const PRESALE_ABI = [
  {"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"address","name":"_paymentToken","type":"address"},{"internalType":"uint256","name":"_tokenPrice","type":"uint256"},{"internalType":"uint256","name":"_minPurchase","type":"uint256"},{"internalType":"uint256","name":"_maxPurchase","type":"uint256"},{"internalType":"uint256","name":"_totalTokensForSale","type":"uint256"},{"internalType":"uint256","name":"_presaleStart","type":"uint256"},{"internalType":"uint256","name":"_presaleEnd","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"totalSold","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalRaised","type":"uint256"}],"name":"PresaleFinalized","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"cost","type":"uint256"}],"name":"TokensPurchased","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"bool","name":"status","type":"bool"}],"name":"WhitelistUpdated","type":"event"},
  {"inputs":[],"name":"applyWhitelist","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"buyTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"finalizePresale","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"getPresaleInfo","outputs":[{"internalType":"uint256","name":"_tokenPrice","type":"uint256"},{"internalType":"uint256","name":"_minPurchase","type":"uint256"},{"internalType":"uint256","name":"_maxPurchase","type":"uint256"},{"internalType":"uint256","name":"_totalTokensForSale","type":"uint256"},{"internalType":"uint256","name":"_tokensSold","type":"uint256"},{"internalType":"uint256","name":"_totalRaised","type":"uint256"},{"internalType":"uint256","name":"_presaleStart","type":"uint256"},{"internalType":"uint256","name":"_presaleEnd","type":"uint256"},{"internalType":"bool","name":"_presaleFinalized","type":"bool"},{"internalType":"bool","name":"_whitelistEnabled","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getUserInfo","outputs":[{"internalType":"uint256","name":"_purchased","type":"uint256"},{"internalType":"bool","name":"_whitelisted","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"maxPurchase","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"minPurchase","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"paymentToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"presaleEnd","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"presaleFinalized","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"presaleStart","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address[]","name":"users","type":"address[]"},{"internalType":"bool[]","name":"statuses","type":"bool[]"}],"name":"setWhitelist","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"bool","name":"enabled","type":"bool"}],"name":"setWhitelistEnabled","outputs":[],"stateMutability":"nonpayable","type":"function"},
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
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"whitelist","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"whitelistEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"withdrawFunds","outputs":[],"stateMutability":"nonpayable","type":"function"}
]; 

