import React, { FunctionComponent } from "react";
import Image from "next/image";
import { ComponentStyle } from "types/component";
import { Token } from "types/token";
import { selectBalancesByChainId } from "slices/balanceSlice";
import { ethers } from "ethers";
import cn from "classnames";
import { useAppSelector } from "hooks/useAppSelector";
import { selectSrcChain } from "slices/swapInputSlice";
import { LoadingIndicator } from "components/common";
import { TokenInputModalKey } from "../modals/TokenInputModal";

interface TokenBalanceProps extends ComponentStyle {
  modalKey: TokenInputModalKey;
  onClick: (token: Token) => void;
  token: Token;
  active?: boolean;
  showBalance?: boolean;
}

export const TokenBalance: FunctionComponent<TokenBalanceProps> = ({
  token,
  className,
  modalKey,
  onClick,
  showBalance = true,
  active = false,
}) => {
  const srcChain = useAppSelector(selectSrcChain);
  const balances = useAppSelector((state) =>
    selectBalancesByChainId(state, srcChain?.id)
  );

  function renderBalance() {
    let content = null;
    if (showBalance) {
      if (balances[token.address]) {
        content = (
          <div>
            {ethers.utils.formatUnits(balances[token.address], token.decimals)}
          </div>
        );
      } else {
        content = <LoadingIndicator width={40} height={18} />;
      }
    }

    return (
      <span className="flex-1 text-right justify-self-end">{content}</span>
    );
  }

  return (
    <div className={`${className}`}>
      <li key={token.address} onClick={() => onClick(token)}>
        <label
          htmlFor={modalKey}
          className={cn("capitalize", {
            active: active,
          })}
        >
          <Image
            className="p-1 mr-2 rounded-full"
            src={token.logoURI || "/ic-unknown.svg"}
            width={32}
            height={32}
            alt={token.name}
          />{" "}
          <div className="flex flex-col items-end flex-1">
            <div className="flex">
              {renderBalance()}
              <span className="w-12 text-right">{token.symbol}</span>
            </div>
          </div>
        </label>
      </li>
    </div>
  );
};
