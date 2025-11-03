import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import provider, { getSigner } from "../provider";
import { CONTRACT_ADDRESSES } from "../config/contracts";
import VaultABI from "../abi/spendBTCVault.json";
import ERC20ABI from "../abi/MockERC20.json";
import BorrowCard from "./BorrowCard";

export default function Dashboard() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState("");
  const [networkName, setNetworkName] = useState("");
  const [vaultBalance, setVaultBalance] = useState("0");
  const [musdBalance, setMusdBalance] = useState("0");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initDashboard() {
      try {
        if (!window.ethereum) {
          alert("MetaMask not detected. Please install MetaMask.");
          setLoading(false);
          return;
        }

        const signer = await getSigner();
        const userAddress = await signer.getAddress();
        setAccount(userAddress);

        const network = await provider.getNetwork();
        setChainId(network.chainId.toString());
        setNetworkName(network.name);
        console.log("Connected Chain:", network.chainId.toString(), network.name);

        const vault = new ethers.Contract(CONTRACT_ADDRESSES.VAULT, VaultABI, signer);
        const musd = new ethers.Contract(CONTRACT_ADDRESSES.MUSD, ERC20ABI, signer);

        const btcBalance = await provider.getBalance(userAddress);
        const userMusdBalance = await musd.balanceOf(userAddress);

        setVaultBalance(ethers.formatEther(btcBalance));
        setMusdBalance(ethers.formatEther(userMusdBalance));
      } catch (err) {
        console.error("Dashboard initialization failed:", err);
        alert("Failed to connect. Check RPC configuration or wallet connection.");
      } finally {
        setLoading(false);
      }
    }

    initDashboard();
  }, []);

  const connectWallet = async () => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      window.location.reload();
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>SpendBTC Vault Dashboard</h2>

      {!account ? (
        <button onClick={connectWallet} style={styles.connectBtn}>
          Connect Wallet
        </button>
      ) : (
        <>
          <div style={styles.infoBox}>
            <p><strong>Wallet:</strong> {account}</p>
            <p><strong>Chain ID:</strong> {chainId}</p>
            <p><strong>Network:</strong> {networkName || "Unknown"}</p>
            <p><strong>BTC Balance:</strong> {vaultBalance} ETH (Native)</p>
            <p><strong>MUSD Balance:</strong> {musdBalance}</p>
          </div>

          {chainId !== "31611" ? (
            <div style={styles.warning}>
              ⚠️ You are not connected to the Mezo Testnet (Chain ID: 31611).  
              Please switch your MetaMask network to continue.
            </div>
          ) : (
            <BorrowCard />
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    color: "#fff",
    backgroundColor: "#0d1117",
    borderRadius: "10px",
    maxWidth: "600px",
    margin: "40px auto",
    boxShadow: "0 0 15px rgba(0,0,0,0.4)",
  },
  infoBox: {
    backgroundColor: "#161b22",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "15px",
  },
  connectBtn: {
    backgroundColor: "#4c82fb",
    color: "#fff",
    padding: "12px 18px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  warning: {
    backgroundColor: "#c0392b",
    padding: "12px",
    borderRadius: "8px",
    marginTop: "15px",
    textAlign: "center",
    fontWeight: "bold",
  },
};
