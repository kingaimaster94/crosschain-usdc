import {
  AxelarGMPRecoveryAPI,
  Environment,
  EvmChain,
  GasToken,
} from "@axelar-network/axelarjs-sdk";

async function test() {
  const environment = Environment.TESTNET; // Can be `Environment.TESTNET` or `Environment.MAINNET`
  const api = new AxelarGMPRecoveryAPI({ environment });
  const wantedGasFee = await api.calculateWantedGasFee(
    "txHash",
    EvmChain.AVALANCHE,
    EvmChain.FANTOM,
    GasToken.AVAX,
    100000
  );
  console.log("Additional gas fee:", wantedGasFee);
}
