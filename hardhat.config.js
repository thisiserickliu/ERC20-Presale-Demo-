require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/vTRr0ICPjUuFOwqBkrmKA",
      accounts: [process.env.PRIVATE_KEY]
    }
  }
}; 