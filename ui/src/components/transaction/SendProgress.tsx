import { useAppSelector } from "hooks/useAppSelector";
import React, { FunctionComponent, useEffect, useState } from "react";
import ReactLoading from "react-loading";
import cn from "classnames";
import { selectDestChain, selectSrcChain } from "slices/swapInputSlice";
import { ComponentStyle } from "types/component";
import { getTxLink } from "utils/explorer";

interface SendProgressProps extends ComponentStyle {
  step: number;
  currentStep: number;
  txHash?: string;
}

export const SendProgress: FunctionComponent<SendProgressProps> = ({
  step,
  currentStep,
  txHash,
}) => {
  const srcChain = useAppSelector(selectSrcChain);
  const destChain = useAppSelector(selectDestChain);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (step === 0) {
      if (currentStep <= step) {
        setTitle("Confirming transaction");
      } else {
        setTitle("Transaction has been confirmed");
      }
    } else if (step === 1) {
      if (currentStep <= step) {
        setTitle("Relaying transaction");
      } else if (!destChain || !txHash) {
        setTitle("Relayed transaction");
      } else {
        setTitle(`Relayed tx to ${destChain.name}`);
      }
    }
  }, [currentStep, destChain, srcChain, step, txHash]);

  return (
    <div className="flex items-center">
      <span
        className={cn("mr-2", {
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
  );
};
