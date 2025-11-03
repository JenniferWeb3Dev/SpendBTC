import { useAccount, useSigner, usePublicClient } from "wagmi";
import { ethers } from "ethers";

export function useWagmiWeb3() {
  const { address, isConnected } = useAccount();
  const { data: signer } = useSigner();
  const publicClient = usePublicClient();

  const signerOrProvider = signer ?? publicClient;
  const ethersProvider = signer ? new ethers.BrowserProvider(window.ethereum) : null;

  return {
    address,
    isConnected,
    signer,          
    ethersProvider,
  };
}
