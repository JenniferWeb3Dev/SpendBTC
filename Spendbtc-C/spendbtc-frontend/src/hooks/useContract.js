import { useMemo } from "react";
import { useSigner, usePublicClient } from "wagmi";
import { CONTRACT_ADDRESSES } from "../config/contracts";
import MUSDABI from "../abi/MUSD.json";
import VAULTABI from "../abi/SpendBTCVault.json";
import WBTCABI from "../abi/MockWBTC.json";
import ORACLEABI from "../abi/MockOracle.json";
import { ethers } from "ethers";

export function useContract(name) {
  const { data: signerData } = useSigner(); 
  const publicClient = usePublicClient(); 

  return useMemo(() => {
    const key = name?.toUpperCase();
    const address = CONTRACT_ADDRESSES[key];
    if (!address) return null;

    let abi;
    if (key === "MUSD") abi = MUSDABI.abi ?? MUSDABI;
    else if (key === "VAULT") abi = VAULTABI.abi ?? VAULTABI;
    else if (key === "WBTC") abi = WBTCABI.abi ?? WBTCABI;
    else if (key === "ORACLE") abi = ORACLEABI.abi ?? ORACLEABI;
    else return null;

    if (signerData) {
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = ethersProvider.getSigner();
      const c = new ethers.Contract(address, abi, signer);
      return { contract: c, address, abi };
    }

    try {
      const rpcUrl = publicClient?.request ? undefined : undefined; 
    } catch {}

    const defaultProvider = ethers.getDefaultProvider();
    const c = new ethers.Contract(address, abi, defaultProvider);
    return { contract: c, address, abi };
  }, [name, signerData, publicClient]);
}
