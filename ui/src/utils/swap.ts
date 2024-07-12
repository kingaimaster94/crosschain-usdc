import { SquidChain } from "types/chain";
import { Token } from "types/token";

export function requiredSwapSrc(srcToken: Token) {
  // If srcToken isn't a cross-chain token, it requires to be swapped to a cross-chain toke first.
  // Otherwise, it can be sent rightaway to the gateway contract.
  return !srcToken.crosschain;
}

export function requiredSwapDest(
  srcToken: Token,
  destToken: Token,
  destChain: SquidChain
) {
  return !destToken.crosschain;
}
