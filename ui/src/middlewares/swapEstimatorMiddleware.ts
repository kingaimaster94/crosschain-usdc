import {
  createListenerMiddleware,
  isAnyOf,
  TypedStartListening,
} from "@reduxjs/toolkit";
import {
  setError,
  setLoading,
  setSendDestAmount,
  setSwapDestAmount,
  setSwapSrcAmount,
} from "slices/swapEstimatorSlice";
import { setAmount, setDestToken, setSrcToken } from "slices/swapInputSlice";
import {
  selectCrosschainTokenAtDestChain,
  selectCrosschainTokenAtSrcChain,
} from "slices/tokenSlice";
import { ethers } from "ethers";
import { AppDispatch, RootState } from "store";
import { estimateSwapOutputAmount } from "utils/contract";
import { requiredSwapDest, requiredSwapSrc } from "utils/swap";
import { resetSwapStatus } from "slices/swapStatusSlice";

export const swapEstimatorMiddleware = createListenerMiddleware();

type SwapEstimatorStartListening = TypedStartListening<RootState, AppDispatch>;

const swapEstimatorStartListening =
  swapEstimatorMiddleware.startListening as SwapEstimatorStartListening;

swapEstimatorStartListening({
  matcher: isAnyOf(setSrcToken, setDestToken, setAmount),
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState();
    const { srcChain, srcToken, destChain, destToken, amount } =
      state.swapInputs;
    if (!srcChain) return;
    if (!amount || amount === "0") return;
    if (!srcToken) return;
    if (!destToken) return;
    const crosschainTokenAtDestChain = selectCrosschainTokenAtDestChain(state);
    const crosschainTokenAtSrcChain = selectCrosschainTokenAtSrcChain(state);

    if (!crosschainTokenAtSrcChain) return;
    if (!crosschainTokenAtDestChain) return;

    const isRequiredSwapAtSrc = requiredSwapSrc(srcToken);
    const isRequiredSwapAtDest = requiredSwapDest(
      srcToken,
      destToken,
      destChain
    );

    const fee = "0";
    if (!fee) return;

    listenerApi.dispatch(setLoading(true));
    listenerApi.dispatch(setError(""));

    let _amount = ethers.utils.parseUnits(amount, srcToken.decimals).toString();
    try {
      if (isRequiredSwapAtSrc) {
        //  estimate swap at src chain first
        const crosschainTokenAmountSrcChain = await estimateSwapOutputAmount({
          token: crosschainTokenAtSrcChain,
          chain: srcChain,
          routerAddress: srcChain.routerAddress,
          amount: _amount,
          nativeToErc20: true,
        });
        _amount = crosschainTokenAmountSrcChain || _amount;
      }
      listenerApi.dispatch(setSwapSrcAmount(_amount));

      // Deduct fee before calculating swap output at destination chain.
      _amount = ethers.BigNumber.from(_amount).sub(fee).toString();
      listenerApi.dispatch(setSendDestAmount(_amount));

      if (ethers.BigNumber.from(_amount).isNegative()) {
        listenerApi.dispatch(setError("Swap amount is too low"));
        return;
      }

      if (isRequiredSwapAtDest) {
        const destSwapAmount = await estimateSwapOutputAmount({
          token: crosschainTokenAtDestChain,
          chain: destChain,
          routerAddress: destChain.routerAddress,
          amount: _amount,
          nativeToErc20: false,
        });
        listenerApi.dispatch(setSwapDestAmount(destSwapAmount));

        const srcTxHash = state.swapStatus.srcTx;
        if (srcTxHash) {
          listenerApi.dispatch(resetSwapStatus());
        }
      }
    } catch (e: any) {
      listenerApi.dispatch(setError(e.message));
    }

    listenerApi.dispatch(setLoading(false));
  },
});
