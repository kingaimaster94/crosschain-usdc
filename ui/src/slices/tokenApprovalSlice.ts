import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store";
import { ChainId } from "types/chain";

export interface TokenApproval {
  address: string;
  approvals: Approval[];
}

export interface Approval {
  spender: string;
  allowance: string;
}

export type TokenApprovalState = Record<
  ChainId,
  Record<string, Record<string, string>>
>;

const initialState: TokenApprovalState = {
  [ChainId.AVALANCHE]: {},
  [ChainId.ETHEREUM]: {},
  [ChainId.ETHEREUM_MAINNET]: {},
  [ChainId.AVALANCHE_MAINNET]: {},
};

export const tokenApprovalSlice = createSlice({
  name: "allowances",
  initialState: initialState,
  reducers: {
    setAllowances: (
      state: TokenApprovalState,
      action: PayloadAction<{
        chainId: ChainId;
        tokenApprovals: TokenApproval[];
      }>
    ) => {
      for (const tokenApproval of action.payload.tokenApprovals) {
        for (const approval of tokenApproval.approvals) {
          if (!state[action.payload.chainId][tokenApproval.address])
            state[action.payload.chainId][tokenApproval.address] = {};

          state[action.payload.chainId][tokenApproval.address][
            approval.spender
          ] = approval.allowance;
        }
      }
    },
    setAllowance: (
      state: TokenApprovalState,
      action: PayloadAction<{ chainId: ChainId; tokenApproval: TokenApproval }>
    ) => {
      const payload = action.payload;
      state[payload.chainId][payload.tokenApproval.address][
        payload.tokenApproval.approvals[0].spender
      ] = payload.tokenApproval.approvals[0].allowance;
    },
    clear: (state: TokenApprovalState) => {
      state[ChainId.AVALANCHE] = {};
      state[ChainId.ETHEREUM] = {};
      state[ChainId.ETHEREUM_MAINNET] = {};
      state[ChainId.AVALANCHE_MAINNET] = {};
    },
  },
});

export const { setAllowances, setAllowance, clear } =
  tokenApprovalSlice.actions;

export const selectTokenApprovalByChainId = (
  state: RootState,
  chainId?: ChainId
) => {
  if (!chainId) return {};
  return state.tokenApprovals[chainId];
};

export default tokenApprovalSlice.reducer;
