import { ChainName, SquidChain } from "./chain";
import { Token } from "./token";

export type FeeResponse = {
  status: boolean;
  data?: string;
  error?: string;
};

export type FeeRequest = {
  srcChain?: SquidChain;
  destChain: SquidChain;
  srcToken?: Token;
};

export type AttestationsResponse = {
  success: boolean;
  error?: string;
  signature?: string;
  hash?: string;
};
export type AttestationsRequest = {
  messageHash: string;
  chain: ChainName;
};
