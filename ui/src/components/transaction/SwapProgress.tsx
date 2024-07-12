import { useAppSelector } from "hooks/useAppSelector";
import React, { FunctionComponent, useEffect, useState } from "react";
import ReactLoading from "react-loading";
import cn from "classnames";
import { selectDestChain, selectSrcChain } from "slices/swapInputSlice";
import { ComponentStyle } from "types/component";
import { getTxLink } from "utils/explorer";
import { selectRefundAddress, selectSwapFailed } from "slices/swapStatusSlice";
import { ExclamationCircleIcon } from "@heroicons/react/outline";
import { shortenAddress } from "utils/formatter";

interface SwapProgressProps extends ComponentStyle {
  step: number;
  currentStep: number;
  txHash?: string;
}

export const SwapProgress: FunctionComponent<SwapProgressProps> = ({
  step,
  currentStep,
  txHash,
}) => {
  const srcChain = useAppSelector(selectSrcChain);
  const destChain = useAppSelector(selectDestChain);
  const swapFailed = useAppSelector(selectSwapFailed);
  const swapRefundAddress = useAppSelector(selectRefundAddress);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (step === 0) {
      if (currentStep <= step) {
        setTitle("Transaction Confirmation");
      } else {
        setTitle("Transaction has been confirmed");
      }
    } else if (step === 1) {
      if (currentStep <= step) {
        setTitle(`Relaying USDC to ${destChain.alias}`);
      } else if (!destChain || !txHash) {
        setTitle("Minted USDC.");
      } else {
        setTitle(`USDC has been minted`);
      }
    } else if (step === 2) {
      if (currentStep <= step) {
        setTitle("Swapping...");
      } else {
        if (swapFailed) {
          setTitle(`Swap has been failed`);
        } else {
          setTitle("Swap has been completed");
        }
      }
    }
  }, [
    currentStep,
    destChain,
    srcChain,
    step,
    swapFailed,
    swapRefundAddress,
    txHash,
  ]);

  const showSwapFailedUI = swapFailed && step === 2;

  return (
    <div className="flex flex-col items-start">
      <div className="text-sm font-thin text-blue-300">Step {step + 1}</div>
      <div className="flex items-center">
        {showSwapFailedUI && (
          <ExclamationCircleIcon
            width={24}
            height={24}
            className="mr-2 text-yellow-600"
          />
        )}

        <span
          className={cn("mr-2 text-white font-thin", {
            "opacity-100": currentStep >= step,
            "opacity-30": currentStep < step,
          })}
        >
          {title}
        </span>
        {txHash && currentStep > step && srcChain && destChain && (
          <a
            className="link link-accent"
            target="_blank"
            rel="noreferrer"
            href={getTxLink(step === 0 ? srcChain.id : destChain.id, txHash)}
          >
            {txHash.slice(0, 5)}...{txHash.slice(-5)}
          </a>
        )}
        {step === currentStep && (
          <ReactLoading
            width={20}
            height={20}
            type="spin"
            color="rgb(156 163 175)"
          />
        )}
      </div>
      {showSwapFailedUI && swapRefundAddress && (
        <span className="text-sm text-yellow-600">
          Refunded to {shortenAddress(swapRefundAddress)}
        </span>
      )}
    </div>
  );
};
