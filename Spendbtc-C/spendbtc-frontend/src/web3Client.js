import { ethers } from "ethers";
import { CONTRACTS } from "./config/contracts";
import { ABIS } from "./config/abis";

let provider;
let signer;

export const connectWallet = async () => {
  if (!window.ethereum) {
    alert("MetaMask is not installed!");
    return null;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    const account = await signer.getAddress();
    return { provider, signer, account };
  } catch (error) {
    console.error("Wallet connection failed:", error);
    return null;
  }
};

export const getContract = (name) => {
  if (!signer) throw new Error("Wallet not connected");
  return new ethers.Contract(CONTRACTS[name], ABIS[name], signer);
};

// Example function: deposit WBTC
export const depositWBTC = async (amount) => {
  const vault = getContract("VAULT");
  const wbtc = getContract("WBTC");
  const amt = ethers.parseUnits(amount.toString(), 18);

  // approve vault
  const txApprove = await wbtc.approve(CONTRACTS.VAULT, amt);
  await txApprove.wait();

  // deposit
  const txDeposit = await vault.depositWBTC(amt);
  await txDeposit.wait();
  return txDeposit.hash;
};

// Example function: borrow MUSD
export const borrowMUSD = async (amount) => {
  const vault = getContract("VAULT");
  const amt = ethers.parseUnits(amount.toString(), 18);
  const tx = await vault.borrowMUSD(amt);
  await tx.wait();
  return tx.hash;
};
