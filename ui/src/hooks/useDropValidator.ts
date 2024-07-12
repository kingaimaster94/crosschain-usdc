import { useEffect, useState } from "react";
import {
  selectSrcChain,
  selectSrcToken,
} from "slices/swapInputSlice";
import { Validation } from "./useAmountValidator";
import { useAppSelector } from "./useAppSelector";

const useDropValidator = (amount: string | undefined, aliasAddresses: string[], amountValidation: Validation) => {
  const srcChain = useAppSelector(selectSrcChain);
  const srcToken = useAppSelector(selectSrcToken);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const shouldDisableSwap =
      !srcChain ||
      !srcToken ||
      !amountValidation.isValid ||
      !amount ||
      aliasAddresses?.length === 0;

    setDisabled(shouldDisableSwap);
  }, [
    aliasAddresses,
    amount,
    amountValidation.isValid,
    srcChain,
    srcToken,
  ]);

  return disabled;
};

export default useDropValidator;
