export interface Token {
  chainId?: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  crosschain?: boolean;
  commonKey: string;
  logoURI: string;
}
