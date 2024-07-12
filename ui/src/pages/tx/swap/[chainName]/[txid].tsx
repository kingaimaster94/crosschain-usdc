import config from "config/constants";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import cn from "classnames";
import Image from "next/image";
import React, { useCallback, useEffect } from "react";
import { useAppSelector } from "hooks/useAppSelector";
import {
  selectSwapStatusDestApprovalTx,
  selectSwapStatusStep,
  selectSwapStatusDestSwapTx,
  selectSwapFailed,
  selectSwapStatusSrcTx,
  setSrcTx,
} from "slices/swapStatusSlice";
import { SwapProgress } from "components/transaction";
import useConfetti from "hooks/useConfetti";
import { useDispatch } from "react-redux";
import {
  selectAmount,
  selectDestChain,
  setAmount,
  setSrcChain,
} from "slices/swapInputSlice";

const SwapTransactionDetail = () => {
  const { query, push, isReady } = useRouter();
  const dispatch = useDispatch();
  const step = useAppSelector(selectSwapStatusStep);
  const amount = useAppSelector(selectAmount);
  const destChain = useAppSelector(selectDestChain);
  const destApprovalTx = useAppSelector(selectSwapStatusDestApprovalTx);
  const destSwapTx = useAppSelector(selectSwapStatusDestSwapTx);
  const isSwapFailed = useAppSelector(selectSwapFailed);
  const srcTxHash = useAppSelector(selectSwapStatusSrcTx);
  const txHash = query.txid as string;
  const chainName = query.chainName as string;
  useConfetti("rewardId", step === 3 && !isSwapFailed, 100);

  useEffect(() => {
    if (isReady && txHash && chainName) {
      const chain = config.chains.find(
        (chain) => chain.name === chainName?.toLowerCase()
      );
      if (!ethers.utils.isHexString(txHash, 32)) {
        push({
          pathname: "/error",
          query: {
            title: "Transaction not found",
            msg: "Transaction hash is invalid.",
          },
        });
      } else if (!chain) {
        push({
          pathname: "/error",
          query: {
            title: "Transaction not found",
            msg: `Unsupported chain ${chainName}`,
          },
        });
      }
    }
  }, [chainName, destChain, isReady, push, txHash]);

  useEffect(() => {
    if (txHash && !srcTxHash && !amount) {
      // Recovers chain and source transaction hash.
      const chain = config.chains.find(
        (chain) => chain.name === chainName?.toLowerCase()
      );
      if (chain) {
        dispatch(setSrcChain(chain));
      }
      dispatch(
        setSrcTx({
          txHash,
          traceId: "",
        })
      );
    }
  }, [amount, chainName, dispatch, srcTxHash, txHash]);

  const getTxHash = useCallback(
    (index: number) => {
      if (index === 0) {
        return txHash;
      } else if (index === 1) {
        return destApprovalTx;
      } else if (index === 2) {
        return destSwapTx;
      }
    },
    [destApprovalTx, destSwapTx, txHash]
  );

  const steps = new Array(3).fill(0).map((_, index) => {
    return (
      <li
        className={cn("step", {
          "step-primary": step >= index,
        })}
        key={index}
      >
        <SwapProgress
          step={index}
          currentStep={step}
          txHash={getTxHash(index)}
        />
      </li>
    );
  });

  const onClickBackToSwap = useCallback(() => {
    dispatch(setAmount(""));
    push("/");
  }, [dispatch, push]);

  return (
    <div className="z-50 flex flex-col p-4 py-6 m-8 shadow-xl card mx-auto rounded-3xl bg-base-900 w-[500px] bg-gradient-to-b to-[#191E31] from-[#192431] relative">
      <div className="z-10 flex flex-col p-4 pb-6">
        <div className="z-50">
          <h1 className="text-3xl font-thin text-center text-white">
            Swap Status
          </h1>
          <div className="mt-5">
            <ul className="items-start steps steps-vertical">{steps}</ul>

            {step >= 3 && (
              <div className="flex justify-center mt-6">
                <button
                  className="btn w-full text-white bg-gradient-to-r from-[#760FC8] to-[#7522DE] transition-all ease-in"
                  onClick={onClickBackToSwap}
                >
                  Back to swap
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="absolute top-0 left-0 z-0 w-full h-full">
          <div className="relative w-full h-full">
            <Image
              className="scale-110 rotate-3"
              src={"/assets/svg/pattern.svg"}
              layout="fill"
              alt="background pattern"
              objectFit="cover"
            />
          </div>
          <div>
            <a
              href={`${config.AXELAR_SCAN}/gmp/${txHash}`}
              rel="noreferrer"
              target={"_blank"}
              className="absolute transition-opacity bottom-4 right-4 hover:opacity-70 text-gray-300"
            >
              Track at AxelarScan
            </a>
          </div>
        </div>
      </div>
      <span id="rewardId" className="z-20 self-center" />
    </div>
  );
};

export default SwapTransactionDetail;
