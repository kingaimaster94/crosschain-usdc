import {
  createListenerMiddleware,
  TypedStartListening,
} from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "store";
import { setSrcToken } from "slices/swapInputSlice";
import { tokenApi } from "slices/tokenSlice";

export const srcChainMiddleware = createListenerMiddleware();

type SrcChainStartListening = TypedStartListening<RootState, AppDispatch>;

const srcChainStartListening =
  srcChainMiddleware.startListening as SrcChainStartListening;

srcChainStartListening({
  // returns true when both tokens and srcChain are existed, otherwise returns false.
  predicate: (action, currentState, previousState) => {
    return (
      previousState.swapInputs.srcChain?.id !==
      currentState.swapInputs.srcChain?.id
    );
  },
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState();
    const currentToken = state.swapInputs.srcToken;
    const srcChain = state.swapInputs.srcChain;

    if (!srcChain || !currentToken) return;

    const tokens = tokenApi.endpoints.getTokens.select()(state)?.data;
    const newToken = tokens?.find(
      (token) => token.chainId === srcChain.id && !token.crosschain
    );
    listenerApi.dispatch(setSrcToken(newToken));
  },
});
