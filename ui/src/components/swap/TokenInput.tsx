import { ComponentStyle } from "types/component";
import { Token } from "types/token";
import cn from "classnames";
import React, { FunctionComponent } from "react";
import Image from "next/image";
import { TokenInputModalKey } from "../modals";

interface TokenInputProps extends ComponentStyle {
  modalKey: TokenInputModalKey;
  selectedToken?: Token;
  label: string;
}

export const TokenInput: FunctionComponent<TokenInputProps> = ({
  className,
  modalKey,
  selectedToken,
}) => {
  return (
    <label
      // htmlFor={modalKey}
      className={cn(
        `flex items-center w-32 px-3 py-2 text-xs border-2 border-[#282B3D] rounded-xl text-[#93BEFF] cursor-not-allowed ${className}`
        // {
        //   "border-[#6700DD]": selectedToken,
        // }
      )}
      style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          {selectedToken && (
            <Image
              src={selectedToken.logoURI || "/ic-unknown.svg"}
              width={20}
              height={20}
              layout="intrinsic"
              alt="chain icon"
              className="!rounded-full"
            />
          )}
        </div>
        <div className="flex items-center ml-2">
          <span className="uppercase">
            {selectedToken?.symbol || "Select token"}
          </span>
          <Image
            src={"/assets/svg/arrow-down.svg"}
            height={20}
            width={20}
            alt="arrow-down"
            layout="intrinsic"
          />
        </div>
      </div>
    </label>
  );
};
