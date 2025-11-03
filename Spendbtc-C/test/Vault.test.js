const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SpendBTCVault", () => {
  let owner, user, wbtc, musd, oracle, vault;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();

    const MockToken = await ethers.getContractFactory("contracts/interfaces/IERC20.sol:IERC20");
    wbtc = await MockToken.deploy(); // Or use mock WBTC

    const MUSD = await ethers.getContractFactory("MUSD");
    musd = await MUSD.deploy();

    const Oracle = await ethers.getContractFactory("MockBTCUSDOracle");
    oracle = await Oracle.deploy(65000 * 1e8);

    const Vault = await ethers.getContractFactory("SpendBTCVault");
    vault = await Vault.deploy(await wbtc.getAddress(), await musd.getAddress(), await oracle.getAddress());
    await musd.setVault(await vault.getAddress());
  });

  it("should mint MUSD against BTC collateral", async () => {
    // Mock deposit test logic
  });
});
