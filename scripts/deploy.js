// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
    // Get the contract factory
    const DIDRegistry = await ethers.getContractFactory("DIDRegistry");

    // Deploy the contract
    const didRegistry = await DIDRegistry.deploy();

    // Wait for deployment to complete (Ethers v6)
    await didRegistry.waitForDeployment();

    // Get deployed contract address
    console.log("DIDRegistry deployed to:", await didRegistry.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
