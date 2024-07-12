import "hardhat-deploy";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import { HardhatUserConfig } from "hardhat/config";
import {
  privateKey,
  ETHERSCAN_API_KEY,
  FTMSCAN_API_KEY,
  MOONSCAN_API_KEY,
  MUMBAISCAN_API_KEY,
  SNOWTRACE_API_KEY,
} from "./secret.json";
import { Chain } from "./constants/chains";
import "./tasks";

const apiKey = {
  ETHERSCAN_API_KEY: ETHERSCAN_API_KEY || "",
  MOONSCAN_API_KEY: MOONSCAN_API_KEY || "",
  SNOWTRACE_API_KEY: SNOWTRACE_API_KEY || "",
  MUMBAISCAN_API_KEY: MUMBAISCAN_API_KEY || "",
  FTMSCAN_API_KEY: FTMSCAN_API_KEY || "",
};

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  defaultNetwork: Chain.AVALANCHE,
  networks: {
    ethereum: {
      chainId: 5,
      gasMultiplier: 2,
      url: "https://goerli.infura.io/v3/a3a667b533f34fd48ca350546454ea05",
      accounts: [privateKey],
    },
    avalanche: {
      chainId: 43113,
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [privateKey],
    },
    ethereumMainnet: {
      chainId: 1,
      gasMultiplier: 1.5,
      url: "https://mainnet.infura.io/v3/a3a667b533f34fd48ca350546454ea05",
      accounts: [privateKey],
    },
    avalancheMainnet: {
      chainId: 43114,
      gasMultiplier: 1.5,
      url: "https://api.avax.network/ext/bc/C/rpc",
      accounts: [privateKey],
    },
    moonbeam: {
      chainId: 1287,
      url: "https://rpc.api.moonbase.moonbeam.network",
      accounts: [privateKey],
    },
    polygon: {
      chainId: 80001,
      url: "https://rpc-mumbai.maticvigil.com/", // polygon mumbai testnet rpc
      accounts: [privateKey],
    },
    fantom: {
      chainId: 4002,
      url: "https://rpc.testnet.fantom.network",
      accounts: [privateKey],
    },
  },
  namedAccounts: {
    deployer: 0,
  },
  etherscan: {
    apiKey: {
      goerli: apiKey.ETHERSCAN_API_KEY,
      avalancheFujiTestnet: apiKey.SNOWTRACE_API_KEY,
      moonbaseAlpha: apiKey.MOONSCAN_API_KEY,
      polygonMumbai: apiKey.MUMBAISCAN_API_KEY,
      ftmTestnet: apiKey.FTMSCAN_API_KEY,
    },
  },
};

export default config;
