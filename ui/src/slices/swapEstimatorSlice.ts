import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Token } from "types/token";
import { SquidChain } from "types/chain";
import { RootState } from "store";

export type SwapEstimatorPayload = {
  routerAddress: string;
  chain: SquidChain;
  token: Token;
  amount: string;
  nativeToErc20: boolean;
};

export interface SwapEstimatorState {
  swapSrcAmount?: string; // An estimated amount after swapping at source chain.
  swapDestAmount?: string; // An estimated amount after swapping at dest chain.
  sendDestAmount?: string; // An estimated amount after sending to dest chain, but before swapping.
  loading: boolean;
  error?: string;
}

const initialState: SwapEstimatorState = {
  loading: false,
};

export const swapEstimatorSlice = createSlice({
  name: "swapEstimator",
  initialState,
  reducers: {
    setSwapSrcAmount: (
      state: SwapEstimatorState,
      action: PayloadAction<string>
    ) => {
      state.swapSrcAmount = action.payload;
    },
    setSwapDestAmount: (
      state: SwapEstimatorState,
      action: PayloadAction<string>
    ) => {
      state.swapDestAmount = action.payload;
    },
    setSendDestAmount: (
      state: SwapEstimatorState,
      action: PayloadAction<string>
    ) => {
      state.sendDestAmount = action.payload;
    },
    setLoading: (state: SwapEstimatorState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      if (action.payload) {
        state.swapDestAmount = undefined;
        state.swapSrcAmount = undefined;
        state.sendDestAmount = undefined;
      }
    },
    setError: (state: SwapEstimatorState, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSwapSrcAmount,
  setSendDestAmount,
  setSwapDestAmount,
  setError,
  setLoading,
} = swapEstimatorSlice.actions;

export const selectEstimateAmountState = (rootState: RootState) =>
  rootState.swapEstimator;

export default swapEstimatorSlice.reducer;
