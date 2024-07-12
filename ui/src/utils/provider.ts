import { ethers } from "ethers";
import { SquidChain } from "types/chain";

export function getProvider(chain: SquidChain): ethers.providers.BaseProvider {
  const provider = new ethers.providers.JsonRpcProvider(chain.rpcUrls.default);

  // Reduce number of pollings while listening for events. If it is unset, the default value is 4000.
  provider.pollingInterval = 10000;

  return provider;
}
