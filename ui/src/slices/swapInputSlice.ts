import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SquidChain } from "types/chain";
import config from "config/constants";
import { Token } from "types/token";
import type { RootState } from "store";

interface SwapInputState {
  srcChain?: SquidChain;
  destChain: SquidChain;
  srcToken?: Token;
  destToken?: Token;
  amount: string;
  swappable: boolean;
  fee?: string;
  destContractAddress?: string;
  destRouterAddress?: string;
  destNativeAmount?: string;
  senderAddress?: string;
  recipientAddress?: string;
}

const initialState: SwapInputState = {
  srcChain: config.chains[1],
  destChain: config.chains[0],
  swappable: true,
  amount: "",
};

export const swapInputSlice = createSlice({
  name: "swapInput",
  initialState,
  reducers: {
    setSrcChain: (
      state: SwapInputState,
      action: PayloadAction<SquidChain | undefined>
    ) => {
      state.srcChain = action.payload;
    },
    setSrcToken: (
      state: SwapInputState,
      action: PayloadAction<Token | undefined>
    ) => {
      state.srcToken = action.payload;
    },
    setAmount: (state: SwapInputState, action: PayloadAction<string>) => {
      state.amount = action.payload;
    },
    setDestToken: (
      state: SwapInputState,
      action: PayloadAction<Token | undefined>
    ) => {
      state.destToken = action.payload;
    },
    setDestRouterContract: (
      state: SwapInputState,
      action: PayloadAction<string>
    ) => {
      state.destContractAddress = action.payload;
    },
    setContractAddress: (
      state: SwapInputState,
      action: PayloadAction<string>
    ) => {
      state.destContractAddress = action.payload;
    },
    setDestChain: (
      state: SwapInputState,
      action: PayloadAction<SquidChain>
    ) => {
      state.destChain = action.payload;
    },
    setDestNativeAmount: (
      state: SwapInputState,
      action: PayloadAction<string>
    ) => {
      state.destNativeAmount = action.payload;
    },
    setRecipientAddress: (
      state: SwapInputState,
      action: PayloadAction<string | undefined>
    ) => {
      state.recipientAddress = action.payload;
    },
    setSenderAddress: (
      state: SwapInputState,
      action: PayloadAction<string | undefined>
    ) => {
      state.senderAddress = action.payload;
    },
    setSwappable: (state: SwapInputState, action: PayloadAction<boolean>) => {
      state.swappable = action.payload;
    },
    setFee: (state: SwapInputState, action: PayloadAction<string>) => {
      state.fee = action.payload;
    },
    resetSwapInputs: (state: SwapInputState) => initialState,
  },
});

export const {
  resetSwapInputs,
  setAmount,
  setContractAddress,
  setDestChain,
  setDestNativeAmount,
  setDestRouterContract,
  setDestToken,
  setRecipientAddress,
  setSenderAddress,
  setSrcToken,
  setFee,
  setSrcChain,
  setSwappable,
} = swapInputSlice.actions;

export const selectAmount = (state: RootState) => state.swapInputs.amount;
export const selectSrcToken = (state: RootState) => state.swapInputs.srcToken;
export const selectSrcChain = (state: RootState) => state.swapInputs.srcChain;
export const selectDestChain = (state: RootState) => state.swapInputs.destChain;
export const selectDestToken = (state: RootState) => state.swapInputs.destToken;
export const selectSwappable = (state: RootState) => state.swapInputs.swappable;
export const selectFee = (state: RootState) => state.swapInputs.fee;
export const selectSenderAddress = (state: RootState) =>
  state.swapInputs.senderAddress;
export const selectRecipientAddress = (state: RootState) =>
  state.swapInputs.recipientAddress;

export default swapInputSlice.reducer;
