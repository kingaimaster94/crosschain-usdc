import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { selectBalancesByChainId } from "slices/balanceSlice";
import { selectEstimateAmountState } from "slices/swapEstimatorSlice";
import { selectSrcChain } from "slices/swapInputSlice";
import { Token } from "types/token";
import { useAppSelector } from "./useAppSelector";
import useCrosschainToken from "./useCrosschainToken";

export interface Validation {
  isValid: boolean;
  error?: string;
}

const useAmountValidator = (amount: string, token?: Token) => {
  const [valid, setValid] = useState<Validation>({ isValid: true });
  const srcChain = useAppSelector(selectSrcChain);
  const { sendDestAmount } = useAppSelector(selectEstimateAmountState);
  const crosschainToken = useCrosschainToken(srcChain);
  const balances = useAppSelector((rootState) =>
    selectBalancesByChainId(rootState, token?.chainId)
  );

  useEffect(() => {
    if (!token) return;
    if (!amount) return;
    if (!srcChain) return;
    if (!crosschainToken) return;

    try {
      const maxAmount = ethers.utils.formatUnits(
        balances[token.address],
        token.decimals
      );
      const numberAmount = parseFloat(amount);
      const numberMaxAmount = parseFloat(maxAmount);

      if (isNaN(numberAmount)) {
        return setValid({
          isValid: false,
          error: "Invalid amount",
        });
      }

      const lessThanMax = numberAmount <= numberMaxAmount;
      const greaterThanMinFee = !ethers.BigNumber.from(
        sendDestAmount || 0
      ).isNegative();

      if (!lessThanMax) {
        setValid({
          isValid: false,
          error: "Amount should be less than max amount",
        });
      } else if (!greaterThanMinFee) {
        setValid({
          isValid: false,
          error: "The amount is less than minimum fee",
        });
      } else {
        setValid({
          isValid: true,
        });
      }
    } catch (e) {
      setValid({
        isValid: false,
        error: "Incorrect amount",
      });
    }
  }, [amount, balances, crosschainToken, sendDestAmount, srcChain, token]);

  return valid;
};

export default useAmountValidator;
