import { ComponentStyle } from "types/component";
import { Token } from "types/token";
import React, { FunctionComponent } from "react";
import { Validation } from "hooks/useAmountValidator";
import { DebounceInput } from "react-debounce-input";
import { useAppDispatch, useAppSelector } from "hooks/useAppSelector";
import { selectSrcChain, selectSrcToken } from "slices/swapInputSlice";
import { selectBalancesByChainId } from "slices/balanceSlice";

import { selectAmount, setAmount } from "slices/swapInputSlice";
import { MaxButton } from "components/common";
import { useAccount } from "wagmi";
import { ethers } from "ethers";

interface AmountInputProps extends ComponentStyle {
  selectedToken?: Token;
  validState: Validation;
}

export const AmountInput: FunctionComponent<AmountInputProps> = ({
  className,
  selectedToken,
  validState,
}) => {
  const amount = useAppSelector(selectAmount);
  const dispatch = useAppDispatch();
  const { isConnected } = useAccount();
  const srcChain = useAppSelector(selectSrcChain);
  const srcToken = useAppSelector(selectSrcToken);

  const balances = useAppSelector((state) =>
    selectBalancesByChainId(state, srcChain?.id)
  );

  function canShowBalance() {
    return (
      isConnected &&
      srcToken &&
      srcChain &&
      balances[srcToken?.address as string] &&
      srcToken.decimals
    );
  }

  function renderTokenBalance() {
    if (canShowBalance()) {
      const balance = ethers.utils.formatUnits(
        balances[srcToken?.address as string],
        srcToken?.decimals
      );
      return <span> {`(${balance} ${srcToken?.symbol})`}</span>;
    }
  }

  return (
    <div className={`${className}`}>
      {/* <div className="flex justify-end">
        <label className="text-[#93BEFF] text-sm">
          <span>Balance</span>
          {renderTokenBalance()}
        </label>
      </div> */}
      <div className="px-4 flex items-center justify-end border border-[#282B3D] w-full rounded-md">
        <DebounceInput
          type={"number"}
          className="w-full h-full px-4 py-3 font-medium text-right text-white bg-transparent outline-none text-md placeholder:text-gray-500 placeholder:font-normal"
          value={amount}
          onWheel={(e: React.WheelEvent<HTMLInputElement>) =>
            e.currentTarget.blur()
          }
          debounceTimeout={200}
          onChange={(e) => dispatch(setAmount(e.target.value))}
        />
        {selectedToken && <MaxButton selectedToken={selectedToken} />}
      </div>
      {/* <div className="relative mt-1 text-xs font-light text-right">
        {validState.error && (
          <span className="text-red-100">{validState?.error}</span>
        )}
      </div> */}
    </div>
  );
};
