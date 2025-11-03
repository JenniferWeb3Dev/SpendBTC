import { useState } from "react";
import { ethers } from "ethers";

export function useWallet() {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Metamask not detected!");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      setAccount(addr);
    } catch (err) {
      console.error(err);
    }
  };

  return { account, connectWallet };
}
