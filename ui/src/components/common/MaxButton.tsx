import { ComponentStyle } from "types/component";
import { Token } from "types/token";
import React, { FunctionComponent } from "react";
import { useAppDispatch, useAppSelector } from "hooks/useAppSelector";
import { selectSrcChain, setAmount } from "slices/swapInputSlice";
import { selectBalancesByChainId } from "slices/balanceSlice";
import { LoadingIndicator } from ".";
import { ethers } from "ethers";

interface MaxButtonProps extends ComponentStyle {
  selectedToken?: Token;
}

export const MaxButton: FunctionComponent<MaxButtonProps> = ({
  selectedToken,
}) => {
  const dispatch = useAppDispatch();
  const srcChain = useAppSelector(selectSrcChain);
  const balances = useAppSelector((state) =>
    selectBalancesByChainId(state, srcChain?.id)
  );
  let balance = "0";
  if (selectedToken?.address) {
    balance = balances[selectedToken?.address] || "0";
  }
  const maxAmount = ethers.utils.formatUnits(balance, selectedToken?.decimals);

  function renderBalance() {
    if (balance) {
      return `Max (${maxAmount} ${selectedToken?.symbol})`;
    } else {
      return <LoadingIndicator width={50} height={18} />;
    }
  }

  return (
    <button
      className="btn bg-[#31FFCE] text-gray-900 h-6 text-xs w-0 px-7 min-h-0 rounded-2xl hover:bg-[#21e9ba]"
      onClick={() => dispatch(setAmount(maxAmount))}
    >
      max
    </button>
  );
};
