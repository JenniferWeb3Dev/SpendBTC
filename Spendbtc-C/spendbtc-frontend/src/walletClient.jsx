import { ethers } from "ethers";

export async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask not detected");
    return null;
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    return address;
  } catch (err) {
    console.error("Wallet connection error:", err);
    return null;
  }
}
