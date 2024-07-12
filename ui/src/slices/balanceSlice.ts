import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store";
import { ChainId } from "types/chain";

export interface Balance {
  address: string;
  amount: string;
}

export type BalanceState = Record<ChainId, Record<string, string>>;

const initialState: BalanceState = {
  [ChainId.AVALANCHE]: {},
  [ChainId.ETHEREUM]: {},
  [ChainId.ETHEREUM_MAINNET]: {},
  [ChainId.AVALANCHE_MAINNET]: {}
};

export const balanceSlice = createSlice({
  name: "balances",
  initialState: initialState,
  reducers: {
    setBalances: (
      state: BalanceState,
      action: PayloadAction<{ chainId: ChainId; balances: Balance[] }>
    ) => {
      for (const balance of action.payload.balances) {
        state[action.payload.chainId][balance.address] = balance.amount;
      }
    },
    clear: (state: BalanceState) => {
      state[ChainId.ETHEREUM] = {};
      state[ChainId.AVALANCHE] = {};
      state[ChainId.ETHEREUM_MAINNET] = {};
      state[ChainId.AVALANCHE_MAINNET] = {};
    },
  },
});

export const { setBalances, clear } = balanceSlice.actions;

export const selectBalancesByChainId = (
  state: RootState,
  chainId?: ChainId
) => {
  if (!chainId) return {};
  return state.balances[chainId];
};

export default balanceSlice.reducer;
