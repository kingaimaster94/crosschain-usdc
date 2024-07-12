import { ComponentStyle } from "types/component";
import { Token } from "types/token";
import React, { FunctionComponent } from "react";
import Image from "next/image";

import { TokenBalance } from "../swap";

interface TokenInputModalProps extends ComponentStyle {
  tokens: Token[];
  selectedToken?: Token;
  showBalance?: boolean;
  modalKey: TokenInputModalKey;
  onSelected: (tokenBalance: Token) => void;
}

export enum TokenInputModalKey {
  ModalTokenInput = "modal-token-input",
  ModalTokenOutput = "modal-token-output",
}

export const TokenInputModal: FunctionComponent<TokenInputModalProps> = ({
  modalKey,
  onSelected,
  selectedToken,
  showBalance = false,
  tokens = [],
}) => {
  const options = tokens.map((token) => {
    return (
      <TokenBalance
        modalKey={modalKey}
        onClick={onSelected}
        token={token}
        showBalance={showBalance}
        active={token.address === selectedToken?.address}
        key={token.address}
      />
    );
  });
  return (
    <>
      <input type="checkbox" id={modalKey} className="modal-toggle" />
      <label
        className="cursor-pointer select-none modal modal-bottom sm:modal-middle"
        htmlFor={modalKey}
      >
        <label
          className="flex flex-col px-8 modal-box bg-gradient-to-b to-[#191E31] from-[#192431]"
          htmlFor=""
        >
          <div className="z-50">
            <h1 className="text-3xl font-thin text-center text-white">
              Select Token
            </h1>
            <div className="bg-[#181A25] rounded-xl text-white my-8">
              <ul className="menu min-h-[400px]">{options}</ul>
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
          </div>
        </label>
      </label>
    </>
  );
};
