import { SquidChain } from "types/chain";
import { ComponentStyle } from "types/component";
import React, { FunctionComponent } from "react";
import Image from "next/image";
import cn from "classnames";
import { ChainInputModalKey } from "components/modals";

interface ChainInputProps extends ComponentStyle {
  selectedChain?: SquidChain;
  label: string;
  modalKey: ChainInputModalKey;
  isSrcChain?: boolean;
}

export const ChainInput: FunctionComponent<ChainInputProps> = ({
  selectedChain,
  modalKey,
}) => {
  return (
    <label
      htmlFor={modalKey}
      className={cn(
        "flex items-center px-3 py-3 min-w-fit w-40 text-xs rounded-md text-[#93BEFF] cursor-pointer bg-slate-800"
      )}
    >
      <div className="flex items-center justify-between w-full cursor-pointer">
        <div className="flex items-center">
          {selectedChain && (
            <Image
              src={selectedChain.icon}
              width={20}
              height={20}
              alt="chain icon"
              className="!rounded-full bg-gray-100"
            />
          )}
          <span className="uppercase ml-4">
            {selectedChain?.alias || "Select Chain"}
          </span>
        </div>
        <div className="flex items-center justify-end">
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
