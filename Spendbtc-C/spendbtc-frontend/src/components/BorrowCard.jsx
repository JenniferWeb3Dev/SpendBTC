import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import provider, { getSigner, ensureCorrectChain } from "../provider";
import { CONTRACT_ADDRESSES } from "../config/contracts";
import VaultABI from "../abi/spendbtcvault.json";
import ERC20ABI from "../abi/MockERC20.json";

export default function BorrowCard() {
  const [vaultContract, setVaultContract] = useState(null);
  const [musdContract, setMusdContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [borrowAmount, setBorrowAmount] = useState("");
  const [debt, setDebt] = useState("0");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function initContracts() {
      try {
        await ensureCorrectChain();
        const signer = await getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const vault = new ethers.Contract(CONTRACT_ADDRESSES.VAULT, VaultABI, signer);
        const musd = new ethers.Contract(CONTRACT_ADDRESSES.MUSD, ERC20ABI, signer);

        setVaultContract(vault);
        setMusdContract(musd);

        const currentDebt = await vault.getDebt(address);
        setDebt(ethers.formatEther(currentDebt));
      } catch (error) {
        console.error("BorrowCard initialization failed:", error);
      }
    }

    initContracts();
  }, []);

  const handleBorrow = async () => {
    if (!vaultContract) {
      alert("Vault contract not loaded. Please connect your wallet.");
      return;
    }

    try {
      setLoading(true);
      const tx = await vaultContract.borrow(ethers.parseEther(borrowAmount));
      await tx.wait();

      alert(`Successfully borrowed ${borrowAmount} MUSD`);
      setBorrowAmount("");

      const currentDebt = await vaultContract.getDebt(account);
      setDebt(ethers.formatEther(currentDebt));
    } catch (err) {
      console.error("Borrow failed:", err);
      alert("Borrow transaction failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h3>Borrow MUSD Using BTC</h3>
      <p><strong>MUSD Debt:</strong> {debt}</p>

      <input
        type="number"
        placeholder="Enter amount to borrow"
        value={borrowAmount}
        onChange={(e) => setBorrowAmount(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleBorrow} disabled={loading} style={styles.button}>
        {loading ? "Processing..." : "Borrow"}
      </button>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#161b22",
    padding: "20px",
    borderRadius: "10px",
    color: "#fff",
    marginTop: "20px",
    textAlign: "left",
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #333",
    backgroundColor: "#0d1117",
    color: "#fff",
    marginBottom: "10px",
  },
  button: {
    padding: "10px 16px",
    background: "#4c82fb",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    borderRadius: "8px",
    fontWeight: "bold",
    width: "100%",
  },
};
