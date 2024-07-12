import { ComponentStyle } from "types/component";
import { SquidChain } from "types/chain";
import Image from "next/image";
import cn from "classnames";
import React, { FunctionComponent } from "react";
import { useAppSelector } from "hooks/useAppSelector";
import { selectDestChain, selectSrcChain } from "slices/swapInputSlice";

interface ChainInputModalProps extends ComponentStyle {
  chains: SquidChain[];
  onSelected: (chain: SquidChain) => void;
  modalKey: ChainInputModalKey;
}

export enum ChainInputModalKey {
  ModalChainFrom = "modal-chain-from",
  ModalChainTo = "modal-chain-to",
}

export const ChainInputModal: FunctionComponent<ChainInputModalProps> = ({
  chains = [],
  onSelected,
  modalKey,
}) => {
  const srcChain = useAppSelector(selectSrcChain);
  const destChain = useAppSelector(selectDestChain);
  const selectedChain =
    modalKey === ChainInputModalKey.ModalChainFrom ? srcChain : destChain;

  const options = chains.map((chain) => {
    return (
      <li key={chain.id} onClick={() => onSelected(chain)}>
        <label
          htmlFor={modalKey}
          className={cn("capitalize", {
            active: selectedChain?.id === chain.id,
          })}
        >
          <Image
            src={chain.icon}
            width={32}
            height={32}
            layout="intrinsic"
            className="p-1 bg-gray-100 rounded-full"
            alt="chain icon"
          />
          <div className="flex flex-col items-end flex-1">
            <span className="ml-2">{chain.alias}</span>
          </div>
        </label>
      </li>
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
          className="flex flex-col modal-box bg-gradient-to-b to-[#191E31] from-[#192431]"
          htmlFor=""
        >
          <div className="z-50">
            <h1 className="text-3xl font-thin text-center text-white">
              Select Chain
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
