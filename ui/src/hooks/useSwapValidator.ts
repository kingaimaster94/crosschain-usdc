import { useEffect, useState } from "react";
import {
  selectDestToken,
  selectSrcChain,
  selectSrcToken,
  selectSwappable,
} from "slices/swapInputSlice";
import { Validation } from "./useAmountValidator";
import { useAppSelector } from "./useAppSelector";

const useSwapValidator = (amount: string, amountValidation: Validation) => {
  const srcChain = useAppSelector(selectSrcChain);
  const srcToken = useAppSelector(selectSrcToken);
  const destToken = useAppSelector(selectDestToken);
  const swappable = useAppSelector(selectSwappable);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const shouldDisableSwap =
      !srcChain ||
      !srcToken ||
      !amountValidation.isValid ||
      !amount ||
      !destToken ||
      !swappable;

    setDisabled(shouldDisableSwap);
  }, [
    amount,
    amountValidation.isValid,
    destToken,
    srcChain,
    srcToken,
    swappable,
  ]);

  return disabled;
};

export default useSwapValidator;
