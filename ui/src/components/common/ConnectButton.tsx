import config from "config/constants";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "hooks/useAppSelector";
import {
  selectSenderAddress,
  setRecipientAddress,
  setSenderAddress,
} from "slices/swapInputSlice";

import { ComponentStyle } from "types/component";
import { useAccount, useNetwork } from "wagmi";

function trimAddress(address?: string) {
  if (!address) return "";
  return address?.slice(0, 7) + "..." + address?.slice(-7);
}

export const ConnectButton: FunctionComponent<ComponentStyle> = ({
  className,
}) => {
  const dispatch = useAppDispatch();
  const senderAddress = useAppSelector(selectSenderAddress);

  const account = useAccount();
  const { chain } = useNetwork();

  const [chainAllowed, setChainAllowed] = useState(true);

  // handle supported chains
  useEffect(() => {
    const chainId = chain?.id;
    const chainIsSupported = config.chains.find((chain) => chain.id === chainId);
    if (chainIsSupported) {
      setChainAllowed(true);
    } else {
      setChainAllowed(false);
    }

    if (account?.address !== senderAddress) {
      dispatch(setSenderAddress(account?.address));
      dispatch(setRecipientAddress(account?.address));
    }
  }, [account, senderAddress, dispatch, chain?.id]);

  // if (account.error) {
  //   return (
  //     <label htmlFor="web3-modal" className="rounded-full btn btn-primary">
  //       Failed to connect. Try again?
  //     </label>
  //   );
  // }
  // console.log("==========");
  // console.log("isConnected", account.isConnected);
  // console.log("isDisconnected", account.isDisconnected);
  // console.log(account);
  if (!account?.isConnected)
    return (
      <label
        htmlFor="web3-modal"
        className="btn text-white rounded-full bg-gradient-to-r from-[#760FC8] to-[#7522DE]"
      >
        Connect Your Wallet
      </label>
    );

  if (!chainAllowed) {
    return (
      <div
        className="tooltip tooltip-bottom"
        data-tip={`Please choose another network. Compatible networks are ${config.chains
          .map((chain) => chain.network)
          .join(" , ")}`}
      >
        <button className="rounded-full btn btn-primary">
          Unsupported Chain
        </button>
      </div>
    );
  }

  return (
    <div className="font-light text-gray-200 transition-colors duration-200 cursor-pointer hover:text-blue-300">
      {trimAddress(account?.address)}
    </div>
  );
};
