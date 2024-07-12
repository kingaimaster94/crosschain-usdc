import React from "react";
import Image from "next/image";
import { useAccount, useNetwork } from "wagmi";
import { NativeBalance, ConnectButton } from "components/common";
import Link from "next/link";
import { SquidChain } from "types/chain";

export const Header = () => {
  const account = useAccount();
  const network = useNetwork();
  const activeChain = network.chain as SquidChain;
  const icon = activeChain?.icon;
  return (
    <div className="fixed z-50 w-full border-b border-[#192431] backdrop-blur-sm bg-black/10 py-2">
      <div className="h-20 max-w-screen-xl mx-auto navbar">
        <Link href={"/"} passHref>
          <a className="relative flex">
            <div className="flex">
              <Image
                src="/assets/png/axl.png"
                width={32}
                height={32}
                alt="logo"
              />
            </div>
            <span className="hidden ml-4 text-2xl font-bold text-white sm:flex">
              Crosschain Swap Demo
            </span>
            <div className="absolute right-0 top-6 translate-x-3">
              <img
                src="/powered.logo.svg"
                width={150}
                alt={"powered by axelar"}
              />
            </div>
          </a>
        </Link>
        <div className="flex items-center ml-auto gap-x-4">
          {account.isConnected && account?.address && <NativeBalance />}
          {account.isConnected && (
            <Image
              className="p-1 bg-gray-200 rounded-full"
              src={icon || "/ic-unknown.svg"}
              width={30}
              height={30}
              alt="chain icon"
            />
          )}
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};
