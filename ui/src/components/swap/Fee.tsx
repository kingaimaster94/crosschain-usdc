import { ethers } from "ethers";
import { useAppSelector } from "hooks/useAppSelector";
import React, { FunctionComponent, useCallback } from "react";
import { selectFee, selectSrcToken } from "slices/swapInputSlice";
import { ComponentStyle } from "types/component";
import { LoadingIndicator } from "components/common";
import { useAccount, useBalance } from "wagmi";
import classNames from "classnames";

interface SwapEstimatorProps extends ComponentStyle {
  amount: string;
}

export const AxelarFee: FunctionComponent<SwapEstimatorProps> = ({
  amount,
}) => {
  const account = useAccount();
  const balance = useBalance({
    addressOrName: account.address,
  });
  const srcToken = useAppSelector(selectSrcToken);
  const fee = useAppSelector(selectFee);

  const render = useCallback(() => {
    if (!fee) {
      return (
        <span className="flex">
          <LoadingIndicator width={120} height={18} />
        </span>
      );
    }
    if (fee) {
      const textAmount = ethers.utils.formatUnits(fee, 18);
      const floatTextAmount = parseFloat(textAmount).toFixed(6);
      const isInsufficient = balance.data?.value.lt(
        ethers.BigNumber.from(ethers.utils.parseEther(amount || "0")).add(fee)
      );
      return (
        <span className="flex">
          <span
            className={classNames({
              "text-red-200": isInsufficient,
            })}
          >
            {floatTextAmount} {srcToken?.symbol}
            {isInsufficient && " (insufficient)"}
          </span>
        </span>
      );
    }
  }, [fee, amount, balance.data?.value, srcToken?.symbol]);

  return (
    <div className="flex justify-between text-sm text-gray-200">
      <div className="font-light">Network Fee:</div>
      <div className="font-medium text-gray-300">{render()}</div>
    </div>
  );
};
