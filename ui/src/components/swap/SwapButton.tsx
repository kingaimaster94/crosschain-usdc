import { ComponentStyle } from "types/component";
import React, { FunctionComponent, useCallback, useState } from "react";
import cn from "classnames";
import { useAppDispatch, useAppSelector } from "hooks/useAppSelector";
import { selectSrcChain } from "slices/swapInputSlice";
import { Validation } from "hooks/useAmountValidator";
import { setSrcTx } from "slices/swapStatusSlice";
import { useRouter } from "next/router";
import useSwapChecker, { SWAP_TYPE } from "hooks/useSwapChecker";
import useSwap from "hooks/useSwap";
import { useAccount } from "wagmi";
import { SquidChain } from "types/chain";

interface SwapButtonProps extends ComponentStyle {
  amount: string;
  amountValidation: Validation;
}

export const SwapButton: FunctionComponent<SwapButtonProps> = ({
  className,
  amount,
  amountValidation,
}) => {
  const { isConnected } = useAccount();
  const srcChain = useAppSelector(selectSrcChain) as SquidChain;
  const swapType = useSwapChecker();
  const { push } = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const { swapOnlyDest, swapSrcAndDest, swapOnlySrc, writeAsync } =
    useSwap();

  const selectSwapFunction = useCallback(() => {
    if (swapType === SWAP_TYPE.SEND_SWAP) {
      return () => swapOnlyDest();
    } else if (swapType === SWAP_TYPE.SWAP_SEND_SWAP) {
      return () => swapSrcAndDest();
    } else if (swapType === SWAP_TYPE.SWAP_SEND) {
      return () => swapOnlySrc();
    }
  }, [swapOnlyDest, swapOnlySrc, swapSrcAndDest, swapType]);

  const swap = useCallback(async () => {
    setLoading(true);

    const swapFn = selectSwapFunction();
    if (!swapFn) return;

    const result = await swapFn().catch((e) => setLoading(false));
    if (result) {
      const { tx, traceId } = result;
      if (tx) {
        dispatch(setSrcTx({ txHash: tx.hash, traceId }));
        push(`/tx/swap/${srcChain.name}/${tx.hash}`);
      }
    }

    setLoading(false);
  }, [srcChain, selectSwapFunction, dispatch, push]);

  if (!isConnected) {
    return (
      <button disabled className={"btn"}>
        CONNECT YOUR WALLET TO SWAP
      </button>
    );
  }

  return (
    <button
      disabled={!writeAsync}
      className={cn(
        `btn text-white bg-gradient-to-r from-[#760FC8] to-[#7522DE] disabled:bg-opacity-30 transition-all ease-in ${className}`,
        {
          loading: loading,
        }
      )}
      onClick={swap}
    >
      Swap
    </button>
  );
};
