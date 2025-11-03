// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockOracle {
    int256 private price = 60000e8; // BTC at $60,000 with 8 decimals

    function latestAnswer() external view returns (int256) {
        return price;
    }

    function setPrice(int256 _price) external {
        price = _price;
    }
}
