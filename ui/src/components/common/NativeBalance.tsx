import React, { FunctionComponent } from "react";
import { ComponentStyle } from "types/component";
import { useAccount, useBalance } from "wagmi";
import { toFixed } from "utils/parser";
import { LoadingIndicator } from "components/common";

export const NativeBalance: FunctionComponent<ComponentStyle> = ({
  className,
}) => {
  const account = useAccount();
  const balance = useBalance({
    addressOrName: account.address,
  });

  if (balance?.isLoading) {
    return (
      <div>
        <LoadingIndicator />
      </div>
    );
  }

  if (balance?.error) {
    return <span className="text-green-300">Unable to fetch balance</span>;
  }

  if (!balance?.data) return null;

  return (
    <div className="flex items-center font-bold text-white gap-x-4">
      <div className="space-x-2">
        <span className="">{toFixed(balance.data?.formatted as string)}</span>
        <span>{balance.data?.symbol}</span>
      </div>
    </div>
  );
};
