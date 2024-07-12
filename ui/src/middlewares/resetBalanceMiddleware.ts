import {
  createListenerMiddleware,
  TypedStartListening,
} from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "store";
import { clear } from "slices/balanceSlice";

export const resetBalanceStateMiddleware = createListenerMiddleware();

type ResetBalanceStateStartListening = TypedStartListening<
  RootState,
  AppDispatch
>;

const resetBalanceStateStartListening =
  resetBalanceStateMiddleware.startListening as ResetBalanceStateStartListening;

resetBalanceStateStartListening({
  // returns true when both tokens and srcChain are existed, otherwise returns false.
  predicate: (action, currentState, previousState) => {
    if (previousState.swapInputs.senderAddress) {
      return (
        previousState.swapInputs.senderAddress !==
        currentState.swapInputs.senderAddress
      );
    }
    return false;
  },
  effect: async (_action, listenerApi) => {
    listenerApi.dispatch(clear());
  },
});
