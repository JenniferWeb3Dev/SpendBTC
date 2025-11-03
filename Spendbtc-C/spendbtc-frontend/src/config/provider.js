import { ethers } from "ethers";

const MEZO_CHAIN_ID = 31611; // Mezo Testnet (Boar)
const MEZO_RPC_URL = "https://spectrum-01.simplystaking.xyz/Y2Fzb3NqcGctMDEtMWZhNDFmOGM/1fK8goGdmmE3pQ/mezo/mainnet/";
const MEZO_CHAIN_NAME = "Mezo Testnet (Boar)";
const MEZO_NATIVE_CURRENCY = {
  name: "BTC",
  symbol: "BTC",
  decimals: 18,
};
const MEZO_BLOCK_EXPLORER_URL = "https://explorer.mezo.org"; // if available

let provider;

// Initialize provider
if (typeof window !== "undefined" && window.ethereum) {
  provider = new ethers.BrowserProvider(window.ethereum);

  // Ensure correct network
  (async () => {
    try {
      const network = await provider.getNetwork();
      if (Number(network.chainId) !== MEZO_CHAIN_ID) {
        console.warn(`Switching to ${MEZO_CHAIN_NAME} (${MEZO_CHAIN_ID})...`);
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x" + MEZO_CHAIN_ID.toString(16) }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            console.warn("Mezo Testnet not found in MetaMask. Adding...");
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x" + MEZO_CHAIN_ID.toString(16),
                  chainName: MEZO_CHAIN_NAME,
                  nativeCurrency: MEZO_NATIVE_CURRENCY,
                  rpcUrls: [MEZO_RPC_URL],
                  blockExplorerUrls: [MEZO_BLOCK_EXPLORER_URL],
                },
              ],
            });
          } else {
            console.error("Failed to switch network:", switchError);
          }
        }
      }
    } catch (err) {
      console.error("Error initializing Mezo provider:", err);
    }
  })();
} else {
  console.warn("MetaMask not detected. Using fallback RPC provider.");
  provider = new ethers.JsonRpcProvider(MEZO_RPC_URL);
}

// Export signer helper
export async function getSigner() {
  if (!provider) throw new Error("Provider not initialized");
  const signer = await provider.getSigner();
  return signer;
}

export default provider;
