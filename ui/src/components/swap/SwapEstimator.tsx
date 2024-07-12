import { ethers } from "ethers";
import { useAppSelector } from "hooks/useAppSelector";
import React, { FunctionComponent, useCallback } from "react";
import { selectEstimateAmountState } from "slices/swapEstimatorSlice";
import { selectDestToken } from "slices/swapInputSlice";
import { ComponentStyle } from "types/component";
import { LoadingIndicator } from "components/common";

interface SwapEstimatorProps extends ComponentStyle {
  amount: string;
}

export const SwapEstimator: FunctionComponent<SwapEstimatorProps> = ({
  amount,
}) => {
  const destToken = useAppSelector(selectDestToken);
  const { loading, error, swapDestAmount, sendDestAmount } = useAppSelector(
    selectEstimateAmountState
  );
  const estimatedAmount = swapDestAmount || sendDestAmount;

  const render = useCallback(() => {
    if (error) {
      return <span className="text-red-200">{error}</span>;
    } else if (destToken && estimatedAmount) {
      const textAmount = ethers.utils.formatUnits(
        estimatedAmount,
        destToken?.decimals
      );
      const floatTextAmount = parseFloat(textAmount).toFixed(6);
      return (
        <span className="flex">
          {loading ? (
            <LoadingIndicator width={120} height={18} />
          ) : (
            <span>
              {floatTextAmount} {destToken?.symbol}
            </span>
          )}
        </span>
      );
    }
  }, [destToken, error, estimatedAmount, loading]);

  return (
    <div className="flex justify-between text-sm text-gray-200">
      <div className="font-light">Estimated output:</div>
      <div className="font-medium text-green-300">{render()}</div>
    </div>
  );
};
