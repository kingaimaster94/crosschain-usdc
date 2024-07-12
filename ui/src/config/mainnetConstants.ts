import { ChainId, ChainName, SquidChain } from "../types/chain";
export const RPC = {
  [ChainName.AVALANCHE_MAINNET]: "https://api.avax.network/ext/bc/C/rpc",
  [ChainName.ETHEREUM_MAINNET]:
    "https://mainnet.infura.io/v3/b0e255b9ef4b442c97f8a7458f8bd6ad",
};

export const WSS = {
  [ChainName.ETHEREUM]:
    "wss://goerli.infura.io/ws/v3/b0e255b9ef4b442c97f8a7458f8bd6ad",
  [ChainName.AVALANCHE_MAINNET]: "wss://api.avax.network/ext/bc/C/ws",
  [ChainName.ETHEREUM_MAINNET]:
    "wss://mainnet.infura.io/ws/v3/b0e255b9ef4b442c97f8a7458f8bd6ad",
};

export const CROSSCHAIN_NATIVE_SWAP = {
  [ChainName.ETHEREUM]: "0xfc388061d55E00f82d2C280287251010ebBd611D",
  [ChainName.AVALANCHE_MAINNET]: "0xd5BA1f7cAe2A907e687f574f9600840e9BeF7E03",
  [ChainName.ETHEREUM_MAINNET]: "0xa056589453813E5C644Fe020a9Cc4421AF68e929"
};

export const MESSAGE_TRANSMITTER = {
  [ChainName.ETHEREUM]: "0x26413e8157CD32011E726065a5462e97dD4d03D9",
  [ChainName.AVALANCHE_MAINNET]: "0x8186359aF5F57FbB40c6b14A588d2A59C0C29880",
  [ChainName.ETHEREUM_MAINNET]: "0x0a992d191DEeC32aFe36203Ad87D7d289a738F81",
};

export const TOKEN_MESSENGER = {
  [ChainName.ETHEREUM]: "0xd0c3da58f55358142b8d3e06c1c30c5c6114efe8",
  [ChainName.AVALANCHE_MAINNET]: "0x6B25532e1060CE10cc3B0A99e5683b91BFDe6982",
  [ChainName.ETHEREUM_MAINNET]: "0xBd3fa81B58Ba92a82136038B25aDec7066af3155"
};

export const ATTESTATION_BASE_API = "https://iris-api.circle.com";
export const chains: SquidChain[] = [
  {
    id: ChainId.ETHEREUM_MAINNET,
    name: ChainName.ETHEREUM_MAINNET,
    alias: "Ethereum",
    network: "mainnet",
    icon: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    rpcUrls: {
      default: RPC[ChainName.ETHEREUM_MAINNET],
    },
    multicallAddress: "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
    gatewayAddress: "0x4F4495243837681061C4743b74B3eEdf548D56A5",
    crosschainNativeSwapAddress: CROSSCHAIN_NATIVE_SWAP[ChainName.ETHEREUM_MAINNET],
    routerAddress: "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
    blockExplorers: {
      default: { name: "Etherscan", url: "https://etherscan.io/" },
    },
    wrappedNativeToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
  },
  // {
  //   id: ChainId.MOONBEAM,
  //   name: ChainName.MOONBEAM,
  //   network: "moonbase-alphanet",
  //   icon: "https://assets.coingecko.com/coins/images/22459/small/glmr.png?1641880985",
  //   rpcUrls: {
  //     default: "https://rpc.api.moonbase.moonbeam.network",
  //   },
  //   multicallAddress: "0x4E2cfca20580747AdBA58cd677A998f8B261Fc21",
  //   gatewayAddress: "0x5769D84DD62a6fD969856c75c7D321b84d455929",
  //   swapExecutorAddress: "0x8fE4B6135B80a4640B7E8a0e12da01c31176F60e",
  //   routerAddress: "0xF75F62464fb6ae6E7088b76457E164EeCfB07dB4",
  //   defaultCrosschainToken: "0xd34007bb8a54b2fbb1d6647c5aba04d507abd21d",
  //   wrappedNativeToken: "0x372d0695E75563D9180F8CE31c9924D7e8aaac47",
  //   distributionENSExecutableAddress:
  //     "0xD05180187165eED557c90AB907D1C0B1dd35bDD6",
  //   ensRegistryAddress: "",
  //   nativeCurrency: {
  //     name: "Moonbeam",
  //     symbol: "GLMR",
  //     decimals: 18,
  //   },
  //   testnet: true,
  // },
  // {
  //   id: ChainId.FANTOM,
  //   name: ChainName.FANTOM,
  //   network: "Fantom Testnet",
  //   icon: "https://assets.coingecko.com/coins/images/4001/small/Fantom.png?1558015016",
  //   rpcUrls: {
  //     default: "https://rpc.testnet.fantom.network/",
  //   },
  //   multicallAddress: "0xf44a24e4447f01e410ea736a8295489b840bad3c",
  //   gatewayAddress: "0x97837985Ec0494E7b9C71f5D3f9250188477ae14",
  //   swapExecutorAddress: "0x3Ee316Ea3DB93771625D6b0D20753aE3fE1c498f",
  //   routerAddress: "0x9fE0E1636735153B0b1f5f5b98B5e93C203c94cc",
  //   wrappedNativeToken: "0x3a34e91226052c509cb0dc38dcdefe6a028f869e",
  //   blockExplorers: {
  //     default: { name: "Ftmscan", url: "https://testnet.ftmscan.com" },
  //   },
  //   nativeCurrency: {
  //     name: "Fantom",
  //     symbol: "FTM",
  //     decimals: 18,
  //   },
  //   testnet: true,
  // },
  {
    id: ChainId.AVALANCHE_MAINNET,
    name: ChainName.AVALANCHE_MAINNET,
    alias: "Avalanche",
    network: "Avalanche C-Chain",
    icon: "https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png?1604021818",
    rpcUrls: {
      default: RPC[ChainName.AVALANCHE_MAINNET],
    },
    multicallAddress: "0x29b6603D17B9D8f021EcB8845B6FD06E1Adf89DE",
    gatewayAddress: "0x5029C0EFf6C34351a0CEc334542cDb22c7928f78",
    crosschainNativeSwapAddress: CROSSCHAIN_NATIVE_SWAP[ChainName.AVALANCHE_MAINNET],
    routerAddress: "0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106",
    wrappedNativeToken: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
    blockExplorers: {
      default: { name: "Snow Trace", url: "https://snowtrace.io/" },
    },
    nativeCurrency: {
      name: "Avalanche",
      symbol: "AVAX",
      decimals: 18,
    },
    testnet: true,
  },
];

export const AXELAR_LCD = "https://axelar-lcd.quickapi.com";
export const AXELAR_SCAN = "https://axelarscan.io";
export const AXELAR_SCAN_GMP = "https://api.gmp.axelarscan.io";
