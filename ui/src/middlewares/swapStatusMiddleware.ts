import {
  createListenerMiddleware,
  TypedStartListening,
} from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "store";
import {
  setChain,
  setRefundAddress,
  setStep,
  setSwapFailed,
  setDestSwapTx,
  setSrcTx,
  setDestApprovalTx,
  setPayloadHash,
} from "slices/swapStatusSlice";
import { ethers } from "ethers";
import { getProvider } from "utils/provider";
import crosschainNativeSwap from "abi/crosschainNativeSwap.json";
import { requiredSwapDest } from "utils/swap";
import { SquidChain } from "types/chain";
import { getSwapPendingEvent } from "utils/contract";
import { selectTokensByChainId } from "slices/tokenSlice";
import { setDestChain, setSrcChain, setSrcToken } from "slices/swapInputSlice";
import { Token } from "types/token";
import config from "config/constants";

export const swapStatusMiddleware = createListenerMiddleware();

type RootStartListening = TypedStartListening<RootState, AppDispatch>;

const swapStatusStartListening =
  swapStatusMiddleware.startListening as RootStartListening;

// Recover state from source tx hash
swapStatusStartListening({
  predicate: (action, currentState, _prevState) => {
    const srcToken = currentState.swapInputs.srcToken;
    const srcChain = currentState.swapInputs.srcChain;

    return action.type === setSrcTx.type && !srcToken && !!srcChain;
  },
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState();
    const dispatch = listenerApi.dispatch;
    const txHash = state.swapStatus.srcTx as string;
    const srcChain = state.swapInputs.srcChain as SquidChain;

    const srcProvider = getProvider(srcChain);
    const srcTxReceipt = await srcProvider.getTransactionReceipt(txHash);
    const contract = new ethers.Contract(
      srcChain.crosschainNativeSwapAddress,
      crosschainNativeSwap
    );
    const swapPendingEvent = getSwapPendingEvent(contract, srcTxReceipt);

    if (swapPendingEvent) {
      const { traceId, destChain, payloadHash } = swapPendingEvent;

      const srcTokens = selectTokensByChainId(state, srcChain.id);
      const srcToken = srcTokens?.find((token) => !token.crosschain) as Token;

      dispatch(setSrcToken(srcToken));
      dispatch(setSrcChain(srcChain));
      dispatch(setDestChain(destChain as SquidChain));

      // const swapStatusData = await fetchSwapStatus(txHash);
      // if (!swapStatusData) return;

      // const approveData = swapStatusData.approved;
      // const executeData = swapStatusData.executed;

      // if (executeData) {
      //   const executeTxHash = executeData.transactionHash;
      //   const executeTxReceipt = executeData.receipt;
      //   dispatch(setDestSwapTx(executeTxHash));
      //   const swapSuccessEvent = getSwapSuccessEvent(
      //     contract,
      //     executeTxReceipt
      //   );
      //   const swapFailedEvent = getSwapFailedEvent(contract, executeTxReceipt);
      //   if (swapSuccessEvent) {
      //     dispatch(setSwapFailed(false));
      //   } else if (swapFailedEvent) {
      //     dispatch(setSwapFailed(true));
      //     const refundAddress =
      //       swapFailedEvent.args[swapFailedEvent.args.length - 1];
      //     dispatch(setRefundAddress(refundAddress));
      //   }
      // }

      // if (approveData) {
      //   const approveTxHash = approveData.transactionHash;
      //   const commandId = approveData.returnValues.commandId;
      //   dispatch(setCommandId(commandId));
      //   dispatch(setDestApprovalTx(approveTxHash));
      // }

      // if (swapStatusData.status === "executed") {
      //   dispatch(setStep(3));
      //   return;
      // } else if (swapStatusData.status === "approved") dispatch(setStep(2));

      // const destTokens = selectTokensByChainId(state, destChain?.id);
      // const destToken = destTokens?.find((token) => !token.crosschain) as Token;
      // dispatch(setDestToken(destToken));
      // dispatch(
      //   setSrcTx({
      //     txHash,
      //     traceId,
      //     payloadHash,
      //   })
      // );
    }
  },
});

// Listening for approval status.
swapStatusStartListening({
  predicate: (action, currentState, _prevState) => {
    const srcToken = currentState.swapInputs.srcToken;
    const destToken = currentState.swapInputs.destToken;
    const destChain = currentState.swapInputs.destChain;
    const step = currentState.swapStatus.step;

    if (!srcToken) return false;
    if (!destToken) return false;

    return (
      action.type === setSrcTx.type &&
      requiredSwapDest(srcToken, destToken, destChain) &&
      step === 0
    );
  },
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState();
    const srcChain = state.swapInputs.srcChain;
    const destChain = state.swapInputs.destChain;
    const srcTxHash = state.swapStatus.srcTx;
    if (!srcChain || !destChain || !srcTxHash) return;
    const srcProvider = getProvider(srcChain);
    const destProvider = new ethers.providers.WebSocketProvider(config.WSS[destChain.name])

    listenerApi.dispatch(setChain(srcChain.name));

    const srcTxReceipt = await srcProvider.waitForTransaction(srcTxHash, 1);
    listenerApi.dispatch(setStep(1));

    // Fetch payload hash from source tx receipt
    const contract = new ethers.Contract(
      srcChain.crosschainNativeSwapAddress,
      crosschainNativeSwap,
      srcProvider
    );
    const pendingEvent = getSwapPendingEvent(contract, srcTxReceipt);
    if (!pendingEvent) return;
    const payloadHash = pendingEvent.payloadHash;
    listenerApi.dispatch(setPayloadHash(payloadHash));

    // wait for usdc mint token
    const destTokenMessenger = new ethers.Contract(
      config.TOKEN_MESSENGER[destChain.name],
      [
        "event MintAndWithdraw(address indexed mintRecipient, uint256 _amount, address indexed mintToken)",
      ],
      destProvider
    );
    const eventFilter = destTokenMessenger.filters.MintAndWithdraw(
      destChain.crosschainNativeSwapAddress,
      null,
      null
    );
    destTokenMessenger.on(eventFilter, (...args) => {
      const txHash = args[args.length - 1].transactionHash;
      listenerApi.dispatch(setStep(2));
      listenerApi.dispatch(setDestApprovalTx(txHash));
      destTokenMessenger.removeAllListeners(eventFilter);
    });
  },
});

// Listening for executed status.
swapStatusStartListening({
  predicate: (action, currentState, _prevState) => {
    const step = currentState.swapStatus.step;
    return action.type === setDestApprovalTx.type && step === 2;
  },
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState();
    const destChain = state.swapInputs.destChain;
    const traceId = state.swapStatus.traceId;

    const destProvider = getProvider(destChain);
    const swapContract = new ethers.Contract(
      destChain.crosschainNativeSwapAddress,
      crosschainNativeSwap,
      destProvider
    );
    const swapSuccessEvent = swapContract.filters.SwapSuccess(traceId);
    const swapFailedEvent = swapContract.filters.SwapFailed(traceId);
    swapContract.once(swapSuccessEvent, (...args) => {
      const txHash = args[args.length - 1].transactionHash;
      listenerApi.dispatch(setStep(3));
      listenerApi.dispatch(setDestSwapTx(txHash));
      listenerApi.dispatch(setSwapFailed(false));
    });
    swapContract.once(swapFailedEvent, (...args) => {
      const txHash = args[args.length - 1].transactionHash;
      listenerApi.dispatch(setStep(3));
      listenerApi.dispatch(setDestSwapTx(txHash));
      listenerApi.dispatch(setSwapFailed(true));
      const refundAddress = args[3];
      listenerApi.dispatch(setRefundAddress(refundAddress));
    });
  },
});
