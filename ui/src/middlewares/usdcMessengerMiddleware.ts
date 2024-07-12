import {
  createListenerMiddleware,
  TypedStartListening,
} from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "store";
import { ethers } from "ethers";
import config from "config/constants";
import { setStep } from "slices/swapStatusSlice";
import { getMessageSentEvent } from "utils/contract";
import { getTxLink } from "utils/explorer";
import { getProvider } from "utils/provider";

export const usdcMessengerMiddleware = createListenerMiddleware();

type RootStartListening = TypedStartListening<RootState, AppDispatch>;
const usdcMessengerStartListening =
  usdcMessengerMiddleware.startListening as RootStartListening;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

usdcMessengerStartListening({
  predicate: (action, currentState, _prevState) => {
    const step = currentState.swapStatus.step;

    return action.type === setStep.type && step === 1;
  },
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState();
    const srcChain = state.swapInputs.srcChain;
    const destChain = state.swapInputs.destChain;
    const srcTxHash = state.swapStatus.srcTx;
    if (!srcChain || !destChain || !srcTxHash) return;

    const srcMessageTransmitterAddress = config.MESSAGE_TRANSMITTER[srcChain.name];
    const destMessageTransmitterAddress = config.MESSAGE_TRANSMITTER[destChain.name];
    const srcProvider = getProvider(srcChain);

    // Step 1: Observe for the MessageSent event
    const srcContract = new ethers.Contract(
      srcMessageTransmitterAddress,
      ["event MessageSent(bytes message)"],
      srcProvider
    );

    const messageSentReceipt = await srcProvider.getTransactionReceipt(
      srcTxHash
    );

    const log = getMessageSentEvent(srcContract, messageSentReceipt);

    if (log) {
      const message = log.args.message;
      // Step 2: Call the Attestation API to get the signature
      console.log("Receive MessageSent event: ", message);
      const messageHash = ethers.utils.solidityKeccak256(["bytes"], [message]);
      console.log("Getting signature from attestation API...");
      let response = { success: false, signature: undefined };
      while (!response.success) {
        response = await fetch(`/api/attestations?messageHash=${messageHash}`)
          .then((resp) => resp.json())
          .catch((err: any) => {
            console.log(err);
          });
        await sleep(5000);
      }

      if (response.success) {
        const destContract = new ethers.Contract(
          destMessageTransmitterAddress,
          [
            "function receiveMessage(bytes memory _message, bytes calldata _attestation)",
          ]
        );

        const signature = response.signature;
        console.log("Received signature:", signature);

        // Step 3: Call the receiveMessage function with the signature
        const txRequest = await destContract.populateTransaction.receiveMessage(
          message,
          signature
        );

        // Step 4: Request to send tx
        console.log("Sending tx to mint USDC on ", destChain.alias, "...");
        const mintTx = await fetch("/api/sendTx", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chain: destChain.name,
            rawTx: txRequest,
          }),
        })
          .then((resp) => resp.json())
          .catch(() => undefined);
        if (mintTx && mintTx.success) {
          console.log("Minted USDC", getTxLink(destChain.id, mintTx.hash));
        }
      }
    }
  },
});
