import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [ metaMask() ],
  transports: {
    [sepolia.id]: http("https://eth-sepolia.g.alchemy.com/v2/ms2RRp0Hmah3qCElfNaoN"),
  },
});
