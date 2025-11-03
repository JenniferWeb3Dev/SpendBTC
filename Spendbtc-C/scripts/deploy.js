const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying from:", await deployer.getAddress());

  const MockOracleFactory = await ethers.getContractFactory("MockBTCUSDOracle");
  const mockOracle = await MockOracleFactory.deploy();
  await mockOracle.waitForDeployment();
  console.log("MockOracle deployed to:", mockOracle.target);

  const MUSDFactory = await ethers.getContractFactory("MUSD");
  const musd = await MUSDFactory.deploy("Mock USD", "MUSD");
  await musd.waitForDeployment();
  console.log("MUSD deployed to:", musd.target);

  const SpendBTCVaultFactory = await ethers.getContractFactory("SpendBTCVault");
  const collateralRatio = 150;
  const vault = await SpendBTCVaultFactory.deploy(musd.target, mockOracle.target, collateralRatio);
  await vault.waitForDeployment();
  console.log("SpendBTCVault deployed to:", vault.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
