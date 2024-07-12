import { ChainId, ChainName, SquidChain } from "../types/chain";
export const RPC = {
  [ChainName.AVALANCHE]: "https://api.avax-test.network/ext/bc/C/rpc",
  [ChainName.ETHEREUM]:
    "https://goerli.infura.io/v3/b0e255b9ef4b442c97f8a7458f8bd6ad",
  [ChainName.ETHEREUM_MAINNET]: "",
};

export const WSS = {
  [ChainName.AVALANCHE]: "wss://api.avax-test.network/ext/bc/C/ws",
  [ChainName.ETHEREUM]:
    "wss://goerli.infura.io/ws/v3/b0e255b9ef4b442c97f8a7458f8bd6ad",
  [ChainName.ETHEREUM_MAINNET]: "",
};

export const CROSSCHAIN_NATIVE_SWAP = {
  [ChainName.AVALANCHE]: "0x83b1dfC81645D0f8EC8cA09169127843E576d703",
  [ChainName.ETHEREUM]: "0xfc388061d55E00f82d2C280287251010ebBd611D",
  [ChainName.ETHEREUM_MAINNET]: "0x0",
};

export const MESSAGE_TRANSMITTER = {
  [ChainName.AVALANCHE]: "0xa9fB1b3009DCb79E2fe346c16a604B8Fa8aE0a79",
  [ChainName.ETHEREUM]: "0x26413e8157CD32011E726065a5462e97dD4d03D9",
  [ChainName.ETHEREUM_MAINNET]: "0x0",
};

export const TOKEN_MESSENGER = {
  [ChainName.AVALANCHE]: "0xeb08f243e5d3fcff26a9e38ae5520a669f4019d0",
  [ChainName.ETHEREUM]: "0xd0c3da58f55358142b8d3e06c1c30c5c6114efe8",
  [ChainName.ETHEREUM_MAINNET]: "0x0",
};

export const ATTESTATION_BASE_API = "https://iris-api-sandbox.circle.com";

export const chains: SquidChain[] = [
  {
    id: ChainId.ETHEREUM,
    name: ChainName.ETHEREUM,
    alias: "Ethereum",
    network: "goerli",
    icon: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    rpcUrls: {
      default: "https://goerli.infura.io/v3/b0e255b9ef4b442c97f8a7458f8bd6ad",
    },
    multicallAddress: "0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e",
    gatewayAddress: "0xe432150cce91c13a887f7D836923d5597adD8E31",
    crosschainNativeSwapAddress: CROSSCHAIN_NATIVE_SWAP[ChainName.ETHEREUM],
    routerAddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    blockExplorers: {
      default: { name: "Etherscan", url: "https://goerli.etherscan.io/" },
    },
    wrappedNativeToken: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
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
    id: ChainId.AVALANCHE,
    name: ChainName.AVALANCHE,
    alias: "Avalanche",
    network: "Avalanche FUJI C-Chain",
    icon: "https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png?1604021818",
    rpcUrls: {
      default: "https://api.avax-test.network/ext/bc/C/rpc",
    },
    multicallAddress: "0x3D015943d2780fE97FE3f69C97edA2CCC094f78c",
    gatewayAddress: "0xC249632c2D40b9001FE907806902f63038B737Ab",
    crosschainNativeSwapAddress: CROSSCHAIN_NATIVE_SWAP[ChainName.AVALANCHE],
    routerAddress: "0x2D99ABD9008Dc933ff5c0CD271B88309593aB921",
    wrappedNativeToken: "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
    blockExplorers: {
      default: { name: "Snow Trace", url: "https://testnet.snowtrace.io/" },
    },
    nativeCurrency: {
      name: "Avalanche",
      symbol: "AVAX",
      decimals: 18,
    },
    testnet: true,
  },
];

export const AXELAR_LCD = "https://axelartest-lcd.quickapi.com";
export const AXELAR_SCAN = "https://testnet.axelarscan.io";
export const AXELAR_SCAN_GMP = "https://testnet.api.gmp.axelarscan.io";
