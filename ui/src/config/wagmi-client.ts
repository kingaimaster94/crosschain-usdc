import { configureChains, createClient } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import config from "./constants";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

const isTestnet = process.env.NEXT_PUBLIC_ENVIRONMENT === "testnet";

const { chains, provider } = configureChains(config.chains, [
  jsonRpcProvider({
    rpc: (chain) => {
      return { http: chain?.rpcUrls?.default };
    },
  }),
]);

export const wagmiClient = createClient({
  autoConnect: true,
  provider,
  connectors: [
    new InjectedConnector({
      chains: chains.map((chain) => ({
        ...chain,
        name:
          chain.name[0].toUpperCase() + chain.name.slice(1) + isTestnet
            ? " Testnet"
            : "",
      })),
      options: {
        shimChainChangedDisconnect: true,
      },
    }),
    new WalletConnectConnector({
      chains: chains.map((chain) => ({
        ...chain,
        name:
          chain.name[0].toUpperCase() + chain.name.slice(1) + isTestnet
            ? " Testnet"
            : "",
      })),
      options: {
        qrcode: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains: chains.map((chain) => ({
        ...chain,
        name:
          chain.name[0].toUpperCase() + chain.name.slice(1) + isTestnet
            ? " Testnet"
            : "",
      })),
      options: {
        appName: "SquiDex",
      },
    }),
  ],
});
