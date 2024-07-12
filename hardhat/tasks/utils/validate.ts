import { Chain } from "../../constants/chains";

export const isValidChain = (chain: string): boolean => {
  return Object.values(Chain)
    .map((c) => c.toString())
    .includes(chain);
};
