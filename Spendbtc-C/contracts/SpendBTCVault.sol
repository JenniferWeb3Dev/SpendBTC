// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./MUSD.sol";
import "./MockBTCUSDOracle.sol";

contract SpendBTCVault is ReentrancyGuard, Ownable {
    MUSD public musd;
    MockBTCUSDOracle public oracle;
    uint256 public collateralRatio;

    mapping(address => uint256) public collateralBTC;
    mapping(address => uint256) public debtMUSD;

    constructor(address musdAddress, address oracleAddress, uint256 _collateralRatio) {
        musd = MUSD(musdAddress);
        oracle = MockBTCUSDOracle(oracleAddress);
        collateralRatio = _collateralRatio;
    }

    function depositCollateral() external payable nonReentrant {
        require(msg.value > 0, "Must deposit BTC");
        collateralBTC[msg.sender] += msg.value;
    }

    function borrowMUSD(uint256 amount) external nonReentrant {
        uint256 btcValueUSD = (collateralBTC[msg.sender] * oracle.getPrice()) / 1e8;
        uint256 maxBorrow = (btcValueUSD * 100) / collateralRatio;
        require(debtMUSD[msg.sender] + amount <= maxBorrow, "Exceeds borrow limit");

        debtMUSD[msg.sender] += amount;
        musd.mint(msg.sender, amount);
    }

    function repayMUSD(uint256 amount) external nonReentrant {
        require(debtMUSD[msg.sender] >= amount, "Repay exceeds debt");
        debtMUSD[msg.sender] -= amount;
        musd.burn(msg.sender, amount);
    }

    function withdrawCollateral(uint256 amount) external nonReentrant {
        uint256 btcValueUSD = (collateralBTC[msg.sender] * oracle.getPrice()) / 1e8;
        uint256 maxBorrow = (btcValueUSD * 100) / collateralRatio;
        require((debtMUSD[msg.sender] * collateralRatio) / 100 <= btcValueUSD - (amount * oracle.getPrice()) / 1e8, "Cannot withdraw enough collateral");

        collateralBTC[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }
}
