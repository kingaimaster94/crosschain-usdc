import { GasToken } from "@axelar-network/axelarjs-sdk";

export enum Chain {
  MOONBEAM = "moonbeam",
  AVALANCHE = "avalanche",
  ETHEREUM = "ethereum",
  FANTOM = "fantom",
  POLYGON = "polygon",
  AVALANCHE_MAINNET = "avalancheMainnet",
  ETHEREUM_MAINNET = "ethereumMainnet",
}

export const GMPChainId = {
  [Chain.MOONBEAM]: "moonbeam",
  [Chain.AVALANCHE]: "avalanche",
  [Chain.ETHEREUM]: "ethereum-2",
  [Chain.AVALANCHE_MAINNET]: "avalanche",
  [Chain.ETHEREUM_MAINNET]: "ethereum",
  [Chain.FANTOM]: "fantom",
  [Chain.POLYGON]: "polygon",
};

export const NativeToken = {
  [Chain.MOONBEAM]: GasToken.GLMR,
  [Chain.AVALANCHE]: GasToken.AVAX,
  [Chain.ETHEREUM]: GasToken.ETH,
  [Chain.FANTOM]: GasToken.FTM,
  [Chain.POLYGON]: GasToken.MATIC,
};
