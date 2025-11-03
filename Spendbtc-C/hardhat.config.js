require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");

const { PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    mezo: {
      url: "https://rpc.test.mezo.org",
      accounts: [PRIVATE_KEY],
      chainId: 31611
    }
  }
};
