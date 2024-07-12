import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SquidChain } from "types/chain";
import config from "config/constants";
import type { RootState } from "store";

interface DropInputState {
  amount: string;
  destChain: SquidChain;
  aliasAddresses: string[];
}

const initialState: DropInputState = {
  amount: "",
  aliasAddresses: [],
  destChain: config.chains[0],
};

export const dropInputSlice = createSlice({
  name: "dropInput",
  initialState,
  reducers: {
    setAliasAddresses: (state, action: PayloadAction<string[]>) => {
      state.aliasAddresses = action.payload;
    },
    addAliasAddress: (state, action: PayloadAction<string>) => {
      state.aliasAddresses = [...state.aliasAddresses, action.payload];
    },
    removeAliasAddress: (state, action: PayloadAction<string>) => {
      state.aliasAddresses = state.aliasAddresses.filter(
        (address) => address !== action.payload
      );
    },
    resetDropInputs: (state) => initialState,
  },
});

export const {
  setAliasAddresses,
  addAliasAddress,
  removeAliasAddress,
  resetDropInputs,
} = dropInputSlice.actions;

export const selectAliasAddresses = (state: RootState) =>
  state.dropInputs.aliasAddresses;

export default dropInputSlice.reducer;
