require("@nomicfoundation/hardhat-toolbox");

const INFURA_API_URL = "https://sepolia.infura.io/v3/24237cbb31974196acb8b8ec4969a760";
const PRIVATE_KEY = "b8d62977efcf17f00bd79033630128398fe0ced70e0b221c8ae2f64166d089e0"; // Use ENV VARS in real projects

module.exports = {
  solidity: "0.8.0",
  networks: {
    sepolia: {
      url: INFURA_API_URL,
      accounts: [PRIVATE_KEY],
    }
  }
};
