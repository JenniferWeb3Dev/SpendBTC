// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockBTCUSDOracle {
    uint256 private price = 30000 * 1e8; 

    function getPrice() external view returns (uint256) {
        return price;
    }

    function setPrice(uint256 _price) external {
        price = _price;
    }
}
