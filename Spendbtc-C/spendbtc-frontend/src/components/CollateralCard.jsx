import React, { useState, useEffect } from "react";
import { CONTRACT_ADDRESSES } from "../config/contracts";
import VaultABI from "../abi/spendbtcvault.json";
import { ethers } from "ethers";

const CollateralCard = () => {
  const [account, setAccount] = useState(null);
  const [collateral, setCollateral] = useState(0);
  const [depositAmount, setDepositAmount] = useState("");
  const [provider, setProvider] = useState(null);
  const [vaultContract, setVaultContract] = useState(null);

  const { WBTC, VAULT } = CONTRACT_ADDRESSES;

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);

      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(ethersProvider);

      const vault = new ethers.Contract(VAULT, VaultABI, ethersProvider.getSigner());
      setVaultContract(vault);
    } catch (err) {
      console.error("Wallet connection error:", err);
    }
  };

  // Fetch collateral
  const fetchCollateral = async () => {
    if (!vaultContract || !account) return;
    try {
      const amount = await vaultContract.collateralOf(account);
      setCollateral(ethers.utils.formatEther(amount));
    } catch (err) {
      console.error("Error fetching collateral:", err);
    }
  };

  // Deposit WBTC collateral
  const depositCollateral = async () => {
    if (!vaultContract || !depositAmount) return;
    try {
      const tx = await vaultContract.depositCollateral({
        value: ethers.utils.parseEther(depositAmount),
      });
      await tx.wait();
      setDepositAmount("");
      fetchCollateral();
    } catch (err) {
      console.error("Deposit error:", err);
    }
  };

  // Fetch collateral whenever account or contract changes
  useEffect(() => {
    fetchCollateral();
  }, [vaultContract, account]);

  return (
    <div className="p-4 border rounded-md shadow-md bg-white">
      <h2 className="text-lg font-bold mb-2">Collateral</h2>
      <p>WBTC Collateral: {collateral}</p>

      {!account ? (
        <button
          onClick={connectWallet}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <div className="mt-2">
            <input
              type="number"
              placeholder="Amount to deposit"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="border px-2 py-1 mr-2 rounded w-32"
            />
            <button
              onClick={depositCollateral}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Approve & Deposit
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CollateralCard;
