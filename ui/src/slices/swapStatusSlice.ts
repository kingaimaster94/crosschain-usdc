import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store";
import { ChainName } from "types/chain";

export interface SwapStatusState {
  step: number;
  chain?: ChainName;
  traceId?: string;
  payloadHash?: string;
  commandId?: string;
  srcTx?: string;
  failed?: boolean;
  destApprovalTx?: string;
  destSwapTx?: string;
  refundAddress?: string;
}

const initialState: SwapStatusState = {
  step: 0,
  failed: false,
};

export const swapStatusSlice = createSlice({
  name: "swapStatus",
  initialState,
  reducers: {
    setStep: (state: SwapStatusState, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    setChain: (state: SwapStatusState, action: PayloadAction<ChainName>) => {
      state.chain = action.payload;
    },
    setSrcTx: (
      state: SwapStatusState,
      action: PayloadAction<{
        txHash: string;
        traceId: string;
        payloadHash?: string;
      }>
    ) => {
      if (action.payload.txHash) {
        state.srcTx = action.payload.txHash;
      }
      state.traceId = action.payload.traceId;
      state.payloadHash = action.payload.payloadHash;
    },
    setDestApprovalTx: (
      state: SwapStatusState,
      action: PayloadAction<string>
    ) => {
      state.destApprovalTx = action.payload;
    },
    setDestSwapTx: (state: SwapStatusState, action: PayloadAction<string>) => {
      state.destSwapTx = action.payload;
    },
    setCommandId: (state: SwapStatusState, action: PayloadAction<string>) => {
      state.commandId = action.payload;
    },
    setPayloadHash: (state: SwapStatusState, action: PayloadAction<string>) => {
      state.payloadHash = action.payload;
    },
    setSwapFailed: (state: SwapStatusState, action: PayloadAction<boolean>) => {
      state.failed = action.payload;
    },
    setRefundAddress: (
      state: SwapStatusState,
      action: PayloadAction<string>
    ) => {
      state.refundAddress = action.payload;
    },
    resetSwapStatus: (state: SwapStatusState) => {
      return initialState;
    },
  },
});

export const {
  setChain,
  setDestApprovalTx,
  setStep,
  setDestSwapTx,
  setSrcTx,
  setCommandId,
  resetSwapStatus,
  setSwapFailed,
  setRefundAddress,
  setPayloadHash,
} = swapStatusSlice.actions;

export const selectSwapStatusStep = (state: RootState) => state.swapStatus.step;
export const selectSwapStatusChain = (state: RootState) =>
  state.swapStatus.chain;
export const selectSwapStatusSrcTx = (state: RootState) =>
  state.swapStatus.srcTx;
export const selectSwapStatusDestApprovalTx = (state: RootState) =>
  state.swapStatus.destApprovalTx;
export const selectSwapStatusDestSwapTx = (state: RootState) =>
  state.swapStatus.destSwapTx;
export const selectSwapStatusTraceId = (state: RootState) =>
  state.swapStatus.traceId;
export const selectSwapStatusPayloadHash = (state: RootState) =>
  state.swapStatus.payloadHash;
export const selectSwapStatusCommandId = (state: RootState) =>
  state.swapStatus.commandId;
export const selectSwapFailed = (state: RootState) => state.swapStatus.failed;
export const selectRefundAddress = (state: RootState) =>
  state.swapStatus.refundAddress;

export default swapStatusSlice.reducer;
