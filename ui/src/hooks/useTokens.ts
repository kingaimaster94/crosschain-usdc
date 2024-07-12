import { ethers } from "ethers";
import { selectBalancesByChainId } from "slices/balanceSlice";
import {
  useGetTokensQuery,
  selectTokensByChainIdHook,
} from "slices/tokenSlice";
import { SquidChain } from "types/chain";
import { useAppSelector } from "./useAppSelector";

const useTokens = (chain?: SquidChain) => {
  const { tokens = [] } = useGetTokensQuery(undefined, {
    selectFromResult: selectTokensByChainIdHook(chain?.id),
  });
  const balances = useAppSelector((state) =>
    selectBalancesByChainId(state, chain?.id)
  );

  return tokens.sort((a, b) => {
    if (!balances[a.address] || !balances[b.address]) return 0;
    const balanceA = ethers.BigNumber.from(balances[a.address]);
    const balanceB = ethers.BigNumber.from(balances[b.address]);
    if (balanceA.lt(balanceB)) return 1;
    if (balanceA.gt(balanceB)) return -1;
    return 0;
  });
};
export default useTokens;
